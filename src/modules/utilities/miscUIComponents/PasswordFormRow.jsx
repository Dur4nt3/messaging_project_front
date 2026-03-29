import { PasswordInput } from '@mantine/core';

export default function PasswordFormRow({
    labelText,
    inputId,
    errorText = null,
}) {
    return (
        <div className='form-row'>
            <label htmlFor={inputId}>{labelText}</label>
            <PasswordInput
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
                        height: 40
                    }
                }}
            />
            {errorText !== null && (
                <span className='inline-error'>{errorText}</span>
            )}
        </div>
    );
}
