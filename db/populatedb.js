const { Client } = require("pg");

const SQL = `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL CHECK (length(first_name) >= 1),
    last_name VARCHAR(255) NOT NULL CHECK (length(last_name) >= 1),
    username VARCHAR(255) NOT NULL UNIQUE CHECK (length(username) >= 4),
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON users(username);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_id INT REFERENCES users(id) ON DELETE SET NULL,
    secret_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_name ON groups(name);

CREATE TABLE groupMemberships (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

CREATE INDEX idx_group_user ON groupMemberships(group_id, user_id);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_group ON messages(group_id);
CREATE INDEX idx_message_author ON messages (author_id);

INSERT INTO users(first_name, last_name, username, password) VALUES(foo, bar, baz);

INSERT INTO groups (name, secret_key, admin_id) VALUES(foo, bar, baz);

INSERT INTO messages (message, author_id, group_id) VALUES (foo, bar, baz)

`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
