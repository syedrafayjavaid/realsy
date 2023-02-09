import * as React from 'react';
import {useAccountPageLayout} from "layout/account-page-layout";
import UserProfile from 'api/user-profile';
import {Fragment} from "react";
import {useState} from "react";
import Listings from "api/listings";
import Documents from "api/documents";
import {useDashboardPageStyles} from './dashboard.page.styles';
import {DashboardGroup} from "components/dashboard-group";
import ListingThumbnail from "components/listings/thumbnail";
import {Button} from "components/button";
import {ActivityRecordThumbnail} from "components/activity-record-thumbnail";
import {formatCurrency} from "util/format-currency";
import {DocumentThumbnail} from "components/document-thumbnail";
import UserCalendar from "components/user-calendar";
import {useNotificationsContext} from "contexts/notifications-context";
import {ApiClient} from "api/api-client";
import {ApiRoutes} from "api/api-routes";
import {UserDto} from "api/auth/user.dto";
import {UserActivityRecordDto} from "api/notifications/user-activity-record.dto";
import {ListingDto} from "api/listings/listing.dto";
import {UserDocumentDto} from "api/documents/user-document.dto";
import {AppPage} from "pages/app-page.type";

/**
 * The user dashboard page
 */

type UserDashboardPageProps = {
    userProfile: UserDto,
    activityRecords: UserActivityRecordDto[],
    listings: ListingDto[],
    savedListings: ListingDto[],
    documents: UserDocumentDto[],
}

const UserDashboardPage: AppPage<UserDashboardPageProps> = (props) => {
    const styleClasses = useDashboardPageStyles();
    const notificationsContext = useNotificationsContext();
    const [hideAlert, setHideAlert] = useState(false);

    const notification = notificationsContext.notifications[0];
    const closedListings = props.listings.filter(listing => listing.status === 'closed');
    const activeListings = props.listings.filter(listing =>
        listing.status === 'pending_realsy'
        || listing.status === 'active'
        ||listing.status === 'sale_pending'
    );

    return <Fragment>
        {notification &&
            <div
                className={`${styleClasses.alert} ${hideAlert ? 'hidden' : ''}`}
                onClick={() => notificationsContext.openNotificationContent(notification)}
            >
                <button
                    className={styleClasses.alertHideButton}
                    onClick={e => {
                        e.preventDefault();
                        setHideAlert(true);
                        setTimeout(() => notificationsContext.dismissNotification(notification.id), 500);
                    }}
                    children={'x'}
                />

                <h3>{notification.heading}</h3>
                <p>{notification.subheading}</p>
            </div>
        }

        <div className={styleClasses.userDashboard}>
            <div>
                <DashboardGroup title={'Saved Homes'}>
                    {props.savedListings && props.savedListings.map((listing) => {
                        return <div style={{marginBottom: 10}} key={listing.id}>
                            <ListingThumbnail horizontalLayout={true} listing={listing} backgroundColor={'#fff'} />
                        </div>
                    })}
                    {(!props.savedListings || props.savedListings.length < 1) &&
                    <p style={{textAlign: 'center' }}>
                        No saved homes yet.<br/><br/><Button href='/buy'>Find some now!</Button>
                    </p>
                    }
                </DashboardGroup>

                <DashboardGroup title={'Account Activity'}>
                    {props.activityRecords && props.activityRecords.map((record) => {
                        return <div style={{margin: '10px 0'}} key={record.id}>
                            <ActivityRecordThumbnail
                                record={record}
                                theme={'light'}
                            />
                        </div>
                    })}
                    {(!props.activityRecords || props.activityRecords.length < 1) &&
                    <p>None yet!</p>
                    }
                </DashboardGroup>

                <DashboardGroup title={'Savings Calculator'} noPadding={true}>
                    {props.listings.length < 1 &&
                    <div style={{textAlign: 'center', padding: '0 0 20px'}}>
                        <p>List a home to determine how much you'll save.</p>
                        <Button
                            href='/account/listings/create'
                            children={'List now!'}
                        />
                    </div>
                    }
                    {props.listings.length >= 1 &&
                    <div className={styleClasses.savingsCard}>
                        <div>
                            <span>You could save</span>
                            <span>
                                {formatCurrency(
                                    activeListings.reduce((total, listing) =>
                                        total + Listings.calculateSavings(listing.askingPrice), 0),
                                    {omitDecimal: true}
                                )}
                            </span>
                            <span>On your current properties</span>
                        </div>
                        <div>
                            <span>You have saved</span>
                            <span>
                                {formatCurrency(
                                    closedListings.reduce((total, listing) =>
                                        total + Listings.calculateSavings(listing.askingPrice), 0),
                                    {omitDecimal: true}
                                    )
                                }
                            </span>
                            <span>Using Realsy so far</span>
                        </div>
                    </div>
                    }
                </DashboardGroup>
            </div>

            <div>
                <DashboardGroup title={'My Listings'}>
                    {props.listings && props.listings.map((listing) => {
                        return <div style={{marginBottom: 10}} key={listing.id}>
                            <ListingThumbnail  horizontalLayout={true} listing={listing} backgroundColor={'#fff'}/>
                        </div>
                    })}
                    {(!props.listings || props.listings.length < 1) &&
                    <p style={{textAlign: 'center' }}>
                        No listings yet.<br/><br/><Button href='/account/listings/create'>Make one now!</Button>
                    </p>
                    }
                </DashboardGroup>

                <DashboardGroup title={'Documents'}>
                    {props.documents?.map?.((document) => (
                        <div key={document.id} style={{marginBottom: 10}}>
                            <DocumentThumbnail document={document}/>
                        </div>
                    ))}
                    {(!props.documents || props.documents.length < 1) &&
                    <p style={{textAlign: 'center' }}>
                        No documents yet!
                    </p>
                    }
                </DashboardGroup>

                <DashboardGroup title={'Calendar'} interiorScroll={false} noPadding={true} noBorder={true}>
                    <UserCalendar showSidebar={false} condensed={true}/>
                </DashboardGroup>
            </div>
        </div>
    </Fragment>
};

UserDashboardPage.getInitialProps = async () => {
    const userProfileResult = await UserProfile.getProfile();
    const activityRecordsResult = await ApiClient.get(ApiRoutes.CurrentUserActivityRecords);
    const savedListingsResult = await Listings.getSaved();
    const listingsResult = await Listings.getOwnedListings();
    const documentsResponse = await ApiClient.get(ApiRoutes.UserDocuments);
    return {
        userProfile: userProfileResult.profile,
        activityRecords: activityRecordsResult.data,
        listings: listingsResult.listings,
        savedListings: savedListingsResult.listings,
        documents: documentsResponse.data,
    };
};

UserDashboardPage.defaultLayout = useAccountPageLayout;
UserDashboardPage.requiresAuth = true;

export default UserDashboardPage;
