import React from 'react';
import PropTypes from 'prop-types';
import AccountSidebar from 'layout/account-page-layout/sidebar';
import {useMainLayout as useMainLayout} from 'layout/main-layout';
import {useAccountLayoutStyles} from 'layout/account-page-layout/account-page-layout.styles';

/**
 * The layout for user account pages
 */
const AccountLayout = props => {
    const styleClasses = useAccountLayoutStyles();
    return (
        <div className={`${styleClasses.accountPage} ${props.noPadding ? 'no-padding' : ''}`}>
            <AccountSidebar userProfile={props.userProfile} />
            <div className={`${styleClasses.main} ${props.noPadding ? 'no-padding' : ''}`}>
                {props.children}
            </div>
        </div>
    );
};

/**
 * Props
 */
AccountLayout.propTypes = {
    userProfile: PropTypes.object.isRequired,
    noPadding: PropTypes.bool
};

AccountLayout.defaultProps = {
    userProfile: {},
    noPadding: false
};

/**
 * Wraps a given page in the account page layout
 * @param page
 * @param globalContent
 * @returns {*}
 */
export const useAccountPageLayout = (page, {globalContent = {}} = {}) => (
    useMainLayout(
        <AccountLayout userProfile={page.props.userProfile} noPadding={page.props.noPadding}>
            {page}
        </AccountLayout>,
        {
            globalContent
        }
    )
);

export default AccountLayout;
