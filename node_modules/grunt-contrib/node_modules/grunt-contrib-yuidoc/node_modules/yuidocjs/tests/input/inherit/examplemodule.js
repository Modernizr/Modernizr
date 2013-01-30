/**
 * This is my example module
 * @module ExampleModule
 * @example
 *
 *     var bar;
 *
 */

YUI.add('examplemodule', function (Y) {
        Y.namespace('mywidget');
        
        /**
         * <b>Superclass</b> description.<br>This is a second line too.
         * 
         * @constructor
         * @class SuperWidget
         * @extends Widget
         * @namespace mywidget
         * @example
         *
         *     var bar;
         *
         */
        Y.mywidget.superwidget = Y.Base.create("mysuperwidget", Y.Widget, [], {
                
                /**
                 * <b>Supermethod</b> description.<br>This is a second line.
                 * 
                 * @method myMethod
                 * @async
                 */
                myMethod: function () {}
                
                /**
                * Overwritten method see {{#crossLink "mywidget.SuperWidget"}}{{/crossLink}}
                * also see {{#crossLink "mywidget.SuperWidget/myMethod"}}{{/crossLink}}
                * This is also a test {{#davglass "Foo"}}{{/davglass}}
                * @method getTargets2
                * @example
                *
                *     var bar;
                *
                */
                /**
                * Override Attribute
                * @attribute focused2
                * @optional
                */

                /**
                * Override Attribute
                * @attribute focused3
                * @required
                */

                /**
                * Override Property
                * @property name2
                * @type String
                */

                /**
                * Override Event
                * @event init2
                */
                 
        }, {
        
        });
        
        /**
         * Subclass description.
         * 
         * @constructor
         * @namespace mywidget
         * @class SubWidget
         * @extends mywidget.SuperWidget
         */
        Y.mywidget.superwidget = Y.Base.create("mysuperwidget", Y.mywidget.superwidget, [], {
                
                /**
                 * Submethod description.
                 * 
                 * @method myMethod
                 * @param {boolean} d Foo
                 */
                myMethod: function () {}
                 
        }, {
        
        });

        /**
         * Subclass description.
         * 
         * @constructor
         * @namespace mywidget
         * @class SubWidget2
         * @extends Accordion
         */
});
