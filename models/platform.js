// PLATFORM MODEL

// AUTHENTICATE
// -INPUT: platform_name, password
// -Success returns token
// -Failure throws Unauthroized Error
// Limitations: Auth user schema

// REGISTER 
// -INPUT: platform_name, password, location, description, logo_url, email, phone, twitter_url, facebook_url, youtube_url, is_admin
// -Success returns all data except password
// Failure throws BadRequestError
// Limitations: Register platform schema

// FIND ALL
// -Success returns all data on all companies

// GET PLATFORM
// -INPUT: platform_name
// -Success: Returns all data on platform except password
// -Failure: errorNotFound

// UPDATE PLATFORM
// -INPUT: platform_name, updatedData
// -Success returns updatedData
// -Failure throws not found error
// -LIMITATIONS: AGAIN!!! ALOT OF LIMITATIONS. ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectPlatformOrAdmin and update platform schema. 

// REMOVE PLATFORM
// -INPUT: platform_name
// -Success returns undefined
// -Failure throws errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin 