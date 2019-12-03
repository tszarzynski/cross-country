import React, { createContext, useContext, useReducer } from "react";
export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => {
  const contextValue = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
