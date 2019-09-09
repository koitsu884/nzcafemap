import { PHOTO_SET_UPLOADING, PHOTO_SET_COUNT } from '../actions/types';

const INITIAL_STATE = {
    uploading: false,
    count: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PHOTO_SET_UPLOADING:
            return {
                ...state,
                uploading: action.payload
            }
        case PHOTO_SET_COUNT:
            return {
                ...state,
                count: action.payload
            }
        default:
            return state;
    }
};