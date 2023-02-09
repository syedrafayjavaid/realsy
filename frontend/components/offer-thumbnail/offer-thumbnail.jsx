import React from 'react';
import PropTypes from 'prop-types';
import {formatCurrency} from "util/format-currency";
import {Button, ButtonVariant} from "components/button";
import Colors from "styles/colors";
import Uploads from "api/uploads";
import {useOfferThumbnailStyles} from "./offer-thumbnail.styles";

const OfferThumbnail = props => {
    const styleClasses = useOfferThumbnailStyles(props);

    const offer = props.offer;
    const offeror = props.offer.offeror;
    const offerorPhoto = Uploads.getUserProfilePhotoUrl(offeror.id, 'small');
    const activeCounterOffer = props.offer.counterOffers?.length > 0
        ? props.offer.counterOffers?.[props.offer.counterOffers.length - 1]
        : null;

    return (
        <div className={`${styleClasses.container} ${props.color} ${offer.status}`}>
            {props.showStatus &&
                <p className={styleClasses.status} data-testid={'offer-status'}>
                    {offer.status.replace('pending_lister', 'pending').replace('pending_realsy', 'reviewing')}
                </p>
            }
            <div className={styleClasses.bodyWrapper}>
                <div className={styleClasses.userImage} style={{backgroundImage: `url('${offerorPhoto}')`}}/>
                <div className={styleClasses.mainBody}>
                    <p className={styleClasses.date}>{new Date(offer.created_at).toLocaleDateString()}</p>
                    <p className={styleClasses.amount}>{formatCurrency(offer.amount, {omitDecimal: true})}</p>
                    <p className={styleClasses.date} style={{marginTop: -25}}>Closing on
                        <span style={{color: Colors.lightBlue, fontWeight: 'bold'}}> {new Date(offer.desiredClosingDate).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>
            <footer className={styleClasses.footer}>
                <span>{offeror?.name || offeror?.email}</span>
                {props.showDetailsButton && offer.status === 'pending_lister' &&
                    <Button
                        children={'See Details'}
                        className={styleClasses.button}
                        padding={'5px'}
                        variant={ButtonVariant.White}
                        onClick={props.onClick}
                    />
                }
            </footer>
        </div>
    );
};

OfferThumbnail.propTypes = {
    offer: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['white', 'blue']),
    showStatus: PropTypes.bool.isRequired,
    showDetailsButton: PropTypes.bool.isRequired
};

OfferThumbnail.defaultProps = {
    showStatus: true,
    showDetailsButton: true
};

export default OfferThumbnail;
