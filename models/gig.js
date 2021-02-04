// GIG MODEL

// CREATE GIG
// -INPUT: platform_name, title, description, compensation, is_remote, number_of_words, gig_type
// -SUCCESS: Returns gig data
// -LIMITATIONS: Create gig schema, ensureCorrectPlatformOrAdmin

// EDIT GIG:
// -INPUT: platform_name, title, description, compensation, is_remote, number_of_words, gig_type
// -SUCCESS: Returns gig data
// -FAILURE: errorNotFound
// -LIMITATIONS: Update gig schema, ensureCorrectPlatformOrAdmin

// REMOVE GIG: 
// -INPUT: title
// -SUCESS: Returns undefined
// -FAILURE: errorNotFound
// -LIMITATIONS: ensureCorrectPlatformOrAdmin

// ADD TAG TO GIG
// -INPUT: gig_title, tag_title
// -Success returns gig and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin

// REMOVE TAG FROM GIG
// -INPUT: gig_title, tag_title
// -Success returns gig and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin

// GET GIGS BY TAG
// -INPUT: tag_title
// -Sucess: returns all gigs that contain tag
// -Failure: errorNotFound
// -Limitations: tag schema

