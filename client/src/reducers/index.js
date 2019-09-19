import {combineReducers } from 'redux';
import userReducer from './userReducer';
import myPageReducer from './myPageReducer';
import errorReducer from './errorReducer';
import { reducer as formReducer} from 'redux-form';
import cafeReducer from './cafeReducer';
import photoReducer from './photoReducer';
import homeReducer from './homeReducer';
import garellyReducer from './garellyReducer';
import mapSearchReducer from './mapSearchReducer';

export default combineReducers({
    form: formReducer,
    user: userReducer,
    myPage: myPageReducer,
    home: homeReducer,
    photo: photoReducer,
    cafe: cafeReducer,
    map: mapSearchReducer,
    garelly: garellyReducer,
    error: errorReducer
});