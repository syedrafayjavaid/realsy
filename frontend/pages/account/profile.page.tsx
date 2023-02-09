import * as React from 'react';
import UserProfile from 'api/user-profile';
import PreApprovalModal from "components/pre-approval-modal";
import {useAccountPageLayout} from "layout/account-page-layout";
import Colors from 'styles/colors';
import {useAuthContext} from "api/auth/auth-context";
import {Button, ButtonVariant} from "components/button";
import {AvailabilityFields} from "components/form-fields/availability-fields";
import {NotificationManager} from 'react-notifications';
import {FormEvent, useState} from "react";
import {Checkbox} from "components/form-fields/checkbox";
import {useRef} from "react";
import {formatCurrency} from "util/format-currency";
import cookies from 'js-cookie';
import {useEffect} from "react";
import Uploads from "api/uploads";
import {TextInput} from "components/form-fields/text-input";
import {PhoneInput} from "components/form-fields/phone-input";
import {useStyles} from './profile.page.styles';
import {useRouter} from "next/router";
import {Modal} from "components/modal";
import AvatarEditor from 'react-avatar-editor'
import Slider from 'react-input-slider';
import {dataURItoBlob} from "util/base64-to-binary";
import Head from "next/head";
import {AppInfo} from "app-info";
import {Breadcrumbs} from "layout/account-page-layout/breadcrumbs";
import {AppPage} from "pages/app-page.type";

/**
 * The user profile page
 */
