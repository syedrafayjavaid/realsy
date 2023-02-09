/**
 * Offers service
 * Provides functions related to offers
 */
module.exports = {
    /**
     * Create one
     * @param data
     * @param files
     * @returns {Promise<{success: boolean, errorCode: string}>}
     */
    async create(data, {files} = {}) {
        const entry = await strapi.query('offer', '').create(data);

        // upload related files, if posted with listing
        if (files) {
            await strapi.entityService.uploadFiles(entry, files, {
                model: 'offer',
            });
            return this.findOne({ id: entry.id });
        }

        // get default properties and update entry
        const appSettings = await strapi.query('app-settings', '').findOne();
        await strapi.query('offer', '').update(
            {id: entry.id},
            {
                closingSteps: appSettings.closingSteps.map(step => { return {
                    title: step.title,
                    microSteps: step.microSteps.map(microStep => { return {
                        name: microStep.name,
                        complete: microStep.complete
                    }})
                }})
            }
        );

        return entry;
    },
};
