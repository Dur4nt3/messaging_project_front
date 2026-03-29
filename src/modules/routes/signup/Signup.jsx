import { useActionData, Link, useNavigation } from 'react-router';

import QuickReturnHome from '../../utilities/miscComponents/QuickReturnHome';
import SignupMain from './SignupMain';

import BasicForm from '../../utilities/miscComponents/BasicForm';
import TextFormRow from '../../utilities/miscComponents/TextFormRow';
import PasswordFormRow from '../../utilities/miscComponents/PasswordFormRow';

export default function Signup() {
    const { errors } = useActionData() || {};
    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === '/signup';

    const signupInputs = [
        <TextFormRow
            labelText='Username'
            inputId='username'
            max={30}
            errorText={errors?.username}
            key='username'
        />,
        <TextFormRow
            labelText='Name'
            inputId='name'
            max={30}
            errorText={errors?.name}
            key='name'
        />,
        <PasswordFormRow
            labelText='Password'
            inputId='password'
            max={30}
            errorText={errors?.password}
            key='password'
        />,
        <PasswordFormRow
            labelText='Confirm Password'
            inputId='cpassword'
            max={30}
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
                    isSubmitting={isSubmitting}
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
