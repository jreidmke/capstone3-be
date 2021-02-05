// GIGS ROUTES

// GET /gigs
// Shows a list of all gigs

// GET /gigs/:gig_id
// Shows detail on specified gig

// GET /gigs/:gig_id/apply
// Shows apply to gig form

// POST /gigs/:gig_id/apply
// Adds writer username, portfolio id and other data to APPLICATION DB. 
//This will also make use of **userContext** to pass in the correct data for user.

// DELETE /gigs/:gig_id/apply
// Withdraws application
//This will also make use of **userContext** to pass in the correct data for user.
