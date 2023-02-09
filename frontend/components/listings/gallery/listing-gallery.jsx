import React, {useEffect, useRef, useState} from 'react';
import FavoriteButton from "components/listings/favorite-button";
import Cms from "cms/cms";
import {bool, object, string} from "prop-types";
import {useAuthContext} from "api/auth/auth-context";
import Listings from "api/listings";
import {Loader} from "components/loader";
import Lightbox from "react-image-lightbox";
import {useListingGalleryStyles} from "./listing-gallery.styles";
import Colors from "styles/colors";

/**
 * A photo gallery for a single listing
 */
export const ListingGallery = (props) => {
    const authContext = useAuthContext();
    const styleClasses = useListingGalleryStyles(props);
    const thumbnailContainerRef = useRef(null);
    const thumbnailWrapperRef = useRef(null);
    const [listing, setListing] = useState(props.listing);
    const [activeImageUrl, setActiveImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [thumbnailContainerScroll, setThumbnailContainerScroll] = useState(0);
    const [thumbnailContainerWidth, setThumbnailContainerWidth] = useState(0);
    const [popupImage, setPopupImage] = useState(null);
    const [popupImageIndex, setPopupImageIndex] = useState(0);

    let statusText = null;
    let statusBackgroundColor = null;
    if (props.listing.status === 'closed') {
        statusText = 'Closed';
        statusBackgroundColor = Colors.darkBlue;
    }
    else if (props.listing.status === 'sale_pending') {
        statusText = 'Sale Pending';
        statusBackgroundColor = Colors.pink;
    }

    /**
     * Init effect
     */
    useEffect(() => {
        // if a listing ID was passed instead of a listing object, load the listing
        (async () => {
            if (!props.listing && props.listingId) {
                setLoading(true);
                const listingResponse = await Listings.getListing(props.listingId);
                if (listingResponse.success) {
                    setListing(listingResponse.listing);
                }
                else {
                    setLoadingError(true);
                }
                setLoading(false);
            }
        })();
    }, []);

    /**
     * On Listing loaded
     */
    useEffect(() => {
        const photos = listing?.photos;
        if (photos?.length > 0) {
            setActiveImageUrl(Cms.getImageFullUrl(photos[0].formats?.large?.url ?? photos[0].url));
        }
        else {
            setActiveImageUrl(Listings.getListingMainPhotoUrl(props.listing?.id || props.listingId));
        }
    }, [listing]);

    /**
     * Container ref set effect
     */
    useEffect(() => {
        if (thumbnailContainerRef) {
            setThumbnailContainerWidth(thumbnailContainerRef.current?.offsetX);
        }
        if (thumbnailWrapperRef) {
            setThumbnailContainerWidth(thumbnailWrapperRef.current?.offsetX);
        }
    }, [thumbnailContainerRef, thumbnailWrapperRef]);

    /**
     * Loading or error render
     */
    if (loading) {
        return <Loader style={{width: 40, margin: '20px auto'}}/>;
    }
    if (loadingError) {
        return <p style={{color: "#ccc"}}>Failed to load listing gallery.</p>;
    }
    if (!listing) {
        return <></>;
    }

    /**
     * Render
     */
    return (
        <div className={styleClasses.listingGallery}>
            {authContext.isSignedIn && authContext.currentUser?.id !== props.listing?.owner?.id &&
                <FavoriteButton listingId={props.listing?.id}/>
            }

            <div
                className={styleClasses.largeImage}
                style={{
                    backgroundImage: `url("${activeImageUrl}")`,
                    cursor: listing.photos?.length > 0 ? 'zoom-in' : 'default'
                }}
                onClick={() => listing.photos.length > 0 && setPopupImage(activeImageUrl)}
            />
            {statusText &&
                <p className={styleClasses.status} style={{backgroundColor: statusBackgroundColor}}>
                    {statusText}
                </p>
            }
            {popupImage &&
                <Lightbox
                    mainSrc={activeImageUrl}
                    nextSrc={Cms.getImageFullUrl(listing.photos[(popupImageIndex + listing.photos.length + 1) % listing.photos.length])}
                    prevSrc={Cms.getImageFullUrl(listing.photos[(popupImageIndex + listing.photos.length - 1) % listing.photos.length])}
                    onCloseRequest={() => setPopupImage(null)}
                    onMovePrevRequest={() => {
                        setPopupImageIndex((popupImageIndex - 1) % listing.photos.length);
                        const newImage = listing.photos[(popupImageIndex - 1) % listing.photos.length];
                        setActiveImageUrl(Cms.getImageFullUrl(newImage.formats?.large?.url || newImage.url));
                    }}
                    onMoveNextRequest={() => {
                        setPopupImageIndex((popupImageIndex + 1) % listing.photos.length);
                        const newImage = listing.photos[(popupImageIndex + 1) % listing.photos.length];
                        setActiveImageUrl(Cms.getImageFullUrl(newImage.formats?.large?.url || newImage.url));
                    }}
                />
            }

            {props.showThumbnails && listing.photos?.length > 1 &&
                <div style={{position: 'relative', margin: '10px 0'}}>
                    <span
                        onClick={() => {
                            thumbnailContainerRef.current.scrollTo({
                                top: 0,
                                left: thumbnailContainerRef.current.scrollLeft - 100,
                                behavior: 'smooth'
                            });
                        }}
                        style={{
                            opacity: thumbnailContainerRef.current?.scrollLeft > 0 ? 1 : 0,
                            transition: '300ms',
                            position: 'absolute',
                            left: 0,
                            top: -1,
                            height: '100%',
                            padding: '24px 5px 0',
                            fontSize: '26px',
                            boxSizing: 'border-box',
                            fontWeight: 300,
                            width: thumbnailContainerRef.current?.scrollLeft > 0 ? 35 : 0,
                            cursor: 'pointer',
                            background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
                            color: '#333'
                        }}
                    >&lt;</span>
                    <span
                        onClick={() => {
                            thumbnailContainerRef.current.scrollTo({
                                top: 0,
                                left: thumbnailContainerRef.current.scrollLeft + 100,
                                behavior: 'smooth'
                            });
                        }}
                        style={{
                            opacity: thumbnailWrapperRef.current?.scrollWidth > thumbnailContainerRef.current?.offsetWidth + thumbnailContainerRef.current?.scrollLeft ? 1 : 0,
                            transition: '300ms',
                            position: 'absolute',
                            right: 0,
                            top: -1,
                            fontSize: '26px',
                            fontWeight: 300,
                            boxSizing: 'border-box',
                            height: '100%',
                            padding: '24px 5px 0',
                            textAlign: 'right',
                            width: thumbnailWrapperRef.current?.scrollWidth > thumbnailContainerRef.current?.offsetWidth + thumbnailContainerRef.current?.scrollLeft ? 35 : 0,
                            cursor: 'pointer',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 100%)',
                            color: '#333'
                        }}
                    >&gt;</span>

                    <div
                        ref={thumbnailContainerRef}
                        style={{maxWidth: '100%', overflowX: 'auto'}}
                        onScroll={e => setThumbnailContainerScroll(thumbnailContainerRef.current.scrollLeft)}
                    >
                        <div style={{whiteSpace: 'nowrap'}} ref={thumbnailWrapperRef}>
                            {listing.photos.map((photo, i) => {
                                return <img
                                    key={photo.id}
                                    style={{
                                        height: 80,
                                        width: 'auto',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        marginRight: 8
                                    }}
                                    src={Cms.getImageFullUrl(photo.formats.thumbnail.url)}
                                    onClick={() => {{
                                        setActiveImageUrl(Cms.getImageFullUrl(photo.formats.large?.url || photo.url))
                                        setPopupImageIndex(i);
                                    }}}
                                />
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

/**
 * Props
 */
ListingGallery.propTypes = {
    listing: object,
    listingId: string,
    showThumbnails: bool
};

ListingGallery.defaultProps = {
    listing: null,
    listingId: null,
    showThumbnails: true
}
