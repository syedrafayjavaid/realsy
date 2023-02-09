# Realsy Frontend
Frontend for the Realsy web app. Built on NextJS as a universal React app.

## Development
Ensure you have a local .env file (use .env.example as a guide) with all 
third-party keys so all features works.

A local development server can be run up with ```npm run dev```.

## Testing
Jest is used as the test runner. Tests are co-located with the files they test as 
much as possible (eg. components have test files in their own directory, instead 
of one higher-level directory to hold all tests).

Tests can be run with ```npm test``` (all tests), ```npm run test:unit``` (unit only)
and ```npm run test:integration``` (integration only).

Tests are organized in groups to be run with 
[jest-runner-groups](https://www.npmjs.com/package/jest-runner-groups). Unit tests 
are grouped as @unit, integration tests as @integration, and individual components 
or modules should also group tests together if there are multiple groups (eg. 
the auth library has unit tests and integration tests, so the unit tests belong 
to groups "unit" and "auth/unit", and the integration tests belong to "integration" 
and "auth/integration"). That individual component/module can then be tested by 
using its group name with ```npm test -- --group=<module-name>``` (so in that 
example ```npm test -- --group=auth``` would run the unit and integration tests 
for the auth library).

Write new tests as changes are made, maintaining these groupings, and run tests 
before committing changes to ensure no regressions were made.

### Integration Tests
Integrations tests require an API environment to be running. An API test
environment can be set up by running
```
npm run api:test-env
```
in the main package directory (not this /frontend directory).

## Third-Party Services
See .env.example for required 3rd-party services

### Google Maps
The frontend should use a different Google Maps API key than the backend. 
Because the frontend API key will be visible to the public, it should have only 
the Maps Javascript API enabled, and should be restricted with an HTTP referrer
of the production domain.
