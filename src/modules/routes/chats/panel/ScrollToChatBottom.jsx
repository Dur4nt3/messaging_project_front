import { ChevronDown } from 'lucide-react';

import './stylesheets/ScrollToChatBottom.css';

export default function ScrollToChatBottom({ inputHeight, scrollToBottom }) {
    return (
        <button
            className='scroll-to-bottom'
            style={{ '--input-offset': `${inputHeight}px` }}
            onClick={scrollToBottom}
        >
            <ChevronDown strokeWidth={1.5} />
        </button>
    );
}
