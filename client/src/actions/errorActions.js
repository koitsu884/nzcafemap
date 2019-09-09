import { CLEAR_ERRORS } from "./types";

export const clearError = () => {
    return {
        type: CLEAR_ERRORS
    }
};
