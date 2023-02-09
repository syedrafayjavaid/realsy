/**
 * A file upload fetched from the CMS or API
 */
export type FileUploadDto = {
    name?: string,
    alternativeText?: string | null,
    caption?: string | null,
    width?: number,
    height?: number,
    formats?: [] | null,
    ext?: string,
    mime?: string,
    size?: number,
    url: string,
    previewUrl?: string | null,
}
