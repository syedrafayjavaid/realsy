import * as React from 'react';
import {useAccountPageLayout} from "layout/account-page-layout";
import Router from "next/router";
import withStyles from 'react-jss';
import {Fragment} from 'react';
import {Button} from "components/button";
import Colors from 'styles/colors';
import Listings from "api/listings";
import {CurrencyInput} from "components/form-fields/currency-input";
import {Checkbox} from "components/form-fields/checkbox";
import {TextInput} from "components/form-fields/text-input";
import UsStatesInput from "components/form-fields/us-states-input";
import {NotificationManager} from "react-notifications";
import {CmsClient} from "cms/cms-client";
import Head from "next/head";
import {AppInfo} from "app-info";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";
import {ApiClient} from "api/api-client";
import {rawStyles} from "./step-1.styles";

/**
 * The "create listing" page
 */
export class CreateListingPage extends React.Component {
    static defaultLayout = useAccountPageLayout;
    static requiresAuth = true;

    static PATH = '/account/listings/create';
    static LOCAL_STORAGE_STATE_KEY = 'create-listing-step-1-state';
    static FORM_CLASS = 'create-listing-form';
    static FORM_ELEMENTS = {
        address: {
            class: 'street-address-input',
            name: 'address',
            defaultLabel: 'Street Address'
        },
        address2: {
            class: 'street-address-2-input',
            name: 'address2',
            defaultLabel: 'Street Address 2'
        },
        city: {
            class: 'city-input',
            name: 'city',
            defaultLabel: 'City'
        },
        state: {
            class: 'state-input',
            name: 'state',
            defaultLabel: 'State'
        },
        zipCode: {
            class: 'zipCode-input',
            name: 'zipCode',
            defaultLabel: 'Zip'
        },
        estimatedPayoff: {
            class: 'estimated-payoff-input',
            name: 'estimatedPayoff',
            defaultLabel: 'Estimated Payoff'
        },
        desiredNet: {
            class: 'desired-net-input',
            name: 'desiredNetAmount',
            defaultLabel: 'Desired Profit from Sale'
        },
        userUnsure: {
            class: 'user-unsure-input',
            name: 'userUnsureOfValue',
            defaultLabel: 'Unsure',
            float: 'right'
        },
    };

    /**
     * Props
     */
    static async getInitialProps(ctx) {
        let microContent = CreateListingPage.defaultProps.microContent;
        try {
            const microContentResponse = await CmsClient.get('/create-listing-micro-content');
            microContent = microContentResponse.data;
        }
        catch (e) {
            // use default micro content if none set in admin
        }
        return {
            microContent,
        }
    }

    static defaultProps = {
        microContent: {
            page1_heading: 'Tell us about your property',
            page1_sidebar: '<h3>Why we need this information</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus sed vulputate odio ut. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam.</p>',
            page1_estimatedPayoffPopup: '<p>Lorem ipsum tool tip</p>',
            page1_desiredNetPopup: '<p>Lorem ipsum tool tip</p>',

            page2_heading: 'This is your home price based on market conditions',
            page2_sidebar: '<h3>What this tells you about your home</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus sed vulputate odio ut. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam.</p>',

            page3_heading: 'Let us know your schedule going forward',
            page3_sidebar: '<h3>How this will work</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus sed vulputate odio ut. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam.</p>',
            page3_availabilityPopup: '<p>Lorem ipsum tool tip</p>',
        }
    };

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._unsureChanged = this._unsureChanged.bind(this);

