import { TextInput } from '@mantine/core';

export default function TextFormRow({
    labelText,
    inputId,
    errorText = null,
}) {
    return (
        <div className='form-row'>
            <label htmlFor={inputId}>{labelText}</label>
            <TextInput id={inputId} name={inputId} classNames={{
                wrapper: 'text-input-wrapper'
            }} />
            {errorText !== null && (
                <span className='inline-error'>{errorText}</span>
            )}
        </div>
    );
}
