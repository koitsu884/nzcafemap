import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/authActions';
import history from '../../history';
import Alert from '../../helper/Alert';
import setAuthToken from '../../utils/setAuthToken';

const baseURL = process.env.REACT_APP_API_URL;

function VerifyEmail(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        let token = props.match.params.token;
        if(!token)
        {
            console.log('No token');
            history.push('/')
        }
        else{
            axios.get('auth/verify', {baseURL:baseURL, params:{token: token}})
            .then(res => {
                Alert.success("アカウントを認証しました");
                const token = res.headers['x-auth-token'];
                setAuthToken(token);
                localStorage.setItem('jwtToken', token)
                dispatch(setCurrentUser(res.data));
                history.push('/');
            })
            .catch(error => {
                Alert.error(error);
                history.push('/');
            })
        }
    }, [props, dispatch])


    return (
        <div className="container">
         <p>アカウントを認証しています</p>
        </div>
    )
}

export default VerifyEmail;