import './stylesheets/EmptyFriendModal.css';

export default function EmptyFriendModal({ heading, description }) {
    return (
        <div className='empty-friend-modal-cont'>
            <h2>{heading}</h2>
            <p>{description}</p>
        </div>
    );
}
