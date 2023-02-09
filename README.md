# Realsy Homes

## General Architecture
The app is split into two packages, backend and frontend, comprising the API and 
the website interface respectively. (The CMS, though conceptually different, 
is contained within the API as well.)

The API backend is built on Strapi (https://strapi.io/documentation/),
and the frontend is built on NextJS (https://nextjs.org/docs/).

## Deploying to AWS
The code has been modified to make deployment to AWS as simple as possible. To do so:
1. Create two elastic beanstalk apps
2. Add a database attached to the backend app
    1. The app will automatically read the AWS-provided environment vars and 
    use the provided database
3. Use the eb cli to initialize and deploy each app
    1. Do not initialize an EB project at the project root
    2. Create one project in /backend, and one in /frontend
    3. Deploy each EB project to the respective EB app
4. Set up environment variables in environment config > software settings
5. Set up app to store uploads in S3
    1. Create an S3 bucket
    2. In the Strapi admin, go to plugins -> files upload settings (gear icon)
    3. Choose AWS S3 upload resize fix as the provider
    4. Fill in AWS credentials

## Testing
Jest is used as the test runner. Tests are co-located with the files they test as 
much as possible (eg. components have test files in their own directory, instead 
of one higher-level directory to hold all tests).

Tests can be run with ```npm test``` (all tests), ```npm run test:unit``` (unit only)
and ```npm run test:integration``` (integration only).

The most valuable tests are end-to-end UI tests run with cypress. These tests can be 
run with ```npm run test:e2e```, which will also place recorded video of the simulated 
user interactions in the cypress folder, or you can run ```npm run cypress:open``` 
to enter an interactive testing environment and run tests through the UI.

The end-to-end tests are the most confirming tests, but have limited coverage and 
take longer to run, so it's recommended to only run those tests after development 
before committing changes.

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
