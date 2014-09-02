define(['ModernizrProto', 'isEventSupported'], function( ModernizrProto, isEventSupported ) {
  // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
  // Modernizr.hasEvent('gesturestart', elem)
  var hasEvent = ModernizrProto.hasEvent = isEventSupported;
  return hasEvent;
});
