/**
 * StackedSplineSeries creates spline graphs in which the different series are stacked along a value axis
 * to indicate their contribution to a cumulative total.
 *
 * @module charts
 * @class StackedSplineSeries
 * @constructor
 * @extends SplineSeries
 * @extends StackingUtil
 */
Y.StackedSplineSeries = Y.Base.create("stackedSplineSeries", Y.SplineSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedSplineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedSpline
         */
        type: {
            value:"stackedSpline"
        }
    }
});

