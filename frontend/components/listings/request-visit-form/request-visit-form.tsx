import React, {FC, useEffect, useState} from 'react';
import {useRequestVisitFormStyles} from './request-visit-form.styles';
import {AvailabilityFields} from "components/form-fields/availability-fields";
import {UserGuideHeader} from "components/user-guide-header";
import {Button} from 'components/button';
import Calendar from 'api/calendar';
import {useAuthContext} from "api/auth/auth-context";
import {NotificationManager} from "react-notifications";
import {Loader} from "components/loader";
import Listings from "api/listings";
import UserProfile from "api/user-profile";
import {Fade} from "react-awesome-reveal";
import Cms from "cms/cms";
import {CmsClient} from "cms/cms-client";
import {CmsRoutes} from "cms/cms-routes";
import {Logger} from "util/logging";
import {MicroContentItemType, MicroContentSetDto} from "cms/micro-content";
import {availabilityForUser} from "api/auth/user.dto";
import {ApiClient} from "api/api-client";
import {ApiRoutes} from "api/api-routes";

const logger = Logger('request-visit-form');

/**
 * A form to request a visit to a listing
 */

export type RequestVisitFormProps = {
    microContentSet: MicroContentSetDto,
    listingId: string,
    formHeading: string,
    onClose: () => any,
    onComplete: () => any,
};

const defaultProps: Partial<RequestVisitFormProps> = {
    onClose: () => {},
    microContentSet: {
        code: '',
        microContent: [
            {
                __component: MicroContentItemType.RichText,
                code: 'user-guide',
                content: "<h4>Tell us your Availability</h4><p>We'll use this to schedule your visit!</p>",
            },
            {
                __component: MicroContentItemType.RichText,
                code: 'request-pending-message',
                content: "<h4>Visit Request Pending</h4><p>We are confirming your request with the lister, and will contact you with further details.</p>"
            }
        ]
    },
};

export const RequestVisitForm: FC<RequestVisitFormProps> = (props) => {
    const authContext = useAuthContext();
    const styles = useRequestVisitFormStyles();
    const [alreadyHasRequest, setAlreadyHasRequest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState(authContext.currentUser ? availabilityForUser(authContext.currentUser) : {});
    const [saving, setSaving] = useState(false);
    const [listing, setListing] = useState<any>(null);
    const [microContentSet, setMicroContentSet] = useState(props.microContentSet);

    /**
     * On mount effect
     */
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                // check if user already has a pending request
                const checkExistingResponse = await Listings.checkVisitRequest(props.listingId);
                setAlreadyHasRequest(checkExistingResponse.hasPendingRequest);

                const listingResponse = await ApiClient.get(ApiRoutes.Listings + '/' + props.listingId);
                setListing(listingResponse.data);

                try {
                    const microContentSetResponse = await CmsClient.get(CmsRoutes.microContentSets, {
                        params: {code: 'visit-request'},
                    });
                    if (microContentSetResponse.data.length > 0) {
                        setMicroContentSet(microContentSetResponse.data[0]);
                        logger.debug('Fetched micro content', microContentSetResponse.data);
                    }
                }
                catch (e) {
                    // use default micro content if none set in CMS
                }
            }
            catch (e) {
                logger.error('Error loading visit request', e);
            }
            setLoading(false);
        })();
    }, []);

    /**
     * Render
     */
    if(loading) {
        return <p style={{height: 300, textAlign: 'center'}}>
            <Loader style={{margin: '50px auto'}}/>
        </p>
    }
    if (alreadyHasRequest) {
        return <Fade>
            <div dangerouslySetInnerHTML={{__html: Cms.getMicroContentItem(microContentSet, 'request-pending-message')}}/>
        </Fade>
    }
    return (
        <Fade>
            <h2>Request a Visit</h2>
            <div className={styles.container}>
                <UserGuideHeader
                    htmlBody={Cms.getMicroContentItem(microContentSet, 'user-guide')}
                />
                <form
                    className={styles.form}
                    onSubmit={async e => {
                        e.preventDefault();
                        setSaving(true);
                        const profileResult = await UserProfile.updateProfile(authContext.apiToken, {...availability});
                        const result = await Calendar.createVisitRequest(authContext.apiToken, props.listingId);
                        if (result.success) {
                            setAlreadyHasRequest(true);
                            authContext.setProfile(profileResult.profile);
                        }
                        else {
                            NotificationManager.error('Error sending visit request');
                        }
                        setSaving(false);
                    }}
                >
                    <h3>{props.formHeading}</h3>
                    <AvailabilityFields
                        initialAvailability={availability}
                        onChange={newAvailability => setAvailability(newAvailability)}
                        selectColor={'#fff'}
                        checkboxColor={'#fff'}
                    />
                    <Button
                        children={'Cancel'}
                        type={'button'}
                        onClick={() => {props.onClose()}}
                    />
                    {' '}
                    <Button
                        children={'Submit'}
                        loading={saving}
                    />

                    {listing.owner?.id && <>
                        <br/><br/>
                        <h4>Lister Availability</h4>
                        <AvailabilityFields
                            onChange={() => {}}
                            disabled={true}
                            initialAvailability={{
                                availableSundayStart: listing?.owner?.availableSundayStart,
                                availableSundayEnd: listing?.owner?.availableSundayEnd,
                                availableMondayStart: listing?.owner?.availableMondayStart,
                                availableMondayEnd: listing?.owner?.availableMondayEnd,
                                availableTuesdayStart: listing?.owner?.availableTuesdayStart,
                                availableTuesdayEnd: listing?.owner?.availableTuesdayEnd,
                                availableWednesdayStart: listing?.owner?.availableWednesdayStart,
                                availableWednesdayEnd: listing?.owner?.availableWednesdayEnd,
                                availableThursdayStart: listing?.owner?.availableThursdayStart,
                                availableThursdayEnd: listing?.owner?.availableThursdayEnd,
                                availableFridayStart: listing?.owner?.availableFridayStart,
                                availableFridayEnd: listing?.owner?.availableFridayEnd,
                                availableSaturdayStart: listing?.owner?.availableSaturdayStart,
                                availableSaturdayEnd: listing?.owner?.availableSaturdayEnd,
                            }}
                        />
                    </>}
                </form>
            </div>
        </Fade>
    );
};

RequestVisitForm.defaultProps = defaultProps;
