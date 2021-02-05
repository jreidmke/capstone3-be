--both writers have the password "password"

INSERT INTO writers (username, password, first_name, last_name, bio, age, location, email, phone, twitter_username, facebook_username, youtube_username, is_admin)
VALUES ('test1',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Test',
    'Writer',
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
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    32,
    'Chicago',
    'testadmin@testadmin.com',
    '4444444444',
    'testadmin',
    'testadmin',
    'testadmin',
    TRUE);

INSERT INTO portfolios (writer_username, title)
VALUES ('test1', 'Test Portfolio 1'), ('test2', 'Test Portfolio 2'); 

INSERT INTO pieces (writer_username, title, text)
VALUES ('test1', 
    'Test Piece 1', 
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'),
    ('test2',
    'Test Piece 2', 
    'Remember, a Jedi can feel the Force flowing through him. I don''t know what you''re talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan-- Alderaan? I''m not going to Alderaan. I''ve got to go home. It''s late, I''m in for it as it is.
    You mean it controls your actions? Your eyes can deceive you. Don''t trust them. But with the blast shield down, I can''t even see! How am I supposed to fight? The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.
    Look, I can take you as far as Anchorhead. You can get a transport there to Mos Eisley or wherever you''re going.'
    );

--both platforms have the password "password"

INSERT INTO platforms(name, password, location, description, logo_url, email, phone, twitter_username, facebook_username, youtube_username, is_admin)
VALUES ('platform1',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
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
    'Chicago',
    'Hey, Luke! May the Force be with you. In my experience, there is no such thing as luck. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers. Kid, I''ve flown from one side of this galaxy to the other. I''ve seen a lot of strange stuff, but I''ve never seen anything to make me believe there''s one all-powerful Force controlling everything. There''s no mystical energy field that controls my destiny. It''s all a lot of simple tricks and nonsense.',
    'https://miro.medium.com/max/8000/1*JrHDbEdqGsVfnBYtxOitcw.jpeg',
    'platform2@platform2.com',
    '2222222222',
    'platform2',
    'platform2',
    'platform2',
    TRUE);

INSERT INTO gigs (platform_name, title, description, compensation, is_remote, gig_type)
VALUES ('platform1', 
    'Comedy Writing Gig', 'Write us a funny    script for our youtube sketch channel', 75, TRUE, 'One-Time'),
    ('platform2', 'New Article about Tammy Baldwin', 'We need someone to write us a story about Tammy Baldwin. If this goes well, there is potential for recurring work.', 100, FALSE, 'Recurring'); 