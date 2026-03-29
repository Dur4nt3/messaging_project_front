import { Form } from 'react-router';

import './stylesheets/BasicForm.css';

export default function BasicForm({
    actionRoute,
    headingText,
    inputs,
    submitText,
    belowButtonAction,
}) {
    return <Form method='POST' action={actionRoute} className='basic-form'>
        <h1 className="form-heading">{headingText}</h1>

        {inputs.map(input => input)}

        <button className='submit-form-button primary-button-design' type='submit'>{submitText}</button>

        {belowButtonAction}
    </Form>;
}
