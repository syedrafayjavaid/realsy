# Strapi startup tests
Because of the way Strapi process maintain state, it is not possible to run multiple 
startups in the same process. Each startup test has been split into its own file 
(and therefore process) for this reason.
