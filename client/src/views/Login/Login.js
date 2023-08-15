import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import Button from '../../commonComponents/Button';
import FormField from '../../commonComponents/FormField';
import FormFieldError from '../../commonComponents/FormFieldError';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
// Middleware
import { isUserLoggedInRequest } from '../../middleware/actions/authActions';
// Styling
import './Login.scss';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState();
    const [passwordError, setPasswordError] = useState();

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserError(username === '');
        setPasswordError(password === '');
        if (password !== '' && username !== '') {
            dispatch(isUserLoggedInRequest({ username, password }));
        }
    };

    useEffect(() => {
        if (username.length) setUserError(false);
        if (password.length) setPasswordError(false);
    }, [username, password]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Player Tracker</h1>
                <form noValidate>
                    <FormField>
                        <Label>Usuario</Label>
                        <Input id="usuario-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required={true} />
                        {userError && <FormFieldError>Usuario Incorrecto</FormFieldError>}
                    </FormField>
                    <FormField>
                        <Label>Contraseña</Label>
                        <Input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
                        {passwordError && <FormFieldError>Contraseña Incorrecta</FormFieldError>}
                    </FormField>
                </form>
                <Button type="submit" variant="primary" onClick={(e) => handleSubmit(e)} disabled={!username || !password}>
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Login;
