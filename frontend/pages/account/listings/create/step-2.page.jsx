import * as React from 'react';
import {useAccountPageLayout} from "layout/account-page-layout";
import Router from 'next/router';
import {Fragment} from "react";
import Listings from "api/listings";
import {formatCurrency} from "util/format-currency";
import withStyles from "react-jss";
import {Button} from "components/button";
import {CreateListingPage} from './index.page';
import {Checkbox} from "components/form-fields/checkbox";
import {TextInput} from "components/form-fields/text-input";
import {rawStyles} from "./step-2.styles";
import {CmsClient} from "cms/cms-client";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";

/**
 * The "create listing" page - step 2
 */
class CreateListingPage2 extends React.Component {
    static defaultLayout = useAccountPageLayout;
    static LOCAL_STORAGE_STATE_KEY = 'create-listing-step-2-state';

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this._goBack = this._goBack.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

        const savedState = process.browser && JSON.parse(localStorage.getItem(CreateListingPage2.LOCAL_STORAGE_STATE_KEY));
        if (savedState && !this.props.valuation.wasUnable && savedState?.valuation?.wasUnable !== true) {
            this.state = {
                ...savedState,
                loading: false,
            };
        }
        else {
            this.state = {
                valuation: props.valuation,
                inputs: {
                    looksWrong: false,
                    bedroomCount: props.valuation?.attributes?.beds,
                    bathroomCount: props.valuation?.attributes?.baths,
                    squareFootage: props.valuation?.attributes?.size
                },
                loading: false,
                updating: false
            };
        }
    }

    /**
     * Initial Properties
     */
    static async getInitialProps(context) {
        if (!process.browser) {
            // if user visited this page directly instead of coming from step 1, send them to step 1
            context.res.writeHead(302, { Location: '/account/listings/create' });
            context.res.end();
            return null;
        }

        // make sure this was reached from step 1
        const step1State = process.browser && JSON.parse(localStorage.getItem('create-listing-step-1-state'));
        const homeValuation = process.browser && JSON.parse(localStorage.getItem('home-valuation'));
        if (!step1State || !homeValuation) {
            await Router.push('/account/listings/create');
        }

        const address = step1State.inputs.address;
        const address2 = step1State.inputs.address2;

        let microContent = null
        try {
            const microContentResponse = await CmsClient.get('/create-listing-micro-content');
            microContent = microContentResponse.data;
        } catch (e) {
            // ignore failed micro content fetch -- default will be used
        }

        return {
            valuation: homeValuation,
            ownerName: '',
            address: address,
            address2: address2,
            streetAddress: `${address} ${address2}`,
            city: step1State.inputs.city,
            state: step1State.inputs.state,
            zipCode: step1State.inputs.zipCode,
            microContent: microContent ?? CreateListingPage.defaultProps.microContent
        };
    }

    /**
     * Update price
     * @returns {Promise<void>}
     * @private
     */
    async _updatePrice() {
        this.setState({updating: true});
        const step1State = process.browser && JSON.parse(localStorage.getItem('create-listing-step-1-state'));
        const homeValuationResult = await Listings.getHomeValue({
            address: step1State.inputs[CreateListingPage.FORM_ELEMENTS.address.name],
            address2: step1State.inputs[CreateListingPage.FORM_ELEMENTS.address2.name],
            city: step1State.inputs[CreateListingPage.FORM_ELEMENTS.city.name],
            state: step1State.inputs[CreateListingPage.FORM_ELEMENTS.state.name],
            zipCode: step1State.inputs[CreateListingPage.FORM_ELEMENTS.zipCode.name],
        },{
            beds: this.state.inputs.bedroomCount,
            baths: this.state.inputs.bathroomCount,
            size: this.state.inputs.squareFootage
        });
        if (homeValuationResult.success) {
            this.setState({valuation: homeValuationResult.valuation});
        }
        this.setState({updating: false});
    }

    /**
     * Returns to step 1
     * @private
     */
    _goBack() {
        Router.push('/account/listings/create');
    }

    /**
     * Syncs state with input change
     * @param e
     * @private
     */
    _handleInputChange(e) {
        const inputs = this.state.inputs;
        inputs[e.target.name] = parseInt(e.target.value);
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
        this.setState({loading: true});
        localStorage.setItem(CreateListingPage2.LOCAL_STORAGE_STATE_KEY, JSON.stringify({
            ...this.state,
            estimatedHomeValue: this.props.valuation.valuations?.default?.EMV
        }));
        await Router.push(`/account/listings/create/step-3`);
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        const lowValuation = this.state.valuation.valuations?.general?.low;
        const highValuation = this.state.valuation.valuations?.general?.high;

        const styles = this.props.classes;
        return (
            <Fragment>
                <Breadcrumbs currentPageTitle={'Create Listing'}/>

                <h2>{this.props.microContent.page2_heading}</h2>
                <div className={styles.wrapper}>
                    <div className={styles.userGuide} dangerouslySetInnerHTML={{__html: this.props.microContent.page2_sidebar}} />
                    <form onSubmit={this._handleSubmit} className={styles.form}>
                        <hr/>

                        {this.props.valuation.wasUnable &&
                            <p>We weren't able to valuate your home. You can continue with your listing and a Realsy agent will contact you with further information.</p>
                        }

                        {!this.props.valuation.wasUnable &&
                        <div className={styles.formWrapper}>
                            <div className={styles.details}>
                                <h4>Property Details</h4>
                                <h2 data-testid={'valuation-summary'}>
                                    {formatCurrency(lowValuation, {omitDecimal: true})} - {formatCurrency(highValuation, {omitDecimal: true})}
                                </h2>
                                <dl>
                                    <dt>Address</dt>
                                    <dd>
                                        {this.props.streetAddress}<br/>
                                        {this.props.city}, {this.props.state} {this.props.zipCode}
                                    </dd>
                                </dl>
                                <label>
                                    <Checkbox
                                        label={"This doesn't look right"}
                                        onChange={checked => {
                                            const inputs = this.state.inputs;
                                            inputs.looksWrong = checked;
                                            this.setState({inputs})
                                        }}
                                        checked={this.state.inputs.looksWrong}
                                    />
                                </label>
                            </div>
                            <div className={styles.inputs}>
                                <div className={styles.selectFields}>
                                    <label>
                                        Bedrooms
                                        <select
                                            name={'bedroomCount'}
                                            data-testid={'bedroom-count-select'}
                                            value={this.state.inputs.bedroomCount}
                                            onChange={this._handleInputChange}
                                        >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                            <option value={9}>9</option>
                                            <option value={10}>10</option>
                                        </select>
                                    </label>
                                    <label>
                                        Bathrooms
                                        <select
                                            name={'bathroomCount'}
                                            data-testid={'bathroom-count-select'}
                                            value={this.state.inputs.bathroomCount}
                                            onChange={this._handleInputChange}
                                        >
                                            <option value={1}>1</option>
                                            <option value={1.5}>1.5</option>
                                            <option value={2}>2</option>
                                            <option value={2.5}>2.5</option>
                                            <option value={3}>3</option>
                                            <option value={3.5}>3.5</option>
                                            <option value={4}>4</option>
                                            <option value={4.5}>4.5</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </label>
                                </div>
                                <label>
                                    Finished Sq Feet
                                    <TextInput
                                        numbersOnly={true}
                                        onChange={newValue => {
                                            const inputs = this.state.inputs;
                                            inputs['squareFootage'] = newValue;
                                            this.setState({inputs});
                                        }}
                                        name={'squareFootage'}
                                        value={this.state.inputs.squareFootage}
                                        required
                                        inputProps={{
                                            'data-testid': 'square-footage-input',
                                        }}
                                    />
                                </label>
                                <Button
                                    loading={this.state.updating}
                                    style={{float: 'right'}}
                                    onClick={() => this._updatePrice()}
                                    type={'button'}
                                    children={'Update'}
                                    data-testid={'update-button'}
                                />
                            </div>
                        </div>
                        }
                        <hr/>

                        <div className={`${styles.nav} mobile-only`}>
                            <p>
                                Step <span>1</span>
                                <span className={styles.activeStep}>2</span>
                                <span>3</span>
                            </p>
                        </div>
                        <div className={styles.nav}>
                            <Button
                                onClick={this._goBack}
                                data-testid={'prev-button'}
                                type={'button'}
                                children={
                                    <><img style={{position: 'relative', right: 5, top: 2}} src='/arrow-previous.svg' /> Previous</>
                                }
                            />
                            <p>Step <span>1</span> <span className={styles.activeStep}>2</span> <span>3</span></p>
                            <Button
                                loading={this.state.loading}
                                type={'submit'}
                                data-testid={'next-button'}
                                children={
                                    <>Next <img style={{position: 'relative', left: 5, top: 2}} src='/arrow-next.svg' /></>
                                }
                            />
                        </div>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default withStyles(rawStyles)(CreateListingPage2);
