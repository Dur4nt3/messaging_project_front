import { useContext } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import { useDisclosure } from '@mantine/hooks';

import { Modal } from '@mantine/core';

import FriendModalHeader from './FriendModalHeader';
import SearchForUser from './SearchForUser';

import './stylesheets/AddFriendModal.css';

function AddFriendModalContent({ data }) {
    console.log(data);
    if (!data) {
        return (
            <div className='start-search-notice'>
                <h2>Find Friends</h2>
                <p>Search by username above and add new friends.</p>
            </div>
        );
    }

    if (data?.friendships?.length === 0) {
        return (
            <div className='not-found-notice'>
                <h2>No Matches Found</h2>
                <p>
                    We couldn’t find any users with that name. Try again with a
                    different term.
                </p>
            </div>
        );
    }

    return <h2>Show users!</h2>;
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
