import { SET_ERRORS, CLEAR_ERRORS} from '../actions/types';

const initialState = null

export default function(state = initialState, action) {
    switch(action.type){
        case SET_ERRORS:
            let error = action.payload;
            let errorMessage = error.response ? error.response.data : error.message;
            if(!errorMessage) errorMessage = "Something wrong happened...";
            return errorMessage;
        case CLEAR_ERRORS:
            
            return null;
        default:
            return state;
    }
}