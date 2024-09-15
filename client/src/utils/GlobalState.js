import React, { createContext, useContext, useReducer } from "react";
import reducer from './reducers'

const StateContext = React.createContext();
const DispatchContext = React.createContext();

export function useStateContext(){
  return useContext(StateContext);
} 
export function useDispatchContext(){
  return useContext(DispatchContext);
}

const CharityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    userInfo: '',
    loggedIn: false,
  });

  return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    </StateContext.Provider>
)
};


export { CharityProvider };
