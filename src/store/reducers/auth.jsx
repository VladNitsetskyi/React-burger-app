import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
  registrationSuccessful: false
};

const authStart = (state) => {
    return updateObject(state, {  
        error: null,
        loading: true,
        registrationSuccessful: false
      });
}
const authErrorReset = (state) => {
  return updateObject(state, {  
      error: null,
      registrationSuccessful:false

    });
}

const authSuccess = (state,action) => {
    return updateObject(state, {  
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false,
        registrationSuccessful: action.registrationSuccessful
      });
}

const authFail = (state,action) => {
    return updateObject(state, {  
       token:null,
       userId: null,
       error: action.error,
       loading:false
      });
}

const authLogout = (state,action) => {
  return updateObject(state, {  
    token:null,
    userId: null
    });
}

const authRedirectPath = (state,action) => {
  return updateObject(state, {  
    authRedirectPath:action.path
    });
}





const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state,action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state,action);
    case actionTypes.AUTH_FAIL: return authFail(state,action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state,action);
    case actionTypes.SET_AUTH_REDIRECT_PATH: return authRedirectPath(state,action);
    case actionTypes.AUTH_ERROR_RESET: return authErrorReset(state);
    default:
      return state;
  }
};

export default reducer;
