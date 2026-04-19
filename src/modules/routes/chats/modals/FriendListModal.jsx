import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';

import LoadingFriendModal from './LoadingFriendModal';
import EmptyFriendModal from './EmptyFriendModal';
import FriendItem from './FriendItem';

import './stylesheets/FriendListModal.css';

function FriendListModalContent({ data }) {
    if (data === null || !data?.friendships) {
        return <LoadingFriendModal item='Friend List' />;
    }

    if (data?.friendships.length === 0) {
        return <EmptyFriendModal item='Friend List' />;
    }
    
    return data?.friendships.map((record) => (
        <FriendItem key={record.friendshipId} userData={record.user} />
    ));
}

export default function FriendListModal({ data }) {
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
                root: 'friend-list-modal-root',
                inner: 'friend-list-modal-inner',
                content: 'friend-list-modal-content',
                header: 'friend-list-modal-header',
                overlay: 'friend-list-modal-overlay',
                title: 'friend-list-modal-title',
                body: 'friend-list-modal-body',
                close: 'friend-list-modal-close',
            }}
        >
            <FriendModalHeader title='Friend List' onClose={handleClose} />
            <FriendListModalContent data={data} />
        </Modal>
    );
}
