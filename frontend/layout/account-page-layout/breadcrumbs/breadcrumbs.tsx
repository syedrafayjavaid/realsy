import React, {FC} from 'react';
import Link from "next/link";
import {useBreadcrumbStyles} from "layout/account-page-layout/breadcrumbs/breadcrumbs.styles";

/**
 * Breadcrumbs for user account pages
 */

export type BreadcrumbsProps = {
    currentPageTitle: string,
};

export const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
    const styleClasses = useBreadcrumbStyles();

    return (
        <p className={styleClasses.breadcrumbs}>
            <span><Link href={'/account/dashboard'}><a>Dashboard</a></Link> | {props.currentPageTitle}</span>
        </p>
    )
};
