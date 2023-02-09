import React, {FC} from 'react';
import {
    CmsButtonDto,
    CmsContentItemTypes,
    CmsHeroSectionDto, CmsImageDto,
    CmsRichBodyTextDto,
    CmsSavingsSliderDto,
    CmsUserGuideBoxDto
} from "cms/cms-content-item-types";
import {HeroSection} from "components/hero-section";
import {Button} from "components/button";
import Dimensions from "styles/dimensions";
import {useAuthContext} from "api/auth/auth-context";
import {SavingsSlider} from 'components/savings-slider';
import {UserGuideBox} from 'components/user-guide-box';
import {GetStartedButton} from 'components/get-started-button';

/**
 * Renders CMS content, transforming the CMS data structure to appropriate react components
 */

export type CmsTransformedContentProps = {
    contentItems: (CmsSavingsSliderDto | CmsUserGuideBoxDto | CmsHeroSectionDto | CmsRichBodyTextDto)[],
};

export const CmsTransformedContent: FC<CmsTransformedContentProps> = (props) => {
    const authContext = useAuthContext();

    let transformedItems = [];

    for (let i = 0; i < props.contentItems.length; ++i) {
        let contentItem = props.contentItems[i];

        switch (contentItem.__component) {
            case CmsContentItemTypes.RichBodyText:
                const richBodyContent = contentItem as CmsRichBodyTextDto;
                transformedItems.push(
                    <section
                        className={'cms-text'}
                        key={i}
                        dangerouslySetInnerHTML={{__html: richBodyContent.body}}
                    />
                );
                break;

            case CmsContentItemTypes.HeroSection:
                const heroSection = contentItem as CmsHeroSectionDto;
                transformedItems.push(
                    <div key={i}>
                        <HeroSection
                            headline={heroSection.headline}
                            backgroundImageUrl={heroSection.backgroundImage?.url}
                            showButton={true}
                            onButtonClicked={() => heroSection.showGetStartedButton && authContext.getStarted()}
                            buttonText={heroSection.buttonText}
                            buttonUrl={heroSection.showGetStartedButton ? undefined : heroSection.buttonUrl}
                            fullWidth={heroSection.fullWidth}
                        />
                    </div>
                );
                break;

            case CmsContentItemTypes.SavingsSlider:
                const savingsSliderItem = contentItem as CmsSavingsSliderDto;
                transformedItems.push(
                    <div key={i}>
                        <SavingsSlider
                            currentValueLabel={savingsSliderItem.currentValueText?.trim() || undefined}
                            couldSaveLabel={savingsSliderItem.couldSaveText?.trim() || undefined}
                            couldSaveLabelAfter={savingsSliderItem.afterSavingsText?.trim() || undefined}
                        />
                    </div>
                );
                break;

            case CmsContentItemTypes.UserGuideBox:
                // consecutive guide boxes must be contained in a wrapper
                // so we iterate beyond the current item to catch all consecutive guide boxes
                let consecutiveGuideBoxes = [];
                while (contentItem && contentItem.__component === 'content.user-guide-box') {
                    const userGuideBoxItem = contentItem as CmsUserGuideBoxDto;

                    // justify first box to end
                    let style = {};
                    if (consecutiveGuideBoxes.length === 0) {
                        style = {justifySelf: 'end'}
                    }
                    consecutiveGuideBoxes.push(
                        <div key={i} style={style}>
                            <UserGuideBox
                                headingText={userGuideBoxItem.heading}
                                imageUrl={userGuideBoxItem.image?.url ?? ''}
                                guidePoints={userGuideBoxItem.bulletPoints?.map((bulletPoint) => bulletPoint.body)}
                            />
                        </div>
                    );
                    // we iterate the outer content item loop here to read consecutive guide boxes
                    ++i;
                    contentItem = props.contentItems[i];
                }
                transformedItems.push(
                    <div key={i} className={'user-guide-boxes-wrapper'}>
                        {consecutiveGuideBoxes}
                    </div>
                );
                break;

            case CmsContentItemTypes.Button:
                const buttonItem = contentItem as CmsButtonDto;
                let button;
                if (buttonItem.triggerSignIn) {
                    button =
                        <GetStartedButton/>
                }
                else if(buttonItem.triggerChat) {
                    button =
                        <Button
                            className={'chat-launcher'}
                            onClick={() => {}} // the chat-launcher class handles click event
                            children={buttonItem.text}
                        />
                }
                else {
                    button =
                        <Button
                            href={buttonItem.link}
                            children={buttonItem.text}
                        />
                }
                transformedItems.push(
                    <section
                        className={'cms-text'}
                        key={i}
                        children={button}
                    />
                );
                break;

            case CmsContentItemTypes.Image:
                const imageItem = contentItem as CmsImageDto;
                transformedItems.push(
                    <section
                        style={{marginLeft: Dimensions.defaultPageMargin}}
                        key={i}
                    >
                        <img src={imageItem.image?.url}/>
                    </section>
                );
                break;

            default:
                break;
        }
    }

    return (
        <>
            {transformedItems}
        </>
    );
};
