import { useContext, useEffect } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';

import useFetchFriendData from '../../../utilities/hooks/useFetchFriendData';

import { Menu } from '@mantine/core';

import { Ellipsis, UserPlus, UserPen, User, UserX } from 'lucide-react';

import './stylesheets/FooterActionMenu.css';

export default function FooterActionMenu({ opened, setOpened }) {
    const { currentChatModal, openModal, setRefresher } =
        useContext(ChatsModal);

    const {
        fetchFriendDataRunner,
        fetchingFriendData,
        currentFriendData,
        setCurrentFriendData,
    } = useFetchFriendData();

    // After data is fetched
    // Provide it to the modal
    useEffect(() => {
        if (currentFriendData !== null) {
            openModal(currentFriendData.type, currentFriendData);
        }
    }, [currentFriendData, openModal]);

    // If the modal was closed
    // Reset the friend data
    useEffect(() => {
        if (currentChatModal.modal === null) {
            setCurrentFriendData(null);
        }
    }, [currentChatModal.modal, setCurrentFriendData]);

    return (
        <Menu
            trapFocus
            opened={opened}
            onChange={setOpened}
            onDismiss={() => setOpened(false)}
            classNames={{
                dropdown: 'footer-menu-dropdown',
                arrow: 'footer-menu-arrow',
                overlay: 'footer-menu-overlay',
                item: 'footer-menu-item',
                itemLabel: 'footer-menu-item-label',
                itemSection: 'footer-menu-item-section',
            }}
            offset={4}
            id='footer-actions-menu'
        >
            <Menu.Target>
                <button
                    className='misc-actions'
                    onClick={() => setOpened(true)}
                    disabled={fetchingFriendData}
                    aria-label='more actions'
                >
                    <Ellipsis strokeWidth={1.5} />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<User size={14} />}
                    onClick={() => {
                        openModal('FRIEND_LIST', null);
                        fetchFriendDataRunner('FRIEND_LIST');
                        setRefresher(() => fetchFriendDataRunner);
                    }}
                >
                    Friend List
                </Menu.Item>

                <Menu.Item
                    leftSection={<UserPen size={14} />}
                    onClick={() => {
                        openModal('FRIEND_REQUEST', null);
                        fetchFriendDataRunner('FRIEND_REQUEST');
                        setRefresher(() => fetchFriendDataRunner);
                    }}
                >
                    Friend Requests
                </Menu.Item>

                <Menu.Item
                    leftSection={<UserPlus size={14} />}
                    onClick={() => {
                        openModal('ADD_FRIEND', null);
                        setRefresher(() => fetchFriendDataRunner);
                    }}
                >
                    Add Friends
                </Menu.Item>

                <Menu.Item
                    leftSection={<UserX size={14} />}
                    onClick={() => {
                        openModal('DENY_LIST', null);
                        fetchFriendDataRunner('DENY_LIST');
                        setRefresher(() => fetchFriendDataRunner);
                    }}
                >
                    Denied Users
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
