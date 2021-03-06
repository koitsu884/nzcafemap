import React, { useEffect} from 'react';
import '../css/style.css';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import { Provider } from 'react-redux';
import { CloudinaryContext } from 'cloudinary-react';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Signin from './auth/Signin';
import Signup from './auth/Signup';
import GlobalNav from './GlobalNav';
import MyPage from './user/MyPage';
import PrivateRoute from './common/PrivateRoute';

import store from '../store';
import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser } from '../actions/authActions';
import CafeSearch from './cafe/CafeSearch';
import CafeDetails from './cafe/CafeDetails';
import CafeEdit from './cafe/CafeEdit';
import CafeCreate from './cafe/CafeCreate';
import ReviewCreate from './review/ReviewCreate';
import ReviewEdit from './review/ReviewEdit';
import ReviewList from './review/ReviewList';
import CafePhotoGarelly from './cafe/CafePhotoGarelly';
import Privacy from './static/Privacy';
import Terms from './static/Terms';
import Contact from './contact/Contact';
import ScrollToTopButton from './common/ScrollToTopButton';
import Help from './static/Help';
import MapSearch from './cafe/MapSearch';
import OAuthRedirect from './auth/OAuthRedirect';
import EmailSent from './static/EmailSent';
import VerifyEmail from './auth/VerifyEmail';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import UserList from './user/UserList';
import UserDetail from './user/UserDetail';

// const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;


if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(JSON.parse(localStorage.user)));
    // const currentTime = Date.now() / 1000;
    // if(decodedToken.exp < currentTime){
    //   store.dispatch(logoutUser());
    //   store.dispatch(clearCurrentProfile());
    //   window.location.href = '/login';
    // }
}

// if (!window.google) {
//     console.log('Loading google map');
//     var s = document.createElement('script');
//     s.type = 'text/javascript';
//     s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja`;
//     var x = document.getElementsByTagName('script')[0];
//     x.parentNode.insertBefore(s, x);
//     console.log('Complete');
// }

const App = () => {
    useEffect(() => {
        // if(!window.google){
        //     console.log('Action load google script');
        //     store.dispatch(loadGoogleScript());
        // }
        // if (!window.google) {
        //     console.log('Loading google map');
        //     var s = document.createElement('script');
        //     s.type = 'text/javascript';
        //     s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja`;
        //     var x = document.getElementsByTagName('script')[0];
        //     x.parentNode.insertBefore(s, x);
        //     console.log('Complete');
        // }
    })

    return (
        <Provider store={store}>
            <CloudinaryContext cloudName="koitsu884">
                <Router history={history}>
                    <Header />
                    <GlobalNav />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/search" exact component={CafeSearch} />
                        <Route path="/signin" exact component={Signin} />
                        <Route path="/signup" exact component={Signup} />
                        <Route path="/auth/verifyemail/:token" exact component={VerifyEmail} />
                        <Route path="/auth/forgotpassword" exact component={ForgotPassword} />
                        <Route path="/auth/resetpassword/:token" exact component={ResetPassword} />
                        <Route path="/oauth/:token" exact component={OAuthRedirect} />
                        <PrivateRoute path="/mypage" exact component={MyPage} />
                        <Route path="/users" exact component={UserList} />
                        <Route path="/users/:userId" exact component={UserDetail} />
                        <Route path="/cafes" exact component={CafeSearch} />
                        <Route path="/cafes/map" exact component={MapSearch} />
                        <PrivateRoute path="/cafes/add" exact component={CafeCreate} />
                        <Route path="/cafes/photos" exact component={CafePhotoGarelly} />
                        <Route path="/cafes/:id" exact component={CafeDetails} />
                        <PrivateRoute path="/cafes/:id/edit" exact component={CafeEdit} />
                        <PrivateRoute path="/cafes/:cafeId/review" exact component={ReviewCreate} />
                        <Route path="/cafes/:cafeId/review/all" exact component={ReviewList} />
                        <PrivateRoute path="/cafes/:cafeId/review/:reviewId" exact component={ReviewEdit} />
                        <Route path="/contact" exact component={Contact} />
                        <Route path="/static/privacy" exact component={Privacy} />
                        <Route path="/static/terms" exact component={Terms} />
                        <Route path="/static/help" exact component={Help} />
                        <Route path="/static/emailsent" exact component={EmailSent} />
                    </Switch>
                    <Footer />
                    <ScrollToTopButton />
                </Router>
            </CloudinaryContext>
        </Provider>
    )
}

export default App;
