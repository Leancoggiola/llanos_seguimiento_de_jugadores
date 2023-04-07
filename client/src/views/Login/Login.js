import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import FormField from '../../commonComponents/FormField';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
// Middleware
import { isUserLoggedInRequest } from '../../middleware/actions/authActions';
// Styling
import './Login.scss'

const Login = () => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword] = useState('')

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(isUserLoggedInRequest({username, password}))
    }

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h1>Player Tracker</h1>
                <form noValidate>
                    <FormField>
                        <Label>Usuario</Label>
                        <Input id='usuario-input' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required={true}/>
                    </FormField>
                    <FormField>
                        <Label>Password</Label>
                        <Input id='password-input' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required={true}/>
                    </FormField>
                </form>
                <button type='submit' className='btn btn-primary' onClick={(e) => handleSubmit(e)} disabled={!username || !password} >Login</button>
            </div>
        </div>
    )
}

export default Login;