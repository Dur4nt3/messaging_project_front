import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import LoadingFriendModal from './LoadingFriendModal';
import EmptyFriendModal from './EmptyFriendModal';
import FriendRequestsSplitPanel from './FriendRequestsSplitPanel';

import './stylesheets/AddFriendModal.css';

function FriendRequestsModalContent({ data }) {
    const { runningRefresher } = useContext(ChatsModal);

    if (runningRefresher) {
        return <LoadingFriendModal text='Loading' />;
    }

    if (!data || data?.friendships?.length === 0) {
        return <EmptyFriendModal
            heading='No Pending Requests'
            description="You haven't sent or received any friend requests."
        />;
    }

    return <FriendRequestsSplitPanel data={data} />;
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
