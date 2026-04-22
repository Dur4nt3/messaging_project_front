import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import LoadingFriendModal from './LoadingFriendModal';
import EmptyFriendModal from './EmptyFriendModal';
import SearchForUser from './SearchForUser';
import FriendItem from './FriendItem';

import './stylesheets/AddFriendModal.css';

function AddFriendModalContent({ data }) {
    const { runningRefresher } = useContext(ChatsModal);

    if (runningRefresher) {
        return <LoadingFriendModal text='Searching' />;
    }

    if (!data) {
        return (
            <EmptyFriendModal
                heading='Find Friends'
                description='Search by username above and add new friends.'
            />
        );
    }

    if (data?.friendships?.length === 0) {
        return (
            <EmptyFriendModal
                heading='No Matches Found'
                description="We couldn't find any users with that name. Try again with a
                    different term."
            />
        );
    }

    return (
        <div className='matching-user-list'>
            {data.friendships.map((user) => (
                <FriendItem
                    key={user.userId}
                    userData={user}
                    variant={'ADD_FRIEND'}
                />
            ))}
        </div>
    );
}

export default function AddFriendModal({ data }) {
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
                root: 'add-friend-modal-root',
                inner: 'add-friend-modal-inner',
                content: 'add-friend-modal-content',
                header: 'add-friend-modal-header',
                overlay: 'add-friend-modal-overlay',
                title: 'add-friend-modal-title',
                body: 'add-friend-modal-body',
                close: 'add-friend-modal-close',
            }}
        >
            <FriendModalHeader title='Add Friends' onClose={handleClose} />
            <SearchForUser />
            <AddFriendModalContent data={data} />
        </Modal>
    );
}
