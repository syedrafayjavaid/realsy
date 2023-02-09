import React from 'react';
import PropTypes from 'prop-types';
import {Lottie} from '@alfonmga/react-lottie-light-ts';
import confettiAnimation from './confetti-animation';

/**
 * Overlays a confetti animation on the window
 */
const Confetti = (props) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999999999,
                background: 'rgba(0, 0, 0, 0.4)',
            }}
        >
            <Lottie
                config={{
                    animationData: confettiAnimation,
                    loop: false,
                    autoplay: true,
                    rendererSettings: {preserveAspectRatio: 'xMidYMid slice'}
                }}
                isStopped={false}
                isPaused={false}
                width={'100%'}
                height={'100%'}
                lottieEventListeners={[{name: 'complete', callback: props.onComplete}]}
            />
        </div>
    );
};

Confetti.propTypes = {
    onComplete: PropTypes.func
};

Confetti.defaultProps = {
    onComplete: () => {}
};

export default Confetti;
