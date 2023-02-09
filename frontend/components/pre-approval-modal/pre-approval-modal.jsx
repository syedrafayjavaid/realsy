import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'components/button';
import {CurrencyInput} from "components/form-fields/currency-input";
import UserProfile from "api/user-profile";
import {useAuthContext} from "api/auth/auth-context";
import {NotificationManager} from "react-notifications";
import {FileInput} from "components/form-fields/file-input";
import {usePreApprovalModalStyles} from './pre-approval-modal.styles';
import {RadioButtonGroup} from 'components/form-fields/radio-button-group';
import Select from "components/form-fields/select";
import Documents from "api/documents";
import Colors from "styles/colors";

/**
 * The modal form for a user to upload their pre-approval
 */
const PreApprovalModal = props => {
    const authContext = useAuthContext();
    const styleClasses = usePreApprovalModalStyles();
    const [submitting, setSubmitting] = useState(false);
    const [daysLookingToBuy, setDaysLookingToBuy] = useState('30');
    const [alsoSellingAHome, setAlsoSellingAHome] = useState('1');
    const [preApproved, setPreApproved] = useState('1');
    const [preApprovedAmount, setPreApprovedAmount] = useState(0.00);
    const [alreadyFoundHome, setAlreadyFoundHome] = useState('1');
    const [uploadedFile, setUploadedFile] = useState(null);

    /**
     * Submit handler
     */
    async function submit(e) {
        e.preventDefault();
        setSubmitting(true);

        if (uploadedFile) {
            await Documents.createDocument(authContext.apiToken, {
                file: uploadedFile,
                name: 'Pre-Approval Letter'
            });
        }

        const updateResult = await UserProfile.updateProfile(authContext.apiToken, {
            daysLookingToBuy: parseInt(daysLookingToBuy),
            alsoSellingAHome,
            preApprovedAmount: preApproved === '1' ? preApprovedAmount : 0,
            alreadyFoundHome
        });

        setSubmitting(false);
        if (updateResult.success) {
            NotificationManager.success('Pre-approval submitted!');
            props.onComplete();
        }
        else {
            NotificationManager.error('Failed saving pre-approval', 'Error');
        }
    }

    /**
     * Render
     */
    return <div className={styleClasses.preApprovalModal}>
        <h2>Pre Approval</h2>
        <form onSubmit={submit}>
            <Select
                label={'When are you looking to buy?'}
                options={[
                    {value: '30', label: 'Within 30 days'},
                    {value: '180', label: 'Within the next 6 months'},
                    {value: '365', label: 'Within the year'},
                    {value: '-1', label: 'Not sure'},
                ]}
                value={daysLookingToBuy}
                onChange={(selected) => setDaysLookingToBuy(selected.value)}
            />
            <br/>
            <RadioButtonGroup
                name={'alsoSelling'}
                label={'Also selling a home?'}
                options={[
                    {value: '1', label: 'Yes'},
                    {value: '0', label: 'No'},
                ]}
                onChange={(newValue) => {setAlsoSellingAHome(newValue)}}
                value={alsoSellingAHome}
                inlineOptions={true}
                buttonBackgroundColor={Colors.offWhite}
            />
            <RadioButtonGroup
                name={'preApproved'}
                label={'Are you pre-qualified for a loan?'}
                options={[
                    {value: '1', label: 'Yes'},
                    {value: '0', label: 'No'},
                ]}
                onChange={(newValue) => {setPreApproved(newValue)}}
                value={preApproved}
                inlineOptions={true}
                buttonBackgroundColor={Colors.offWhite}
            />
            <div className={`pre-approval-amount ${preApproved === '0' ? 'hidden' : ''}`}>
                <div style={{marginBottom: 20}}>
                    <CurrencyInput
                        label={'Amount pre-approved'}
                        placeholder={'$100,000'}
                        onChange={newValue => setPreApprovedAmount(newValue)}
                        value={preApprovedAmount}
                    />
                </div>
                <div style={{marginBottom: 20}}>
                    <FileInput
                        value={uploadedFile}
                        onChange={newFiles => setUploadedFile(newFiles[0])}
                        label={'Upload pre-approval letter'}
                    />
                </div>
            </div>
            <RadioButtonGroup
                name={'alreadyFoundHome'}
                label={'Already found your home?'}
                options={[
                    {value: '1', label: 'Yes'},
                    {value: '0', label: 'No'}
                ]}
                onChange={(newValue) => setAlreadyFoundHome(newValue)}
                value={alreadyFoundHome}
                inlineOptions={true}
                buttonBackgroundColor={Colors.offWhite}
            />
            <br/>
            <Button loading={submitting}>Finish</Button>
        </form>
    </div>
};

/**
 * Props
 */
PreApprovalModal.propTypes = {
    onComplete: PropTypes.func
};

PreApprovalModal.defaultProps = {
    onComplete: () => {}
};

export default PreApprovalModal
