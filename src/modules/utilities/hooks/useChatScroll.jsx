import {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    useContext,
} from 'react';
import ChatHighlight from '../context/ChatHighlight';

export default function useChatScroll(scrollThreshold) {
    const { currentChatData, highlightedChat } = useContext(ChatHighlight);

    const scrollRef = useRef();

    const hasLoadedRef = useRef(false);

    const nearBottomRef = useRef(true);

    const beforeChangeScroll = useRef();

    const [showScrollButton, setShowScrollButton] = useState(false);

    const messages = currentChatData?.messages;

    const lastMessageId = messages?.[messages?.length - 1]?.messageId;
    const firstMessageId = messages?.[0]?.messageId;

    const preserveScrollOnChange = () => {
        const chatPanel = scrollRef.current;
        if (chatPanel) {
            beforeChangeScroll.current = {
                scrollHeight: chatPanel.scrollHeight,
                scrollTop: chatPanel.scrollTop,
                distanceFromBottom:
                    chatPanel.scrollHeight -
                    chatPanel.scrollTop -
                    chatPanel.clientHeight,
            };
        }
    };

    // Fix for panel
    // Ensures scroll to bottom on every load
    useEffect(() => {
        hasLoadedRef.current = false;
    }, [highlightedChat]);

    // Initial scroll to bottom on load
    useEffect(() => {
        if (!lastMessageId || hasLoadedRef.current === true) {
            return;
        }

        const chatPanel = scrollRef.current;

        if (chatPanel) {
            chatPanel.scrollTop = chatPanel.scrollHeight;
            hasLoadedRef.current = true;
        }
    }, [lastMessageId]);

    // Determine whether to show scroll button
    useEffect(() => {
        const chatPanel = scrollRef.current;
        if (!chatPanel) {
            return;
        }

        const handleScroll = () => {
            const distanceFromBottom =
                chatPanel.scrollHeight -
                chatPanel.scrollTop -
                chatPanel.clientHeight;

            nearBottomRef.current = distanceFromBottom <= scrollThreshold;

            setShowScrollButton(distanceFromBottom > scrollThreshold);
        };

        chatPanel.addEventListener('scroll', handleScroll);

        return () => chatPanel.removeEventListener('scroll', handleScroll);
    }, [lastMessageId, scrollThreshold]);

    // Auto-scroll when new message arrives, if near bottom
    useEffect(() => {
        const chatPanel = scrollRef.current;
        const appendScroll = beforeChangeScroll.current;

        if (!chatPanel || !lastMessageId || !appendScroll) {
            return;
        }

        if (appendScroll.distanceFromBottom < scrollThreshold) {
            chatPanel.scrollTop = chatPanel.scrollHeight;
        }
    }, [lastMessageId, scrollThreshold]);

    // Preserve scroll when fetching older messages
    useLayoutEffect(() => {
        const chatPanel = scrollRef.current;
        const prependScroll = beforeChangeScroll.current;

        if (!chatPanel || !firstMessageId || !prependScroll) {
            return;
        }

        chatPanel.scrollTop =
            chatPanel.scrollHeight -
            prependScroll.scrollHeight +
            prependScroll.scrollTop;

        beforeChangeScroll.current = null;
    }, [firstMessageId]);

    const scrollToBottom = () => {
        const chatPanel = scrollRef.current;
        if (chatPanel) {
            chatPanel.scrollTo({
                top: chatPanel.scrollHeight,
                behavior: 'smooth',
            });
            setShowScrollButton(false);
        }
    };

    return {
        scrollRef,
        showScrollButton,
        scrollToBottom,
        preserveScrollOnChange,
    };
}
