import React, { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/authActions';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import history from '../../history';

const baseURL = process.env.REACT_APP_API_URL;

const OAuthRedirect = (props) => {
    const accessToken = props.match.params.token;
    const dispatch = useDispatch();

    useEffect(() => {
        if(!accessToken){
            console.log("No token");
            history.push('/');
            return;
        }
        setAuthToken(accessToken);
        localStorage.setItem('jwtToken', accessToken)

        axios.get('auth/me', {baseURL: baseURL})
        .then(res => {
            dispatch(setCurrentUser(res.data));
        })
        .catch(error => {
            console.log(error);
            setAuthToken(null);
            localStorage.removeItem('jwtToken')
        })
        .finally(() => {
            history.push('/');
        })
    }, [accessToken, dispatch])

    return (
        <div className="box">
            Loading...
        </div>
    )
}

export default OAuthRedirect
