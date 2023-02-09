import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonVariant} from 'components/button';
import {CurrencyInput} from 'components/form-fields/currency-input';
import {NotificationManager} from "react-notifications";
import Listings from "api/listings";
import {useAuthContext} from "api/auth/auth-context";
import {Checkbox} from "components/form-fields/checkbox";
import TagsInput from 'components/form-fields/tags-input';
import {PhoneInput} from "components/form-fields/phone-input";
import {TextInput} from "components/form-fields/text-input";
import OfferResponseForm from "components/offer-response-form";
import {microContent, includeSelections, financingOptions, inspectionOptions} from './default-props';
import {Loader} from "components/loader";
import {useStyles} from './create-offer-form.styles';
import Select from "components/form-fields/select";
import Colors from "styles/colors";
import DatePicker from "react-datepicker";
import Cms from "cms/cms";
import {UserGuideHeader} from "components/user-guide-header";
import {Formik, FieldArray} from 'formik'
import {ToolTip} from "components/tool-tip/tool-tip";
import {RadioButtonGroup} from "components/form-fields/radio-button-group/radio-button-group";
import {formatCurrency} from "util/format-currency";
import {useNotificationsContext} from "contexts/notifications-context";
import {CmsClient} from "cms/cms-client";

/**
 * A form for a user to create an offer for a listing
 */
