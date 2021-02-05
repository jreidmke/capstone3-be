CREATE TABLE writers (
    username VARCHAR(20) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    bio TEXT NOT NULL,
    age INTEGER NOT NULL,
    location TEXT NOT NULL,
    email TEXT NOT NULL,
    phone CHAR(10),
    twitter_username TEXT NOT NULL,
    facebook_username TEXT NOT NULL,
    youtube_username TEXT NOT NULL,
    is_admin BOOLEAN
); 

CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    writer_username VARCHAR(20) NOT NULL
        REFERENCES writers ON DELETE CASCADE,
    title TEXT NOT NULL
); 

CREATE TABLE pieces (
    id SERIAL PRIMARY KEY,
    writer_username VARCHAR(20) NOT NULL
        REFERENCES writers ON DELETE CASCADE,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    date_of_submission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_of_last_edit TIMESTAMP DEFAULT NULL
);