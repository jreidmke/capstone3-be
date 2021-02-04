// PORTFOLIO MODEL

// CREATE PORTFOLIO
// -Input: author username, title
// -Success returns username and title
// -Failure throws SchemaError
// -Limiations: new portfolio schema, ensureCorrectUserOrAdmin

// EDIT PORTFOLIO
// -INPUT: title, new title
// -Success returns new title
// -Failure throws notFoundError
// -Limitations update portfolio schema, ensureCorrectUserOrAdmin

// REMOVE PORTFOLIO
// -INPUT: title
// -Success returns undefined
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin

// ADD PIECE TO PORTFOLIO
// -INPUT: portfolio_title, piece_title
// -Success returns portfolio data
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin

// REMOVE PIECE FROM PORTFOLIO
// -INPUT: portfolio_title, piece_title
// -Success returns portfolio data
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin