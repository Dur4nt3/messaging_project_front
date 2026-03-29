import { useActionData, Link, useNavigation } from 'react-router';

import LoginMain from './LoginMain';

import QuickReturnHome from '../../utilities/miscComponents/QuickReturnHome';
import BasicForm from '../../utilities/miscComponents/BasicForm';
import TextFormRow from '../../utilities/miscComponents/TextFormRow';
import PasswordFormRow from '../../utilities/miscComponents/PasswordFormRow';

export default function Login() {
    const { errors } = useActionData() || {};
    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === '/signup';

    const serverError = errors?.serverError;

    const loginInputs = [
        <TextFormRow
            labelText='Username'
            inputId='username'
            max={30}
            errorText={!!serverError}
            key='username'
        />,
        <PasswordFormRow
            labelText='Password'
            inputId='password'
            max={30}
            errorText={!!serverError}
            key='password'
        />,
    ];

    const belowButtonAction = (
        <p className='not-signed below-form-text'>
            New here? <Link to='/signup'>Sign up.</Link>
        </p>
    );

    return (
        <>
            <QuickReturnHome />
            <LoginMain>
                <BasicForm
                    isSubmitting={isSubmitting}
                    actionRoute='/login'
                    headingText='Log In'
                    submitText='Log in'
                    inputs={loginInputs}
                    belowButtonAction={belowButtonAction}
                    serverError={serverError}
                />
            </LoginMain>
        </>
    );
}
