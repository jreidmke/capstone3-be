CREATE TABLE writers(
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    bio VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE platforms(
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR UNIQUE NOT NULL,
    description VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    password VARCHAR NOT NULL,
    image_url VARCHAR NOT NULL,
    address_1 VARCHAR NOT NULL,
    address_2 VARCHAR,
    city VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    postal_code BIGINT NOT NULL,
    phone TEXT,
    twitter_username VARCHAR,
    facebook_username VARCHAR,
    youtube_username VARCHAR,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE portfolios(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE pieces(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE gigs(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    compensation DECIMAL(6, 2) NOT NULL,
    is_remote BOOLEAN NOT NULL,
    word_count BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE(platform_id, title)
);

CREATE TABLE tags(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR UNIQUE NOT NULL,
    is_fiction BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE applications(
    id BIGSERIAL PRIMARY KEY,
    gig_id BIGINT NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    writer_id BIGINT NOT NULL REFERENCES writers(id) ON DELETE CASCADE,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL CHECK (status in('Pending', 'Accepted', 'Rejected')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE piece_portfolios(
    id BIGSERIAL PRIMARY KEY,
    piece_id BIGINT NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (piece_id, portfolio_id)
);

CREATE TABLE piece_tags(
    id BIGSERIAL PRIMARY KEY,
    piece_id BIGINT NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (piece_id, tag_id)
);

CREATE TABLE gig_tags(
    id BIGSERIAL PRIMARY KEY,
    gig_id BIGINT NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (gig_id, tag_id)
);

CREATE TABLE platform_tag_follows(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (platform_id, tag_id)
);

CREATE TABLE platform_writer_follows(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (platform_id, writer_id)
);

CREATE TABLE writer_platform_follows(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (writer_id, platform_id)
);

CREATE TABLE writer_tag_follows(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (writer_id, tag_id)
);