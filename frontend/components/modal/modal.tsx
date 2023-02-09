import React, {FC, useEffect} from "react";
import {useModalStyles} from './modal.styles';
import ReactModal from 'react-modal';
import CloseIcon from 'components/icons/close';
import {disableMainBodyScroll, enableMainBodyScroll} from "util/disable-main-body-scroll";

/**
 * A modal window with translucent backdrop
 */

export type ModalProps = {
    onClose?: () => any,
    overlayStyles?: any,
    containerStyles?: any,
    overlayClassName?: string,
    containerClassName?: string,
    fullScreenBreakpoint?: string, // allows fullscreen modals at smaller resolutions
};

const defaultProps: Partial<ModalProps> = {
    overlayStyles: {},
    containerStyles: {},
    fullScreenBreakpoint: '0px', // by default modal will never show fullscreen
}

export const Modal: FC<ModalProps> = (props) => {
    const styleClasses = useModalStyles(props);

    useEffect(() => {
        const onKeyPressed = (e: KeyboardEvent) => e.key === 'Escape' ? props.onClose?.() : {}; // closes on "esc" pressed

        document.addEventListener('keydown', onKeyPressed);
        disableMainBodyScroll();

        return function onUnmount() {
            document.removeEventListener('keydown', onKeyPressed);
            enableMainBodyScroll();
            props.onClose?.();
        };
    }, []);

    return <>
        <ReactModal
            isOpen={true}
            onRequestClose={props.onClose}
            className={[
                styleClasses.modal,
                props.containerClassName,
            ].join(' ')}
            overlayClassName={[
                styleClasses.modalOverlay,
                props.overlayClassName,
            ].join(' ')}
            style={{
                content: {...props.containerStyles},
                overlay: {...props.overlayStyles},
            }}
        >
            <div className={styleClasses.modalContent}>
                <button
                    className={styleClasses.closeButton}
                    onClick={props.onClose}
                    children={<CloseIcon/>}
                />
                {props.children}
            </div>
        </ReactModal>
    </>;
};

Modal.defaultProps = defaultProps;
