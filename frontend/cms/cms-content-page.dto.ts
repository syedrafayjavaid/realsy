import {
    CmsHeroSectionDto,
    CmsRichBodyTextDto,
    CmsSavingsSliderDto,
    CmsUserGuideBoxDto
} from "cms/cms-content-item-types";

/**
 * A content page fetched from the CMS
 */
export type CmsContentPageDto = {
    title: string,
    slug: string,
    htmlTitle?: string,
    bodyContent: (CmsSavingsSliderDto | CmsUserGuideBoxDto | CmsHeroSectionDto | CmsRichBodyTextDto)[],
}
