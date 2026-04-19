import { useContext, useState } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';

import { Input } from '@mantine/core';

import { Search } from 'lucide-react';

import './stylesheets/SearchForUser.css';

export default function SearchForUser() {
    const { runRefresher } = useContext(ChatsModal);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => runRefresher('ADD_FRIEND', searchValue);

    return (
        <div className='add-friend-searchbar'>
            <input
                type='text'
                value={searchValue}
                placeholder='Search by username'
                onChange={(event) => setSearchValue(event.target.value)}
            />
            <button onClick={handleSearch} aria-label='Search for users'>
                <Search strokeWidth={1.5} />
            </button>
        </div>
    );
}
