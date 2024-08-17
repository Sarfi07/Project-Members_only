CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL CHECK (length(first_name) >= 1),
    last_name VARCHAR(255) NOT NULL CHECK (length(last_name) >= 1),
    username VARCHAR(255) NOT NULL UNIQUE CHECK (length(username) >= 4),
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE "GroupMemberships" (
    user_id INT REFERENCES "Users"(id) ON DELETE CASCADE,
    group_id INT REFERENCES "Groups"(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
)

CREATE TABLE "Groups" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_id INT REFERENCES "Users"(id) ON DELETE SET NULL,
    secret_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE "GroupMembers" (
    group_id INT REFERENCES "Groups"(id) ON DELETE CASCADE,
    user_id INT REFERENCES "Users"(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
)

CREATE TABLE "GroupMessages" (
    group_id INT REFERENCES "Groups"(id) ON DELETE CASCADE,
    message_id INT REFERENCES "Messages"(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, message_id)
)

CREATE TABLE "Messages" (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    author_id INT REFERENCES "Users"(id) ON DELETE SET NULL,
    group_id INT REFERENCES "Groups"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


