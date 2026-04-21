import { useState } from 'react';

import FriendItem from './FriendItem';

import './stylesheets/FriendRequestsSplitPanel.css';

export default function FriendRequestsSplitPanel({ data }) {
    const [activePanel, setActivePanel] = useState('received');

    const receivedRequests = data?.friendships?.filter(
        (record) => !record.sent
    );
    const sentRequests = data?.friendships?.filter((record) => record.sent);

    return (
        <div className='friend-requests-split-panel'>
            <div className='split-panel-buttons'>
                <button
                    className={
                        activePanel === 'received'
                            ? 'view-received active'
                            : 'view-received'
                    }
                    onClick={() => {
                        if (activePanel !== 'received') {
                            setActivePanel('received');
                        }
                    }}
                >
                    <span>Received</span>
                    {receivedRequests && (
                        <span className='request-count'>
                            {receivedRequests.length < 10
                                ? receivedRequests.length
                                : '9+'}
                        </span>
                    )}
                </button>
                <button
                    className={
                        activePanel === 'sent'
                            ? 'view-sent active'
                            : 'view-sent'
                    }
                    onClick={() => {
                        if (activePanel !== 'sent') {
                            setActivePanel('sent');
                        }
                    }}
                >
                    <span>Sent</span>
                    {sentRequests && (
                        <span className='request-count'>
                            {sentRequests.length < 10
                                ? sentRequests.length
                                : '9+'}
                        </span>
                    )}
                </button>
            </div>
            <div className='split-panel-content'>
                {activePanel === 'received'
                    ? receivedRequests.map((request) => (
                          <FriendItem
                              key={request.friendshipId}
                              userData={request}
                              variant='FRIEND_REQUEST'
                          />
                      ))
                    : sentRequests.map((request) => (
                          <FriendItem
                              key={request.friendshipId}
                              userData={request}
                              variant='FRIEND_REQUEST'
                          />
                      ))}
            </div>
        </div>
    );
}
