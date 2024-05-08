const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="confirmation">
      {message}
    </div>
  )
}


export{ Notification, ErrorNotification }