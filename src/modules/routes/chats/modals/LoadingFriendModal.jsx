import './stylesheets/LoadingFriendModal.css';

export default function LoadingFriendModal({ text }) {
    return (
        <div className='loading-friend-modal-cont'>
            <h2>{text}</h2>
        </div>
    );
}
