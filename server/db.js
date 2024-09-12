const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "aks.1971628123",
    host: "localhost",
    port: 5432,
    database: "fresh"
});

module.exports = pool;