/**
 * The StackedColumnSeries renders column chart in which series are stacked vertically to show
 * their contribution to the cumulative total.
 *
 * @module charts
 * @class StackedColumnSeries
 * @extends ColumnSeries
 * @uses StackingUtil
 * @constructor
 */
Y.StackedColumnSeries = Y.Base.create("stackedColumnSeries", Y.ColumnSeries, [Y.StackingUtil], {
    /**
     * Draws the series.
     *
     * @method drawSeries
	 * @protected
	 */
	drawSeries: function()
	{
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var isNumber = Y_Lang.isNumber,
            style = Y.clone(this.get("styles").marker), 
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            ratio,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            fillColors,
            borderColors,
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            totalWidth = len * w,
            dimensions = {
                width: [],
                height: []
            },
            xvalues = [],
            yvalues = [],
            groupMarkers = this.get("groupMarkers");
        if(Y_Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y_Lang.isArray(style.border.color))
        {
            borderColors = style.border.color.concat();
        }
        this._createMarkerCache();
        if(totalWidth > this.get("width"))
        {
            ratio = this.width/totalWidth;
            w *= ratio;
            w = Math.max(w, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
            if(!negativeBaseValues || !positiveBaseValues)
            {
                useOrigin = true;
                positiveBaseValues = [];
                negativeBaseValues = [];
            }
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            left = xcoords[i];
            top = ycoords[i];
            
            if(!isNumber(top) || !isNumber(left))
            {
                if(useOrigin)
                {
                    negativeBaseValues[i] = this._bottomOrigin;
                    positiveBaseValues[i] = this._bottomOrigin;
                }
                this._markers.push(null); 
                continue;
            }
            if(useOrigin)
            {
                h = Math.abs(this._bottomOrigin - top);
                if(top < this._bottomOrigin)
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = this._bottomOrigin;
                }
                else if(top > this._bottomOrigin)
                {
                    positiveBaseValues[i] = this._bottomOrigin;
                    negativeBaseValues[i] = top;
                    top -= h;
                }
                else
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = top;
                }
            }
            else 
            {
                if(top > this._bottomOrigin)
                {
                    top += (negativeBaseValues[i] - this._bottomOrigin);
                    h = top - negativeBaseValues[i];
                    negativeBaseValues[i] = top;
                    top -= h;
                }
                else if(top <= this._bottomOrigin)
                {
                    top = positiveBaseValues[i] - (this._bottomOrigin - top);
                    h = positiveBaseValues[i] - top;
                    positiveBaseValues[i] = top;
                }
            }
            if(!isNaN(h) && h > 0)
            {
                left -= w/2;
                if(groupMarkers)
                {
                    dimensions.width[i] = w;
                    dimensions.height[i] = h;
                    xvalues.push(left);
                    yvalues.push(top);
                }
                else
                {
                    style.width = w;
                    style.height = h;
                    style.x = left;
                    style.y = top;
                    if(fillColors)
                    {
                        style.fill.color = fillColors[i % fillColors.length];
                    }
                    if(borderColors)
                    {
                        style.border.color = borderColors[i % borderColors.length];
                    }
                    marker = this.getMarker(style, graphOrder, i);
                }
            }
            else if(!groupMarkers)
            {
               this._markers.push(null);
            }
        }
        if(groupMarkers)
        {
            this._createGroupMarker({
                fill: style.fill,
                border: style.border,
                dimensions: dimensions,
                xvalues: xvalues,
                yvalues: yvalues,
                shape: style.shape
            });
        }
        else
        {
            this._clearMarkerCache();
        }
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers && this._markers[i])
        {
            var styles,
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                marker = this._markers[i],
                offset = 0,
                fillColor,
                borderColor;        
            styles = this.get("styles").marker;
            offset = styles.width * 0.5;
            markerStyles = state == "off" || !styles[state] ? Y.clone(styles) : Y.clone(styles[state]); 
            markerStyles.height = marker.get("height");
            markerStyles.x = (xcoords[i] - offset);
            markerStyles.y = marker.get("y");
            markerStyles.id = marker.get("id");
            fillColor = markerStyles.fill.color; 
            borderColor = markerStyles.border.color;
            if(Y_Lang.isArray(fillColor))
            {
                markerStyles.fill.color = fillColor[i % fillColor.length];
            }
            else
            {
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            }
            if(Y_Lang.isArray(borderColor))
            {
                markerStyles.border.color = borderColor[i % borderColor.length];
            }
            else
            {
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            }
            marker.set(markerStyles);
        }
    },
	
    /**
     * Gets the default values for the markers. 
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 24,
            height: 24,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedColumn
         */
        type: {
            value: "stackedColumn"
        },

        /**
         * @attribute negativeBaseValues
         * @type Array
         * @default null
         * @private
         */
        negativeBaseValues: {
            value: null
        },

        /**
         * @attribute positiveBaseValues
         * @type Array
         * @default null
         * @private
         */
        positiveBaseValues: {
            value: null
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `ColumnSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>width</dt><dd>indicates the width of the marker. The default value is 24.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});

