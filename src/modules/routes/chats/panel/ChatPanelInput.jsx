import { useContext, useEffect, useState, useRef } from 'react';
import { useFetcher } from 'react-router';

import { Textarea } from '@mantine/core';

import { notifications } from '@mantine/notifications';

import ChatsModal from '../../../utilities/context/ChatsModal';

import FormLoader from '../../../utilities/miscComponents/FormLoader';
import errorNotificationProps from '../../../utilities/miscComponents/errorNotificationProps';

import { SendHorizontal } from 'lucide-react';

import './stylesheets/ChatPanelInput.css';

// If this isn't rendered within a modal
// Ensure to supply the message data
export default function ChatPanelInput({
    loaded,
    setInputHeight,
    preserveScrollOnChange,
    data = null,
}) {
    const { currentChatModal, runRefresher } = useContext(ChatsModal);
    const fetcher = useFetcher();

    const [messageInput, setMessageInput] = useState('');

    const inputRef = useRef();

    const messages = data ? data?.messages : currentChatModal?.data?.messages;
    const chatId = messages?.[0]?.chatId;

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success === true) {
            const lastMessageId = messages
                ? messages[messages.length - 1]?.messageId
                : null;

            setMessageInput('');
            preserveScrollOnChange();
            runRefresher(chatId, lastMessageId);
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
                className={
                    loaded ? 'chat-panel-input loaded' : 'chat-panel-input'
                }
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
                    autosize
                    maxRows={5}
                    disabled={!loaded}
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
                    disabled={!loaded || fetcher.state !== 'idle'}
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
