import {
    GARELLY_SET_LOADING,
    GARELLY_CLEAR_PHOTOS,
    GARELLY_ADD_PHOTOS,
    GARELLY_SET_COMPLETE
} from '../actions/types';

const INITIAL_STATE = {
    photos: [],
    loading: true,
    complete: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GARELLY_ADD_PHOTOS:
            return {
                ...state,
                photos: [...state.photos].concat(action.payload),
                loading: false
            }
        case GARELLY_CLEAR_PHOTOS:
            return {
                photos: [],
                loading: false,
                complete: false
            }
        case GARELLY_SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case GARELLY_SET_COMPLETE:
            return {
                ...state,
                complete: true
            }
        default:
            return state;
    }
}

