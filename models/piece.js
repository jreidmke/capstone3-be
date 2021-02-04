// PIECE MODEL

// CREATE PIECE:
// -INPUT: username, title, text
// -Success returns title and text
// -Limitations: now piece schema, ensureCorrectUserOrAdmin

// EDIT PIECE: 
// -INPUT: title, new title, new text
// -Success returns new title and new text
// -Failure returns not found error
// -Limitations: update piece schema, ensureCorrectUserOrAdmin

// REMOVE PIECE:
// -INPUT: title
// -Success returns undefined
// -Failure returns not found error
// -Limitations: ensureCorrectUserOrAdmin

// ADD TAG TO PIECE:
// -INPUT: piece_title, tag_title
// -Success returns piece and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectUserOrAdmin

// REMOVE TAG FROM PIECE:
// -INPUT: piece_title, tag_title
// -Success returns piece and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectUserOrAdmin

// GET PIECES BY TAG
// -INPUT: tag_title
// -Sucess: returns all pieces that contain tag
// -Failure: errorNotFound
// -Limitations: tag schema