const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const winston = require("winston");
const { validateUser, validateUpdate } = require("./validators");


const app = express();
app.use(bodyParser.json());

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Database setup
const db = new sqlite3.Database("users.db", (err) => {
  if (err) {
    logger.error("Database connection error: " + err.message);
  } else {
    logger.info("Connected to SQLite database.");
  }
});

// Create tables
const createTables = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS managers (
      manager_id TEXT PRIMARY KEY,
      is_active INTEGER DEFAULT 1
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      mob_num TEXT NOT NULL,
      pan_num TEXT NOT NULL,
      manager_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
    )`
  );
};
createTables();
//insert managers
const insertManagers = () => {
    const managers = Array.from({ length: 3 }, () => ({ manager_id: uuidv4() }));
  
    managers.forEach(({ manager_id }) => {
      db.run(
        "INSERT INTO managers (manager_id, is_active) VALUES (?, 1)",
        [manager_id],
        (err) => {
          if (err) {
            console.log(`Error inserting manager: ${err.message}`);
          } else {
            console.log(`Inserted manager: ${manager_id}`);
          }
        }
      );
    });
  };
  
insertManagers();

// Create User 
app.post("/create_user", async (req, res) => {
  const { full_name, mob_num, pan_num, manager_id } = req.body;
  const validationError = validateUser(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  db.get("SELECT * FROM managers WHERE manager_id = ? AND is_active = 1", [manager_id], (err, row) => {
    if (err || !row) return res.status(400).json({ error: "Invalid or inactive manager." });
    
    const user_id = uuidv4();
    db.run(
      "INSERT INTO users (user_id, full_name, mob_num, pan_num, manager_id, is_active) VALUES (?, ?, ?, ?, ?, 1)",
      [user_id, full_name, mob_num, pan_num.toUpperCase(), manager_id],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ message: "User created successfully.", user_id });
      }
    );
  });
});

//Get User
app.post("/get_users", (req, res) => {
  const { user_id, mob_num, manager_id } = req.body;
  let query = "SELECT * FROM users WHERE is_active = 1";
  const params = [];
  if (user_id) { query += " AND user_id = ?"; params.push(user_id); }
  if (mob_num) { query += " AND mob_num = ?"; params.push(mob_num); }
  if (manager_id) { query += " AND manager_id = ?"; params.push(manager_id); }
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error." });
    res.json({ users: rows });
  });
});

//Delete User
app.post("/delete_user", (req, res) => {
  const { user_id, mob_num } = req.body;
  if (!user_id && !mob_num) return res.status(400).json({ error: "Provide user_id or mob_num." });

  const query = user_id ? "DELETE FROM users WHERE user_id = ?" : "DELETE FROM users WHERE mob_num = ?";
  db.run(query, [user_id || mob_num], (err) => {
    if (err) return res.status(500).json({ error: "Database error." });
    res.json({ message: "User deleted successfully." });
  });
});

//Update user
app.post("/update_user", (req, res) => {
  const { user_ids, update_data } = req.body;
  const validationError = validateUpdate(update_data);
  if (validationError) return res.status(400).json({ error: validationError });

  user_ids.forEach((id) => {
    db.run("UPDATE users SET full_name = ?, mob_num = ?, pan_num = ?, manager_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", 
      [update_data.full_name, update_data.mob_num, update_data.pan_num.toUpperCase(), update_data.manager_id, id], (err) => {
        if (err) logger.error("Update error: " + err.message);
      }
    );
  });
  res.json({ message: "Users updated successfully." });
});


const PORT = 3005;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
