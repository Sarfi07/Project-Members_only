const pool = require("./pool");
const { format } = require("date-fns");

async function insertUser(user) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES($1, $2, $3, $4)",
    [user.firstName, user.lastName, user.username, user.password]
  );
}

async function findUser(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username=($1)", [
    username,
  ]);

  return rows[0];
}

async function findUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id=($1)", [id]);

  return rows[0];
}

// groups

async function getAllGroups() {
  const { rows } = await pool.query("SELECT id, name FROM groups;");
  return rows;
}

async function getUserGroups(user_id) {
  const { rows } = await pool.query(
    "SELECT groups.id, groups.name, groups.admin_id FROM groupMemberships JOIN groups on group_id = groups.id WHERE user_id=$1",
    [user_id]
  );

  return rows;
}
async function getGroup(id) {
  const { rows } = await pool.query("SELECT * FROM groups WHERE id=$1", [id]);

  return rows[0];
}

async function deleteGroup(id) {
  await pool.query("DELETE FROM groups WHERE id=($1)", [id]);
}

async function getGroupsMessages(group_id) {
  const { rows } = await pool.query(
    "SELECT messages.*, users.id as user_id, users.first_name as user_first_name FROM messages JOIN users ON messages.author_id = users.id WHERE group_id=($1) ORDER BY messages.created_at",
    [group_id]
  );

  rows.forEach((row) => {
    const formattedDate = format(new Date(row.created_at), "PPpp");
    row.created_at = formattedDate;
  });

  return rows;
}

async function createGroup(groupObj) {
  const { rows } = await pool.query(
    "INSERT INTO groups (name, secret_key, admin_id) VALUES ($1, $2, $3) RETURNING id",
    [groupObj.name, groupObj.secretKey, groupObj.admin_id]
  );

  return rows[0].id;
}

async function updateGroup(groupObj, group_id) {
  console.log(group_id);
  const { rows } = await pool.query(
    "UPDATE groups SET name=$1, secret_key=$2, updated_at=NOW() WHERE id=$3",
    [groupObj.name, groupObj.secret_key, group_id]
  );

  console.log(rows);
}

// Groups memberShip
async function checkMembership(group_id, user_id) {
  const { rows } = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM groupMemberships WHERE group_id=($1) and user_id=($2))",
    [group_id, user_id]
  );

  return rows[0].exists;
}

async function addMembership(group_id, user_id) {
  await pool.query(
    "INSERT INTO groupMemberships (group_id, user_id)VALUES($1, $2)",
    [group_id, user_id]
  );
}

async function getAllGroupMembers(group_id) {
  const { rows } = await pool.query(
    "SELECT user_id FROM groupMemberships WHERE group_id=$1",
    [group_id]
  );

  return rows;
}

async function createMessage(messageObj) {
  await pool.query(
    "INSERT INTO messages (message, author_id, group_id) VALUES ($1, $2, $3)",
    [messageObj.message, messageObj.author_id, messageObj.group_id]
  );
}

async function deleteMessage(id) {
  const { rows } = await pool.query(
    "DELETE FROM messages WHERE id=($1) RETURNING group_id",
    [id]
  );

  return rows[0].group_id;
}

module.exports = {
  insertUser,
  findUser,
  findUserById,
  getAllGroups,
  getUserGroups,
  getGroup,
  deleteGroup,
  getGroupsMessages,
  createGroup,
  updateGroup,
  checkMembership,
  addMembership,
  getAllGroupMembers,
  createMessage,
  deleteMessage,
};
