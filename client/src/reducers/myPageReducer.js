import {
    MYPAGE_SET_USER,
    MYPAGE_SET_CAFES,
    MYPAGE_DELETE_CAFE,
    MYPAGE_SET_REVIEWS,
    MYPAGE_SET_RATES,
    UPDATE_USER_PROFILE,
    MYPAGE_CLEAR,
    MYPAGE_SET_LOADING_CAFE,
    MYPAGE_SET_LOADING_REVIEW,
    MYPAGE_SET_LOADING_RATE
} from '../actions/types';

const INITIAL_STATE = {
    user: null,
    cafes: null,
    cafeLoading: true,
    cafePagination: {
        page: 1,
        pageSize: 10,
        itemCount: 0,
        pageCount: 1
    },
    reviews: null,
    reviewLoading: true,
    reviewPagination: {
        page: 1,
        pageSize: 10,
        itemCount: 0,
        pageCount: 1
    },
    rates: null,
    rateLoading: true,
    ratePagination: {
        page: 1,
        pageSize: 10,
        itemCount: 0,
        pageCount: 1
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MYPAGE_SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case MYPAGE_CLEAR:
            return INITIAL_STATE;
        case MYPAGE_SET_CAFES:
            return {
                ...state,
                cafes: action.payload.cafes,
                cafePagination: {
                    page: action.payload.currentPage,
                    pageSize: action.payload.pageSize,
                    itemCount: action.payload.itemCount,
                    pageCount: action.payload.pageCount,
                },
                cafeLoading: false
            };
        case MYPAGE_DELETE_CAFE:
            return {
                ...state,
                cafes: state.cafes.filter(cafe => cafe._id !== action.payload),
                cafeLoading: false
            }
        case MYPAGE_SET_RATES:
            return {
                ...state,
                rates: action.payload
            }
        case MYPAGE_SET_REVIEWS:
            return {
                ...state,
                reviews: action.payload.reviews,
                reviewPagination: action.payload.pagination,
                reviewLoading: false
            };
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                user: action.payload,
                loading: false
            };
        case MYPAGE_SET_LOADING_CAFE:
            return {
                ...state,
                cafeLoading: true
            }
        case MYPAGE_SET_LOADING_REVIEW:
            return {
                ...state,
                reviewLoading: true
            }
        case MYPAGE_SET_LOADING_RATE:
            return {
                ...state,
                rateLoading: true
            }
        default:
            return state
    }
}