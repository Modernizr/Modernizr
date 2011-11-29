// GamePad API
// https://wiki.mozilla.org/GamepadAPI
// Note: this feature detection test has been confirmed with the developers
// of the GamePad API implementation in FF
// By Addy Osmani
Modernizr.addTest('classList', !!('gamepads' in navigator));