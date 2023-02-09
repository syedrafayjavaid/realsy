import React from "react";
import {CmsClient} from "cms/cms-client";

/**
 * CMS functions
 */
const Cms = {
    getMicroContentSet,
    getMicroContentItem,
    getForm,
    getImageFullUrl,
};
export default Cms;

/**
 * Fetches a micro content set by code/slug
 * @param code
 * @returns {Promise<{success: boolean, microContent: any}>}
 */
async function getMicroContentSet(code) {
    const apiResponse = await CmsClient.get('/micro-content-sets?code_eq=' + code);
    const data = apiResponse.data;
    return {
        success: apiResponse.status === 200 && (data.length > 0),
        microContentSet: data?.[0]
    }
}

/**
 * Gets a micro content item from a micro content set
 * @param microContentSet
 * @param itemCode
 * @returns {*}
 */
function getMicroContentItem(microContentSet, itemCode) {
    return microContentSet?.microContent?.filter(item => item.code === itemCode)?.[0]?.content;
}

/**
 * Fetches a form by code/slug
 * @param code
 * @returns {Promise<{form: *, success: boolean}>}
 */
async function getForm(code) {
    const apiResponse = await CmsClient.get('/forms?code_eq=' + code);
    const formFields = (apiResponse.data)?.[0]?.fields;

    // paginate the form
    const formPages = [];
    let pageFields = [];
    formFields.forEach(formField => {
        if (formField.__component === 'forms.page-break') {
            formPages.push(pageFields)
            pageFields = [];
        }
        else {
            pageFields.push(formField);
        }
    });
    formPages.push(pageFields);

    return {
        success: apiResponse.status === 200,
        form: formPages
    }
}

/**
 * Returns the full URL for an image's path
 * This is abstracted away in the image base URL or directory ever changes
 * @param imagePath
 * @returns {string}
 */
function getImageFullUrl(imagePath) {
    return process.env.NEXT_PUBLIC_CMS_IMAGES_URL + imagePath;
}
