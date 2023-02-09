import React, {FC} from 'react';
import {Fade, Slide} from 'react-awesome-reveal';
import {useHeroSectionStyles} from "./hero-section.styles";
import {Button, ButtonVariant} from "components/button";

/**
 * A "hero" section with a large full-width image behind text
 */

export type HeroSectionProps = {
    backgroundImageUrl?: string,
    headline?: string,
    buttonUrl?: string,
    buttonText?: string,
    onButtonClicked?: () => any;
    showButton?: boolean,
    fullWidth?: boolean,
};

const defaultProps: HeroSectionProps = {
    showButton: true,
    fullWidth: true
};

export const HeroSection: FC<HeroSectionProps> = (props) => {
    const styleClasses = useHeroSectionStyles(props);

    return (
        <div
            className={styleClasses.heroSection}
            style={{ backgroundImage: `url(${props.backgroundImageUrl})` }}
        >
            <div>
                <Fade triggerOnce={true} duration={1300}>
                    <Slide triggerOnce={true} direction={'down'}>
                        <h2 className={styleClasses.heading}>{props.headline}</h2>
                    </Slide>
                </Fade>

                {props.showButton &&
                    <Fade triggerOnce={true} delay={1800}>
                        <p>
                            <Button
                                children={props.buttonText}
                                href={props.buttonUrl}
                                onClick={props.onButtonClicked}
                                variant={ButtonVariant.Yellow}
                                className={styleClasses.button}
                            />
                        </p>
                    </Fade>
                }
            </div>
        </div>
    );
}

HeroSection.defaultProps = defaultProps;
