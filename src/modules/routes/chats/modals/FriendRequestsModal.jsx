import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import FriendRequestsSplitPanel from './FriendRequestsSplitPanel';

import './stylesheets/AddFriendModal.css';

function FriendRequestsModalContent({ data }) {
    const { runningRefresher } = useContext(ChatsModal);

    if (runningRefresher) {
        return (
            <div className='loading-search-notice'>
                <h2>Loading</h2>
            </div>
        );
    }

    if (!data || data?.friendships?.length === 0) {
        return (
            <div className='not-found-notice'>
                <h2>No Pending Requests</h2>
                <p>You haven't sent or received any friend requests.</p>
            </div>
        );
    }

    return <FriendRequestsSplitPanel data={data} />
}

export default function FriendRequestsModal({ data }) {
    const { closeModal } = useContext(ChatsModal);

    const [opened, { close }] = useDisclosure(true);

    const handleClose = () => {
        closeModal();
        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            closeOnClickOutside={false}
            withCloseButton={false}
            closeOnEscape={true}
            classNames={{
                root: 'friend-requests-modal-root',
                inner: 'friend-requests-modal-inner',
                content: 'friend-requests-modal-content',
                header: 'friend-requests-modal-header',
                overlay: 'friend-requests-modal-overlay',
                title: 'friend-requests-modal-title',
                body: 'friend-requests-modal-body',
                close: 'friend-requests-modal-close',
            }}
        >
            <FriendModalHeader title='Friend Requests' onClose={handleClose} />
            <FriendRequestsModalContent data={data} />
        </Modal>
    );
}
