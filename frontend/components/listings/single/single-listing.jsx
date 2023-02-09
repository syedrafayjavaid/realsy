import React, {Fragment, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types'
import {Button, ButtonVariant} from 'components/button';
import ListingSummary from "components/listings/summary";
import {UserChat} from "components/user-chat";
import {useAuthContext} from "api/auth/auth-context";
import {RequestVisitForm} from 'components/listings/request-visit-form';
import {Fade} from 'react-awesome-reveal';
import Listings from "api/listings";
import OfferThumbnail from "components/offer-thumbnail";
import OfferResponseForm from "components/offer-response-form";
import {DocumentThumbnail} from "components/document-thumbnail";
import {EventThumbnail} from "components/event-thumbnail";
import {Loader} from "components/loader";
import {Checkbox} from "components/form-fields/checkbox";
import Colors from "styles/colors";
import {useRouter} from 'next/router';
import {useSingleListingStyles} from './single-listing.styles';
import {scrollToRef} from "util/scroll-to-ref";
import {pushSoftQueryParams} from "util/push-soft-query-param";
import {useNotificationsContext} from "contexts/notifications-context";
import {ListingGallery} from "components/listings/gallery";
import Confetti from "components/confetti";
import CreateOfferForm from "components/listings/create-offer-form";
import {getCurrentUserId} from "api/auth/auth-functions";

/**
 * Keys for the different tabs of the view (details, messages, chat, etc)
 */
const TabKeys = {
    description: 'description',
    messages: 'messages',
    schedule: 'schedule',
    requestVisit: 'request-visit',
    makeOffer: 'make-offer',
    offers: 'offers',
    tips: 'tips',
    documents: 'documents',
};

/**
 * A single listing full view
 */
const SingleListing = props => {
    const router = useRouter();
    const authContext = useAuthContext();
    const notificationsContext = useNotificationsContext();
    const styleClasses = useSingleListingStyles();
    const detailsRef = useRef(null);
    const [offers, setOffers] = useState([]);
    const [activeOffer, setActiveOffer] = useState(null);
    const [activeChatId, setActiveChatId] = useState(props.listing.chats?.length > 0 ? props.listing.chats[0].id : null);
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [tips, setTips] = useState(props.listing.realsyTips);

    const isOwner = authContext.isSignedIn && (authContext.currentUser?.id === props.listing.owner?.id || authContext.currentUser?.id === props.listing.owner);
    const viewedSection = router.query.listingSection ?? 'description';
    const sentOffer = offers?.filter(offer => offer.offeror === authContext.currentUser?.id)[0];

    useEffect(function onMount() {
        if (router.query.listingSection) {
            // scroll to the details section if a section was given in the initial route
            setTimeout(() => {
                scrollToRef(detailsRef, -100);
            }, 200);
        }
        loadOffers();
        notificationsContext.clearNotificationsForContent('listing', props.listing.id);
    }, []);

    useEffect(function onTabChanged() {
        setActiveOffer(null);
    }, [viewedSection]);

    async function loadOffers() {
        if (authContext.isSignedIn) {
            setLoading(true);
            const offersResult = await Listings.getOffers(props.listing.id);
            setOffers(offersResult.offers?.filter(offer => offer.status !== 'pending_realsy') || []);
            setLoading(false);
        }
    }

    function setActiveTab(newTab) {
        pushSoftQueryParams({listingSection: newTab}, router)
    }

    async function markTip(tipId, complete) {
        const updateResult = await Listings.markTip(props.listing.id, tipId, complete);
        if (updateResult.success) {
            setTips(updateResult.newTips);
        }
    }

    function renderActiveTab() {
        if (activeOffer) {
            return <OfferResponseForm
                onComplete={() => {
                    loadOffers();
                    pushSoftQueryParams({listingSection: TabKeys.description}, router);
                    pushSoftQueryParams({listingSection: TabKeys.offers}, router);
                }}
                onAccept={() => setShowConfetti(true)}
                offer={activeOffer}
                agent={props.listing.agent}
            />
        }

        switch (viewedSection) {
            /** DESCRIPTION TAB **/
            case TabKeys.description:
                return <Fragment>
                    <h2>Description</h2>
                    {props.listing.description && <div dangerouslySetInnerHTML={{__html: props.listing.description}} />}
                    {!props.listing.description &&
                    <p>We're writing up the description for this listing. Hang tight!</p>
                    }
                </Fragment>;

            /** MESSAGES TAB **/
            case TabKeys.messages:
                if (props.listing.status === 'closed' && !props.isFullView) {
                    return <Fragment><h2>Messages</h2><p>Listing closed</p></Fragment>;
                }
                else if (!props.listing.owner) {
                    return <>
                        <h2>Messages</h2>
                        <p>
                            This listing was imported from an external system and is not owned by a Realsy user.
                        </p>
                        <p>
                            <Button
                                className={'chat-launcher'}
                                children={'Chat with Realsy about this listing'}
                                padding={'10px 20px'}
                            />
                        </p>
                    </>;
                }
                if (authContext.isSignedIn) {
                    if (authContext.currentUser?.id === props.listing.owner?.id) {
                        if (props.listing.chats.length === 0) {
                            // owner has no chats
                            return <Fragment>
                                <h2>Messages</h2>
                                <p>Here you'll find any messages other users have sent you regarding this listing. Once a user messages you it will populate here!</p>
                            </Fragment>
                        }
                        else {
                            // list all users who have sent chats
                            return <Fragment>
                                <label className={styleClasses.chatSelectLabel}>Chat with:</label>
                                <select style={{marginTop: 20}} onChange={e => setActiveChatId(e.target.value)}>
                                    {props.listing.chats.map(chat => {
                                        return <option key={chat.id} value={chat.id}>{chat.messages[0].user.name || chat.messages[0].user.email}</option>
                                    })}
                                </select>
                                <UserChat chatId={activeChatId.toString()} />
                            </Fragment>
                        }
                    }
                    else {
                        // other user gets just their own chat
                        return <Fragment>
                            <h2>{props.listing.owner?.name || props.listing.owner?.email || 'Chat'}</h2>
                            <UserChat otherUserId={props.listing.owner?.id} listingId={props.listing.id}/>
                        </Fragment>
                    }
                }
                else {
                    return <h4>Sign in to Chat</h4>;
                }

            /** SCHEDULE TAB **/
            case TabKeys.schedule:
                if (authContext.isSignedIn) {
                    const events = props.listing.scheduledEvents?.filter(event => event.status === 'scheduled').map(event => { return {...event, listing: props.listing}});
                    if (events && events.length > 0) {
                        if (authContext.currentUser?.id === props.listing.owner) {
                            // all events if user is the owner of the listing
                            return <Fragment>
                                <h2>Schedule</h2>
                                {events.map(event =>
                                    <Fragment key={event.id}><EventThumbnail event={event}/></Fragment>
                                )}
                            </Fragment>
                        }
                        else {
                            // only this user's events if not the owner
                            return <Fragment>
                                <h2>Schedule</h2>
                                {events?.filter(event => event.user == authContext.currentUser?.id).map(event =>
                                    <Fragment key={event.id}><EventThumbnail event={event}/></Fragment>
                                )}
                            </Fragment>
                        }
                    }
                    else {
                        return <Fragment>
                            <h2>Schedule</h2>
                            <p>Keep track of important events for this listing. Events can also be viewed on your
                                Calendar page.</p>
                        </Fragment>
                    }
                }
                else {
                    return <h4>Sign in to Schedule Events</h4>
                }

            /** VISIT REQUEST TAB **/
            case TabKeys.requestVisit:
                if (props.listing.status === 'closed') {
                    return <Fragment><h2>Request a Visit</h2><p>Listing closed</p></Fragment>;
                }
                return authContext.isSignedIn
                    ? <Fragment>
                        <RequestVisitForm
                            listingId={props.listing.id}
                            onComplete={() => setActiveTab(TabKeys.description)}
                            onClose={() => setActiveTab(TabKeys.description)}
                        />
                    </Fragment>
                    : <h4>Sign in to Request a Visit</h4>;

            /** MAKE OFFER TAB **/
            case TabKeys.makeOffer:
                if (props.listing.status === 'closed') {
                    return <Fragment><h2>Make an Offer</h2><p>Listing closed. No offers may be sent.</p></Fragment>;
                }
                if (authContext.isSignedIn) {
                    if (getCurrentUserId() === props.listing.owner) {
                        return <Fragment></Fragment>
                    }
                    else {
                        return (
                            <Fragment>
                                <CreateOfferForm
                                    listingId={props.listing.id}
                                    onResponseFormAccept={() => setShowConfetti(true)}
                                    onResponseComplete={() => {
                                        setActiveTab(TabKeys.description);
                                        setActiveTab(TabKeys.makeOffer);
                                    }}
                                />
                            </Fragment>
                        );
                    }
                }
                else {
                    return <h4>Sign in to Make and Offer</h4>;
                }

            /** DOCUMENTS TAB **/
            case TabKeys.documents:
                if (props.listing.documents?.length > 0) {
                    const documents = props.listing.documents?.map(doc => {return {...doc, listing: props.listing}});
                    return <Fragment>
                        {documents.map(doc =>
                            <div style={{margin: '10px 0'}} key={doc.id}><DocumentThumbnail document={doc} noFloat={true}/></div>
                        )}
                    </Fragment>
                }
                else {
                    return <Fragment>
                        <h2>Documents</h2>
                        <p>We'll help you keep track of important documents, as well as signing them virtually in a
                            secure and convenient manner.</p>
                    </Fragment>;
                }

            /** TIPS TAB **/
            case TabKeys.tips:
                const filteredTips = tips?.filter(tip => tip.name !== '');
                if (filteredTips?.length === 0) {
                    return <Fragment>
                        <h2>Tips</h2>
                        <p>Here you'll find helpful tips to maximize the effectiveness of your listing. We will populate this area once we learn a bit more about your home!</p>
                    </Fragment>;
                }
                else {
                    return <Fragment>
                        <h2>Prep Your Property</h2>
                        {filteredTips?.map(tip => {
                            return <div key={tip.id} style={{marginBottom: 10}}>
                                <Checkbox
                                    onChange={async nowChecked => { await markTip(tip.id, nowChecked); }}
                                    checked={tip.complete}
                                    label={tip.name}
                                />
                            </div>
                        })}
                    </Fragment>;
                }

            /** OFFERS TAB **/
            case TabKeys.offers:
                if (props.listing.status === 'closed') {
                    return <Fragment><h2>Offers</h2><p>Listing closed</p></Fragment>;
                }
                return <Fragment>
                    <h2>Offers</h2>
                    {offers && offers.map(offer =>
                        <Fragment key={offer.id}><OfferThumbnail onClick={() => setActiveOffer(offer)} offer={offer}/></Fragment>
                    )}
                    {offers.length === 0 && <Fragment>
                        <p>Here you'll be able to see all the offers you've gotten on this listing. Once you get your first it will appear here!</p>
                    </Fragment>}
                </Fragment>;

            /** DEFAULT TAB (description) **/
            default:
                return <Fragment>
                    <h2>Description</h2>
                    {props.listing.description && <div dangerouslySetInnerHTML={{__html: props.listing.description}} />}
                    {!props.listing.description &&
                    <p>We're writing up the description for this listing. Hang tight!</p>
                    }
                </Fragment>;
        }
    }

    /**
     * Render
     */
    return (
        <div className={styleClasses.singleListing}>
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

            <div className={styleClasses.wrapper}>
                <p className={styleClasses.mobileTabMenu}>
                    <label>Switch to</label>
                    <select onChange={e => setActiveTab(e.target.value)}>
                        <option value={TabKeys.description}>Details</option>
                        <option value={TabKeys.messages}>Messages</option>
                        {isOwner && <option value={TabKeys.offers}>Offers</option>}
                        <option value={TabKeys.schedule}>Schedule</option>
                        {isOwner && <option value={TabKeys.documents}>Documents</option>}
                        {isOwner && <option value={TabKeys.tips}>Tips</option>}
                    </select>
                </p>

                <div className={viewedSection !== TabKeys.description ? 'hide-mobile' : ''}>
                    <ListingGallery showThumbnails={props.showGalleryThumbnails} listing={props.listing} />
                    <ListingSummary listing={props.listing} horizontalLayout={true} />
                </div>

                {/** PENDING LISTING **/}
                {(props.listing.status === 'pending_realsy' || props.listing.status === null) &&
                    <div>
                        <h2 style={{borderBottom: '1px solid #999', color: '#333', paddingBottom: 10, marginBottom: 5}}>Listing Pending</h2>
                        <p>We're currently reviewing this listing for approval.</p>
                    </div>
                }

                {/** ACTIVE LISTING **/}
                {(props.listing.status === 'active' || props.listing.status === 'sale_pending' || props.listing.status === 'closed') &&
                <div ref={detailsRef}>
                    <ul className={styleClasses.detailsNav} data-testid={'listing-nav'}>
                        <li
                            className={viewedSection === TabKeys.description ? 'active' : ''}
                            onClick={() => pushSoftQueryParams({listingSection: TabKeys.description}, router)}
                            children={'Details'}
                        />
                        <li
                            className={viewedSection === TabKeys.messages ? 'active' : ''}
                            onClick={() => pushSoftQueryParams({listingSection: TabKeys.messages}, router)}
                            children={'Messages'}
                        />
                        {isOwner &&
                            <li
                                className={viewedSection === TabKeys.offers ? 'active' : ''}
                                onClick={() => pushSoftQueryParams({listingSection: TabKeys.offers}, router)}
                            >
                                Offers
                                {props.listing.offers?.filter(offer => offer.status !== 'pending_realsy').length > 0 &&
                                    <span style={{position: 'relative', marginBottom: -8, marginRight: -8, top: -29, left: 46, display: 'block', width: 8, height: 8, backgroundColor: Colors.pink, borderRadius: '50%'}} />
                                }
                            </li>
                        }
                        <li
                            className={viewedSection === TabKeys.schedule ? 'active' : ''}
                            onClick={() => pushSoftQueryParams({listingSection: TabKeys.schedule}, router)}
                            children={'Schedule'}
                        />
                        {isOwner && <li className={viewedSection === TabKeys.documents ? 'active' : ''}
                                        onClick={() => pushSoftQueryParams({listingSection: TabKeys.documents}, router)}>Documents</li>}
                        {isOwner && <li className={viewedSection === TabKeys.tips ? 'active' : ''}
                                        onClick={() => pushSoftQueryParams({listingSection: TabKeys.tips}, router)}>Tips</li>}
                    </ul>

                    <section className={styleClasses.activeSection}>
                        <Fade>
                            <>
                                {loading && <div style={{ width: 30, height: 30, margin: '30px auto'}}><Loader/></div>}
                                {!loading && renderActiveTab()}
                            </>
                        </Fade>
                    </section>

                    <hr/>

                    {authContext.currentUser?.id !== props.listing.owner?.id && props.listing.status === 'active' &&
                        <div className={styleClasses.userControls}>
                            <Button
                                onClick={() => pushSoftQueryParams({listingSection: TabKeys.requestVisit}, router)}
                            >
                                Request a Visit
                            </Button>
                            <Button
                                variant={ButtonVariant.Yellow}
                                onClick={() => pushSoftQueryParams({listingSection: TabKeys.makeOffer}, router)}
                            >
                                {sentOffer ? 'Active Offer' : 'Make an Offer'}
                            </Button>
                        </div>
                    }
                </div>
                }
            </div>
        </div>
    );
};

SingleListing.propTypes = {
    listing: PropTypes.object,
    initialSection: PropTypes.string,
    showGalleryThumbnails: PropTypes.bool,
    isFullView: PropTypes.bool, // if this is the lister/buyer full view with steps
};

SingleListing.defaultProps = {
    initialSection: '',
    showGalleryThumbnails: true,
    isFullView: false
}

export default SingleListing;
