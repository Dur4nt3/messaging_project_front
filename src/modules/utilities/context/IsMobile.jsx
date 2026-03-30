import { createContext } from 'react';

const IsMobile = createContext(window.innerHeight < 748);

export default IsMobile;
