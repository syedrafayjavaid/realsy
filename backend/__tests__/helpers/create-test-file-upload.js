/**
 * Creates a file upload entity for use in tests
 */
export async function createTestFileUpload() {
    return (await strapi.plugins.upload.services.upload.upload({
        data: {
            fileInfo: {},
        },
        files: {
            path: __dirname + '/../mock-data/dummy.pdf',
            name: 'dummy.pdf',
            type: 'pdf',
            size: 0,
        },
    }))[0];
}
