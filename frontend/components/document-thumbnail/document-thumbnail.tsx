import React, {FC, useState} from 'react';
import {Button, ButtonVariant} from "components/button";
import Documents from "api/documents";
import {useAuthContext} from "api/auth/auth-context";
import {NotificationManager} from 'react-notifications';
import Uploads from "api/uploads";
import {useDocumentThumbnailStyles} from './document-thumbnail.styles';
import {ApiClient} from "api/api-client";
import {UserDocumentDto} from "api/documents/user-document.dto";
import {Modal} from "components/modal";

/**
 * A quick view of a user document
 */

export type DocumentThumbnailProps = {
    document: UserDocumentDto,
    signingReturnUrl?: string,
    noFloat?: boolean,
    onDelete?: () => any,
};

export const DocumentThumbnail: FC<DocumentThumbnailProps> = ({
    document,
    signingReturnUrl = process.env.NEXT_PUBLIC_BASE_URL,
    noFloat = false,
    onDelete,
}) => {
    const authContext = useAuthContext();
    const styles = useDocumentThumbnailStyles();
    const [loadingDocument, setLoadingDocument] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    /**
     * Opens the document in Docusign
     */
    async function openInDocusign() {
        setLoadingDocument(true);
        const signingUrlResponse = await Documents.getSigningUrl(
            authContext.apiToken,
            document.id,
            process.env.NEXT_PUBLIC_BASE_URL + '/account/documents'
        );
        if (signingUrlResponse?.viewResult?.url) {
            window.location = signingUrlResponse.viewResult.url;
        }
        else {
            NotificationManager.error('Failed to load document');
        }
        setLoadingDocument(false);
    }

    /**
     * Render
     */
    const documentUrl = Uploads.getUploadFullUrl(document.signed ? document.signed?.url : document.original?.url);
    const listing = document.listing;
    const listingAddress = listing ? `${listing.address} ${listing.city}, ${listing.state}` : '';
    return (
        <div className={`${styles.container} ${noFloat ? 'no-float' : ''}`}>
            {showDeleteModal &&
                <Modal
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div style={{padding: '50px 20px 20px'}}>
                        <p style={{textAlign: 'center'}}>Really delete document "{document.name}"?</p>
                        <p style={{textAlign: 'center'}}>
                            <Button
                                children={'No'}
                                padding={'10px 20px'}
                                onClick={() => setShowDeleteModal(false)}
                            />
                            {' '}
                            <Button
                                children={'Yes'}
                                padding={'10px 20px'}
                                variant={ButtonVariant.Yellow}
                                onClick={async () => {
                                    setIsDeleting(true);
                                    try {
                                        await ApiClient.delete('/user-documents/' + document.id);
                                        onDelete?.();
                                    }
                                    catch (e) {
                                        NotificationManager.error('Failed to delete document');
                                    }
                                    setIsDeleting(false);
                                }}
                            />
                        </p>
                    </div>
                </Modal>
            }

            <div className={styles.bodyWrapper}>
                <div className={styles.imageContainer} style={{backgroundImage: `url("/icon-document.png")`}}/>
                <div className={styles.body}>
                    <h3><a href={documentUrl} target='_new'>{document.name}</a></h3>
                    <p className={styles.date}>Uploaded {new Date(document.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <footer className={styles.footer}>
                <span>{listingAddress}</span>
                <div>
                    {document.owner?.id === authContext.currentUser?.id &&
                        <Button
                            children={'Delete'}
                            onClick={async () => {
                                setShowDeleteModal(true);
                            }}
                            loading={isDeleting}
                            variant={ButtonVariant.White}
                            padding={'3px 15px'}
                        />
                    }
                    {document.docusignEnvelope?.envelopeId && !document.signed &&
                        <Button
                            children={'Review/Sign'}
                            loading={loadingDocument}
                            onClick={openInDocusign}
                            variant={ButtonVariant.White}
                            padding={'3px 15px'}
                        />
                    }
                    {(!document.docusignEnvelope?.envelopeId || document.signed) &&
                        <Button
                            children={'View'}
                            href={documentUrl}
                            target='_new'
                            variant={ButtonVariant.White}
                            padding={'3px 15px'}
                        />
                    }
                </div>
            </footer>
        </div>
    );
};
