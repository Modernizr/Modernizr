// GamePad API
// https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
// By Eric Bidelman

Modernizr.addTest('gamepads', !!Modernizr.prefixed('Gamepads', navigator) ||
    !!Modernizr.prefixed('GetGamepads', navigator));
