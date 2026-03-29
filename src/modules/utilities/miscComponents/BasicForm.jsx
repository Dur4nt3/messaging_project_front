import { Form } from 'react-router';

import FormLoader from './FormLoader';
import FormBannerError from './FormBannerError';

import './stylesheets/BasicForm.css';

export default function BasicForm({
    isSubmitting,
    actionRoute,
    headingText,
    inputs,
    submitText,
    serverError,
    belowButtonAction,
}) {
    return (
        <Form method='POST' action={actionRoute} className='basic-form'>
            <h1 className='form-heading'>{headingText}</h1>

            { serverError && <FormBannerError errorText={serverError} /> }

            {inputs.map((input) => input)}

            <button
                disabled={isSubmitting}
                className={
                    serverError
                        ? 'submit-form-button primary-button-design server-error'
                        : 'submit-form-button primary-button-design'
                }
                type='submit'
            >
                {isSubmitting ? <FormLoader color='#03110f' /> : submitText}
            </button>

            {belowButtonAction}
        </Form>
    );
}
