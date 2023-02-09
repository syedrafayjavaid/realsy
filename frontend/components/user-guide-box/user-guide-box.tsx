import * as React from 'react';
import {GetStartedButton} from "components/get-started-button";
import Cms from "cms/cms";
import {Fade} from 'react-awesome-reveal';
import {useUserGuideBoxStyles} from "./user-guide-box.styles";
import {FC} from "react";

/**
 * A box containing a simple user guide (eg. "Selling with Realsy ...")
 */

export type UserGuideBoxProps = {
    headingText: string,
    guidePoints: string[],
    imageUrl: string,
};

export const UserGuideBox: FC<UserGuideBoxProps> = ({
    headingText,
    imageUrl,
    guidePoints = [],
}) => {
    const styleClasses = useUserGuideBoxStyles();
    return (
        <Fade triggerOnce={true}>
            <div className={styleClasses.userGuideBox}>
                <div className={styleClasses.image} style={{backgroundImage: `url('${Cms.getImageFullUrl(imageUrl)}')`}} />
                <div className='user-guide-body'>
                    <h2>{headingText}</h2>
                    <ul>
                        {guidePoints.map((point, i) => {
                            return (<li key={i}>{point}</li>);
                        })}
                    </ul>
                    <p><GetStartedButton/></p>
                </div>
            </div>
        </Fade>
    );
}