const CreateOfferForm = props => {
    const styles = useStyles();
    const authContext = useAuthContext();
    const notificationsContext = useNotificationsContext();

    const [currentView, setCurrentView] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [existingOffer, setExistingOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [microContent, setMicroContent] = useState(props.microContent);
    const [formFields, setFormFields] = useState(null);

    useEffect(function onMount() {
        (async () => {
            setLoading(true);
            await loadOfferIfExists();
            await loadMicroContent();
            await loadForm();
            setLoading(false);
        })();
    }, []);


    async function loadOfferIfExists() {
        if (authContext.isSignedIn) {
            Listings.checkOffer(props.listingId).then(offerResult => {
                if (offerResult.hasActiveOffer) {
                    setExistingOffer(offerResult.offer);
                    notificationsContext.clearNotificationsForContent('offer', offerResult.offer.id);
                }
            });
        }
    }

    async function loadMicroContent() {
        try {
            const microContentResponse = await CmsClient.get('create-offer');
            setMicroContent(microContentResponse.data.microContentSet.microContent);
        }
        catch (e) {
            // use default micro content if none set in cms
        }
    }

    async function loadForm() {
        const formResult = await Cms.getForm('create-offer');
        if (formResult.success && formResult.form) {
            setFormFields(formResult.form);
        }
    }

    /**
     * Render
     */
    if (loading) {
        return (
            <div style={{ height: 300 }} >
                <Loader style={{margin: '50px auto'}} />
            </div>
        );
    }
    if ((!submitted && !existingOffer) || existingOffer?.status === 'declined') {
        return (
            <Formik
                initialValues={{
                    itemsIncluded: [],
                    additionalIncludedInSale: [],
                    includedInspections: [],
                    additionalInspections: [],
                    preferredCompanies: [],
                    amount: 0,
                    preApprovedForAmount: '1',
                    earnestMoneyDeposit: 0,
                    financingMethod: '',
                    lenderName: '',
                    loanOfficerName: '',
                    loanOfficerPhoneNumber: '',
                    estimatedInterestRate: 0.0,
                    estimatedPrincipal: 0,
                    closingCostsPaid: '',
                    desiredClosingDate: new Date(),
                    haveTitleCompany: false,
                    otherNotes: ''
                }}
                validate={values => {
                    const errors = {};
                    return errors;
                }}
                onSubmit={async (values, {setSubmitting}) => {
                    const consolidatedState = {
                        ...values,
                        itemsIncluded: values.itemsIncluded.concat(values.additionalIncludedInSale),
                        includedInspections: values.includedInspections.concat(values.additionalInspections),
                        listing: props.listingId
                    };
                    const result = await Listings.createOffer(consolidatedState);
                    if (result.success) {
                        NotificationManager.success(`Offer sent to Realsy for Review!`);
                        setSubmitted(true);
                    }
                    else {
                        NotificationManager.error('Error sending offer');
                    }
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <UserGuideHeader
                            htmlBody={microContent.filter(microContent => (microContent.code === `user-guide-${currentView+1}`))?.[0]?.content}
                        />
                        <section className={styles.mainInputs}>
                            {formFields[currentView].map(formField => {
                                if (formField.__component === 'forms.checkbox-group') {
                                    return (
                                        <fieldset>
                                            <legend>
                                                {formField.label}
                                                {formField.extra?.tooltip && <>{' '}<ToolTip htmlContent={formField.extra.tooltip}/></>}
                                            </legend>
                                            {formField.inputs.map((input, index) => {
                                                let inputValue = input.value || input.label;
                                                return (
                                                    <FieldArray
                                                        name={formField.fieldName}
                                                        render={arrayHelpers => {
                                                            return <>
                                                                <Checkbox
                                                                    checked={values[formField.fieldName].indexOf(inputValue) !== -1}
                                                                    onChange={checked => {
                                                                        if (checked) {
                                                                            arrayHelpers.push(inputValue)
                                                                        }
                                                                        else {
                                                                            const idx = values[formField.fieldName].indexOf(inputValue);
                                                                            arrayHelpers.remove(idx);
                                                                        }
                                                                    }}
                                                                    label={input.label}
                                                                    backgroundColor={'#fff'}
                                                                />
                                                                <br/>
                                                            </>
                                                        }}
                                                    />
                                                );
                                            })}
                                        </fieldset>
                                    );
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'tags') {
                                    return <>
                                        <TagsInput
                                            tooltip={formField.extra?.tooltip}
                                            label={formField.label}
                                            value={values[formField.fieldName]}
                                            placeholder={formField.placeholder}
                                            onChange={newTags => setFieldValue(formField.fieldName, newTags)}
                                            required={formField.required}
                                        />
                                        <br/>
                                    </>
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'currency') {
                                    return <CurrencyInput
                                        tooltip={formField.extra?.tooltip}
                                        label={formField.label}
                                        placeholder={formField.placeholder}
                                        value={values[formField.fieldName]}
                                        onChange={newValue => setFieldValue(formField.fieldName, newValue)}
                                        required={formField.required}
                                        style={errors[formField.fieldName] ? {border: `2px solid ${Colors.pink}`}: {}}
                                    />
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'text') {
                                    return <TextInput
                                        tooltip={formField.extra?.tooltip}
                                        label={formField.label}
                                        backgroundColor={'#fff'}
                                        onChange={handleChange}
                                        name={formField.fieldName}
                                        required={formField.required}
                                        value={values[formField.fieldName]}
                                    />
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'long_text') {
                                    return <>
                                        <label style={{display: 'inline'}}>{formField.label}</label>
                                        {formField.extra?.tooltip && <>{' '}<ToolTip htmlContent={formField.extra.tooltip}/></>}
                                        <textarea
                                            value={values[formField.fieldName]}
                                            onChange={handleChange}
                                            name={formField.fieldName}
                                        />
                                    </>
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'phone') {
                                    return <>
                                        <label style={{display: 'inline'}}>{formField.label}</label>
                                        {formField.extra?.tooltip && <>{' '}<ToolTip htmlContent={formField.extra.tooltip}/></>}
                                        <PhoneInput
                                            name={formField.fieldName}
                                            onChange={handleChange}
                                            value={values[formField.fieldName]}
                                        />
                                    </>
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'decimal') {
                                    return <TextInput
                                        tooltip={formField.extra?.tooltip}
                                        label={formField.label}
                                        backgroundColor={'#fff'}
                                        numbersOnly={true}
                                        placeholder={formField.placeholder}
                                        allowDecimals={true}
                                        name={formField.fieldName}
                                        onChange={handleChange}
                                        value={values[formField.fieldName]}
                                    />
                                }
                                else if (formField.__component === 'forms.text-input' && formField.type === 'date') {
                                    return <>
                                        <label style={{display: 'inline'}}>{formField.label}</label>
                                        {formField.extra?.tooltip && <>{' '}<ToolTip htmlContent={formField.extra.tooltip}/></>}
                                        <br/>
                                        <DatePicker
                                            selected={values[formField.fieldName]}
                                            onChange={date => setFieldValue(formField.fieldName, date)}
                                            minDate={new Date()}
                                        />
                                        <br/>
                                    </>
                                }
                                else if (formField.__component === 'forms.radio-button-group') {
                                    return <RadioButtonGroup
                                        label={formField.label}
                                        name={formField.fieldName}
                                        tooltipContent={formField.extra?.tooltip}
                                        options={formField.radioButtons.map(radioButton => (
                                            {value: radioButton.value || radioButton.label, label: radioButton.label}
                                        ))}
                                        onChange={newValue => setFieldValue(formField.fieldName, newValue)}
                                        value={values[formField.fieldName]}
                                    />
                                }
                                else if (formField.__component === 'forms.select-input') {
                                    return <Select
                                        tooltip={formField.extra?.tooltip}
                                        label={formField.label}
                                        options={formField.options.map(option => {
                                            return {value: option.value || option.label, label: option.label}
                                        })}
                                        onChange={selectedOption => setFieldValue(formField.fieldName, selectedOption.value)}
                                        value={values[formField.fieldName]}
                                    />
                                }
                            })}
                        </section>
                        <nav className={styles.pagerControls} data-testid={'pager-controls'}>
                            {currentView > 0 &&
                                <Button
                                    type={'button'}
                                    variant={ButtonVariant.Yellow}
                                    onClick={() => {
                                        currentView > 0 && setCurrentView(currentView - 1);
                                    }}
                                    style={{marginRight: 20}}
                                >Prev</Button>
                            }
                            {currentView < formFields.length - 1 &&
                                <Button
                                    type={'button'}
                                    onClick={() => {
                                        currentView < formFields.length - 1 && setCurrentView(currentView + 1);
                                    }}
                                >Next</Button>
                            }
                            {currentView === formFields.length - 1 &&
                                <Button
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >Submit</Button>
                            }
                        </nav>
                    </form>
                )}
            </Formik>
        );
    }
    else {
        return (
            <Fragment>
                {(submitted || existingOffer?.status === 'pending_realsy') &&
                    <div>
                        <h2>Offer Pending</h2>
                        <p>We are currently reviewing your offer, and will notify you when it has been sent to the seller.</p>
                    </div>
                }

                {existingOffer?.status === 'pending_lister' &&
                    <div>
                        <h2 data-testid={'offer-heading'}>Awaiting Lister</h2>
                        <p>Your offer is awaiting a response from the lister.</p>
                        <div style={{fontSize: 14}}>
                            <h3 style={{marginBottom: -10}}>Details</h3>
                            <ul>
                                <li>Offer: {formatCurrency(existingOffer.amount, {omitDecimal: true})}</li>
                                <li>Closing date: {new Date(existingOffer.desiredClosingDate).toLocaleDateString()}</li>
                            </ul>
                            {existingOffer.itemsIncluded?.length > 0 &&
                                <>
                                    <h4 style={{marginBottom: -10}}>Items Included</h4>
                                    <ul>
                                        {existingOffer.itemsIncluded.map(item => <li key={item.body}>{item.body}</li>)}
                                    </ul>
                                </>
                            }
                            {existingOffer.includedInspections?.length > 0 &&
                                <>
                                    <h4 style={{marginBottom: -10}}>Inspections Included</h4>
                                    <ul>
                                        {existingOffer.includedInspections.map(item => <li key={item.body}>{item.body}</li>)}
                                    </ul>
                                </>
                            }
                            {existingOffer.otherNotes?.length > 0 &&
                                <>
                                    <h4 style={{marginBottom: -10}}>Other Notes</h4>
                                    <p>{existingOffer.otherNotes}</p>
                                </>
                            }
                        </div>
                    </div>
                }

                {existingOffer?.status === 'countered' &&
                    <OfferResponseForm
                        onAccept={async () => {
                            props.onResponseFormAccept();
                            await loadOfferIfExists();
                        }}
                        onComplete={props.onResponseComplete}
                        offer={existingOffer}
                    />
                }

                {existingOffer?.status === 'accepted' &&
                    <Fragment>
                        <h2 data-testid={'offer-heading'}>Offer Accepted!</h2>
                        <p style={{marginTop: 20}}>
                            <Button href={`/account/listings/${props.listingId}`}>Go to Dashboard</Button>
                        </p>
                    </Fragment>
                }
            </Fragment>
        );
    }
};

CreateOfferForm.propTypes = {
    microContent: PropTypes.object.isRequired,
    includeSelections: PropTypes.array.isRequired,
    listingId: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onResponseFormAccept: PropTypes.func,
};

CreateOfferForm.defaultProps = {
    microContent: microContent,
    includeSelections: includeSelections,
    financingOptions: financingOptions,
    inspectionOptions: inspectionOptions,
    onClose: () => {},
    onResponseComplete: () => {},
};

export default CreateOfferForm;
