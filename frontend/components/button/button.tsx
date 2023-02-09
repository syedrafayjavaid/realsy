import React, {FC} from 'react';
import Link from 'next/link';
import {Loader} from "components/loader";
import {useButtonStyles} from './button.styles';
import {ButtonVariant} from "./button-variants.enum";

/**
 * A button which can also serve as a "button-styled" link if an href property is provided
 */
export type ButtonProps = {
    variant?: ButtonVariant,
    href?: string,
    onClick?: () => any,
    className?: string,
    loading?: boolean,
    loaderDelay?: number,
    loaderColor?: string,
    padding?: string,
    type?: string,
    role?: string,
    target?: string,
    'data-testid'?: string,
    style?: any,
};

const defaultProps: ButtonProps = {
    variant: ButtonVariant.Blue,
    loaderColor: '#fff',
    loading: false,
    onClick: () => {},
    padding: '14px 42px',
    style: {},
};

export const Button: FC<ButtonProps> = (props) => {
    const classes = useButtonStyles(props);

    let styleClass = classes.buttonBlue;
    if (props.variant === ButtonVariant.Yellow) {
        styleClass = classes.buttonYellow;
    }
    else if (props.variant === ButtonVariant.Pink) {
        styleClass = classes.buttonPink;
    }
    else if (props.variant === ButtonVariant.White) {
        styleClass = classes.buttonWhite;
    }

    let {onClick, href, children, className, loaderColor, loading, target} = props;
    if (className === undefined) className = '';

    const linkIsExternal = (props.href?.indexOf('http') ?? -1) > -1;

    // determine to use button or anchor based on href prop
    const WrapperElement = (href && !linkIsExternal) ? Link : React.Fragment;
    const InnerElement = href ? 'a' : 'button';
    const wrapperProps: any = {};
    const innerProps: any = {};
    if (href) {
        if (linkIsExternal) {
            innerProps.href = href;
        }
        else {
            wrapperProps.href = href;
        }
        innerProps.target = target;
    }
    else {
        innerProps.type = props.type;
        innerProps.disabled = loading;
    }

    return (
        <WrapperElement {...wrapperProps}>
            <InnerElement
                {...innerProps}
                onClick={onClick}
                className={`${styleClass} ${className}`}
                role={props.role}
                style={{
                    padding: props.padding,
                    ...props.style,
                }}
                data-testid={props['data-testid']}
            >
                {loading &&
                    <Loader
                        delay={props.loaderDelay}
                        size={15}
                        className={classes.loader}
                        color={loaderColor}
                        role={'status'}
                    />
                }

                {children}
            </InnerElement>
        </WrapperElement>
    );
};

Button.defaultProps = defaultProps;
