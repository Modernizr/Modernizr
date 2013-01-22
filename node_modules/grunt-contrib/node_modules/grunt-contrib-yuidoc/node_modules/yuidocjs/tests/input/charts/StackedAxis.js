/**
 * StackedAxis manages stacked numeric data on an axis.
 *
 * @module charts
 * @class StackedAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends NumericAxis
 */
function StackedAxis(config)
{
	StackedAxis.superclass.constructor.apply(this, arguments);
}

StackedAxis.NAME = "stackedAxis";


Y.extend(StackedAxis, Y.NumericAxis,
{
    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function()
    {
        var max = 0,
            min = 0,
            pos = 0,
            neg = 0,
            len = 0,
            i = 0,
            key,
            num,
            keys = this.get("keys"),
            setMin = this.get("setMin"),
            setMax = this.get("setMax");

        for(key in keys)
        {
            if(keys.hasOwnProperty(key))
            {
                len = Math.max(len, keys[key].length);
            }
        }
        for(; i < len; ++i)
        {
            pos = 0;
            neg = 0;
            for(key in keys)
            {
                if(keys.hasOwnProperty(key))
                {
                    num = keys[key][i];
                    if(isNaN(num))
                    {
                        continue;
                    }
                    if(num >= 0)
                    {
                        pos += num;
                    }
                    else
                    {
                        neg += num;
                    }
                }
            }
            if(pos > 0)
            {
                max = Math.max(max, pos);
            }
            else 
            {
                max = Math.max(max, neg);
            }
            if(neg < 0)
            {
                min = Math.min(min, neg);
            }
            else
            {
                min = Math.min(min, pos);
            }
        }
        this._actualMaximum = max;
        this._actualMinimum = min;
        if(setMax)
        {
            max = this._setMaximum;
        }
        if(setMin)
        {
            min = this._setMinimum;
        }
        this._roundMinAndMax(min, max, setMin, setMax);
    }
});

Y.StackedAxis = StackedAxis;
		
