import * as React from 'react';
import {useAccountPageLayout} from "layout/account-page-layout";
import Router from 'next/router';
import Listings from 'api/listings';
import {Fragment} from "react";
import {AuthContext} from "api/auth/auth-context";
import UserProfile from "api/user-profile";
import withStyles from "react-jss";
import {Button, ButtonVariant} from "components/button";
import Colors from "styles/colors";
import {AvailabilityFields} from "components/form-fields/availability-fields";
import {Checkbox} from "components/form-fields/checkbox";
import {NotificationManager} from 'react-notifications';
import Uploads from "api/uploads";
import {PhoneInput} from "components/form-fields/phone-input";
import {CreateListingPage} from "./index.page";
import {rawStyles} from "./step-3.styles";
import {ToolTip} from "components/tool-tip/tool-tip";
import {ApiClient} from "api/api-client";
import {CmsClient} from "cms/cms-client";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";
import {availabilityForUser} from "api/auth/user.dto";

/**
 * The "create listing" page - step 3
 */
class CreateListingPage3 extends React.Component {
    static defaultLayout = useAccountPageLayout;
    static contextType = AuthContext;

    /**
     * Constructor
     */
    constructor(props, context) {
        super(props, context);
        this._goBack = this._goBack.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this.state = {
            contactText: this.context.currentUser.contactText,
            contactEmail: this.context.currentUser.contactEmail,
            contactPhone: this.context.currentUser.contactPhone,
            phone: this.context.currentUser.phone,
            availability: availabilityForUser(this.context.currentUser),
            loading: false,
        };
    }

    /**
     * Gets the initial properties
     * @param context
     * @returns {Promise<{}>}
     */
    static async getInitialProps(context) {
        if (!process.browser) {
            // if user visited this page directly instead of coming from step 1, send them to step 1
            context.res.writeHead(302, { Location: '/account/listings/create' });
            context.res.end();
            return null;
        }
        const userProfileResponse = await UserProfile.getProfile();
        const defaultAgentResponse = await ApiClient.get('/agents/default');

        let microContent = null;
        try {
            const microContentResponse = await CmsClient.get('/create-listing-micro-content');
            microContent = microContentResponse.data;
        }
        catch (e) {
            // use default micro content if none set in cms
        }

        return {
            title: 'Create Listing',
            defaultAgent: defaultAgentResponse.data,
            userProfile: userProfileResponse.profile,
            microContent: microContent ?? CreateListingPage.defaultProps.microContent
        };
    }

    /**
     * Returns to step 2
     * @private
     */
    _goBack() {
        Router.push('/account/listings/create/step-2');
    }

