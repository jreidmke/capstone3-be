--MAIN TABLES

CREATE TABLE writers (
    username VARCHAR(20) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    image_url TEXT,
    bio TEXT,
    age INTEGER NOT NULL,
    location TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    phone CHAR(10),
    twitter_username TEXT,
    facebook_username TEXT,
    youtube_username TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE tags (
    title TEXT PRIMARY KEY,
    is_fiction BOOLEAN NOT NULL
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

CREATE TABLE platforms (
    username VARCHAR(20) PRIMARY KEY,
    password TEXT NOT NULL,
    handle VARCHAR(20) UNIQUE CHECK (handle = lower(handle)),
    display_name TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    phone CHAR(10) NOT NULL,
    twitter_username TEXT,
    facebook_username TEXT,
    youtube_username TEXT,
    is_admin BOOLEAN DEFAULT FALSE
); 

CREATE TABLE gigs (
    id SERIAL PRIMARY KEY,
    platform_handle VARCHAR(20) NOT NULL
        REFERENCES platforms(handle) ON DELETE CASCADE,
    platform_display_name TEXT NOT NULL
        REFERENCES platforms(display_name) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    compensation INTEGER CHECK (compensation > 0),
    is_remote BOOLEAN NOT NULL,
    gig_type TEXT NOT NULL CHECK (gig_type IN ('Fulltime', 'Recurring', 'One-Time')),
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--MANY TO MANY TABLES

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    writer_username TEXT
        REFERENCES writers ON DELETE CASCADE,
    platform_handle VARCHAR(20) NOT NULL
        REFERENCES platforms(handle) ON DELETE CASCADE,
    platform_display_name TEXT NOT NULL
        REFERENCES platforms(display_name) ON DELETE CASCADE,
    gig_id INTEGER
        REFERENCES gigs ON DELETE CASCADE,
    portfolio_id INTEGER
        REFERENCES portfolios ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE portfolio_pieces (
    portfolio_id INTEGER
        REFERENCES portfolios ON DELETE CASCADE,
    piece_id INTEGER 
        REFERENCES pieces ON DELETE CASCADE,
    PRIMARY KEY (portfolio_id, piece_id)
);

CREATE TABLE piece_tags (
    tag_title TEXT
        REFERENCES tags ON DELETE CASCADE,
    piece_id INTEGER
        REFERENCES pieces ON DELETE CASCADE,
    PRIMARY KEY (tag_title, piece_id)
); 

CREATE TABLE gig_tags (
    gig_id INTEGER
        REFERENCES gigs ON DELETE CASCADE,
    tag_title TEXT
        REFERENCES tags ON DELETE CASCADE,
    PRIMARY KEY (gig_id, tag_title)
); 

CREATE TABLE writer_follows_tag (
    writer_username TEXT
        REFERENCES writers ON DELETE CASCADE,
    tag_title TEXT
        REFERENCES tags ON DELETE CASCADE,
    PRIMARY KEY (writer_username, tag_title)
); 

CREATE TABLE writer_follows_platform (
    writer_username VARCHAR(20)
        REFERENCES writers ON DELETE CASCADE,
    platform_handle VARCHAR(20)
        REFERENCES platforms(handle) ON DELETE CASCADE,
    PRIMARY KEY (writer_username, platform_handle)
);

CREATE TABLE platform_follows_tag (
    platform_handle VARCHAR(20)
        REFERENCES platforms(handle) ON DELETE CASCADE,
    tag_title TEXT
        REFERENCES tags ON DELETE CASCADE,
    PRIMARY KEY (platform_handle, tag_title)
);

CREATE TABLE platform_follows_writer (
    platform_handle VARCHAR(20)
        REFERENCES platforms(handle) ON DELETE CASCADE,
    writer_username VARCHAR(20)
        REFERENCES writers ON DELETE CASCADE,
    PRIMARY KEY (platform_handle, writer_username)
);