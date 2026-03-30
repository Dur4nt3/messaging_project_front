import { formatDateExtended } from '../../../utilities/formatters/formatDate';

import './stylesheets/ChatPanelMainMessages.css';

function MessageCont({ message, sent }) {
    return (
        <div className={sent ? 'message-row sent' : 'message-row received'}>
            <div className='message-content'>{message.content}</div>
            <div className='message-meta'>
                <div className='message-time'>
                    {formatDateExtended(message.sentAt)}{' '}
                </div>
                {message.edited && <span className="message-edited">edited</span>}
            </div>
        </div>
    );
}

export default function ChatPanelMainMessages({ messages }) {
    return messages.map((message) =>
        message.sent ? (
            <MessageCont
                key={message.messageId}
                message={message}
                sent={true}
            />
        ) : (
            <MessageCont key={message.messageId} message={message} />
        )
    );
}
