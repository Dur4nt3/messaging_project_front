import { useContext } from 'react';

import ChatsModal from '../../../utilities/context/ChatsModal';

import DotsLoader from '../../../utilities/miscComponents/DotsLoader';

import { ChevronUp } from 'lucide-react';

import './stylesheets/ChatPanelViewMore.css';

export default function ChatPanelViewMore({
    chatId,
    firstMessageId,
    preserveScrollOnChange,
}) {
    const { runRefresher, runningRefresher } = useContext(ChatsModal);

    return (
        <div className='load-more-wrapper'>
            <div className='border-decorator'></div>
            <button
                className='load-more-messages'
                onClick={() => {
                    preserveScrollOnChange();
                    runRefresher(chatId, null, firstMessageId);
                }}
            >
                {runningRefresher ? (
                    <span>Loading</span>
                ) : (
                    <span className='with-chevron'>
                        <ChevronUp strokeWidth={1.5} />
                        Load older messages
                    </span>
                )}
            </button>
            <div className='border-decorator'></div>
        </div>
    );
}
