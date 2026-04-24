import { useState, useEffect } from 'react';

import IsMobile from './IsMobile';

export default function IsMobileProvider({ children }) {
    const [currentlyMobile, setMobile] = useState(window.innerWidth < 768);

    const updateMedia = () => {
        setMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });

    return (
        <IsMobile.Provider
            value={{
                currentlyMobile,
            }}
        >
            {children}
        </IsMobile.Provider>
    );
}
