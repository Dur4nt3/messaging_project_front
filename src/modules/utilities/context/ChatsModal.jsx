import { createContext } from 'react';

import ChatsModalContext from '../classes/ChatsModalContext';

const ChatsModal = createContext(new ChatsModalContext(null, null));

export default ChatsModal;
