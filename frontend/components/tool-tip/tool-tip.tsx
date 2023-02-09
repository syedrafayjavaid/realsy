import React, {FC} from 'react';
import {Tooltip as LibToolTip} from 'react-tippy';

/**
 * A tool tip icon that opens a popup
 */

export type ToolTipProps = {
    iconAlt?: string,
    htmlContent: string,
}

export const ToolTip: FC<ToolTipProps> = ({
    iconAlt = 'More info',
    htmlContent,
}) => {
    return (
        <>
            <span style={{marginLeft: 5}}>
                <LibToolTip
                    title={htmlContent}
                    position="bottom"
                    trigger="click"
                    theme='light'
                    popperOptions={{
                        modifiers: {
                            addZIndex: {
                                enabled: true,
                                order: 810,
                                fn: (data: any) => ({
                                    ...data,
                                    styles: {
                                        ...data.styles,
                                        zIndex: 999999999,
                                    },
                                })
                            }
                        }
                    }}
                >
                    <img
                        alt={iconAlt}
                        src={'/icon-info.svg'}
                        style={{cursor: 'pointer'}}
                    />
                </LibToolTip>
            </span>
        </>
    );
};
