import { createContext } from 'react';

const IsMobile = createContext(window.innerHeight < 768);

export default IsMobile;
