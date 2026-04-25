import { useContext, useState } from 'react';
import ChatHighlight from '../../../utilities/context/ChatHighlight';
import ChatsModal from '../../../utilities/context/ChatsModal';
import IsMobile from '../../../utilities/context/IsMobile';

import { useDisclosure } from '@mantine/hooks';

import useChatScroll from '../../../utilities/hooks/useChatScroll';

import { Modal } from '@mantine/core';

import ChatPanelHeader from '../panel/ChatPanelHeader';
import ChatPanelMain from '../panel/ChatPanelMain';
import ChatPanelInput from '../panel/ChatPanelInput';

import { ChevronDown } from 'lucide-react';

import './stylesheets/ChatModal.css';

export default function ChatModal() {
    const { closeModal } = useContext(ChatsModal);
    const { currentlyMobile } = useContext(IsMobile);

    const [inputHeight, setInputHeight] = useState(0);

    const scrollThreshold = currentlyMobile ? 150 : 200;

    const {
        scrollRef,
        showScrollButton,
        scrollToBottom,
        preserveScrollOnChange,
    } = useChatScroll(scrollThreshold);

    const [opened, { close }] = useDisclosure(true);

    const handleClose = () => {
        closeModal();
        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            fullScreen={true}
            withCloseButton={false}
            closeOnEscape={false}
            classNames={{
                root: 'chat-modal-root',
                inner: 'chat-modal-inner',
                content: 'chat-modal-content',
                header: 'chat-modal-header',
                overlay: 'chat-modal-overlay',
                title: 'chat-modal-title',
                body: 'chat-modal-body',
                close: 'chat-modal-close',
            }}
        >
            <ChatPanelHeader onClose={handleClose} isModal={true} />
            <ChatPanelMain
                preserveScrollOnChange={preserveScrollOnChange}
                scrollRef={scrollRef}
            />
            <ChatPanelInput
                setInputHeight={setInputHeight}
                preserveScrollOnChange={preserveScrollOnChange}
            />
            {showScrollButton && (
                <button
                    className='scroll-to-bottom'
                    style={{ '--input-offset': `${inputHeight}px` }}
                    onClick={scrollToBottom}
                >
                    <ChevronDown strokeWidth={1.5} />
                </button>
            )}
        </Modal>
    );
}
