// export the global, so we don't directly reference window
var _globalThis = new Function('return this')();

export default _globalThis
