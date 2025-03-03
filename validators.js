exports.validateUser = (data) => {
    if (!data.full_name) return "Full name is required.";
    if (!/^\+?\d{10,12}$/.test(data.mob_num)) return "Invalid mobile number.";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan_num.toUpperCase())) return "Invalid PAN number.";
    return null;
  };
  
  exports.validateUpdate = (data) => {
    if (data.mob_num && !/^\+?\d{10,12}$/.test(data.mob_num)) return "Invalid mobile number.";
    if (data.pan_num && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan_num.toUpperCase())) return "Invalid PAN number.";
    return null;
  };

