import FormLoader from '../../../utilities/miscComponents/FormLoader';

import './stylesheets/LoadingFriendModal.css';

export default function LoadingFriendModal({ item }) {
    return (
        <div className='loading-friend-modal-cont'>
            <FormLoader size={36} color='#00c2a8' />
            <h2>Loading {item}</h2>
        </div>
    );
}
