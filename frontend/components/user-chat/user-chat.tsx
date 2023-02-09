import React, {useEffect, useState, useRef, FC, FormEvent} from 'react';
import {Button} from 'components/button';
import Chat from "api/chat";
import {useAuthContext} from "api/auth/auth-context";
import {Fade} from "react-awesome-reveal";
import Uploads from "api/uploads";
import {useUserChatStyles} from "components/user-chat/user-chat.styles";
import {useNotificationsContext} from "contexts/notifications-context";
import {UserChatDto} from "api/chat/user-chat.dto";
import {UserDto} from "api/auth/user.dto";
import {ChatMessageDto} from "api/chat/chat-message.dto";

/**
 * A chat between users
 */

export type UserChatProps = {
    otherUserId?: number,
    listingId?: number,
    chatId?: number,
    showChattingWith?: boolean,
};

export const UserChat: FC<UserChatProps> = ({
    otherUserId,
    listingId,
    chatId,
    showChattingWith = false,
}) => {
    const styleClasses = useUserChatStyles();
    const authContext = useAuthContext();
    const notificationsContext = useNotificationsContext();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<UserChatDto | null>(null);
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);
    const [otherUser, setOtherUser] = useState<UserDto | null>(null);

    /**
     * Checks for new messages on the current chat
     */
    const checkNewMessages = async () => {
        if (!chatId) {
            Chat.findChat(authContext.apiToken, otherUserId, listingId).then(chatResult => {
                setChat(chatResult.chat);
                setMessages(chatResult.chat?.messages || []);
                scrollToBottom();
            });
        }
        else {
            Chat.findChatById(authContext.apiToken, chatId).then(chatResult => {
                setChat(chatResult.chat);
                setMessages(chatResult.chat?.messages || []);
                scrollToBottom();
            });
        }
    }

    /**
     * On chat loaded
     */
    useEffect(() => {
        if (chat) {
            setOtherUser(chat.users.filter(user => user.id !== authContext.currentUser?.id)?.[0]);
            notificationsContext.clearNotificationsForContent('chat', chat.key);
        }
    }, [chat]);

    /**
     * Fetches (and scheduled recurring fetches of) the chat when the props are set/changed
     */
    useEffect(() => {
        checkNewMessages()
        const handle = setInterval(() => checkNewMessages(), 5000);

        return () => clearInterval(handle);
    }, [chatId, otherUserId]);

    /**
     * Scrolls to bottom
     */
    function scrollToBottom() {
        if (!messagesContainerRef.current) return;
        messagesContainerRef.current.scrollTop = messagesContainerRef.current?.scrollHeight || 0;
    }

    /**
     * Handles a new message
     */
    async function newMessageSubmit(e: FormEvent) {
        e.preventDefault();
        if (newMessage === '') { return }

        setSending(true);
        const sendResult = await Chat.sendMessage(authContext.apiToken, {
            otherUserId: otherUserId,
            chatId: chatId,
            listingId: listingId,
            messageBody: newMessage
        });
        setMessages(sendResult.chat.messages);
        setNewMessage('');
        scrollToBottom();
        setSending(false);
    }

    /**
     * Render
     */
    return <>
        {showChattingWith &&
            <p style={{color: '#ccc', fontSize: '13px', marginBottom: 0}}>Chatting with {otherUser?.name || otherUser?.email}</p>
        }

        <div className={styleClasses.container}>
            <div className={styleClasses.messagesBody} ref={messagesContainerRef}>
                {messages?.length === 0 &&
                <p style={{marginTop: 30, marginLeft: 20, color: '#ccc'}}>Send the first message!</p>
                }
                {messages?.map((message, index) => {
                    const marginTop = index === 0 ? 20 : 0;

                    if (message.user?.id === authContext.currentUser?.id) {
                        // message from current user
                        return (
                            <Fade triggerOnce={true} direction={'up'} key={message.id}>
                                    <div className={styleClasses.chatMessage} style={{marginTop}}>
                                    <p className={styleClasses.messageBody}>
                                        <span className={styleClasses.timestamp}>
                                            {new Date(message.datetimeSent).toLocaleString()}
                                        </span>
                                        <span data-testid={'own-chat-message-body'}>
                                            {message.body}
                                        </span>
                                    </p>
                                    <div
                                        className={styleClasses.userImage}
                                        style={{backgroundImage: `url('${Uploads.getUserProfilePhotoUrl(authContext.currentUser?.id)}')`}}
                                    />
                                </div>
                            </Fade>
                        );
                    }
                    else {
                        // message from other user
                        return (
                            <Fade triggerOnce={true} direction={'up'} key={message.id}>
                                <div className={`${styleClasses.chatMessage} received`} style={{marginTop}}>
                                    <div className={styleClasses.userImage}
                                         style={{backgroundImage: `url('${Uploads.getUserProfilePhotoUrl(message.user?.id)}')`}}
                                    />
                                    <p className={styleClasses.messageBody}>
                                        <span className={styleClasses.timestamp}>
                                            {new Date(message.datetimeSent).toLocaleString()}
                                        </span>
                                        <span data-testid={'other-chat-message-body'}>
                                            {message.body}
                                        </span>
                                    </p>
                                </div>
                            </Fade>
                        );
                    }
                })}
            </div>

            <form onSubmit={newMessageSubmit} className={styleClasses.inputForm}>
                <textarea
                    onChange={e => {
                        e.preventDefault();
                        if (e.target.value.indexOf("\n") !== -1) {
                            // submit if enter was pressed
                            e.target?.form?.dispatchEvent(new Event("submit", {cancelable: true}));
                        }
                        else {
                            setNewMessage(e.target.value);
                        }
                    }}
                    placeholder={'Your message'}
                    value={newMessage}
                />
                <p>
                    <Button loading={sending} type={'submit'}>Send</Button>
                </p>
            </form>
        </div>
    </>;
};
