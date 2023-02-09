import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import HeartIcon from "components/icons/heart";
import {useAuthContext} from "api/auth/auth-context";
import {useFavoriteButtonStyles} from "./favorite-button.styles";
import {Loader} from "components/loader";

/**
 * A button to favorite or un-favorite a listing
 */
const FavoriteButton = props => {
    const authContext = useAuthContext();
    const styleClasses = useFavoriteButtonStyles();
    const [disabled, setDisabled] = useState(true);
    const [favorited, setFavorited] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Loads current favorite status on init
     */
    useEffect(() => {
        if (authContext.isSignedIn) {
            const isFavorited = authContext.checkListingFavorited(props.listingId);
            setFavorited(isFavorited);
            setDisabled(false);
        }
    }, []);

    /**
     * Render
     */
    if (authContext.isSignedIn) {
        return (
            <button
                data-testid={'favorite-button'}
                onClick={async (e) => {
                    e.preventDefault();
                    if (authContext.isSignedIn) {
                        setIsSaving(true);
                        await authContext.setListingFavorited(props.listingId, !favorited);
                        setFavorited(!favorited);
                        setIsSaving(false);
                    }
                }}
                disabled={disabled}
                className={`${styleClasses.button} ${favorited ? 'active' : 'inactive'}`}
            >
                {isSaving
                    ? <Loader color={'#ccc'} size={18} style={{marginTop: 3}}/>
                    : <HeartIcon/>
                }
            </button>
        );
    }
    else {
        return <></>;
    }
};

/**
 * Prop types
 */
FavoriteButton.propTypes = {
    listingId: PropTypes.number.isRequired
};

export default FavoriteButton;
