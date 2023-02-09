import React, {useContext, useEffect, useState} from 'react';
import {func} from 'prop-types';
import {TextInput} from "components/form-fields/text-input";
import {AuthContext} from "api/auth/auth-context";
import {FileInput} from "components/form-fields/file-input";
import {Button} from "components/button";
import Documents from "api/documents";
import {NotificationManager} from "react-notifications";
import Fonts from 'styles/fonts';
import Colors from "styles/colors";
import Select from "components/form-fields/select";
import Listings from "api/listings";
import {Loader} from "components/loader";

const UploadDocumentForm = props => {
    const authContext = useContext(AuthContext);
    const [documentName, setDocumentName] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [selectedListingId, setSelectedListingId] = useState(undefined);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const listingsResult = await Listings.getOwnedListings(authContext.apiToken);
            setListings(listingsResult.listings);
            setIsLoading(false);
        })();
    }, []);

    async function submit(e) {
        e.preventDefault();
        setUploading(true);

        if (file === null || documentName.trim() === '') {
            setUploading(false);
            return;
        }

        const createResult = await Documents.createDocument(authContext.apiToken, {
            file,
            name: documentName.trim(),
            listingId: selectedListingId,
        });

        if(createResult.success) {
            props.onComplete();
        }
        else {
            NotificationManager.error('Failed to upload document');
        }

        setUploading(false);
    }

    if (isLoading) {
        return <div style={{padding: 40, width: 50, margin: '0 auto'}}>
            <Loader/>
        </div>;
    }

    return <form style={{padding: 30}} onSubmit={submit}>
        <h2 style={{...Fonts.defaultHeading, color: Colors.mediumBlue}}>Upload Document</h2>
        <TextInput
            label={'Name'}
            disabled={uploading}
            value={documentName}
            onChange={newValue => setDocumentName(newValue)}
        />
        <FileInput
            disabled={uploading}
            label={'Document'}
            value={file}
            onChange={newFile => setFile(newFile)}
        />
        <Select
            label={'Associate with listing'}
            value={selectedListingId}
            onChange={selected => setSelectedListingId(selected.value)}
            backgroundColor={Colors.offWhite}
            options={
                [
                    {label: 'None', value: undefined}
                ].concat(
                    listings.map(listing => (
                        {label: listing.address, value: listing.id}
                    ))
                )
            }
        />
        <br/>
        <Button loading={uploading}>Upload</Button>
    </form>
};

UploadDocumentForm.propTypes = {
    onComplete: func
};

UploadDocumentForm.defaultProps = {
    onComplete: () => {}
};

export default UploadDocumentForm;
