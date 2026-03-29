import { TextInput } from '@mantine/core';

export default function TextFormRow({
    labelText,
    inputId,
    max,
    errorText = null,
}) {
    return (
        <div
            className={errorText ? 'form-row has-errors' : 'form-row'}
        >
            <label htmlFor={inputId}>{labelText}</label>
            <TextInput
                maxLength={max}
                id={inputId}
                name={inputId}
                classNames={{
                    wrapper: 'text-input-wrapper',
                }}
            />
            {errorText !== null && errorText !== true && (
                <span className='inline-error'>{errorText}</span>
            )}
        </div>
    );
}
