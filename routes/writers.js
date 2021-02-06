// WRITER ROUTES

// **The ONLY VIEWABLE statements are of course a first draft and will probably/definitely be changed to allow more writers/platforms to view more things. The only protected routes should be the 'edit', 'post' and delete routes. Remember, first draft**

// 
// **
// WRITERS//
// **

// GET /writers
// Shows a list of writers

// GET /writers/writer username
// Shows a writers profile

// GET /writers/writer username/edit
// Only viewable by admin/username
// Shows a writers profile edit form

// PATCH /writers/writer username/edit
// Only viewable by admin/username
// Sends request to update write data in database

// DELETE /writers/writer username
// ONLY viewalbe by admin/username
// Sends request to delete profile. Redirects to home page.

// GET /writers/writer_username/followed_tags
// ONLY viewalbe by admin/username
// Shows a list of tags the writer is following with ICON LINKS TO send POST || DELETE reqs. 

// POST /writers/writer_username/followed_tags/:tag_title
// Adds TAG title to WRITER_FOLLOW_TAG DB

// DELETE /writers/writer_username/followed_tags/:tag_title
// Deletes TAG title from WRITER_FOLLOW_TAG

// GET /writers/writer_username/followed_platforms
// ONLY viewalbe by admin/username 
// Shows a list of platforms the writer follows with ICON LINKS TO send POST || DELETE reqs. 

// POST /writers/writer_username/followed_platforms/:platform_name
// Adds Platform name to WRITER_FOLLOW_PLATFORM

// DELETE /writers/writer_username/followed_platforms/:platform_name
// Deletes Platform name from WRITER_FOLLOW_PLATFORM

// *
// *
// // //PORTFOLIOS
// *
// *

// GET /writers/writer username/portfolios
// Only viewable by admin/username
// Shows a list of writer portfolios

// GET /writers/writer username/portfolios/portfolio id
// Only viewable by admin/username
// Shows the contents of portfolio (a list of pieces)

//PATCH /writers/writer username/portfolios/portfolio id/edit
//ONLY VIEWABLE BY ADMIN/USERNAME
// Sends patch to UPDATE portfolio name

// GET /writers/writer_username/portfolios/new
// Only viewable by admin/username
// Shows form to create new portfolio

// POST /writers/writer_username/portfolios/new
// Only viewable by admin/username
// Makes POST to create new portfolio. Redirects to /writers/writer_username/portfolios. 

// GET /writers/writer_username/portfolios/:portfolio_id/add_pieces/
// Shows a list of all pices by author and AN ICON TO EITHER ADD OR REMOVE PIECE depending on wether or not it is present in portfolio. 

// POST /writers/writer_username/portfolios/:portfolio_id/add_piece/:piece_id
// Makes the actual post request when you CLICK ON AN ICON

// DELETE /writers/writer_username/portfolios/:portfolio_id/add_piece/:piece_id
// Deletes piece id and portfolio id from PORTFOLIO_PIECE db. 


//** */
//** */
// //PIECES
//** */
//** */


// GET /writers/writer username/pieces
// Only viewable by admin/username
// Shows a list of authoer's pieces

// GET /writers/writer username/pieces/:piece_id
// Only viewable by admin/username
// Shows the details of a piece

// GET /writers/writer_username/pieces/new (FE ROUTE)
// Shows form to create new piece

// POST /writers/writer_username/pieces/new
// Insert new piece into DB.

// GET /writers/writer username/pieces/:piece_id/edit
// Only viewable by admin/username
// Shows edit form to allow you to edit piece

// PATCH /writers/writer username/pieces/:piece_id/edit
// Only viewable by admin/username
// Makes patch request to update piece.

// GET /writers/writer_username/pieces/:piece_id/tags
// Shows two lists of tags. Tags that the piece is already tagged with as well as all other tags. 

// POST /writers/writer_username/pieces/:piece_id/tags/:tag_title
// Adds tag title and pice id to PIECE_TAG db. 

// DELETE /writers/writer_username/pieces/:piece_id/tags/:tag_title
// Removes tag title and piece id from PIECE_TAG db.