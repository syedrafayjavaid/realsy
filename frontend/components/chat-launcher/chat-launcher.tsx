import React, {FC} from 'react';
import {useChatLauncherStyles} from "./chat-launcher.styles";

/**
 * The "chat with us" launcher button
 */

export type ChatLauncherProps = {
    promptText: string
}

export const ChatLauncher: FC<ChatLauncherProps> = ({
    promptText = 'Chat with Us!',
}) => {
    const classes = useChatLauncherStyles();
    return (
        <a id={'chat-launcher'} className={`${classes.chatLauncher} chat-launcher`}>
            <img src={'/icon-chat.svg'} /> <span>{promptText}</span>
        </a>
    );
};
