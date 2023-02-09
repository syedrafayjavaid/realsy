import React, {FC, useEffect, useState} from 'react';
import Colors from "styles/colors";

/**
 * A spinner to show loading state, with optional label and delay
 */
export type LoaderProps = {
    color?: string,
    className?: string,
    style?: object,
    label?: string,
    size?: number,
    role?: string,

    /** Will wait for delay before spinner is shown (to avoid flicker on fast loads) */
    delay?: number,
}

export const Loader: FC<LoaderProps> = props => {
    const [delayMet, setDelayMet] = useState((props.delay ?? 250) < 1);

    // start delay timer to only show loader after the set delay
    useEffect(() => {
        const timeoutHandle = setTimeout(() => setDelayMet(true), props.delay);
        // unset the timeout if loader is unmounted before timeout
        return () => clearTimeout(timeoutHandle);
    }, []);

    if (!delayMet) {
        return <></>;
    }

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                role={props.role}
                aria-busy={true}
                aria-live={'polite'}
                viewBox="0 0 38 38"
                className={props.className}
                style={{
                    width: props.size,
                    height: props.size,
                    stroke: props.color,
                    ...props.style,
                }}
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="2">
                        <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="0.7s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </g>
            </svg>

            {props.label &&
                <p
                    children={props.label}
                    style={{
                        textAlign: 'center',
                        color: '#999',
                        fontSize: 13
                    }}
                />
            }
        </>
    );
};

const defaultProps: LoaderProps = {
    color: Colors.lightGray,
    className: '',
    style: {},
    delay: 250,
    size: 50,
    role: 'status'
};
Loader.defaultProps = defaultProps;
