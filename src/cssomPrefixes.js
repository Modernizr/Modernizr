import {ModernizrProto} from './Modernizr.js';
import omPrefixes from './omPrefixes.js';

var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);

export default cssomPrefixes;
