const { Pool } = require("pg");

module.exports = new Pool({
  connectionString:
    "postgres://sarfi07:seraj2005@localhost:5432/project_members_only",
});
