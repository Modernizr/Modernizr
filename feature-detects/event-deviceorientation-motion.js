// support for orientation and motion events by way of device accelerometers  

Modernizr.addTest('deviceorientation', 'DeviceOrientationEvent' in window);

Modernizr.addTest('devicemotion', 'DeviceMotionEvent' in window);
