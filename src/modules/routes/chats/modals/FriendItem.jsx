import FriendListAction from './FriendListAction';
import AddFriendAction from './AddFriendAction';
import FriendRequestsAction from './FriendRequestsAction';
import DenyListAction from './DenyListAction';

import getUserInitials from '../../../utilities/formatters/getUserInitials';

import BotAccountTooltip from '../../../utilities/miscComponents/BotAccountTooltip';

import './stylesheets/FriendItem.css';

function FriendItemActions({ variant, data = null }) {
    const variantMap = {
        FRIEND_LIST: FriendListAction,
        FRIEND_REQUEST: FriendRequestsAction,
        ADD_FRIEND: AddFriendAction,
        DENY_LIST: DenyListAction,
    };

    const ActionComponent = variantMap[variant];

    if (!ActionComponent) {
        return null;
    }

    return <div className='friend-item-actions'>
        <ActionComponent data={data} />
    </div>
}

function FriendItemUserData({ userData }) {
    return (
        <div className='friend-item-user-data'>
            <div className='user-avatar'>{getUserInitials(userData.name)}</div>
            <div className='user-info'>
                <p className='user-username'>
                    <span>{userData.username}</span>
                    {userData.type === 'BOT' && <BotAccountTooltip />}
                </p>
                <div className='user-name'>{userData.name}</div>
            </div>
        </div>
    );
}

export default function FriendItem({ userData, variant }) {
    return (
        <div className='friend-item-cont'>
            <FriendItemUserData userData={userData} />
            <FriendItemActions variant={variant} data={userData} />
        </div>
    );
}
