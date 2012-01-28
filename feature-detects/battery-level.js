
// Low Battery Level
// Enable a developer to remove CPU intensive CSS/JS when battery is low
// https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
// By: Paul Sayre

Modernizr.addTest('lowbattery', function () {
	var minLevel = 0.20,
		nav = window.navigator,
		battery = nav.battery || nav.webkitBattery || nav.mozBattery,
		low = battery && !battery.charging && battery.level <= minLevel;
	return !!low;
});