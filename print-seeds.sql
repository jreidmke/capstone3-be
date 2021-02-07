--both writers have the password "password"

-- ***WRITERS***

INSERT INTO writers (username, password, first_name, last_name, image_url, bio, age, location, email, phone, twitter_username, facebook_username, youtube_username, is_admin)
VALUES ('test1',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Test',
    'Writer',
    'https://searchengineland.com/figz/wp-content/seloads/2018/09/writer-writing-ss-1920.jpg',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    32,
    'Milwaukee',
    'testwriter@testwriter.com',
    '5555555555',
    'testwriter',
    'testwriter',
    'testwriter',
    FALSE),
    ('test2',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Test',
    'Admin',
    'https://searchengineland.com/figz/wp-content/seloads/2018/09/writer-writing-ss-1920.jpg',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    32,
    'Chicago',
    'testadmin@testadmin.com',
    '4444444444',
    'testadmin',
    'testadmin',
    'testadmin',
    TRUE),
    ('jreid',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'James',
    'Reid',
    'https://searchengineland.com/figz/wp-content/seloads/2018/09/writer-writing-ss-1920.jpg',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    32,
    'Milwaukee',
    'jreidmke@gmail.com',
    '6303385693',
    'blah',
    'blegh',
    'jreidmke',
    TRUE),
    ('mariaaaldapa',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Maria',
    'Aldapa',
    'https://searchengineland.com/figz/wp-content/seloads/2018/09/writer-writing-ss-1920.jpg',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    24,
    'Milwaukee',
    'mariaaaldapa@gmail.com',
    '4143991206',
    'tessaract',
    'tessarcat',
    'tessarcat',
    FALSE);

-- **TAGS**

INSERT INTO tags (title, is_fiction)
VALUES ('Comedy', TRUE), 
        ('Sci-Fi', TRUE), 
        ('Horror', TRUE),
        ('Romance', TRUE),
        ('Drama', TRUE),
        ('Action', TRUE),
        ('Politics', FALSE), 
        ('History', FALSE), 
        ('Cooking', FALSE),
        ('Sports', FALSE),
        ('Science', FALSE),
        ('Woodworking', FALSE); 

-- **PORTFOLIOS**

INSERT INTO portfolios (writer_username, title)
VALUES ('test1', 'Fiction Portfolio 1'), 
        ('test2', 'Non-Fiction Portfolio 2'),
        ('jreid', 'Sci Fi Portfolio'),
        ('jreid', 'Horror Portfolio'),
        ('mariaaaldapa', 'Sports Portfolio'),
        ('mariaaaldapa', 'Science Port 3'); 

-- **PIECES**

