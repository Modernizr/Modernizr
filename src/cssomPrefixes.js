import ModernizrProto from 'ModernizrProto';
import omPrefixes from 'omPrefixes';
var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
ModernizrProto._cssomPrefixes = cssomPrefixes;
export default cssomPrefixes;
