
const token = document.cookie.split('=')[1];
const socket = io();

// On Logout Reload the Window
socket.on(`log-out-${token}` , () => {
  location.reload();
});