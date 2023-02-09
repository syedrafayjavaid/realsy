/**
 * Types of micro content items provided by the CMS
 */
export enum MicroContentItemType {
    PlainText = 'content.micro-content',
    RichText = 'content.micro-content-rich',
}

/**
 * A micro content set fetched from the CMS
 */
export type MicroContentSetDto = {
    code: string,
    microContent: {
        __component: MicroContentItemType,
        code: string,
        content: string,
    }[],
}
