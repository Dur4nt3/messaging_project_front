import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import LoadingFriendModal from './LoadingFriendModal';
import EmptyFriendModal from './EmptyFriendModal';
import FriendItem from './FriendItem';

import './stylesheets/AddFriendModal.css';

function DenyListModalContent({ data }) {
    const { runningRefresher } = useContext(ChatsModal);

    if (runningRefresher) {
        return <LoadingFriendModal text='Loading' />;
    }

    if (!data || data?.friendships?.length === 0) {
        return (
            <EmptyFriendModal
                heading='No Users Denied'
                description="You haven't denied any users. If you do, they will
                    appear here."
            />
        );
    }

    return (
        <div className='matching-user-list'>
            {data.friendships.map((user) => (
                <FriendItem
                    key={user.friendshipId}
                    userData={user}
                    variant={'DENY_LIST'}
                />
            ))}
        </div>
    );
}

export default function DenyListModal({ data }) {
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
                root: 'deny-list-modal-root',
                inner: 'deny-list-modal-inner',
                content: 'deny-list-modal-content',
                header: 'deny-list-modal-header',
                overlay: 'deny-list-modal-overlay',
                title: 'deny-list-modal-title',
                body: 'deny-list-modal-body',
                close: 'deny-list-modal-close',
            }}
        >
            <FriendModalHeader title='Denied Users' onClose={handleClose} />
            <DenyListModalContent data={data} />
        </Modal>
    );
}
