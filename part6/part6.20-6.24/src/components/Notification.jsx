import React from 'react';
import { useNotification } from './NotificationContext'; // Adjust the path as needed

const Notification = () => {
  const { state } = useNotification();

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  };

  if (!state.visible) return null;

  return (
    <div style={style}>
      {state.message}
    </div>
  );
};

export default Notification;




