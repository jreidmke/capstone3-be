CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE NOT NULL,
    is_fiction BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE writers(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    bio VARCHAR NOT NULL,
    expertise_1 INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    expertise_2 INTEGER REFERENCES tags(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE platforms(
    id SERIAL PRIMARY KEY,
    display_name VARCHAR UNIQUE NOT NULL,
    description VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    password VARCHAR NOT NULL,
    image_url VARCHAR NOT NULL,
    address_1 VARCHAR NOT NULL,
    address_2 VARCHAR,
    city VARCHAR NOT NULL,
    state VARCHAR(2) NOT NULL,
    postal_code INTEGER NOT NULL,
    phone TEXT,
    twitter_username VARCHAR,
    facebook_username VARCHAR,
    youtube_username VARCHAR,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolios(
    id SERIAL PRIMARY KEY,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE pieces(
    id SERIAL PRIMARY KEY,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    pinned BOOLEAN DEFAULT FALSE
);

CREATE TABLE gigs(
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    deadline DATE NOT NULL,
    compensation DECIMAL(6, 2) NOT NULL,
    is_remote BOOLEAN NOT NULL,
    word_count INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE(platform_id, title)
);

CREATE TABLE piece_portfolios(
    id SERIAL PRIMARY KEY,
    piece_id INTEGER NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (piece_id, portfolio_id)
);

CREATE TABLE piece_tags(
    id SERIAL PRIMARY KEY,
    piece_id INTEGER NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (piece_id, tag_id)
);

CREATE TABLE gig_tags(
    id SERIAL PRIMARY KEY,
    gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (gig_id, tag_id)
);

CREATE TABLE platform_tag_follows(
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (platform_id, tag_id)
);

CREATE TABLE platform_writer_follows(
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (platform_id, writer_id)
);

CREATE TABLE writer_platform_follows(
    id SERIAL PRIMARY KEY,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (writer_id, platform_id)
);

CREATE TABLE writer_tag_follows(
    id SERIAL PRIMARY KEY,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (writer_id, tag_id)
);

CREATE TABLE queries(
    id SERIAL PRIMARY KEY,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (writer_id, platform_id, gig_id)
);

CREATE TABLE ongoing_gigs(
    id SERIAL PRIMARY KEY,
    gig_id INTEGER REFERENCES gigs(id) ON DELETE CASCADE,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications(
    id SERIAL PRIMARY KEY,
    gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    writer_id INTEGER NOT NULL REFERENCES writers(id) ON DELETE CASCADE,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL CHECK (status in('Pending', 'Accepted', 'Rejected')) DEFAULT 'Pending',
    pitch TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE application_messages(
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    writer_id INTEGER REFERENCES writers(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    gig_id INTEGER REFERENCES gigs(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL CHECK (status in('Pending', 'Accepted', 'Rejected')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);