INSERT INTO pieces (writer_username, title, text)
VALUES ('test1', 
    'Fiction Piece 1', 
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'),
    ('test2',
    'Non-Fiction Piece 2', 
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'),
    ('jreid',
    'Star Wars Lines',
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'),
    ('mariaaaldapa',
    'Science Stuff',
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'
    );

--both platforms have the password "password"

-- **PLATFORMS**

INSERT INTO platforms(username, password, handle, display_name, location, description, logo_url, email, phone, twitter_username, facebook_username, youtube_username, is_admin)
VALUES ('platform1',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'platform1',
    'The First Platform.com',
    'Milwaukee',
    'Hey, Luke! May the Force be with you. In my experience, there is no such thing as luck. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers. Kid, I''ve flown from one side of this galaxy to the other. I''ve seen a lot of strange stuff, but I''ve never seen anything to make me believe there''s one all-powerful Force controlling everything. There''s no mystical energy field that controls my destiny. It''s all a lot of simple tricks and nonsense.',
    'https://miro.medium.com/max/8000/1*JrHDbEdqGsVfnBYtxOitcw.jpeg',
    'platform1@platform1.com',
    '1111111111',
    'platform1',
    'platform1',
    'platform1',
    FALSE), 
    ('platform2',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'platform2',
    'The Second Platform',
    'Chicago',
    'Hey, Luke! May the Force be with you. In my experience, there is no such thing as luck. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers. Kid, I''ve flown from one side of this galaxy to the other. I''ve seen a lot of strange stuff, but I''ve never seen anything to make me believe there''s one all-powerful Force controlling everything. There''s no mystical energy field that controls my destiny. It''s all a lot of simple tricks and nonsense.',
    'https://miro.medium.com/max/8000/1*JrHDbEdqGsVfnBYtxOitcw.jpeg',
    'platform2@platform2.com',
    '2222222222',
    'platform2',
    'platform2',
    'platform2',
    TRUE),
    ('scifiTV',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'scifitv',
    'Sci-Fi TV',
    'New York City',
    'Hey, Luke! May the Force be with you. In my experience, there is no such thing as luck. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers. Kid, I''ve flown from one side of this galaxy to the other. I''ve seen a lot of strange stuff, but I''ve never seen anything to make me believe there''s one all-powerful Force controlling everything. There''s no mystical energy field that controls my destiny. It''s all a lot of simple tricks and nonsense.',
    'https://miro.medium.com/max/8000/1*JrHDbEdqGsVfnBYtxOitcw.jpeg',
    'scifiTV@scifiTV.com',
    '1234567890',
    'scifiTV',
    'scifiTV',
    'scifiTV',
    FALSE),
    ('scienceChannel',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'sciencechannel',
    'The Science Channel',
    'New York City',
    'Hey, Luke! May the Force be with you. In my experience, there is no such thing as luck. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers. Kid, I''ve flown from one side of this galaxy to the other. I''ve seen a lot of strange stuff, but I''ve never seen anything to make me believe there''s one all-powerful Force controlling everything. There''s no mystical energy field that controls my destiny. It''s all a lot of simple tricks and nonsense.',
    'https://miro.medium.com/max/8000/1*JrHDbEdqGsVfnBYtxOitcw.jpeg',
    'scichan@scichan.com',
    '1234567890',
    'scichan',
    'scichan',
    'scichan',
    FALSE);

-- **GIGS**

INSERT INTO gigs (platform_handle, platform_display_name, title, description, compensation, is_remote, gig_type)
VALUES ('platform1', 'The First Platform.com', 'Comedy Writing Gig', 'Write us a funny script for our youtube sketch horror-comedy channel', 75, TRUE, 'One-Time'),
    ('platform2', 'The Second Platform', 'New Article about Tammy Baldwin', 'We need someone to write us a story about Tammy Baldwin from a historical perspective. If this goes well, there is potential for recurring work.', 100, FALSE, 'Recurring'), 
    ('platform1', 'The First Platform.com', 'Star Wars Sequel', 'Help us write the next Star Wars Movie for $50', 50, TRUE, 'One-Time'),
    ('platform2', 'The Second Platform', 'Recipes', 'Come write recipes for us. We need food now!', 1000, FALSE, 'Fulltime'),
    ('scifitv', 'Sci-Fi TV', 'New Trek', 'Come write a new Trek show that takes place after Voyager.', 500000, TRUE, 'Fulltime'),
    ('sciencechannel', 'The Science Channel', 'Global Warming: The Show', 'Come and write about global warming and start the countdown.', 25, FALSE, 'One-Time'),
    ('scifitv', 'Sci-Fi TV', 'New Stargate', 'Finally, a Stargate Reboot', 5, TRUE, 'Recurring'),
    ('sciencechannel', 'The Science Channel', 'The Bear Show', 'Come write about bears.', 5000, FALSE, 'One-Time'); 

-- **APPLICATIONS**

INSERT INTO applications (writer_username, platform_handle, platform_display_name, gig_id, portfolio_id, is_active)
VALUES('test1', 'platform1', 'The First Platform.com', 1, 1, TRUE), 
    ('test2', 'platform2', 'The Second Platform', 2, 2, TRUE),
    ('jreid', 'scifitv', 'Sci-Fi TV', 5, 3, TRUE),
    ('jreid', 'scifitv', 'Sci-Fi TV', 7, 3, TRUE),
    ('mariaaaldapa', 'sciencechannel', 'The Science Channel', 6, 6, FALSE),
    ('mariaaaldapa', 'sciencechannel', 'The Science Channel', 8, 6, FALSE);

-- **PORTFOLIO PIECES

INSERT INTO portfolio_pieces 
VALUES(1, 1), (2, 2), (3, 3), (6, 4);

-- **TAG JOINS**

INSERT INTO piece_tags
VALUES('Comedy', 1), ('Horror', 1), ('Politics', 2), ('History', 2), ('Sci-Fi', 3), ('Comedy', 3), ('Science', 3), ('Cooking', 3); 

INSERT INTO gig_tags
VALUES(1, 'Comedy'), (1, 'Horror'), (2, 'Politics'), (2, 'History'); 

-- **FOLLOWS**

INSERT INTO writer_follows_tag
VALUES('test1', 'Comedy'), ('test1', 'Horror'), ('test1', 'Sci-Fi'), ('test2', 'History'), ('test2', 'Politics'), ('test2', 'Cooking'), ('jreid', 'Comedy'), ('jreid', 'Sci-Fi'), ('jreid', 'Politics'), ('jreid', 'History'), ('mariaaaldapa', 'Cooking'), ('mariaaaldapa', 'History'), ('mariaaaldapa', 'Woodworking');

INSERT INTO writer_follows_platform
VALUES('test1', 'platform1'), ('test2', 'platform2'), ('jreid', 'sciencechannel'), ('jreid', 'scifitv'), ('mariaaaldapa', 'sciencechannel'), ('mariaaaldapa', 'platform2');

INSERT INTO platform_follows_tag
VALUES('platform1', 'Comedy'), ('platform1', 'Horror'), ('platform1', 'Sci-Fi'), ('platform2', 'History'), ('platform2', 'Politics'), ('platform2', 'Cooking');

INSERT INTO platform_follows_writer
VALUES('platform1', 'test1'), ('platform2', 'test2');