import { Loader } from '@mantine/core';

export default function FormLoader({ color, size = 24 }) {
    return (
        <Loader
            classNames={{ root: 'form-loader-root' }}
            color={color}
            size={size}
        />
    );
}