    /**
     * Handles the form submission
     * @param e
     * @returns {Promise<void>}
     * @private
     */
    async _handleSubmit(e) {
        e.preventDefault();

        this.setState({loading: true});

        let listing = JSON.parse(localStorage.getItem('create-listing-step-1-state')).inputs;
        const step2State = JSON.parse(localStorage.getItem('create-listing-step-2-state'));
        listing.bedroomCount = step2State.inputs.bedroomCount ?? 1;
        listing.bathroomCount = step2State.inputs.bathroomCount ?? 1;
        listing.squareFootage = step2State.inputs.squareFootage ?? 1000;
        listing.agent = this.props.defaultAgent.id;
        listing.askingPrice = step2State.valuation.valuations?.general?.high ?? 100000;

        const createResult = await Listings.createListing(listing);
        this.setState({loading: false});

        // also update user profile
        await UserProfile.updateProfile(this.context.apiToken, {
            contactEmail: this.state.contactEmail,
            contactPhone: this.state.contactPhone,
            contactText: this.state.contactText,
            phone: this.state.phone,
            ...this.state.availability
        });

        if (createResult.success) {
            NotificationManager.success('Listing created!');
            localStorage.removeItem('create-listing-step-1-state');
            localStorage.removeItem('create-listing-step-2-state');
            localStorage.removeItem('create-listing-step-3-state');
            localStorage.removeItem('home-valuation');
            // we delay the router push to give the backend time to set defaults on the listing
            // during its "afterCreate" lifecycle event
            setTimeout(() => Router.push(`/account/listings/${createResult.listing.id}`), 400);
        }
        else {
            const errorMessage = createResult.errorCode === 'duplicate-listing'
                ? 'A listing for this home is already active!'
                : 'Please verify all provided information';
            NotificationManager.error(errorMessage, 'Error saving listing');
        }
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        const agentImageUrl = Uploads.getUploadFullUrl(this.props.defaultAgent.photo?.url);
        const styles = this.props.classes;

        return (
            <Fragment>
                <Breadcrumbs currentPageTitle={'Create Listing'}/>

                <h2>{this.props.microContent.page3_heading}</h2>
                <div className={styles.wrapper}>
                    <div className={styles.userGuide} dangerouslySetInnerHTML={{__html: this.props.microContent.page3_sidebar}} />
                    <form onSubmit={this._handleSubmit} className={styles.form}>
                        <div className={styles.formWrapper}>
                            <h3>Your Agent</h3>
                            <div style={{
                                backgroundImage: `url('${agentImageUrl}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                float: 'left',
                                width: 90,
                                height: 90,
                                marginRight: 15,
                                marginBottom: 20,
                                borderRadius: '50%'
                            }}/>
                            <h5 style={{marginBottom: -15}}>{this.props.defaultAgent.name}</h5>
                            <p>{this.props.defaultAgent.about}</p>
                            <hr style={{clear: 'both'}}/>
                            <div className={styles.inputs}>
                                <div>
                                    <h4>Your Availability {this.props.microContent.page3_availabilityPopup && <ToolTip htmlContent={this.props.microContent.page3_availabilityPopup}/>}</h4>
                                    <AvailabilityFields
                                        onChange={newAvailability => this.setState({availability: newAvailability})}
                                        initialAvailability={this.state.availability}
                                        checkboxColor='#fff'
                                        selectColor={'#fff'}
                                    />
                                </div>
                                <div>
                                    <h4>Preferred Contact Method</h4>
                                    <Checkbox
                                        backgroundColor='#fff'
                                        label='Text Message'
                                        checked={this.state.contactText}
                                        onChange={checked => this.setState({contactText: checked})}
                                    />
                                    <br/>
                                    <Checkbox
                                        backgroundColor='#fff'
                                        label='Phone'
                                        checked={this.state.contactPhone}
                                        onChange={checked => this.setState({contactPhone: checked})}
                                    />
                                    <br/>
                                    <Checkbox
                                        backgroundColor='#fff'
                                        label='Email'
                                        checked={this.state.contactEmail}
                                        onChange={checked => this.setState({contactEmail: checked})}
                                    />
                                    <br/>
                                    <br/>
                                    <label>
                                        Phone Number
                                        <PhoneInput
                                            style={{backgroundColor: '#fff'}}
                                            value={this.state.phone}
                                            required={this.state.contactPhone || this.state.contactText}
                                            onChange={newValue => this.setState({phone: newValue})}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div className={`${styles.nav} mobile-only`}>
                            <p>Step <span>1</span> <span>2</span> <span className={styles.activeStep}>3</span></p>
                        </div>

                        <div className={styles.nav}>
                            <Button
                                onClick={this._goBack}
                                data-testid={'prev-button'}
                                type={'button'}
                            >
                                <><img src='/arrow-previous.svg'/> Previous</>
                            </Button>
                            <p>Step <span>1</span> <span>2</span> <span className={styles.activeStep}>3</span></p>
                            <Button
                                loading={this.state.loading}
                                style={{color: Colors.mediumBlue, fontWeight: 'bold'}}
                                variant={ButtonVariant.Yellow}
                                type={'submit'}
                                data-testid={'submit-button'}
                                children={'Finished'}
                            />
                        </div>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default withStyles(rawStyles)(CreateListingPage3);
