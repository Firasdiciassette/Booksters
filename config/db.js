const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./booksters.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("DB error:", err.message);
  else console.log("Database Connected!");
});

module.exports = db;
