import { TextInput } from '@mantine/core';

import formatTestId from '../formatters/formatTestId';

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
                <span className='inline-error' data-testid={`${formatTestId(labelText)}-inline-error`}>{errorText}</span>
            )}
        </div>
    );
}
