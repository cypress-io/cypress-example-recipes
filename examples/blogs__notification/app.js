/* eslint-env browser */
/* eslint-disable no-console */
/* eslint-disable-next-line no-unused-vars */
function notifyMe () {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')

    return
  }

  // Let's check whether notification permissions have already been granted
  if (Notification.permission === 'granted') {
    console.log('permission was granted before')
    // If it's okay let's create a notification
    new Notification('Permission was granted before')

    return
  }

  // Otherwise, we need to ask the user for permission
  if (Notification.permission !== 'denied') {
    console.log('need to ask for permission')
    Notification.requestPermission().then(function (permission) {
      console.log('permission requested, the user says'.permission)
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        console.log('permission granted, showing hi')
        console.log(Notification)
        new Notification('Hi there!')
      }
    })

    return
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
  console.log('Permission was denied before')
}
