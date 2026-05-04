import { useContext, useEffect, useState, useRef } from 'react';
import ChatHighlight from '../../../utilities/context/ChatHighlight';

import { useFetcher } from 'react-router';

import { Textarea } from '@mantine/core';

import { notifications } from '@mantine/notifications';

import ChatsModal from '../../../utilities/context/ChatsModal';

import FormLoader from '../../../utilities/miscComponents/FormLoader';
import errorNotificationProps from '../../../utilities/miscComponents/errorNotificationProps';

import { SendHorizontal } from 'lucide-react';

import './stylesheets/ChatPanelInput.css';

function determineFormClassname(loaded, friends) {
    if (!loaded && !friends) {
        return 'chat-panel-input';
    }

    if (loaded && !friends) {
        return 'chat-panel-input not-friends';
    }

    return 'chat-panel-input loaded';
}

// If this isn't rendered within a modal
// Ensure to supply the message data
export default function ChatPanelInput({
    setInputHeight,
    preserveScrollOnChange,
    testEnv
}) {
    const { currentChatData } = useContext(ChatHighlight);
    const { currentChatModal, runRefresher } = useContext(ChatsModal);

    const fetcher = useFetcher();

    const [messageInput, setMessageInput] = useState('');

    const inputRef = useRef();

    const loaded = !!currentChatData;

    const messages = currentChatData
        ? currentChatData?.messages
        : currentChatModal?.data?.messages;

    const chatId = currentChatData?.chatId;

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success === true) {
            const lastMessageId = messages
                ? messages[messages.length - 1]?.messageId
                : null;
            const firstMessageId = messages ? messages[0]?.messageId : null;

            setMessageInput('');
            preserveScrollOnChange();
            runRefresher(chatId, lastMessageId, null, firstMessageId);
        } else if (fetcher.state === 'idle' && fetcher.data?.errors) {
            notifications.clean();
            notifications.show(
                errorNotificationProps(
                    'Failed to send message',
                    fetcher.data.errors
                )
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.state, fetcher.data]);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        const observer = new ResizeObserver(() => {
            setInputHeight(inputRef.current.offsetHeight);
        });

        observer.observe(inputRef.current);

        return () => observer.disconnect();
    }, [setInputHeight]);

    return (
        <>
            <fetcher.Form
                className={determineFormClassname(
                    loaded,
                    currentChatData?.friends
                )}
                action={
                    loaded && chatId ? `/send-message/${chatId}` : '/no-action'
                }
                method='POST'
                ref={inputRef}
            >
                <Textarea
                    value={messageInput}
                    onChange={(event) =>
                        setMessageInput(event.currentTarget.value)
                    }
                    aria-label='Send a message'
                    autosize={!testEnv}
                    maxRows={5}
                    disabled={!loaded || !currentChatData.friends}
                    tabIndex={loaded ? 0 : -1}
                    name='message'
                    id='message'
                    classNames={{
                        wrapper: 'message-input-wrapper',
                        input: 'message-input-inner',
                        root: 'message-input-root',
                    }}
                />

                <button
                    type='submit'
                    disabled={
                        !loaded ||
                        fetcher.state !== 'idle' ||
                        !currentChatData.friends
                    }
                    className='send-message-button'
                >
                    {fetcher.state === 'idle' ? (
                        <SendHorizontal strokeWidth={1.5} />
                    ) : (
                        <FormLoader size={20} color='#03110f' />
                    )}
                </button>
            </fetcher.Form>
        </>
    );
}
