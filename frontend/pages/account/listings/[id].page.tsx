import * as React from 'react';
import Listings from 'api/listings';
import {useAccountPageLayout} from 'layout/account-page-layout';
import {useState} from "react";
import ArrowDownIcon from "components/icons/arrow-down";
import SingleListing from "components/listings/single";
import Link from "next/link";
import Colors from "styles/colors";
import {useSingleListingPageStyles} from "./[id].page.styles";
import {AppPage} from "pages/app-page.type";
import {ListingDto} from "api/listings/listing.dto";
import {OfferDto} from "api/offers/offer.dto";
import {OfferStatus} from "api/offers/offer-status.enum";
import redirect from "util/redirect";
import {Logger} from "util/logging";
import {getCurrentUserId} from "api/auth/auth-functions";

const logger = Logger('single-listing-page');

/**
 * A Single owned listing
 */

type OwnedListingPageProps = {
    listing: ListingDto;
    offer?: OfferDto;
    noPadding: boolean;
};

const OwnedListingPage: AppPage<OwnedListingPageProps> = (props) => {
    const listing = props.listing;
    const offer = props.offer;
    const styleClasses = useSingleListingPageStyles();

    const steps = offer ? offer.closingSteps : listing.steps;
    const currentStepIndex = getUnfinishedStepIndexForSteps(steps);

    const [showMicroSteps, setShowMicroSteps] = useState(false);
    const [shownMacroStep, setShownMacroStep] = useState(steps[currentStepIndex]);

    return (
        <>
            <div className={styleClasses.steps} style={{maxWidth: '100%'}}>
                <div className={styleClasses.macroStepsWrapper}>
                    <div className={styleClasses.breadcrumbs}>
                        <p>
                            <span><Link href={'/account/dashboard'}><a>Dashboard</a></Link> | My Listings</span>
                        </p>
                    </div>
                    <div className={styleClasses.macroStepsListWrapper}>
                        <ul className={styleClasses.macroSteps} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr '.repeat(steps.length),
                        }}>
                            {steps.map((step, index) => {
                                return <li key={index} className={styleClasses.macroStep} onClick={() => setShownMacroStep(step)}>
                                    <span className={`${index === 0 ? 'first' : ''} ${index === steps.length-1 ? 'last' : ''} ${styleClasses.statusMarker} ${index === currentStepIndex ? 'current' : ''} ${index < currentStepIndex ? 'complete' : ''}`}>
                                    </span>
                                    <span className={styleClasses.stepNumber}>{index + 1}</span> <span style={step.id === shownMacroStep.id ? {color: Colors.lightBlue} : {}} className={styleClasses.stepName}>{step.title}</span>
                                </li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className={styleClasses.microStepsWrapper}>
                    <h4 className={`${styleClasses.microStepsHeading} ${showMicroSteps ? 'active' : ''}`} onClick={() => setShowMicroSteps(!showMicroSteps)}>
                        {shownMacroStep?.title} <ArrowDownIcon/>
                    </h4>
                    <div className={`${styleClasses.microSteps} ${showMicroSteps ? 'shown' : ''}`}>
                        {shownMacroStep?.microSteps.map(microStep => (
                            <span key={microStep.id} className={microStep.complete ? 'complete' : ''}>{microStep.name}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styleClasses.singleWrapper} style={{width: '100%'}}>
                <SingleListing isFullView={true} showGalleryThumbnails={false} listing={listing}/>
            </div>
        </>
    )
};

/**
 * Gets the first unfinished step in a list of steps
 * @param steps
 */
function getUnfinishedStepIndexForSteps(steps: {title: string, microSteps: {name: string, complete: boolean}[]}[]): number {
    let unfinishedStep = false;
    let unfinishedStepIndex = 0;
    steps.forEach((step, stepIndex) => {
        step.microSteps.forEach(microStep => {
            if (unfinishedStep) return;
            if (!microStep.complete) {
                unfinishedStep = true;
                unfinishedStepIndex = stepIndex;
            }
        });
    });
    return unfinishedStepIndex;
}

OwnedListingPage.getInitialProps = async (context) => {
    const listingsResult = await Listings.getListing(context.query.id);
    const listing = listingsResult.listing;

    // redirect anyone other than the lister or a buyer with an accepted offer
    // and load the accepted offer if applicable
    let offer = undefined;
    console.log('**** ID:', getCurrentUserId(context));
    if (listing.owner?.id !== getCurrentUserId(context)) {
        Listings.checkOffer(listingsResult.listing.id).then(offerResponse => {
            // send to public view if buyer does not have an accepted offer for this listing
            if (offerResponse.offer?.status !== OfferStatus.Accepted) {
                let redirectUrl = `/account/dashboard?viewedListingId=${listing.id}`;
                redirect(redirectUrl);
                return;
            }
        });
    }

    return {
        noPadding: true,
        listing,
        offer,
    };
};

OwnedListingPage.defaultLayout = useAccountPageLayout;
OwnedListingPage.requiresAuth = true;

export default OwnedListingPage;
