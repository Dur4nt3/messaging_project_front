import { useContext } from 'react';
import ChatHighlight from '../../../utilities/context/ChatHighlight';

import ChatActionMenu from './ChatActionMenu';
import DotsLoader from '../../../utilities/miscComponents/DotsLoader';

import getUserInitials from '../../../utilities/formatters/getUserInitials';

import './stylesheets/ChatPanelHeader.css';

function RecipientData({ recipientName }) {
    if (!recipientName) {
        return (
            <>
                <span className='recipient-avatar'>-</span>
                {recipientName !== false && (
                    <div className='recipient-name'>
                        <DotsLoader />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <span className='recipient-avatar'>
                {getUserInitials(recipientName)}
            </span>
            <div className='recipient-name'>{recipientName}</div>
        </>
    );
}

export default function ChatPanelHeader({ onClose = null, isModal = false }) {
    const { currentChatData } = useContext(ChatHighlight);

    const recipientName = currentChatData?.name;

    return (
        <div
            className={
                recipientName
                    ? 'chat-panel-header'
                    : 'chat-panel-header loading-data'
            }
        >
            <div className='header-left'>
                <RecipientData recipientName={recipientName} />
            </div>
            <div className='header-right'>
                <ChatActionMenu onClose={onClose} isModal={isModal} />
            </div>
        </div>
    );
}
