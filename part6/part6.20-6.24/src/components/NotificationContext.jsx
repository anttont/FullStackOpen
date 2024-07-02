import React, { createContext, useReducer, useContext, useEffect } from 'react';

const NotificationContext = createContext();

const initialState = {
  message: '',
  duration: 0,
  visible: false
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        ...state,
        message: action.payload.message,
        duration: action.payload.duration,
        visible: true
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        message: '',
        duration: 0,
        visible: false
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    if (state.visible && state.duration > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, state.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [state.visible, state.duration]);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
