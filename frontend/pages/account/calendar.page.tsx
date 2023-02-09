import * as React from 'react';
import {useAccountPageLayout} from "layout/account-page-layout";
import UserCalendar from "components/user-calendar";
import {useEffect} from "react";
import {useNotificationsContext} from "contexts/notifications-context";
import Head from "next/head";
import {AppInfo} from "app-info";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";
import {AppPage} from "pages/app-page.type";

/**
 * The user calendar page
 */

const UserCalendarPage: AppPage = () => {
    const notificationsContext = useNotificationsContext();

    useEffect(() => {
        notificationsContext.clearNotificationsForContent('scheduled-event');
    }, []);

    return <>
        <Head>
            <title>{AppInfo.name}: My Calendar</title>
        </Head>
        <Breadcrumbs currentPageTitle={'My Calendar'}/>
        <UserCalendar/>
    </>
};

UserCalendarPage.defaultLayout = useAccountPageLayout;
UserCalendarPage.requiresAuth = true;

export default UserCalendarPage;
