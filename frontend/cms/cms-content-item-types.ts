import {FileUploadDto} from "api/uploads/file-upload.dto";

/**
 * Content item types provided by the CMS
 */
export enum CmsContentItemTypes {
    Image = 'content.image',
    Button = 'content.button',
    SavingsSlider = 'content.savings-slider',
    HeroSection = 'content.hero-section',
    RichBodyText = 'content.rich-body-text',
    UserGuideBox = 'content.user-guide-box', //
}

/**
 * A hero section content item from the CMS
 */
export type CmsHeroSectionDto = {
    __component: string,
    headline?: string,
    buttonText?: string,
    buttonUrl?: string,
    showGetStartedButton: boolean,
    fullWidth: boolean,
    backgroundImage?: FileUploadDto,
};


/**
 * A savings slider content item from the CMS
 * (the home page "you can save $xxx" box)
 */
export type CmsSavingsSliderDto = {
    __component: string,
    currentValueText?: string,
    couldSaveText?: string,
    afterSavingsText?: string,
};

/**
 * A rich text content item from the CMS
 */
export type CmsRichBodyTextDto = {
    __component: string,
    body: string; // HTML content
}

/**
 * A user guide box from the CMS
 * (eg. the homepage "buying with realsy"/"selling with realsy" boxes)
 */
export type CmsUserGuideBoxDto = {
    __component: string,
    heading: string,
    bulletPoints: {body: string}[],
    image?: FileUploadDto,
}

/**
 * A button content item from the CMS
 */
export type CmsButtonDto = {
    __component: string,
    text: string,
    link?: string,
    triggerSignIn?: boolean,
    triggerChat?: boolean,
}

/**
 * An image content item from the CMS
 */
export type CmsImageDto = {
    __component: string,
    overlayText?: string,
    image?: FileUploadDto,
}
