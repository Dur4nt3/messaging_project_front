import { Tooltip } from '@mantine/core';

import { BotMessageSquare } from 'lucide-react';

import './stylesheets/BotAccountTooltip.css';

export default function BotAccountTooltip() {
    return (
        <Tooltip
            label='Utility Bot'
            events={{ hover: true, focus: true, touch: true }}
            classNames={{
                tooltip: 'bot-account-tooltip',
            }}
        >
            <BotMessageSquare strokeWidth={1.5} />
        </Tooltip>
    );
}
