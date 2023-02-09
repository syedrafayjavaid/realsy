import React from 'react';
import {Modal} from "components/modal";
import {bool, func, object, string} from "prop-types";
import SingleListing from "components/listings/single/single-listing";
import {useSingleListingModalStyles} from "./single-listing-modal.styles";

/**
 * A single listing in a modal
 */
const SingleListingModal = (props) => {
    const styleClasses = useSingleListingModalStyles()

    return (
        <Modal
            fullScreenBreakpoint={'600px'}
            containerClassName={styleClasses.container}
            onClose={props.onClose}
        >
            <SingleListing
                listing={props.listing}
                initialSection={props.initialSection}
                showGalleryThumbnails={props.showGalleryThumbnails}
            />
        </Modal>
    );
};

SingleListingModal.propTypes = {
    listing: object.isRequired,
    initialSection: string,
    showGalleryThumbnails: bool,
    onClose: func,
};

export default SingleListingModal;
