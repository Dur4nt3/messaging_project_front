import { PasswordInput } from '@mantine/core';

import formatTestId from '../formatters/formatTestId';

export default function PasswordFormRow({
    labelText,
    inputId,
    max,
    errorText = null,
}) {
    return (
        <div className={errorText ? 'form-row has-errors' : 'form-row'}>
            <label htmlFor={inputId}>{labelText}</label>
            <PasswordInput
                maxLength={max}
                id={inputId}
                name={inputId}
                variant='unstyled'
                classNames={{
                    root: 'password-input-root',
                    wrapper: 'password-input-wrapper',
                    input: 'password-input',
                    innerInput: 'password-input-inner',
                    visibilityToggle: 'password-visibility-toggle',
                }}
                styles={{
                    input: {
                        height: 38,
                    },
                }}
            />
            {errorText !== null && errorText !== true && (
                <span
                    className='inline-error'
                    data-testid={`${formatTestId(labelText)}-inline-error`}
                >
                    {errorText}
                </span>
            )}
        </div>
    );
}
