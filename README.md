# User Management API

## Overview
This is a simple User Management API built using Node.js, Express, and SQLite. It allows managing users and their associated managers with endpoints to create, update, fetch, and delete users.

## Features
- Add and manage users
- Assign managers to users
- Retrieve user details
- Update user information
- Delete users

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **UUID:** Used for generating unique IDs
- **Logging:** Winston for logging errors and info

## Installation

1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <project_directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the server:
   ```sh
   node server.js
   ```

## API Endpoints

### 1. Create a User
**Endpoint:** `POST /create_user`
- **Request Body:**
  ```json
  {
    "full_name": "UserName",
    "mob_num": "+919876543210",
    "pan_num": "ABCDE1234F",
    "manager_id": "7265d43f-ce83-4b50-9c80-d74fab2da8b7"
  }
  ```

### 2. Get Users
**Endpoint:** `POST /get_users`
- **Request Body (Optional Filters):**
  ```json
  {
    "user_id": "681f6415-cb31-40fa-b4e0-3988b135c836"
  }
  ```

### 3. Update User
**Endpoint:** `POST /update_user`
- **Request Body:**
  ```json
  {
    "user_ids": ["681f6415-cb31-40fa-b4e0-3988b135c836"],
    "update_data": {
      "full_name": "Mr. Praveen",
      "mob_num": "+917730966506",
      "pan_num": "ABCDE1238T",
      "manager_id": "7265d43f-ce83-4b50-9c80-d74fab2da8b7"
    }
  }
  ```

### 4. Delete User
**Endpoint:** `POST /delete_user`
- **Request Body:**
  ```json
  {
    "user_id": "681f6415-cb31-40fa-b4e0-3988b135c836"
  }
  ```

## Database Structure
### `managers` Table
| Column     | Type  | Constraints  |
|------------|-------|--------------|
| manager_id | TEXT  | PRIMARY KEY  |
| is_active  | INT   | DEFAULT 1    |

### `users` Table
| Column     | Type  | Constraints  |
|------------|-------|--------------|
| user_id    | TEXT  | PRIMARY KEY  |
| full_name  | TEXT  | NOT NULL     |
| mob_num    | TEXT  | NOT NULL     |
| pan_num    | TEXT  | NOT NULL     |
| manager_id | TEXT  | FOREIGN KEY (managers) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| is_active  | INT   | DEFAULT 1    |

## Environment Variables
Create a `.env` file and configure the following:
```env
PORT=3000
DATABASE_URL=users.db
```

## Logging
- Logs are managed using Winston and printed in JSON format in the console.

## Running the Project
1. Ensure Node.js is installed.
2. Install dependencies with `npm install`.
3. Run `node server.js`.
4. The server starts on `http://localhost:3000/`.

## Contributing
Feel free to open issues or pull requests to improve the project.

## License
MIT License

