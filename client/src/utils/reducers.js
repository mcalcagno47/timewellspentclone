import ACTIONS from './actions'
const reducer = (state, action)=>{
    switch(action.type){
        case ACTIONS.USER_INFO:
            return {...state, userInfo: action.payload}
        case ACTIONS.LOGGED_IN:
            return { ...state, loggedIn: action.payload}
            default:
                throw new Error();
    }
}

export default reducer;