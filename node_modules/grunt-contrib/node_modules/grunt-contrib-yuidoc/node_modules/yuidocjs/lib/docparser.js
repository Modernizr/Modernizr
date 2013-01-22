/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
YUI.add('docparser', function(Y) {

    var Lang = Y.Lang,
    trim = Lang.trim,
    stringify = Y.JSON.stringify,
    fixType = Y.Lang.fixType,
    /**
    * Parses the JSON data and formats it into a nice log string for filename and line number:
    `/file/name.js:123`
    * @method stringlog
    * @private
    * @param {Object} data The data block from the parser
    * @return {String} The formatted string.
    * @for DocParser
    */
    stringlog = function(data) {
        var line, file;
        
        if (data.file && data.line) {
            file = data.file;
            line = data.line;
        } else {
            data.forEach(function(d) {
                if (d.tag === 'file') {
                    file = d.value;
                }
                if (d.tag === 'line') {
                    line = d.value;
                }
            });
        }
        return ' ' + file + ':' + line;
    },
    /*
    * Flatted a string, remove all line breaks and replace them with a token
    * @method implodeString
    * @private
    * @param {String} str The string to operate on
    * @return {String} The modified string
    */
    implodeString = function(str) {
        return str.replace(REGEX_GLOBAL_LINES, '!~YUIDOC_LINE~!');
    },
    /*
    * Un-flatted a string, replace tokens injected with `implodeString`
    * @method implodeString
    * @private
    * @param {String} str The string to operate on
    * @return {String} The modified string
    */
    explodeString = function(str) {
        return str.replace(/!~YUIDOC_LINE~!/g, '\n');
    },
    CURRENT_NAMESPACE = 'currentnamespace',
    CURRENT_MODULE = 'currentmodule',
    MAIN_MODULE = 'mainmodule',
    CURRENT_SUBMODULE = 'currentsubmodule',
    CURRENT_FILE = 'currentfile',
    CURRENT_CLASS = 'currentclass',

    REGEX_TYPE = /(.*?)\{(.*?)\}(.*)/,
    REGEX_FIRSTWORD = /^\s*?([^\s]+)(.*)/,
    REGEX_OPTIONAL = /\[(.*?)\]/,
    REGEX_START_COMMENT = {
      js: /^\s*\/\*\*/,
      coffee: /^\s*###\*/
    },
    REGEX_END_COMMENT = {
      js: /\*\/\s*$/,
      coffee: /###\s*$/
    },
    REGEX_LINE_HEAD_CHAR = {
      js: /^\s*\*/,
      coffee: /^\s*#/
    },
    REGEX_LINES = /\r\n|\n/,
    REGEX_GLOBAL_LINES = /\r\n|\n/g,

    SHORT_TAGS = {
        'async': 1,
        'beta': 1,
        'chainable': 1,
        'extends': 1,
        'final': 1,
        'static': 1,
        'optional': 1,
        'required': 1
    },

    /**
     * A list of known tags.  This populates a member variable
     * during initialization, and will be updated if additional
     * digesters are added.
     * @property TAGLIST
     * @type Array
     * @final
     * @for DocParser
     */
    TAGLIST = [
        "async",  // bool, custom events can fire the listeners in a setTimeout
        "author", // author best for projects and modules, but can be used anywhere // multi
        "attribute", // YUI attributes -- get/set with change notification, etc
        "beta",  // module maturity identifier
        "broadcast",  // bool, events
        "bubbles", // custom events that bubble
        "category", // modules can be in multiple categories
        "chainable", // methods that return the host object
        "class", // pseudo class
        "conditional", // conditional module
        "config", // a config param (not an attribute, so no change events)
        "const", // not standardized yet, converts to final property
        "constructs", // factory methods (not yet used)
        "constructor", // this is a constructor
        "contributor", // like author
        "default", // property/attribute default value
        "deprecated", // please specify what to use instead
        "description", // can also be free text at the beginning of a comment is
        "emitfacade",  // bool, YUI custom event can have a dom-like event facade
        "event", // YUI custom event
        "evil", // uses eval
        "extension", // this is an extension for [entity]
        "extensionfor", // this is an extension for [entity]
        "extension_for", // this is an extension for [entity]
        "example", // 0..n code snippets.  snippets can also be embedded in the desc
        "experimental",  // module maturity identifier
        "extends", // pseudo inheritance
        "file", // file name (used by the parser)
        "final", // not meant to be changed
        "fireonce",  // bool, YUI custom event config allows
        "for", // used to change class context
        "global", // declare your globals
        "icon", // project icon(s)
        "in", // indicates module this lives in (obsolete now)
        "initonly", // attribute writeonce value
        "injects",  // injects {HTML|script|CSS}
        "knownissue", // 0..n known issues for your consumption
        "line", // line number for the comment block (used by the parser)
        "method", // a method
        "module", // YUI module name
        "main", // Description for the module
        "namespace", // Y.namespace, used to fully qualify class names
        "optional", // For optional attributes
        "required", // For required attributes
        "param", // member param
        "plugin", // this is a plugin for [entityl]
        "preventable", // YUI custom events can be preventable ala DOM events
        "private", // > access
        "project", // project definition, one per source tree allowed
        "property", // a regular-ole property
        "protected", // > access
        "public", // > access
        "queuable",  // bool, events
        "readonly", // YUI attribute config
        "requires", // YUI module requirements
        "return", // {type} return desc -- returns is converted to this
        "see", // 0..n things to look at
        "since", // when it was introduced
        "static",  // static
        "submodule", // YUI submodule
        "throws", // {execption type} description
        "title", // this should be something for the project description
        "todo", // 0..n things to revisit eventually (hopefully)
        "type", // the var type
        "url", // project url(s)
        "uses", // 0..n compents mixed (usually, via augment) into the prototype
        "value", // the value of a constant
        "writeonce" // YUI attribute config
    ],

    /**
     * Common errors will get scrubbed instead of being ignored.
     * @property CORRECTIONS
     * @type Object
     * @final
     * @for DocParser
     */
    CORRECTIONS = {
        'augments': 'uses', // YUI convention for prototype mixins
        'depreciated': 'deprecated', // subtle difference
        'desciption': 'description', // shouldn't need the @description tag at all
        'extend': 'extends', // typo
        'function': 'method', // we may want standalone inner functions at some point
        'member': 'method', // probably meant method
        'parm': 'param', // typo
        'params': 'param', // typo
        'pamra': 'param', // typo
        'parma': 'param', // typo
        'propery': 'property', // typo
        'prop': 'property', // probably meant property
        'returns': 'return' // need to standardize on one or the other
    },

    /**
     * A map of the default tag processors, keyed by the
     * tag name.  Multiple tags can use the same digester
     * by supplying the string name that points to the
     * implementation rather than a function.
     * @property DIGESTERS
     * @type Object
     * @final
     * @for DocParser
     */
    DIGESTERS = {

        // "params": [
        // {
        //   "name": "optionalandmultiple",
        //   "description": "my desc",
        //   "type": "string",
        //   "optional": true, // [surroundedbybrackets]
        //   "optdefault": "if specified, this is always string to avoid syntax errors @TODO",
        //   "multiple": true // endswith*
        // }
        // ],
        // @param {type} name description    -or-
        // @param name {type} description
        // #2173362 optional w/ or w/o default
        // @param {type} [optvar=default] description
        // #12 document config objects
        // @param {object|config} config description
        // @param {type} config.prop1 description
        // @param {type} config.prop2 description
        // #11 document callback argument signature
        // @param {callback|function} callback description
        // @param {type} callback.arg1 description
        // @param {type} callback.arg2 description
        // #2173362 document event facade decorations for custom events
        // @param {event} event description
        // @param {type}  event.child description
        // @param {type}  event.index description
        // @param name* {type} 1..n description
        // @param [name]* {type} 0..n description
        'param': function(tagname, value, target, block) {
            // Y.log('param digester' + value);
            target.params = target.params || [];

            if (!value) {
                this.warnings.push({
                    message: 'param name/type/descript missing',
                    line: stringlog(block)
                });
                Y.log('param name/type/descript missing: ' + stringlog(block), 'warn', 'docparser');
                return;
            }

            var type, name, optional, optdefault, parent, multiple, len,
                desc = implodeString(trim(value)),
                match = REGEX_TYPE.exec(desc),
                host = target.params;

            // Extract {type}
            if (match) {
                type = fixType(trim(match[2]));
                desc = trim(match[1] + match[3]);
            }

            // extract the first word, this is the param name
            match = REGEX_FIRSTWORD.exec(desc);
            if (match) {
                name = trim(match[1]);
                desc = trim(match[2]);
            }

            if (!name) {
                if (value && value.match(/callback/i)) {
                    this.warnings.push({
                        message: 'Fixing missing name for callback',
                        line: stringlog(block)
                    });
                    Y.log('Fixing missing name for callback:' + stringlog(block), 'warn', 'docparser');
                    name = 'callback';
                    type = 'Callback';
                } else {
                    this.warnings.push({
                        message: 'param name missing: ' + value,
                        line: stringlog(block)
                    });
                    Y.log('param name missing: ' + value + ':' + stringlog(block), 'warn', 'docparser');
                    name = 'UNKNOWN';
                }
            }

            len = name.length - 1;

            if (name.charAt(len) == '*') {
                multiple = true;
                name = name.substr(0, len);
            }

            // extract [name], optional param
            if (name.indexOf('[') > -1) {
                match = REGEX_OPTIONAL.exec(name);
                if (match) {
                    optional = true;
                    name = trim(match[1]);
                    // extract optional=defaultvalue
                    parts = name.split('=');
                    if (parts.length > 1) {
                        name = parts[0];
                        optdefault = parts[1];
                        //Add some shortcuts for object/array defaults
                        if (optdefault.toLowerCase() == 'object') {
                            optdefault = '{}';
                        }
                        if (optdefault.toLowerCase() == 'array') {
                            optdefault = '[]';
                        }
                    }
                }
            }

            // parse object.prop, indicating a child property for object
            if (name.indexOf('.') > -1) {
                match = name.split('.');
                parent = trim(match[0]);
                Y.each(target.params, function(param) {
                    if (param.name == parent) {
                        param.props = param.props || [];
                        host = param.props;
                        match.shift();
                        name = trim(match.join('.'));
                        if (match.length > 1) {
                            var pname = name.split('.')[0],
                            par;
                            Y.each(param.props, function(o) {
                                if (o.name === pname) {
                                    par = o;
                                }
                            });
                            if (par) {
                                match = name.split('.');
                                match.shift();
                                name = match.join('.');
                                par.props = par.props || [];
                                host = par.props;
                            }
                        }
                    }
                });

            }

            result = {
                name: name,
                description: explodeString(desc)
            };

            if (type) {
                result.type = type;
            }

            if (optional) {
                result.optional = true;
                if (optdefault) {
                    result.optdefault = optdefault;
                }
            }

            if (multiple) {
                result.multiple = true;
            }
            host.push(result);


        },

        // @return {type} description // methods
        // @returns {type} description // methods
        // @throws {type} an error #2173342
        // @injects {HTML|CSS|script} description
        // can be used by anthing that has an optional {type} and a description
        'return': function(tagname, value, target, block) {

            var desc = implodeString(trim(value)), type,
                match = REGEX_TYPE.exec(desc),
                result = {};
            if (match) {
                type = fixType(trim(match[2]));
                desc = trim(match[1] + match[3]);
            }

            result = {
                description: explodeString(desc)
            };

            if (type) {
                result.type = type;
            }

            target[tagname] = result;

        },
        'throws': 'return',
        'injects': 'return',

        // trying to overwrite the constructor value is a bad idea
        'constructor': function(tagname, value, target, block) {
            target.is_constructor = 1;
        },

        // @author {twitter: @arthurdent | github: ArthurDent}
        //    Arthur Dent adent@h2g2.earth #23, multiple // modules/class/method
        // 'author': function(tagname, value, target, block) {
        //     // Y.log('author digester');
        // },

        // A key bock type for declaring modules and submodules
        // subsequent class and member blocks will be assigned
        // to this module.
        'module': function(tagname, value, target, block) {
            this.set(CURRENT_MODULE, value);
            var go = true;
            Y.some(block, function(o) {
                if (trim(o.tag) == 'submodule') {
                    go = false;
                    return true;
                }
            });
            if (go) {
                if (!this.get(MAIN_MODULE)) {
                    var o = {
                        tag: tagname,
                        name: value,
                        file: target.file,
                        line: target.line,
                        description: target.description
                    };
                    this.set(MAIN_MODULE, o);
                }
                host = this.modules[value];
                return host;
            }
            return null;
        },

        //Setting the description for the module..
        'main': function(tagname, value, target, block) {
            var o = target;
            o.mainName = value;
            o.tag = tagname;
            o.itemtype = 'main';
	        o._main = true;
            this.set(MAIN_MODULE, o);
        },

        // accepts a single project definition for the source tree
        'project': function(tagname, value, target, block) {
            return this.project;
        },

        // A key bock type for declaring submodules.  subsequent class and
        // member blocks will be assigned to this submodule.
        'submodule': function(tagname, value, target, block) {
            //console.log('Setting current submodule: ', value, 'on class');
            this.set(CURRENT_SUBMODULE, value);
            var host = this.modules[value],
                clazz = this.get(CURRENT_CLASS),
                parent = this.get(CURRENT_MODULE);
                if (parent) {
                    host.module = parent;
                }
                if (clazz && this.classes[clazz]) {
                    //console.log('Adding submodule', value , 'to class', clazz, ' it has submodule', this.classes[clazz].submodule);
                    //if (!this.classes[clazz].submodule) {
                        //console.log('REALLY Adding submodule', value , 'to class', clazz);
                        this.classes[clazz].submodule = value;
                    //}
                }
            return host;
        },

        // A key bock type for declaring classes, subsequent
        // member blocks will be assigned to this class
        'class': function(tagname, value, target, block) {
            var _namespace, _value = value;

            block.forEach(function(def) {
                if (def.tag === 'namespace') {
                    //We have a namespace, augment the name
                    var name = trim(def.value) + '.' + value;
                    if (value.indexOf(trim(def.value) + '.') === -1) {
                        value = name;
                        _namespace = trim(def.value);
                    }
                }
            });

            if (_namespace) {
                this.set(CURRENT_NAMESPACE, _namespace);
            }
            this.set(CURRENT_CLASS, value);
            var fullname = this.get(CURRENT_CLASS);
            var host = this.classes[fullname],
                parent = this.get(CURRENT_MODULE);

            if (_namespace) {
                host.namespace = _namespace;
            }
            if (parent) {
                host.module = parent;
            }

            //Merge host and target in case the class was defined in a "for" tag
            //before it was defined in a "class" tag
            host = Y.merge(host, target);
            this.classes[fullname] = host;
            parent = this.get(CURRENT_SUBMODULE);
            if (parent) {
                //this.set(CURRENT_SUBMODULE, parent);
                host.submodule = parent;
            }
            return host;
        },

        // change 'const' to final property
        'const': function(tagname, value, target, block) {
            target.itemtype = 'property';
            target.name = value;
            target['final'] = '';
        },

        // supported classitems
        'property': function(tagname, value, target, block) {
            var match, name, desc;

            target.itemtype = tagname;
            target.name = value;
            if (!target.type) {
                desc = implodeString(trim(value)),
                match = REGEX_TYPE.exec(desc);
                
                // Extract {type}
                if (match) {
                    type = fixType(trim(match[2]));
                    name = trim(match[1] + match[3]);
                    target.type = type;
                    target.name = name;
                }
                
            }
            if (target.type && target.type.toLowerCase() === 'object') {
                block.forEach(function(i, k) {
                    if (i.tag === 'property') {
                        i.value = trim(i.value);
                        i.tag = 'param';
                        block[k] = i;
                    }
                });
            }
        },
        'method': 'property',
        'attribute': 'property',
        'config': 'property',
        'event': 'property',

        // access fields
        'public': function(tagname, value, target, block) {
            target.access = tagname;
            target.tagname = value;
        },
        'private': 'public',
        'protected': 'public',
        'inner': 'public',

        // tags that can have multiple occurances in a single block
        'todo': function(tagname, value, target, block) {
            if (!Lang.isArray(target[tagname])) {
                target[tagname] = [];
            }
            //If the item is @tag one,two
            if (value.indexOf(',') > -1) {
                value = value.split(',');
            } else {
                value = [value];
            }
            
            value.forEach(function(v) {
                v = trim(v);
                target[tagname].push(v);
            });
        },
        'extension_for': 'extensionfor',
        'extensionfor': function(tagname, value, target, block) {
            if (this.classes[this.get(CURRENT_CLASS)]) {
                this.classes[this.get(CURRENT_CLASS)].extension_for.push(value);
            }
        },
        'example': function(tagname, value, target, block) {
            if (!Lang.isArray(target[tagname])) {
                target[tagname] = [];
            }

            var e = value;
            block.forEach(function(v) {
                if (v.tag == 'example') {
                    if (v.value.indexOf(value) > -1) {
                        e = v.value;
                    }
                }
            });

            target[tagname].push(e);
        },
        'url': 'todo',
        'icon': 'todo',
        'see': 'todo',
        'throws': 'todo',
        'requires': 'todo',
        'knownissue': 'todo',
        'uses': 'todo',
        'category': 'todo',
        'unimplemented': 'todo',

        genericValueTag: function (tagname, value, target, block) {
            target[tagname] = value;
        },

        'author'     : 'genericValueTag',
        'contributor': 'genericValueTag',
        'since'      : 'genericValueTag',

        'deprecated': function (tagname, value, target, block) {
            target.deprecated = true;

            if (typeof value === 'string' && value.length) {
                target.deprecationMessage = value;
            }
        },

        // updates the current namespace
        'namespace': function(tagname, value, target, block) {
            this.set(CURRENT_NAMESPACE, value);
            if (value === '') {
                //Shortcut this if namespace is an empty string.
                return;
            }
            var file = this.get(CURRENT_FILE);
            if (file) {
                this.files[file].namespaces[value] = 1;
            }
            var mod = this.get(CURRENT_MODULE);
            if (mod) {
                this.modules[mod].namespaces[value] = 1;
            }

            var mod = this.get(CURRENT_SUBMODULE);
            if (mod) {
                this.modules[mod].namespaces[value] = 1;
            }

            var mod = this.get(CURRENT_CLASS);
            if (mod) {
                var lastNS = this.get('lastnamespace');
                if (lastNS && lastNS !== value && (value.indexOf(lastNS + '.') !== 0)) {
                    if (this.classes[mod]) {
                        var m = this.classes[mod];
                        delete this.classes[mod];
                        mod = value + '.' + mod.replace(lastNS + '.', '');
                        m.name = mod;
                        m.namespace = value;
                        this.classes[mod] = m;
                        this.set(CURRENT_CLASS, m.name);
                    }
                }
                if (this.classes[mod]) {
                    this.classes[mod].namespace = value;
                    if (mod === value) {
                        return;
                    }
                    if (mod.indexOf(value + '.') === -1) {
                        if (mod.indexOf('.') === -1) {
                            var m = this.classes[mod];
                            delete this.classes[mod];
                            var name = m.namespace + '.' + m.name;
                            m.name = name;
                            this.classes[name] = m;
                            this.set(CURRENT_CLASS, name);
                        } else {
                            if (mod.indexOf(this.classes[mod].namespace + '.') === -1) {
                                var m = this.classes[mod];
                                delete this.classes[mod];
                                var name = m.namespace + '.' + m.shortname;
                                m.name = name;
                                this.classes[name] = m;
                                this.set(CURRENT_CLASS, name);
                            }
                        }
                    }
                }
            }
        },

        // updates the current class only (doesn't create
        // a new class definition)
        'for': function(tagname, value, target, block) {
            value = this._resolveFor(value);
            this.set(CURRENT_CLASS, value);
            var ns = ((this.classes[value]) ? this.classes[value].namespace : '');
            this.set(CURRENT_NAMESPACE, ns);
            var file = this.get(CURRENT_FILE);
            if (file) {
                this.files[file].fors[value] = 1;
            }
            var mod = this.get(CURRENT_MODULE);
            if (mod) {
                this.modules[mod].fors[value] = 1;
            }

            var mod = this.get(CURRENT_SUBMODULE);
            if (mod) {
                this.modules[mod].fors[value];
            }
        }

    },

    /**
     * The doc parser accepts a **map** of files to file content.
     * Once `parse()` is called, various properties will be populated
     * with the parsers data (aggregated in the `'data'` property).
     * @class DocParser
     * @extends Base
     * @constructor
     * @param {Object} o the config object
     * @module yuidoc
     */
    DocParser = function(o) {
        this.digesters = Y.merge(DIGESTERS);
        this.knowntags = Y.Array.hash(TAGLIST);
        DocParser.superclass.constructor.apply(this, arguments);
    };

    DocParser.NAME = 'DocParser';

    DocParser.ATTRS = {
        
        lint: {
            value: false
        },

        /**
         * Digesters process the tag/text pairs found in a
         * comment block.  They are looked up by tag name.
         * The digester gets the tagname, the value, the
         * target object to apply values to, and the full
         * block that is being processed.  Digesters can
         * be declared as strings instead of a function --
         * in that case, the program will try to look up
         * the key listed and use the function there instead
         * (it is an alias).  Digesters can return a host
         * object in the case the tag defines a new key
         * block type (modules/classes/methods/events/properties)
         * @attribute digesters
         */
        digesters: {
            setter: function(val) {
                Y.mix(this.digesters, val, true);
                Y.mix(this.knowntags, val, true);
                return val;
            }
        },

        /**
         * Emitters will be schemas for the types of payloads
         * the parser will emit.  Not implemented.
         * @attribute emitters
         */
        emitters: {
            setter: function(val) {
                Y.mix(this.emitters, val, true);
            }
        },

        /**
         * Comment syntax type. 
         * @attribute syntaxtype
         * @type String
         */
        syntaxtype: {
            writeOnce: true,
        },

        /**
         * The map of file names to file content.
         * @attribute filemap
         */
        filemap: {
            writeOnce : true
        },

        /**
         * A map of file names to directory name.  Provided in
         * case this needs to be used to reset the module name
         * appropriately -- currently not used
         * @attribute dirmap
         */
        dirmap: {
            writeOnce : true
        },

        /**
         * The file currently being parsed
         * @attribute currentfile
         * @type String
         */
        currentfile: {
            setter: function(val) {
                val = trim(val);
                // this.set(CURRENT_NAMESPACE, '');
                if (!(val in this.files)) {
                    this.files[val] = {
                        name: val,
                        modules: {},
                        classes: {},
                        fors: {},
                        namespaces: {}
                    };
                }
                return val;
            }
        },
        /**
        * The main documentation block for the module itself.
        * @attribute mainmodule
         * @type String
        */
        mainmodule: {
            setter: function(o) {
                if (!o) {
                    return;
                }
		        //console.log('Main Module Setter: ', o);
                var write = true,
                    name = o.mainName || o.name;
               	if (this.get(CURRENT_MODULE) === name) {

                    if (name in this.modules) {
                        //console.log('In Global Modules', this.modules[name]);
                        if (this.modules[name].tag) {
                            //The main module has already been added, don't over write it.
                            if (this.modules[name].tag === 'main') {
                                write = false;
                            }
                        }
                        if (write) {
			                //console.log('Writing');
                            this.modules[name] = Y.merge(this.modules[name], o);
                        }
                    } else {
                        if (o._main) {
			                //console.log('Writing');
                            this.modules[name] = o;
                        }
                    }
                }
            }
        },
        /**
         * The module currently being parsed
         * @attribute currentmodule
         * @type String
         */
        currentmodule: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                val = trim(val);
                this.set(CURRENT_SUBMODULE, '');
                this.set(CURRENT_NAMESPACE, '');
		        var m = this.get(MAIN_MODULE);
		        if (m && m.name !== val) {
                	this.set(MAIN_MODULE, '');
		        }
                var clazz = this.classes[this.get(CURRENT_CLASS)];
                if (clazz) {
                    //Handles case where @module comes after @class in a new directory of files 
                    if (clazz.module !== val) {
                        if (this.modules[clazz.module]) {
                            delete this.modules[clazz.module].submodules[clazz.submodule];
                            delete this.modules[clazz.module].classes[clazz.name];
                        }
                        if (clazz.submodule && this.modules[clazz.submodule]) {
                            delete this.modules[clazz.submodule].submodules[clazz.submodule];
                            delete this.modules[clazz.submodule].classes[clazz.name];
                        }
                        clazz.module = val;
                        if (this.modules[val]) {
                            this.modules[val].submodules[clazz.submodule] = 1;
                            this.modules[val].classes[clazz.name] = 1;
                        }
                        if (clazz.submodule && this.modules[clazz.submodule]) {
                            this.modules[clazz.submodule].module = val;
                        }
                    }
                }
                if (!(val in this.modules)) {
                    this.modules[val] = {
                        name: val,
                        submodules: {},
                        classes: {},
                        fors: {},
                        namespaces: {}
                    };
                }
                return val;
            }
        },

        /**
         * The submodule currently being parsed
         * @attribute currentsubmodule
         * @type String
         */
        currentsubmodule: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                val = trim(val);
                if (!(val in this.modules)) {
                    var mod = this.modules[val] = {
                        name: val,
                        submodules: {},
                        classes: {},
                        fors: {},
                        is_submodule: 1,
                        namespaces: {}
                    };

                    mod.module = this.get(CURRENT_MODULE);
                    mod.namespace = this.get(CURRENT_NAMESPACE);
                }
                //console.log('SETTING CURRENT SUBMODULE: ', val, 'ON CLASS', this.get(CURRENT_CLASS));
                return val;
            }
        },
        currentnamespace: {
            setter: function(val) {
                this.set('lastnamespace', this.get(CURRENT_NAMESPACE));
                return val;
            }
        },
        lastnamespace: {

        },
        lastclass: {

        },
        /**
         * The class currently being parsed
         * @attribute currentclass
         * @type String
         */
        currentclass: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                this.set('lastclass', this.get(CURRENT_CLASS));
                val = trim(val);
                if (!(val in this.classes)) {
                    var ns = this.get(CURRENT_NAMESPACE),
                        name = (ns && ns !== '' && (val.indexOf(ns + '.') !== 0)) ? ns + '.' + val : val,
                        clazz = this.classes[name] = {
                            name: name,
                            shortname: val,
                            classitems: [],
                            plugins: [],
                            extensions: [],
                            plugin_for: [],
                            extension_for: []
                        };
                    clazz.module = this.get(CURRENT_MODULE);
                    if (this.get(CURRENT_SUBMODULE)) {
                        clazz.submodule = this.get(CURRENT_SUBMODULE);
                    }
                    clazz.namespace = ns;
                }
                return name;
            }
        }
    };

    Y.extend(DocParser, Y.Base, {
        /**
        * Takes a non-namespaced classname and resolves it to a namespace (to support `@for`)
        * @private
        * @method _resolveFor
        * @param {String} value The classname to resolve
        * @return {String} The resolved namespace + classname
        */
        _resolveFor: function(value) {
            if (value.indexOf('.') === -1) {
                Y.each(this.classes, function(i) {
                    if (i.shortname === value) {
                        if (i.namespace) {
                            value = i.namespace + '.' + i.shortname;
                        }
                    }
                });
            }
            return value;
        },

        initializer: function() {

            this.warnings = [];

            var self = this;
            self.after('currentfileChange', function(e) {
                /*
                * File changed, so we reset class and submodule.
                * You should use @for if you want to reference another class
                * in different file.
                */
                self.set(CURRENT_SUBMODULE, '');
                self.set(CURRENT_CLASS, '');
            });

            self.after('currentmoduleChange', function(e) {
                var mod = e.newVal, classes = self.classes;
                Y.each(classes, function(clazz) {
                    if (!(clazz.module)) {
                        clazz.module = mod;
                    }
                });
            });

            self.after('currentsubmoduleChange', function(e) {
                var mod = e.newVal, classes = self.classes,
                    parent;

                if (mod) {
                    parent = self.modules[mod].module;
                    Y.each(classes, function(clazz) {
                        if (!(clazz.submodule)) {
                            //if ((!clazz.module) || clazz.module == parent) {
                            if (!clazz.module) {
                                //console.log('Adding Submodule: ', mod, ' to', clazz.module, 'with parent', parent);
                                clazz.submodule = mod;
                            }
                        }
                    });
                }
            });

            self.after('currentclassChange', function(e) {
                var clazz = e.newVal;
                Y.each(self.classitems, function(item) {
                    if (!(item["class"])) {
                        item["class"] = clazz;
                    }
                });
                // Y.log(self.classitems);
            });

        },
        /**
        Normalizes the initial indentation of the given _content_ so that the first line
        is unindented, and all other lines are unindented to the same degree as the
        first line. So if the first line has four spaces at the beginning, then all
        lines will be unindented four spaces. Ported from [Selleck](https://github.com/rgrove/selleck)

        @method unindent
        @param {String} content Text to unindent.
        @return {String} Unindented text.
        @private
        **/

        unindent: function(content) {
            var indent = content.match(/^(\s+)/);

            if (indent) {
                content = content.replace(new RegExp('^' + indent[1], 'gm'), '');
            }

            return content;
        },

        /**
         Transforms a JavaDoc style comment block (less the start
         and end of it) into a list
         of tag/text pairs.  The leading space and '*' are removed,
         but the remaining whitespace is preserved so that the
         output should be friendly for both markdown and html
         parsers.

         @method handlecomment
         @param {String} comment The comment to parse
         @param {String} file The file it was parsed from
         @param {String} line The line number it was found on
         */
        handlecomment: function(comment, file, line) {
            var lines = comment.split(REGEX_LINES),
                len = lines.length, i,
                parts, part, peek, skip,
                results = [{tag: 'file', value: file},
                           {tag: 'line', value: line}],
                syntaxtype = this.get('syntaxtype'),
                lineHeadCharRegex = REGEX_LINE_HEAD_CHAR[syntaxtype],
                hasLineHeadChar  = lines[0] && lineHeadCharRegex.test(lines[0]);

// trim leading line head char(star or harp) if there are any
            if (hasLineHeadChar) {
                for (i = 0; i < len; i++) {
                    lines[i] = lines[i].replace(lineHeadCharRegex, '');
                }
            }

// reconsitute and tokenize the comment block
            comment = this.unindent(lines.join('\n'));
            parts = comment.split(/(?:^|\n)\s*(@\w*)/);
            len = parts.length;
            for (i = 0; i < len; i++) {
                value = '';
                part = parts[i];
                if (part === '') {
                    continue;
                }
                skip = false;

// the first token may be the description, otherwise it should be a tag
                if (i === 0 && part.substr(0, 1) !== '@') {
                    if (part) {
                        tag = '@description';
                        value = part;
                    } else {
                        skip = true;
                    }
                } else {
                    tag = part;
                    // lookahead for the tag value
                    peek = parts[i + 1];
                    if (peek) {
                        value = peek;
                        i++;
                    }
                }

                if (!skip && tag) {
                    results.push({
                        tag: tag.substr(1).toLowerCase(),
                        value: value
                    });
                }
            }

            return results;
        },

        /**
         * Accepts a map of filenames to file content.  Returns
         * a map of filenames to an array of API comment block
         * text.  This expects the comment to start with / **
         * on its own line, and end with * / on its own
         * line.  Override this function to provide an
         * alternative comment parser.
         * @method extract
         * @param {Object} filemap A map of filenames to file content
         * @param {Array} dirmap A map of file names to directory name
         * @return {Object} A map of filenames to an array of extracted
         * comment text.
         */
        extract: function(filemap, dirmap) {
            filemap = filemap || this.get('filemap');
            dirmap = dirmap || this.get('dirmap');
            var syntaxtype = this.get('syntaxtype');
            var commentmap = {};
            Y.each(filemap, function(code, filename) {

                var commentlines, comment,
                    lines = code.split(REGEX_LINES),
                    len = lines.length, i, linenum;

                for (i = 0; i < len; i++) {
                    line = lines[i];
                    if(REGEX_START_COMMENT[syntaxtype].test(line)) {
                        commentlines = [];

                        linenum = i + 1;

                        while (i < len && (!REGEX_END_COMMENT[syntaxtype].test(line))) {
                            commentlines.push(line);
                            i++;
                            line = lines[i];
                        }

                        // we can look ahead here if we need to guess the
                        // name/type like we do in the python version.

                        // remove /**
                        commentlines.shift();
                        comment = commentlines.join('\n');
                        commentmap[filename] = commentmap[filename] || [];
                        commentmap[filename]
                          .push(this.handlecomment(comment, filename, linenum));
                    }
                }
            }, this);

            this.commentmap = commentmap;
            return commentmap;
        },

        /**
         * Processes all the tags in a single comment block
         * @method processblock
         * @param {Array} an array of the tag/text pairs
         */
        processblock: function(block) {
            var target = {},
                clazz,
                module,
                submodule,
                digestname,
                digester,
                host;
            // Y.log(block);
            Y.each(block, function(tag) {
                var name = trim(tag.tag),
                    value = trim(tag.value),
                    parent, ret;

                //Convert empty values to a 1 for JSON data parsing later
                if (SHORT_TAGS[name] && value === '') {
                    value = 1;
                }

                if (tag && tag.tag) {

                    if (!(name in this.knowntags)) {
                        if (name in CORRECTIONS) {
                            this.warnings.push({
                                message: 'replacing incorrect tag: ' + name + ' with ' + CORRECTIONS[name],
                                line: stringlog(block)
                            });
                            Y.log('replacing incorrect tag: ' + name + ' with ' + CORRECTIONS[name] + ': ' + stringlog(block), 'warn', 'docparser');
                            name = CORRECTIONS[name];
                        } else {
                            this.warnings.push({
                                message: 'unknown tag: ' + name,
                                line: stringlog(block)
                            });
                            Y.log('unknown tag: ' + name + ',' + stringlog(block), 'warn', 'docparser');
                        }
                    }
                    digestname = name;
                    if (digestname in this.digesters) {
                        digester = this.digesters[digestname];
                        if (Lang.isString(digester)) {
                            digester = this.digesters[digester];
                        }
                        ret = digester.call(this, name, value, target, block);
                        host = host || ret;
                    } else {
                        target[name] = value;
                    }
                }

            }, this);

            if (host) {
                Y.mix(host, target);
            } else {
                this.classitems.push(target);
                target['class'] = this.get(CURRENT_CLASS);
                target.module = this.get(CURRENT_MODULE);
                host = this.get(CURRENT_SUBMODULE);
                if (host) {
                    target.submodule = host;
                }
                host = this.get(CURRENT_NAMESPACE);
                if (host) {
                    target.namespace = host;
                }
            }
        },

        /**
         * Transforms a map of filenames to arrays of comment blocks into a
         * JSON structure that represents the entire processed API doc info
         * and relationships between elements for the entire project.
         * @method transform
         * @param {object} commentmap The hash of files and parsed comment blocks
         * @return {object} The transformed data for the project
         */
        transform: function(commentmap) {
            var self = this,
                project = self.project = {},
                files = self.files = {},
                modules = self.modules = {},
                classes = self.classes = {},
                classitems = self.classitems = [],
                data = self.data = {
                    project: project,
                    files: files,
                    modules: modules,
                    classes: classes,
                    classitems: classitems
                };

            commentmap = commentmap || self.commentmap;

            // process
            Y.each(commentmap, function(blocks, file) {
                //Y.log('transform: ' + file, 'info', 'docparser');
                self.set(CURRENT_FILE, file);
                Y.each(blocks, function(block) {
                    self.processblock(block);
                });
            });

            // cross reference
            Y.each(modules, function(module, name) {
                if (module.file) {
                    files[module.file].modules[name] = 1;
                }
                if (module.is_submodule) {
                    modules[module.module].submodules[name] = 1;
                }
                //Clean up processors
                delete module.mainName;
                delete module._main;
            });

            Y.each(classes, function(clazz, name) {
                if (clazz.module) {
                    modules[clazz.module].classes[name] = 1;
                }
                //console.error('------------------------------');
                //console.error(clazz);
                //console.error(modules[clazz.submodule]);
                //console.error('------------------------------');
                if (clazz.submodule) {
                    modules[clazz.submodule].classes[name] = 1;
                    if (!modules[clazz.submodule].description) {
                        modules[clazz.submodule].description = clazz.description;
                    }
                }

                if (clazz.file) {
                    files[clazz.file].classes[name] = 1;
                    if (modules[clazz.module]) {
                        modules[clazz.module].file = clazz.file;
                        modules[clazz.module].line = clazz.line;
                    }
                    if (modules[clazz.submodule]) {
                        modules[clazz.submodule].file = clazz.file;
                        modules[clazz.submodule].line = clazz.line;
                    }
                }
                if (clazz.uses && clazz.uses.length) {
                    clazz.uses.forEach(function(u) {
                        var c = classes[u];
                        if (c) {
                            c.extension_for.push(clazz.name);
                        }
                    });
                }
            });

            Y.each(classitems, function(v) {
                if (!v.itemtype) {
                    self.warnings.push({
                        message: 'Missing item type' + (v.description ? '\n' + v.description : ''),
                        line:  stringlog(v)
                    });
                    Y.log('Missing item type: ' + stringlog(v), 'warn', 'DocParser');
                    if (v.description) {
                        Y.log('\t\t' + v.description, 'warn', 'DocParser');
                    }
                }
                if (v.itemtype === 'property' && v.params) {
                    v.subprops = v.params;
                    v.subprops.forEach(function(i) {
                        //Remove top level prop name from sub props (should have been done in the @param parser
                        i.name = i.name.replace(v.name + '.', '');
                    });
                    delete v.params;
                }
            });

            Y.each(modules, function(mod) {
                if (!mod.file || !mod.line || !mod.name) {
                    console.log('Failed to find lines for', mod);
                }
            });

            return self;
        },

        /**
         * Extracts and transforms the filemap provided to constructor
         * @method parse
         * @param {Array} filemap A map of filenames to file content
         * @param {Array} dirmap A map of file names to directory name
         * @return {DocParser} this parser instance.  The total results
         * are available in parser.data.
         */
        parse: function(filemap, dirmap) {
            filemap = filemap || this.get('filemap');
            dirmap = dirmap || this.get('dirmap');
            return this.transform(this.extract(filemap, dirmap));
        }

    });

    Y.DocParser = DocParser;

}, '0.1.0', { requires: ['base-base', 'json-stringify'] });

