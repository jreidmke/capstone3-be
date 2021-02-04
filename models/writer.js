// WRITER MODEL METHODS

// AUTHENTICATE
// -Input: username, password
// -Success returns all data on writer except password, all portfolios, pieces, applications, followed tags, and followed platforms.
// -Failure throws UnauthorizedError.
// Limitations: Auth User schema

// REGISTER
// -Input: username, password, first_name, last_name, age, location, email, phone, twitter_url, facebook_url, youtube_url, is_admin
// -Success returns all data on writer except password
// -Failure throws BadRequestError
// Limitations: Register User schema

// FIND ALL
// -Success returns all data on all writers (except their password, as well as followed tags and followed platforms)

// GET WRITER
// -Input: username
// -Success returns all data on writer except password, all portfolios, pieces, applications, followed tags, and followed platforms.
// -Failure throws BadRequestError
// Limitations: ensureCorrectUserOrAdmin 

// UPDATE WRITER
// -Input: username <=this is not changable! this is just for verification, password, first_name, last_name, age, location, email, phone, twitter_url, youtube_url, facebook_url
// -Success returns all data on writer except password
// -Failure Throws NotFoundError
// Limitations: ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectUserOrAdmin and update writer schema. 

// REMOVE WRITER
// -Input: username, password
// -Success returns undefined. 
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin

// FOLLOW TAG
// -Input: Username, tag title
// -Success returns username, tagtitle
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin, json schema for follow tag

// FOLLOW PLATFORM
// -Input: Username, platform name
// -Success returns username, platformname
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin, json schema for follow platform.