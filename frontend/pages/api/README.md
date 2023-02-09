# API Routes

The directory name here is a little unintuitive, as the API is actually a separate
top-level package, but it is required by NextJS.
 
These are routes the frontend and hit that don't belong in the real API. For example, 
logging in without client-side JS is handled here by POSTing to login.js. Most of 
these routes will then call the real API, but logging into the frontend for example 
should be unique to the frontend.
