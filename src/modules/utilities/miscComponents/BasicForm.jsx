import { Form } from 'react-router';

import FormLoader from './FormLoader';

import './stylesheets/BasicForm.css';

export default function BasicForm({
    isSubmitting,
    actionRoute,
    headingText,
    inputs,
    submitText,
    belowButtonAction,
}) {
    return (
        <Form method='POST' action={actionRoute} className='basic-form'>
            <h1 className='form-heading'>{headingText}</h1>

            {inputs.map((input) => input)}

            <button
                disabled={isSubmitting}
                className='submit-form-button primary-button-design'
                type='submit'
            >
                {isSubmitting ? <FormLoader color='#03110f' /> : submitText}
            </button>

            {belowButtonAction}
        </Form>
    );
}
