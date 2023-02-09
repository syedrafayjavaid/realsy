import React, {FC} from 'react';
import {useDashboardGroupStyles} from "components/dashboard-group/dashboard-group.styles";

/**
 * A group of information in the user dashboard
 */

export type DashboardGroupProps = {
    title?: string,
    interiorScroll?: boolean,
    noPadding?: boolean,
    noBorder?: boolean,
};

const defaultProps: Partial<DashboardGroupProps> = {
    interiorScroll: true,
    noPadding: false,
    noBorder: false
};

export const DashboardGroup: FC<DashboardGroupProps> = (props) => {
    const styleClasses = useDashboardGroupStyles();

    let containerClass = styleClasses.dashboardGroup;
    if (props.interiorScroll) containerClass += ' interior-scroll';
    if (props.noPadding) containerClass += ' no-padding';
    if (props.noBorder) containerClass += ' no-border';

    return (
        <div className={containerClass}>
            <h2>{ props.title }</h2>
            <div className='dashboard-group-body'>
                { props.children }
            </div>
        </div>
    );
}

