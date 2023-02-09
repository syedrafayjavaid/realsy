import React, {FC} from 'react';
import {useUserGuideHeaderStyles} from './user-guide-header.styles';

/**
 * A user guide header box
 * (eg. the explanation boxes above offer creation forms)
 */

export type UserGuideHeaderProps = {
    heading?: string,
    body?: string,
    htmlBody: string,
}

export const UserGuideHeader: FC<UserGuideHeaderProps> = props => {
    const styleClasses = useUserGuideHeaderStyles();
    if (props.htmlBody) {
        return (
            <div
                className={styleClasses.container}
                dangerouslySetInnerHTML={{__html: props.htmlBody}}
            />
        );
    }
    else {
        return (
            <div className={styleClasses.container}>
                <h4>{props.heading}</h4>
                <p>{props.body}</p>
            </div>
        )
    }
};
