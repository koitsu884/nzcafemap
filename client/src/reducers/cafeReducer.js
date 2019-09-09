import { SEARCH_CAFES, SET_CAFES, SET_CAFE_DETAILS, CAFE_SET_LOADING, EDIT_CAFE_PHOTO, DELETE_CAFE_PHOTO } from '../actions/types';

const INITIAL_STATE = {
    filters: {},
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageCount: 1,
    cafes: [],
    cafeDetails: null,
    latestReviews: [],
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    let tempCafe;
    switch (action.type) {
        case SEARCH_CAFES:
            return {
                ...state,
                filters: action.payload.filters,
                page:action.payload.page,
                pageSize:action.payload.pageSize,
                cafes:[],
                loading: true
            };
        case SET_CAFES:
            return {
                ...state,
                cafes: action.payload.cafes,
                page:action.payload.currentPage,
                pageSize:action.payload.pageSize,
                itemCount: action.payload.itemCount,
                pageCount: action.payload.pageCount,
                loading: false
            };
        case SET_CAFE_DETAILS:
            return {
                ...state,
                cafeDetails: action.payload.cafe,
                latestReviews: action.payload.latestReviews,
                loading: false
            };
        case EDIT_CAFE_PHOTO:
                tempCafe = Object.assign({}, state.cafeDetails);
                tempCafe.mainPhotoURL = action.payload;
    
                return {
                    ...state,
                    cafeDetails: tempCafe
                }
        case DELETE_CAFE_PHOTO:
            tempCafe = Object.assign({}, state.cafeDetails);
            tempCafe.mainPhotoURL = undefined;

            return {
                ...state,
                cafeDetails: tempCafe,
                uploading: false
            }
        case CAFE_SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state;
    }
};