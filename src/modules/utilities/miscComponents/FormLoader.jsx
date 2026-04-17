import { Loader } from '@mantine/core';

export default function FormLoader({ color, size = 24, type = 'oval' }) {
    return (
        <Loader
            classNames={{ root: 'form-loader-root' }}
            type={type}
            color={color}
            size={size}
        />
    );
}