        // load state saved in localstorage if exists
        const savedState = process.browser && localStorage.getItem(CreateListingPage.LOCAL_STORAGE_STATE_KEY);
        if (savedState) {
            this.state = {
                ...JSON.parse(savedState),
                loading: false,
                invalidAddress: false,
                invalidCity: false,
                invalidState: false,
                invalidZipCode: false,
            };
        }
        else {
            // otherwise default state
            this.state = {
                loading: false,
                inputs: {
                    [CreateListingPage.FORM_ELEMENTS.address.name]: '',
                    [CreateListingPage.FORM_ELEMENTS.address2.name]: '',
                    [CreateListingPage.FORM_ELEMENTS.city.name]: '',
                    state: 'AL',
                    [CreateListingPage.FORM_ELEMENTS.zipCode.name]: '',
                    [CreateListingPage.FORM_ELEMENTS.estimatedPayoff.name]: 0,
                    [CreateListingPage.FORM_ELEMENTS.desiredNet.name]: 0,
                    [CreateListingPage.FORM_ELEMENTS.userUnsure.name]: '0',
                    invalidAddress: false,
                    invalidCity: false,
                    invalidState: false,
                    invalidZipCode: false,
                }
            }
        }
    }

    /**
     * Updates the state when inputs change
     * @param newValue
     * @param field
     * @private
     */
    _handleInputChange(newValue, field) {
        const inputs = this.state.inputs;
        inputs[field] = newValue;
        this.setState({inputs});
    }

    _handleCurrencyInputChange(fieldName, newValue) {
        const inputs = this.state.inputs;
        inputs[fieldName] = newValue;
        this.setState({inputs});
    }

    _unsureChanged(checked) {
        const inputs = this.state.inputs;
        inputs[CreateListingPage.FORM_ELEMENTS.userUnsure.name] = checked ? '1' : '0';
        this.setState({inputs});
    }

    /**
     * Handles the form submission
     * @param e
     * @returns {Promise<void>}
     * @private
     */
    async _handleSubmit(e) {
        e.preventDefault();

        let validInput = true;
        if(!this.state.inputs[CreateListingPage.FORM_ELEMENTS.address.name]) {
            validInput = false;
            this.setState({invalidAddress: true});
        }
        if(!this.state.inputs[CreateListingPage.FORM_ELEMENTS.city.name]) {
            validInput = false;
            this.setState({invalidCity: true});
        }
        if(!this.state.inputs[CreateListingPage.FORM_ELEMENTS.state.name]) {
            validInput = false;
            this.setState({invalidState: true});
        }
        if(!this.state.inputs[CreateListingPage.FORM_ELEMENTS.zipCode.name]) {
            validInput = false;
            this.setState({invalidZipCode: true});
        }
        if (!validInput) { return; }

        this.setState({loading: true});

        try {
            const existingListingResponse = await ApiClient.get('/listings', {
                params: {
                    address: this.state.inputs[CreateListingPage.FORM_ELEMENTS.address.name],
                    address2: this.state.inputs[CreateListingPage.FORM_ELEMENTS.address2.name],
                    city: this.state.inputs[CreateListingPage.FORM_ELEMENTS.city.name],
                    state: this.state.inputs[CreateListingPage.FORM_ELEMENTS.state.name],
                    zipCode: this.state.inputs[CreateListingPage.FORM_ELEMENTS.zipCode.name],
                    status_ne: 'closed',
                },
            });
            const existingListingResult = existingListingResponse.data;
            if (existingListingResult?.length > 0 && process.env.NEXT_PUBLIC_ALLOW_DUPLICATE_LISTINGS !== 'true') {
                NotificationManager.error('A listing for this address is already active');
                this.setState({loading: false});
                return;
            }
        }
        catch (e) {
            // ignore failed check for duplicate listing
        }

        // get home valuation
        const homeValuationResult = await Listings.getHomeValue( {
            address: this.state.inputs[CreateListingPage.FORM_ELEMENTS.address.name],
            address2: this.state.inputs[CreateListingPage.FORM_ELEMENTS.address2.name],
            city: this.state.inputs[CreateListingPage.FORM_ELEMENTS.city.name],
            state: this.state.inputs[CreateListingPage.FORM_ELEMENTS.state.name],
            zipCode: this.state.inputs[CreateListingPage.FORM_ELEMENTS.zipCode.name],
        });

        const inputs = this.state.inputs;
        if (inputs[CreateListingPage.FORM_ELEMENTS.desiredNet] === '') {
            inputs[CreateListingPage.FORM_ELEMENTS.desiredNet] = 0;
        }
        if (inputs[CreateListingPage.FORM_ELEMENTS.estimatedPayoff] === '') {
            inputs[CreateListingPage.FORM_ELEMENTS.estimatedPayoff] = 0;
        }
        this.setState(inputs);

        this.setState({loading: false});
        localStorage.setItem(CreateListingPage.LOCAL_STORAGE_STATE_KEY, JSON.stringify(this.state));
        if (homeValuationResult.success) {
            localStorage.setItem('home-valuation', JSON.stringify(homeValuationResult.valuation));
        }
        else {
            localStorage.setItem('home-valuation', JSON.stringify({wasUnable: true}));
        }

        await Router.push('/account/listings/create/step-2');
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        const styles = this.props.classes;

        return <Fragment>
            <Head>
                <title>{AppInfo.name}: Create Listing</title>
            </Head>

            <Breadcrumbs currentPageTitle={'Create Listing'}/>

            <h2>{this.props.microContent.page1_heading}</h2>
            <div className={styles.wrapper}>
                <div className={styles.userGuide} dangerouslySetInnerHTML={{__html: this.props.microContent.page1_sidebar}} />
                <form onSubmit={this._handleSubmit} className={`${CreateListingPage.FORM_CLASS} ${styles.form}`}>
                    <div className={styles.addressInputs}>
                        <p>
                            <p>
                                <TextInput
                                    label={CreateListingPage.FORM_ELEMENTS.address.defaultLabel}
                                    autoFocus={true}
                                    name={CreateListingPage.FORM_ELEMENTS.address.name}
                                    value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.address.name]}
                                    onChange={newValue => this._handleInputChange(newValue, CreateListingPage.FORM_ELEMENTS.address.name)}
                                    inputProps={{
                                        'data-testid': 'address-input',
                                    }}
                                    required
                                />
                            </p>
                        </p>
                        <p>
                            <p>
                                <TextInput
                                    label={CreateListingPage.FORM_ELEMENTS.address2.defaultLabel}
                                    name={CreateListingPage.FORM_ELEMENTS.address2.name}
                                    value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.address2.name]}
                                    onChange={newValue => this._handleInputChange(newValue, CreateListingPage.FORM_ELEMENTS.address2.name)}
                                    inputProps={{
                                        'data-testid': 'address2-input',
                                    }}
                                />
                            </p>
                        </p>
                    </div>
                    <div className={styles.cityStateZipInputs}>
                        <p>
                            <TextInput
                                label={CreateListingPage.FORM_ELEMENTS.city.defaultLabel}
                                name={CreateListingPage.FORM_ELEMENTS.city.name}
                                value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.city.name]}
                                onChange={newValue => this._handleInputChange(newValue, CreateListingPage.FORM_ELEMENTS.city.name)}
                                required
                                inputProps={{
                                    'data-testid': 'city-input'
                                }}
                            />
                        </p>
                        <p data-testid={'state-select'}>
                            <UsStatesInput
                                label={'State'}
                                backgroundColor={Colors.offWhite}
                                value={this.state.inputs.state}
                                name={CreateListingPage.FORM_ELEMENTS.state.name}
                                onChange={selectedOption => { const inputs = this.state.inputs; inputs.state = selectedOption.value ; this.setState({inputs}); }}
                            />
                        </p>
                        <p>
                            <TextInput
                                label={CreateListingPage.FORM_ELEMENTS.zipCode.defaultLabel}
                                name={CreateListingPage.FORM_ELEMENTS.zipCode.name}
                                value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.zipCode.name]}
                                onChange={newValue => this._handleInputChange(newValue, CreateListingPage.FORM_ELEMENTS.zipCode.name)}
                                numbersOnly={true}
                                maxLength={5}
                                required
                                inputProps={{
                                    'data-testid': 'zip-code-input'
                                }}
                            />
                        </p>
                    </div>
                    <hr />
                    <div className={styles.amountInputs}>
                        <p>
                            <CurrencyInput
                                label={CreateListingPage.FORM_ELEMENTS.estimatedPayoff.defaultLabel}
                                tooltip={this.props.microContent.page1_estimatedPayoffPopup}
                                placeholder="$100,000"
                                name={CreateListingPage.FORM_ELEMENTS.estimatedPayoff.name}
                                value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.estimatedPayoff.name]}
                                onChange={newValue => this._handleCurrencyInputChange(CreateListingPage.FORM_ELEMENTS.estimatedPayoff.name, newValue)}
                                data-testid={'estimated-payoff-input'}
                            />
                        </p>
                        <p>
                            <CurrencyInput
                                label={CreateListingPage.FORM_ELEMENTS.desiredNet.defaultLabel}
                                tooltip={this.props.microContent.page1_desiredNetPopup}
                                placeholder="$100,000"
                                name={CreateListingPage.FORM_ELEMENTS.desiredNet.name}
                                value={this.state.inputs[CreateListingPage.FORM_ELEMENTS.desiredNet.name]}
                                onChange={newValue => this._handleCurrencyInputChange(CreateListingPage.FORM_ELEMENTS.desiredNet.name, newValue)}
                                data-testid={'desired-net-input'}
                            />
                        </p>
                    </div>
                    <p style={{margin: '-10px 0 20px', textAlign: 'right'}}>
                        <Checkbox
                            label={CreateListingPage.FORM_ELEMENTS.userUnsure.defaultLabel}
                            checked={this.state.inputs.userUnsureOfValue === '1'}
                            onChange={this._unsureChanged}
                            data-testid={'unsure-checkbox'}
                        />
                    </p>

                    <hr/>

                    <div className={`${styles.nav} mobile-only`}>
                        <p>Step <span className={styles.activeStep}>1</span> <span>2</span> <span className={''}>3</span></p>
                    </div>
                    <div className={styles.nav}>
                        {/* empty span to fill space for missing previous button */}
                        <span/>
                        <p>Step <span className={styles.activeStep}>1</span> <span>2</span> <span>3</span></p>
                        <Button
                            loading={this.state.loading}
                            type={'Submit'}
                            data-testid={'next-button'}
                        >
                            Next <img style={{position: 'relative', left: 5, top: 2}} src='/arrow-next.svg'/>
                        </Button>
                    </div>
                </form>
            </div>
        </Fragment>
    }
}

export default withStyles(rawStyles)(CreateListingPage);

