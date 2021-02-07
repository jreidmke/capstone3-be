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
    description VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    writer_id BIGINT REFERENCES writers(id),
    platform_id BIGINT REFERENCES platforms(id),
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
    writer_id BIGINT REFERENCES writers(id),
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE pieces(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE gigs(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id),
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    compensation DECIMAL(2) NOT NULL,
    is_remote BOOLEAN NOT NULL,
    word_count BIGINT,
    status VARCHAR NOT NULL CHECK (status in('Pending', 'Accepted', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE tags(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE applications(
    id BIGSERIAL PRIMARY KEY,
    gig_id BIGINT NOT NULL REFERENCES gigs(id),
    writer_id BIGINT NOT NULL REFERENCES writers(id),
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE piece_portfolios(
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id),
    piece_id BIGINT NOT NULL REFERENCES pieces(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE piece_tags(
    id BIGSERIAL PRIMARY KEY,
    piece_id BIGINT NOT NULL REFERENCES pieces(id),
    tag_id BIGINT NOT NULL REFERENCES tags(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE gig_tags(
    id BIGSERIAL PRIMARY KEY,
    tag_id BIGINT NOT NULL REFERENCES tags(id),
    gig_id BIGINT NOT NULL REFERENCES gigs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE platform_tag_follows(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id),
    tag_id BIGINT NOT NULL REFERENCES tags(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE platform_writer_follows(
    id BIGSERIAL PRIMARY KEY,
    platform_id BIGINT REFERENCES platforms(id),
    writer_id BIGINT REFERENCES writers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE writer_platform_follows(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id),
    platform_id BIGINT REFERENCES platforms(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE writer_tag_follows(
    id BIGSERIAL PRIMARY KEY,
    writer_id BIGINT REFERENCES writers(id),
    tag_id BIGINT NOT NULL REFERENCES tags(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);