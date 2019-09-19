import {MAP_SET_CAFES, MAP_SET_LOADING, MAP_SET_FILTER} from '../actions/types';

const INITIAL_STATE = {
    filter: null,
    cafes: [],
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case MAP_SET_FILTER:
            return {
                ...state,
                filter: action.payload
            }
        case MAP_SET_CAFES:
            return {
                ...state,
                cafes: action.payload,
                loading: false
            }
        case MAP_SET_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}
