import { useContext } from 'react';
import ChatsModal from '../../utilities/context/ChatsModal';

import ChatModal from './modals/ChatModal';

const MODALS = {
    CHAT_WINDOW: ChatModal,
    EDIT_PROFILE: <h1>WIP</h1>,
    FRIEND_LIST: <h1>WIP</h1>,
    ADD_FRIEND: <h1>WIP</h1>,
    FRIEND_REQUEST: <h1>WIP</h1>,
};

export default function ChatsRouteModals() {
    const { currentChatModal } = useContext(ChatsModal);

    if (!currentChatModal) {
        return null;
    }

    const ModalComponent = MODALS[currentChatModal.modal];

    if (!ModalComponent) {
        return null;
    }

    return (
        <ModalComponent data={currentChatModal.data} />
    );
}
