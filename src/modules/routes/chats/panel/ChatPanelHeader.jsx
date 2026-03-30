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

export default function ChatPanelHeader({
    recipientName = null,
    onClose,
    isModal = false,
}) {
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
                <ChatActionMenu
                    populated={!!recipientName}
                    onClose={onClose}
                    isModal={isModal}
                />
            </div>
        </div>
    );
}
