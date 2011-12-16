// Notifications
// By Theodoor van Donge

// webkitNotification is only used by Chrome 
//	http://www.html5rocks.com/en/tutorials/notifications/quick/
// Notification only exist in the draft specs 
//	http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html#idl-if-Notification

Modernizr.addTest('notification', !!window.webkitNotifications || !!window.Notification);