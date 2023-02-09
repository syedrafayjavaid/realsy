import * as React from 'react';
import Documents from 'api/documents';
import {useAccountPageLayout} from "layout/account-page-layout";
import {Button} from "components/button";
import {DocumentThumbnail} from "components/document-thumbnail";
import {createUseStyles} from "react-jss";
import {useAuthContext} from "api/auth/auth-context";
import UploadDocumentForm from "containers/upload-document-form";
import {useState} from "react";
import {Modal} from "components/modal";
import Listings from "api/listings";
import Head from "next/head";
import {AppInfo} from "app-info";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";
import {UserDocumentDto} from "api/documents/user-document.dto";
import {ListingDto} from "api/listings/listing.dto";
import {AppPage} from "pages/app-page.type";
import {getCurrentApiToken} from "api/auth/auth-functions";

/**
 * The user documents page
 */

const useStyles = createUseStyles({
    grid: {
        display: 'grid',
        gridGap: 20,
        '@media (min-width: 1300px)': {
            gridTemplateColumns: '1fr 1fr'
        }
    }
});

type UserDocumentsPageProps = {
    documents: UserDocumentDto[],
    listings: ListingDto[],
}

const UserDocumentsPage: AppPage<UserDocumentsPageProps> = (props) => {
    const styleClasses = useStyles();
    const authContext = useAuthContext();
    const [documents, setDocuments] = useState<UserDocumentDto[]>(props.documents);
    const [documentTypes, setDocumentTypes] = useState<string>('all');
    const [selectedListing, setSelectedListing] = useState<number | undefined>(undefined);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    console.log(documents);
    let generalDocuments = documents.filter(document => document.listing === null);
    let listingDocuments = documents.filter(document => document.listing !== null);
    if (documentTypes === 'general') {
        listingDocuments = [];
    }
    if (documentTypes === 'listing') {
        generalDocuments = [];
    }

    if (selectedListing) {
        listingDocuments = listingDocuments.filter(document => document.listing?.id === selectedListing);
    }

    // show empty content view if no documents exist for current user
    /**
     * Empty content render
     */
    if (documents.length === 0) {
        return <>
            <Head>
                <title>{AppInfo.name}: My Documents</title>
            </Head>
            <Breadcrumbs currentPageTitle={'My Documents'}/>

            {showUploadModal &&
            <Modal
                onClose={() => setShowUploadModal(false)}
            >
                <UploadDocumentForm onComplete={async () => {
                    setShowUploadModal(false);
                    const documentsResult = await Documents.getOwnedDocuments(authContext.apiToken);
                    if (documentsResult.success) {
                        setDocuments(documentsResult.documents);
                    }
                }}/>
            </Modal>
            }

            <h2>Documents</h2>
            <p>Here you'll find important documents related to your Realsy experience once you're up and started.</p>
            <p><Button onClick={() => setShowUploadModal(true)}>Add your first!</Button></p>
        </>
    }

    /**
     * Main render
     */
    return <>
        <Head>
            <title>{AppInfo.name}: My Documents</title>
        </Head>
        <Breadcrumbs currentPageTitle={'My Documents'}/>

        {showUploadModal &&
            <Modal
                onClose={() => setShowUploadModal(false)}
            >
                <UploadDocumentForm onComplete={async () => {
                    setShowUploadModal(false);
                    const documentsResult = await Documents.getOwnedDocuments(authContext.apiToken);
                    if (documentsResult.success) {
                        setDocuments(documentsResult.documents);
                    }
                }}/>
            </Modal>
        }

        <div>
            <p>
                <select
                    onChange={e => setDocumentTypes(e.target.value)}
                    style={{width: 190, float: 'left', marginRight: 20}}
                >
                    <option value={'all'}>All Document Types</option>
                    <option value={'general'}>General Documents</option>
                    <option value={'listing'}>Listing Documents</option>
                </select>
                {documentTypes !== 'general' &&
                <select
                    style={{width: 190, float: 'left', marginRight: 20}}
                    onChange={e => setSelectedListing(parseInt(e.target.value))}
                >
                    <option value={''}>All Listings</option>
                    {props.listings.map(listing => (
                        <option value={listing.id}>{listing.address}</option>
                    ))}
                </select>
                }
                <Button onClick={() => setShowUploadModal(true)}>Add Document</Button>
            </p>

            {(generalDocuments.length > 0 || documentTypes === 'general') && <>
                <h2 style={{ clear: 'both', marginTop: 50 }}>General Documents</h2>
                <div className={styleClasses.grid}>
                    {generalDocuments.length === 0 && <p style={{marginTop: -20}}>None yet!</p>}
                    {generalDocuments.length > 0 && generalDocuments.map((document) =>
                        <div key={document.id}>
                            <DocumentThumbnail
                                document={document}
                                onDelete={() => {
                                    setDocuments(current => current.filter(doc => doc.id !== document.id))
                                }}
                            />
                        </div>
                    )}
                </div>
            </>}

            {(listingDocuments.length > 0 || documentTypes === 'listing') && <>
                <h2 style={{ clear: 'both', marginTop: 50 }}>Listing Documents</h2>
                <div className={styleClasses.grid}>
                    {listingDocuments.length === 0 && <p style={{marginTop: -20}}>None yet!</p>}
                    {listingDocuments.length > 0 && listingDocuments.map((document) =>
                        <div key={document.id}>
                            <DocumentThumbnail
                                document={document}
                                onDelete={() => {
                                    setDocuments(current => current.filter(doc => doc.id !== document.id))
                                }}
                            />
                        </div>
                    )}
                </div>
            </>}

            <p><Button onClick={() => setShowUploadModal(true)}>Add Document</Button></p>
        </div>
    </>;
};

UserDocumentsPage.getInitialProps = async (context) => {
    const apiToken = getCurrentApiToken(context);
    const documentsResult = await Documents.getOwnedDocuments(apiToken);
    const listingsResult = await Listings.getOwnedListings();
    return {
        documents: documentsResult.documents?.length ? documentsResult.documents : [],
        listings: listingsResult.listings ?? [],
    }
};

UserDocumentsPage.defaultLayout = useAccountPageLayout;
UserDocumentsPage.requiresAuth = true;

export default UserDocumentsPage;
