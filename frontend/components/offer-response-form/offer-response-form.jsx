import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {CurrencyInput} from 'components/form-fields/currency-input';
import Listings from 'api/listings';
import {NotificationManager} from "react-notifications";
import {Button, ButtonVariant} from "components/button";
import OfferThumbnail from "components/offer-thumbnail";
import {useStyles} from "./offer-response-form.styles";
import Select from "components/form-fields/select";
import DatePicker from "react-datepicker";
import Cms from "cms/cms";
import Uploads from "api/uploads";
import {useNotificationsContext} from "contexts/notifications-context";

const OfferResponseForm = props => {
    const styles = useStyles();
    const notificationsContext = useNotificationsContext();
    const [amount, setAmount] = useState(0);
    const [closingDate, setClosingDate] = useState(new Date());
    const [closingCostsPaid, setClosingCostsPaid] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        notificationsContext.clearNotificationsForContent('offer', props.offer.id);
    }, []);

    async function acceptOffer() {
        const result = await Listings.acceptOffer(props.offer.id);
        if (result.success) {
            NotificationManager.success('Offer Accepted');
            props.onAccept();
            props.onComplete();
        }
        else {
            NotificationManager.error('Failed to save offer acceptance', 'Error Accepting');
        }
    }

    async function rejectOffer() {
        const result = await Listings.declineOffer(props.offer.id);
        if (result.success) {
            NotificationManager.error('Offer Rejected');
            props.onComplete();
        }
        else {
            NotificationManager.error('Failed to save offer rejection', 'Error');
        }
    }

    async function counterOffer(e) {
        e.preventDefault();
        const result = await Listings.counterOffer({
            offerId: props.offer.id,
            amount,
            closingDate: new Date(closingDate).toISOString(),
            closingCostsPaid,
            notes,
            datetime: new Date().toISOString(),
        });
        if (result.success) {
            NotificationManager.info('Counter offer sent!');
            props.onComplete();
        }
        else {
            NotificationManager.error('Failed to save counter offer', 'Error');
        }
    }

    const activeCounterOffer = props.offer.counterOffers?.length > 0
        ? props.offer.counterOffers?.[props.offer.counterOffers.length - 1]
        : null;
    const agentNotes = activeCounterOffer ? activeCounterOffer.agentNotes : props.offer.agentNotes;
    const offerDocument = activeCounterOffer ? activeCounterOffer.offerDocument : props.offer.offerDocument;

    return (
        <Fragment>
            <h2>{props.offer.status !== 'countered' ? 'Offer' : 'Counter Offer'}</h2>
            <div className={styles.container}>
                <OfferThumbnail offer={props.offer} showStatus={false} color={'blue'} showDetailsButton={false}/>

                <div className={styles.wrapper}>
                    {agentNotes?.map(note => {
                        const agentImageUrl = Uploads.getUploadFullUrl(`/agents/${props.offer.listing?.agent?.id || props.offer.listing?.agent}/main-photo`);
                        return (
                            <div>
                                <div style={{
                                    width: 50,
                                    height: 50,
                                    backgroundImage: agentImageUrl ? `url("${Cms.getImageFullUrl(agentImageUrl)}")` : '',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    borderRadius: '50%',
                                    float: 'left',
                                }}/>
                                <div className={styles.agentNote}>{note.body}</div>
                                <br style={{clear: 'both'}}/><br/>
                            </div>
                        )
                    })}
                    <br/>

                    {props.offer.status === 'accepted' &&
                        <h2 style={{margin: '-15px 0 20px'}}>Offer Accepted!</h2>
                    }

                    {props.offer.status === 'declined' &&
                        <h2 style={{margin: '-15px 0 20px'}}>Offer Declined!</h2>
                    }

                    {props.offer.status !== 'accepted' && props.offer.status !== 'declined' &&
                        <Fragment>
                            <div className={styles.head}>
                                {offerDocument &&
                                    <p>
                                        <a
                                            href={Uploads.getUploadFullUrl(offerDocument?.signed?.url || offerDocument?.original?.url)}
                                            target={'_new'}
                                            children={'View Full Offer'}
                                        />
                                    </p>
                                }
                                <p style={{margin: '-15px 0 10px'}}>
                                    <Button style={{width: '100%'}} onClick={acceptOffer}>Accept</Button>
                                </p>
                                <p style={{margin: '0'}}>
                                    <Button style={{width: '100%'}} onClick={rejectOffer} variant={ButtonVariant.Pink}>Reject</Button>
                                </p>
                            </div>
                            <form>
                                <hr/>
                                <h3>Counter Offer</h3>
                                <label>
                                    Price
                                    <CurrencyInput
                                        name={'counter-price'}
                                        placeholder={'$100,000'}
                                        value={amount}
                                        onChange={newValue => setAmount(newValue)}
                                    />
                                </label>
                                <label>
                                    Closing Date
                                    <br/>
                                    <DatePicker
                                        style={{width: '100%'}}
                                        selected={closingDate}
                                        onChange={date => setClosingDate(date)}
                                        minDate={Date.now()}
                                    />
                                </label>
                                <label>
                                    How should Closing Costs be Paid
                                    <Select
                                        options={[
                                            {value: 'Seller pays closing costs', label: 'Seller pays closing costs'},
                                            {value: 'Buyer pays closing costs', label: 'Buyer pays closing costs'},
                                            {value: 'Buyer and seller split closing costs', label: 'Buyer and seller split closing costs'},
                                        ]}
                                        onChange={selectedOption => setClosingCostsPaid(selectedOption.value)}
                                        value={closingCostsPaid}
                                    />
                                </label>
                                <label>
                                    Additional Details
                                    <textarea onChange={e => setNotes(e.target.value)} value={notes}/>
                                </label>
                                <Button onClick={counterOffer}>Counter</Button>

                                <hr/>

                                <div style={{fontSize: 15}}>
                                    <h3>Details</h3>
                                    <ul>
                                        <li>Closing costs: {activeCounterOffer ? activeCounterOffer.closingCostsPaid : props.offer.closingCostsPaid}</li>
                                        <li>Financing method: {props.offer.financingMethod}</li>
                                    </ul>
                                    {props.offer.itemsIncluded?.length > 0 &&
                                        <>
                                            <h4>Items Included</h4>
                                            <ul style={{marginTop: -15}}>
                                                {props.offer.itemsIncluded.map(item => <li key={item.body}>{item.body}</li>)}
                                            </ul>
                                        </>
                                    }
                                    {props.offer.includedInspections?.length > 0 &&
                                        <>
                                            <h4>Included Inspections</h4>
                                            <ul style={{marginTop: -15}}>
                                                {props.offer.includedInspections.map(item => <li key={item.body}>{item.body}</li>)}
                                            </ul>
                                        </>
                                    }
                                    {props.offer.otherNotes?.length > 0 &&
                                        <>
                                            <h4 style={{marginBottom: -10, paddingBottom: 0}}>Offeror Notes</h4>
                                            <p>{activeCounterOffer ? activeCounterOffer.notes : props.offer.otherNotes}</p>
                                        </>
                                    }
                                </div>
                            </form>
                        </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    )
};

OfferResponseForm.propTypes = {
    offer: PropTypes.object.isRequired,
    agent: PropTypes.object,
    onComplete: PropTypes.func,
    onAccept: PropTypes.func,
};

OfferResponseForm.defaultProps = {
    onComplete: () => {},
    onAccept: () => {},
};

export default OfferResponseForm;
