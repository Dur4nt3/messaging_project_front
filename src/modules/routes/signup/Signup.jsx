import { useActionData, Link } from 'react-router';

import QuickReturnHome from '../../utilities/miscUIComponents/QuickReturnHome';
import SignupMain from './SignupMain';

import BasicForm from '../../utilities/miscUIComponents/BasicForm';
import TextFormRow from '../../utilities/miscUIComponents/TextFormRow';
import PasswordFormRow from '../../utilities/miscUIComponents/PasswordFormRow';

export default function Signup() {
    const { errors } = useActionData() || {};

    const signupInputs = [
        <TextFormRow
            labelText='Username'
            inputId='username'
            errorText={errors?.username}
            key='username'
        />,
        <TextFormRow
            labelText='Name'
            inputId='name'
            errorText={errors?.name}
            key='name'
        />,
        <PasswordFormRow
            labelText='Password'
            inputId='password'
            errorText={errors?.password}
            key='password'
        />,
        <PasswordFormRow
            labelText='Confirm Password'
            inputId='cpassword'
            errorText={errors?.cpassword}
            key='cpassword'
        />,
    ];

    const belowButtonAction = (
        <p className='already-signed below-form-text'>
            Already have an account? <Link to='/login'>Log in.</Link>
        </p>
    );

    return (
        <>
            <QuickReturnHome />
            <SignupMain>
                <BasicForm
                    actionRoute='/signup'
                    headingText='Sign Up'
                    submitText='Sign up'
                    inputs={signupInputs}
                    belowButtonAction={belowButtonAction}
                />
            </SignupMain>
        </>
    );
}