const UserProfilePage: AppPage = (props) => {
    const styleClasses = useStyles();
    const router = useRouter();
    const isNewSignUp = router.query.newSignUp === 'true';
    const authContext = useAuthContext();
    const initialAvailability = {
        availableSundayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableSundayStart,
        availableSundayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableSundayEnd,
        availableMondayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableMondayStart,
        availableMondayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableMondayEnd,
        availableTuesdayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableTuesdayStart,
        availableTuesdayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableTuesdayEnd,
        availableWednesdayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableWednesdayStart,
        availableWednesdayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableWednesdayEnd,
        availableThursdayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableThursdayStart,
        availableThursdayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableThursdayEnd,
        availableFridayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableFridayStart,
        availableFridayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableFridayEnd,
        availableSaturdayStart: isNewSignUp ? '07:00:00' : authContext.currentUser?.availableSaturdayStart,
        availableSaturdayEnd: isNewSignUp ? '22:00:00' : authContext.currentUser?.availableSaturdayEnd,
    }
    const [name, setName] = useState<string>(authContext.currentUser?.name ?? '');
    const [phone, setPhone] = useState<string>(authContext.currentUser?.phone ?? '');
    const [isAgent, setIsAgent] = useState<boolean>(authContext.currentUser?.isAgent ?? false);
    const [contactText, setContactText] = useState<boolean>(authContext.currentUser?.contactText ?? false);
    const [contactPhone, setContactPhone] = useState<boolean>(authContext.currentUser?.contactPhone ?? false);
    const [contactEmail, setContactEmail] = useState<boolean>(authContext.currentUser?.contactEmail ?? false);
    const [availability, setAvailability] = useState<any>(initialAvailability);
    const [saving, setSaving] = useState<boolean>(false);
    const [showPreApprovalModal, setShowPreApprovalModal] = useState<boolean>(false);
    const [uploadedPhotoSrc, setUploadedPhotoSrc] = useState<File | undefined>(undefined);
    const [avatarZoom, setAvatarZoom] = useState<number>(1);
    const [avatarRotation, setAvatarRotation] = useState<number>(0);
    const avatarFormRef = useRef(null);
    const avatarEditorRef = useRef<AvatarEditor>(null);

    useEffect(() => {
        if (uploadedPhotoSrc) {
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (!validImageTypes.includes(uploadedPhotoSrc.type)) {
                setUploadedPhotoSrc(undefined);
                NotificationManager.warning('Invalid file type for new photo');
            }
        }
    }, [uploadedPhotoSrc]);

    /**
     * Handles new photo saved
     */
    async function photoSaved() {
        if (!avatarEditorRef.current) {
            return;
        }

        const dataBlob = dataURItoBlob(avatarEditorRef.current?.getImage().toDataURL());
        const newAvatarFile = new File([dataBlob], 'tmp');
        const uploadResult = await Uploads.uploadFile(authContext.apiToken, newAvatarFile);
        const updateProfileResult = await UserProfile.updateProfile(authContext.apiToken, {
            profilePhoto: uploadResult.upload.id
        });

        // refresh profile on client
        const profileResult = await UserProfile.getProfile();
        if (profileResult.success) {
            authContext.setProfile(profileResult.profile);
        }

        location.reload(); // to force refresh of profile photo in all components
    }

    /**
     * Submit handler
     */
    async function submit(e: FormEvent) {
        e.preventDefault();

        setSaving(true);
        const updateResult = await UserProfile.updateProfile(authContext.apiToken, {
            name, phone,
            isAgent,
            contactText, contactPhone, contactEmail,
            ...availability
        });
        if (updateResult.success) {
            NotificationManager.success('Profile saved!');
            authContext.setProfile(updateResult.profile);
            if (isNewSignUp) {
                await router.push('/account/dashboard');
            }
        }
        else {
            NotificationManager.error('Failed to save profile.', 'Error');
        }
        setSaving(false);
    }

    /**
     * Render
     */
    return <>
        <Head>
            <title>{AppInfo.name}: My Profile</title>
        </Head>

        <Breadcrumbs currentPageTitle={'My Profile'}/>

        {showPreApprovalModal &&
            <Modal
                onClose={() => setShowPreApprovalModal(false)}
            >
                <PreApprovalModal
                    onComplete={() => {
                        setShowPreApprovalModal(false);
                        location.reload(); // to force refresh of profile photo in all components
                    }}
                />,
            </Modal>
        }

        <div className={styleClasses.editProfileMain}>
            <div className={styleClasses.editProfileHeader}>
                <form ref={avatarFormRef}>
                    {uploadedPhotoSrc &&
                        <>
                            <AvatarEditor
                                ref={avatarEditorRef}
                                image={uploadedPhotoSrc}
                                width={190}
                                height={190}
                                border={0}
                                borderRadius={95}
                                color={[255, 255, 255, 0.7]}
                                scale={avatarZoom}
                                rotate={avatarRotation}
                            />
                            <Slider
                                axis="x"
                                x={avatarZoom}
                                onChange={({ x }) => setAvatarZoom(x)}
                                xmin={1}
                                xmax={3}
                                xstep={0.1}
                                styles={{
                                    active: {
                                        backgroundColor: Colors.mediumBlue,
                                    },
                                }}
                            />
                            <button
                                type={'button'}
                                onClick={() => setAvatarRotation(current => current - 90)}
                                children={'<'}
                                style={{
                                    backgroundColor: Colors.mediumBlue,
                                    color: '#fff',
                                    border: 'none',
                                    outline: 'none',
                                    marginRight: 10,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                }}
                            />
                            <button
                                type={'button'}
                                onClick={() => setAvatarRotation(current => current + 90)}
                                children={'>'}
                                style={{
                                    backgroundColor: Colors.mediumBlue,
                                    color: '#fff',
                                    border: 'none',
                                    outline: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                }}
                            />
                            <br/>
                            <button
                                type={'button'}
                                onClick={photoSaved}
                                children={'Save'}
                                style={{
                                    backgroundColor: Colors.pink,
                                    color: '#fff',
                                    border: 'none',
                                    outline: 'none',
                                    marginTop: 10,
                                    padding: '8px 25px',
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                }}
                            />
                        </>
                    }
                    {!uploadedPhotoSrc &&
                        <label className={styleClasses.editPhotoLabel}>
                            <div
                                style={{backgroundImage: ` url('${Uploads.getUserProfilePhotoUrl(authContext.currentUser?.id, {format: 'small'})}')`}}/>
                            <br/>
                            Edit Photo
                            <input
                                name='files'
                                type={'file'}
                                id={'profile-photo-input'}
                                style={{display: 'none'}}
                                onChange={e => setUploadedPhotoSrc(e.target.files?.[0])}
                            />
                            <input name='ref' type={'hidden'} value={'user'}/>
                            <input name='refId' type={'hidden'} value={authContext.currentUser?.id}/>
                            <input name='field' type={'hidden'} value={'profilePhoto'}/>
                            <input name='source' type='hidden' value='users-permissions'/>
                        </label>
                    }
                </form>
                <div className={styleClasses.desktopPreApproval}>
                    {!authContext.currentUser?.preApprovedAmount &&
                        <>
                            <h3>Not Yet Pre Approved?</h3>
                            <p>To place offers on listings you would like to purchase you must be pre approved</p>
                            <p>
                                <Button
                                    children={'Get Pre Approved'}
                                    onClick={() => setShowPreApprovalModal(true)}
                                    variant={ButtonVariant.Pink}
                                />
                            </p>
                        </>
                    }
                    {authContext.currentUser?.preApprovedAmount &&
                        <>
                            <p style={{marginTop: 40}}>Pre Approved for</p>
                            <h2 style={{marginTop: -30}}>{formatCurrency(authContext.currentUser?.preApprovedAmount, {omitDecimal: true})}</h2>
                            <p><a onClick={() => setShowPreApprovalModal(true)} style={{cursor: 'pointer', textDecoration: 'underline', color: Colors.mediumBlue}}>Edit</a></p>
                        </>
                    }
                </div>
            </div>
            <form onSubmit={submit}>
                <TextInput
                    name={'name'}
                    label={'Name'}
                    value={name}
                    onChange={newValue => setName(newValue)}
                />
                <TextInput
                    label={'Email'}
                    value={authContext.currentUser?.email}
                    disabled={true}
                />
                <PhoneInput
                    name={'phone'}
                    label={'Phone'}
                    required={contactPhone || contactText}
                    value={phone}
                    onChange={newValue => setPhone(newValue)}
                />

                <div style={{margin: '10px 0'}}>
                    <Checkbox
                        label={"I'm an agent"}
                        onChange={checked => setIsAgent(checked)}
                        checked={isAgent}
                    />
                </div>

                <h4>Preferred Contact Method</h4>
                <div style={{lineHeight: '2em'}}>
                <Checkbox label={'Text Message'} checked={contactText} onChange={checked => setContactText(checked)} />
                <br/>
                <Checkbox label={'Phone'} checked={contactPhone} onChange={checked => setContactPhone(checked)} />
                <br/>
                <Checkbox label={'Email'} checked={contactEmail} onChange={checked => setContactEmail(checked)} />
                </div>

                <hr style={{margin: '20px 0'}}/>

                <h4>Your Availability</h4>
                <AvailabilityFields
                    initialAvailability={availability}
                    onChange={newAvailability => {setAvailability(newAvailability)}}
                />

                <br/>
                <Button loading={saving}>Save</Button>
            </form>

            <div className={styleClasses.mobilePreApproval}>
                {!authContext.currentUser?.preApprovedAmount &&
                <>
                    <h3>Not Yet Pre Approved?</h3>
                    <p>To place offers on listings you would like to purchase you must be pre approved</p>
                    <p>
                        <Button
                            type={'button'}
                            children={'Get Pre Approved'}
                            onClick={() => setShowPreApprovalModal(true)}
                            variant={ButtonVariant.Pink}
                        />
                    </p>
                </>
                }
                {authContext.currentUser?.preApprovedAmount &&
                <>
                    <p style={{marginTop: 40}}>Pre Approved for</p>
                    <h2 style={{marginTop: -30}}>{formatCurrency(authContext.currentUser?.preApprovedAmount, {omitDecimal: true})}</h2>
                    <p><a onClick={() => setShowPreApprovalModal(true)} style={{cursor: 'pointer', textDecoration: 'underline', color: Colors.mediumBlue}}>Edit</a></p>
                </>
                }
            </div>
        </div>
    </>;
};

UserProfilePage.defaultLayout = useAccountPageLayout;
UserProfilePage.requiresAuth = true;

export default UserProfilePage;
