import * as React from "react";
import {useActivityRecordThumbnailStyles} from './activity-record-thumbnail.styles';
import {Button, ButtonVariant} from 'components/button';
import Uploads from "api/uploads";
import Colors from "styles/colors";
import {ApiRoutes} from "api/api-routes";
import {UserActivityRecordDto} from "api/notifications/user-activity-record.dto";
import {FC} from "react";

/**
 * A thumbnail view of a user activity record
 */

export type ActivityRecordThumbnailProps = {
    record: UserActivityRecordDto,
    theme?: 'dark' | 'light',
};

const defaultProps: Partial<ActivityRecordThumbnailProps>= {
    theme: 'dark'
};

export const ActivityRecordThumbnail: FC<ActivityRecordThumbnailProps> = (props) => {
    const styleClasses = useActivityRecordThumbnailStyles(props);

    let imageUrl = ApiRoutes.listingMainPhotoUrl(props.record.listing?.id ?? 0, {format: 'thumbnail'});
    let buttonText = 'Details';

    if (props.record.typeCode === 'chat') {
        imageUrl = Uploads.getUserProfilePhotoUrl(props.record.extra?.senderId, {format: 'small'});
        buttonText = 'Reply';
    }

    return (
        <div className={styleClasses.activityRecord}>
            <div className={styleClasses.top}>
                <div
                    className={styleClasses.image}
                    style={{backgroundImage: `url(${imageUrl})`}}
                />
                <div
                    className={styleClasses.body}
                    style={{backgroundColor: props.theme === 'dark' ? Colors.offWhite : '#fff'}}
                >
                    <h4 className={styleClasses.title}>{props.record.title}</h4>
                    <p className={styleClasses.date}>
                        {new Date(props.record.created_at).toLocaleDateString()}
                    </p>
                    <p style={{fontWeight: 300, fontSize: '14px'}}>
                        {props.record.body}
                    </p>
                </div>
            </div>

            {props.theme === 'dark' &&
                <div className={styleClasses.footer}>
                    {props.record.listing &&
                        <span>
                            <img
                                src={'/icon-location-yellow.svg'}
                                style={{position: 'relative', top: 2, marginRight: 5}}
                                alt={''}
                            />
                            {props.record.listing.address} {props.record.listing.city}, {props.record.listing.state}
                        </span>
                    }
                    {!props.record.listing && <span/>}
                    <span className={styleClasses.footerButtonContainer}>
                        <Button
                            variant={ButtonVariant.White}
                            padding={'3px 15px'}
                            href={props.record.link}
                        >
                            {buttonText}
                        </Button>
                    </span>
                </div>
            }
        </div>
    );
};

ActivityRecordThumbnail.defaultProps = defaultProps;
