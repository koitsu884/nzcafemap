import { SET_NEW_CAFES, SET_NEW_REVIEWS } from '../actions/types';

const INITIAL_STATE = {
    newReviews: null,
    newCafes: null
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case SET_NEW_CAFES:
            return {
                ...state,
                newCafes: action.payload
            }
        case SET_NEW_REVIEWS:
            return {
                ...state,
                newReviews: action.payload
            }
        default:
            return state;
    }
}