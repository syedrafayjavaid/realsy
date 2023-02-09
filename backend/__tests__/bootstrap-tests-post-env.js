/**
 * Test env bootstrap _after_ the jest environment is set up
 */

// many tests depend on bootstrapping strapi, which takes a while, so we set a longer default timeout
jest.setTimeout(20000);
