/**
 * AxisType is an abstract class that manages the data for an axis.
 *
 * @module charts
 * @class AxisType
 * @constructor
 * @extends Axis
 */
Y.AxisType = Y.Base.create("baseAxis", Y.Axis, [], {
    /**
     * @method initializer
     * @private
     */
    initializer: function()
    {
        this.after("dataReady", Y.bind(this._dataChangeHandler, this));
        this.after("dataUpdate", Y.bind(this._dataChangeHandler, this));
        this.after("minimumChange", Y.bind(this._keyChangeHandler, this));
        this.after("maximumChange", Y.bind(this._keyChangeHandler, this));
        this.after("keysChange", this._keyChangeHandler);
        this.after("dataProviderChange", this._dataProviderChangeHandler);
        this.after("alwaysShowZeroChange", this._keyChangeHandler);
        this.after("roundingMethodChange", this._keyChangeHandler);
    },

    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        this.after("stylesChange", this._updateHandler);
        this.after("overlapGraphChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
        this.after("calculatedWidthChange", this._handleSizeChange);
        this.after("calculatedHeightChange", this._handleSizeChange);
    },

    /**
     * Handles changes to `dataProvider`.
     *
     * @method _dataProviderChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _dataProviderChangeHandler: function(e)
    {
        var keyCollection = this.get("keyCollection").concat(),
            keys = this.get("keys"),
            i;
        if(keys)
        {
            for(i in keys)
            {
                if(keys.hasOwnProperty(i))
                {
                    delete keys[i];
                }
            }
        }
        if(keyCollection && keyCollection.length)
        {
            this.set("keys", keyCollection);
        }
    },

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuibaseaxis",
	
    /**
     * Type of data used in `Axis`.
     *
     * @property _type
     * @type String 
     * @readOnly
     * @private
     */
    _type: null,
	
    /**
     * Storage for `setMaximum` attribute.
     *
     * @property _setMaximum
     * @type Object
     * @private
     */
    _setMaximum: null,
	
    /**
     * Storage for `dataMaximum` attribute.
     *
     * @property _dataMaximum
     * @type Object
     * @private
     */
    _dataMaximum: null,
	
    /**
     * Storage for `setMinimum` attribute.
     *
     * @property _setMinimum
     * @type Object
     * @private
     */
    _setMinimum: null,
	
    /**
     * Reference to data array.
     *
     * @property _data
     * @type Array
     * @private
     */
    _data: null,

    /**
     * Indicates whether the all data is up to date.
     *
     * @property _updateTotalDataFlag
     * @type Boolean
     * @private
     */
    _updateTotalDataFlag: true,

    /**
     * Storage for `dataReady` attribute.
     *
     * @property _dataReady
     * @type Boolean
     * @readOnly
     * @private
     */
    _dataReady: false,
	
    /**
     * Adds an array to the key hash.
     *
     * @method addKey
     * @param value Indicates what key to use in retrieving
     * the array.
     */
    addKey: function (value)
	{
        this.set("keys", value);
	},

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArray = [],
            len = data.length;
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArray[i] = obj[key];
        }
        return keyArray;
    },

    /**
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private 
     */
    _setDataByKey: function(key, data)
    {
        var i,
            obj, 
            arr = [], 
            dv = this._dataClone.concat(), 
            len = dv.length;
        for(i = 0; i < len; ++i)
        {
            obj = dv[i];
            arr[i] = obj[key];
        }
        this.get("keys")[key] = arr;
        this._updateTotalDataFlag = true;
    },

    /**
     * Updates the total data array.
     *
     * @method _updateTotalData
     * @private
     */
    _updateTotalData: function()
    {
		var keys = this.get("keys"),
            i;
        this._data = [];
        for(i in keys)
        {
            if(keys.hasOwnProperty(i))
            {
                this._data = this._data.concat(keys[i]);
            }
        }
        this._updateTotalDataFlag = false;
    },

    /**
     * Removes an array from the key hash.
     * 
     * @method removeKey
     * @param {String} value Indicates what key to use in removing from 
     * the hash.
     */
    removeKey: function(value)
    {
        var keys = this.get("keys");
        if(keys.hasOwnProperty(value)) 
        {
            delete keys[value];
            this._keyChangeHandler();
        }
    },

    /**
     * Returns a value based of a key value and an index.
     *
     * @method getKeyValueAt
     * @param {String} key value used to look up the correct array
     * @param {Number} index within the array
     * @return Number 
     */
    getKeyValueAt: function(key, index)
    {
        var value = NaN,
            keys = this.get("keys");
        if(keys[key] && Y_Lang.isNumber(parseFloat(keys[key][index])))
        {
            value = keys[key][index];
        }
        return parseFloat(value);
    },

    /**
     * Returns an array of values based on an identifier key.
     *
     * @method getDataByKey
     * @param {String} value value used to identify the array
     * @return Object
     */
    getDataByKey: function (value)
    {
        var keys = this.get("keys");
        if(keys[value])
        {
            return keys[value];
        }
        return null;
    },

    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function() 
    {
        var data = this.get("data"),
            max = 0,
            min = 0,
            len,
            num,
            i;
        if(data && data.length && data.length > 0)
        {
            len = data.length;
            max = min = data[0];
            if(len > 1)
            {
                for(i = 1; i < len; i++)
                {	
                    num = data[i];
                    if(isNaN(num))
                    {
                        continue;
                    }
                    max = Math.max(num, max);
                    min = Math.min(num, min);
                }
            }
        }
        this._dataMaximum = max;
        this._dataMinimum = min;
    },

    /**
     * Returns the total number of majorUnits that will appear on an axis.
     *
     * @method getTotalMajorUnits
     * @return Number
     */
    getTotalMajorUnits: function()
    {
        var units,
            majorUnit = this.get("styles").majorUnit,
            len = this.get("length");
        if(majorUnit.determinant === "count") 
        {
            units = majorUnit.count;
        }
        else if(majorUnit.determinant === "distance") 
        {
            units = (len/majorUnit.distance) + 1;
        }
        return units; 
    },

    /**
     * Returns the distance between major units on an axis.
     *
     * @method getMajorUnitDistance
     * @param {Number} len Number of ticks
     * @param {Number} uiLen Size of the axis.
     * @param {Object} majorUnit Hash of properties used to determine the majorUnit
     * @return Number
     */
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/(len - 1);
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },
    
    /**
     * Gets the distance that the first and last ticks are offset from there respective
     * edges.
     *
     * @method getEdgeOffset
     * @param {Number} ct Number of ticks on the axis.
     * @param {Number} l Length (in pixels) of the axis.
     * @return Number
     */
    getEdgeOffset: function(ct, l)
    {
        return 0;
    },

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label;
            l -= 1;
        label = min + (i * increm);
        return label;
    },

    /**
     * Updates the `Axis` after a change in keys.
     *
     * @method _keyChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _keyChangeHandler: function(e)
    {
        this._updateMinAndMax();
        this.fire("dataUpdate");
    },

    /**
     * Checks to see if data extends beyond the range of the axis. If so,
     * that data will need to be hidden. This method is internal, temporary and subject
     * to removal in the future.
     *
     * @method _hasDataOverflow
     * @protected
     * @return Boolean
     */
    _hasDataOverflow: function()
    {
        if(this.get("setMin") || this.get("setMax"))
        {
            return true;
        }
        return false;
    },

    /**
     * Returns a string corresponding to the first label on an 
     * axis.
     *
     * @method getMinimumValue
     * @return String
     */
    getMinimumValue: function()
    {
        return this.get("minimum");
    },

    /**
     * Returns a string corresponding to the last label on an 
     * axis.
     *
     * @method getMaximumValue
     * @return String
     */
    getMaximumValue: function()
    {
        return this.get("maximum");
    }
}, {
    ATTRS: {
        /**
         * Hash of array identifed by a string value.
         *
         * @attribute keys
         * @type Object
         */
        keys: {
            value: {},

            setter: function(val)
            {
                var keys = {},
                    i, 
                    len,
                    data = this.get("dataProvider");
                if(Y_Lang.isArray(val))
                {
                    len = val.length;
                    for(i = 0; i < len; ++i)
                    {
                        keys[val[i]] = this._getKeyArray(val[i], data);   
                    }
                    
                }
                else if(Y_Lang.isString(val))
                {
                    keys = this.get("keys");
                    keys[val] = this._getKeyArray(val, data);
                }
                else
                {
                    for(i in val)
                    {
                        if(val.hasOwnProperty(i))
                        {
                            keys[i] = this._getKeyArray(i, data);
                        }
                    }
                }
	            this._updateTotalDataFlag = true;
                return keys;
            }
        },

        /**
         *Indicates how to round unit values.
         *  <dl>
         *      <dt>niceNumber</dt><dd>Units will be smoothed based on the number of ticks and data range.</dd>
         *      <dt>auto</dt><dd>If the range is greater than 1, the units will be rounded.</dd>
         *      <dt>numeric value</dt><dd>Units will be equal to the numeric value.</dd>
         *      <dt>null</dt><dd>No rounding will occur.</dd>
         *  </dl>
         *
         * @attribute roundingMethod
         * @type String
         * @default niceNumber
         */
        roundingMethod: {
            value: "niceNumber"
        },

        /**
         *Returns the type of axis data
         *  <dl>
         *      <dt>time</dt><dd>Manages time data</dd>
         *      <dt>stacked</dt><dd>Manages stacked numeric data</dd>      
         *      <dt>numeric</dt><dd>Manages numeric data</dd>
         *      <dt>category</dt><dd>Manages categorical data</dd>
         *  </dl>
         *
         * @attribute type
         * @type String
         */
        type:
        {
            readOnly: true,

            getter: function ()
            {
                return this._type;
            }
        },

        /**
         * Instance of `ChartDataProvider` that the class uses
         * to build its own data.
         *
         * @attribute dataProvider
         * @type Array
         */
        dataProvider:{
            setter: function (value)
            {
                return value;
            }
        },

        /**
         * The maximum value contained in the `data` array. Used for
         * `maximum` when `autoMax` is true.
         *
         * @attribute dataMaximum
         * @type Number
         */
        dataMaximum: {
            getter: function ()
            {
                if(!this._dataMaximum)
                {   
                    this._updateMinAndMax();
                }
                return this._dataMaximum;
            }
        },

        /**
         * The maximum value that will appear on an axis.
         *
         * @attribute maximum
         * @type Number
         */
        maximum: {
            lazyAdd: false,

            getter: function ()
            {
                var max = this.get("dataMaximum"),
                    min = this.get("minimum");
                //If all values are zero, force a range so that the Axis and related series
                //will still render.
                if(min === 0 && max === 0)
                {
                    max = 10;
                }
                if(Y_Lang.isNumber(this._setMaximum))
                {
                    max = this._setMaximum;
                }
                return parseFloat(max);
            },
            setter: function (value)
            {
                this._setMaximum = parseFloat(value);
                return value;
            }
        },

        /**
         * The minimum value contained in the `data` array. Used for
         * `minimum` when `autoMin` is true.
         *
         * @attribute dataMinimum
         * @type Number
         */
        dataMinimum: {
            getter: function ()
            {
                if(!this._dataMinimum)
                {
                    this._updateMinAndMax();
                }
                return this._dataMinimum;
            }
        },

        /**
         * The minimum value that will appear on an axis.
         *
         * @attribute minimum
         * @type Number
         */
        minimum: {
            lazyAdd: false,

            getter: function ()
            {
                var min = this.get("dataMinimum");
                if(Y_Lang.isNumber(this._setMinimum))
                {
                    min = this._setMinimum;
                }
                return parseFloat(min);
            },
            setter: function(val)
            {
                this._setMinimum = parseFloat(val);
                return val;
            }
        },

        /**
         * Determines whether the maximum is calculated or explicitly 
         * set by the user.
         *
         * @attribute setMax
         * @type Boolean
         */
        setMax: {
            readOnly: true,

            getter: function()
            {
                return Y_Lang.isNumber(this._setMaximum);
            }
        },

        /**
         * Determines whether the minimum is calculated or explicitly
         * set by the user.
         *
         * @attribute setMin
         * @type Boolean
         */
        setMin: {
            readOnly: true,

            getter: function()
            {
                return Y_Lang.isNumber(this._setMinimum);
            }
        },

        /**
         * Array of axis data
         *
         * @attribute data
         * @type Array
         */
        data: {
            getter: function ()
            {
                if(!this._data || this._updateTotalDataFlag)
                {
                    this._updateTotalData();
                }
                return this._data;
            }
        },

        /**
         * Array containing all the keys in the axis.
        
         * @attribute keyCollection
         * @type Array
         */
        keyCollection: {
            getter: function()
            {
                var keys = this.get("keys"),
                    i, 
                    col = [];
                for(i in keys)
                {
                    if(keys.hasOwnProperty(i))
                    {
                        col.push(i);
                    }
                }
                return col;
            },
            readOnly: true
        }
    }
});
