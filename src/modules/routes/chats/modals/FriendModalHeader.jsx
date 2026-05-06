import { X } from 'lucide-react';

import './stylesheets/FriendModalHeader.css';

export default function FriendModalHeader({ title, onClose }) {
    return <div className="friend-modal-header">
        <h2>{title}</h2>
        <button className="close-modal" onClick={onClose} aria-label='Close modal'>
            <X strokeWidth={1.5} />
        </button>
    </div>
}