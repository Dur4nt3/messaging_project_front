import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import FriendItem from './FriendItem';

import './stylesheets/AddFriendModal.css';

function DenyListModalContent({ data }) {
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
                <h2>No Users Denied</h2>
                <p>
                    You haven't denied any users yet. If you do, they will
                    appear here.
                </p>
            </div>
        );
    }

    return (
        <div className='matching-user-list'>
            {data.friendships.map((user) => (
                <FriendItem
                    key={user.userId}
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
