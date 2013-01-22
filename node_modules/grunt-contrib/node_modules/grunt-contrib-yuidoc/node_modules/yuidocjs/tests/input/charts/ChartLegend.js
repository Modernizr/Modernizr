/**
 * ChartLegend provides a legend for a chart.
 *
 * @class ChartLegend
 * @module charts
 * @submodule charts-legend
 * @extends Widget
 */
Y.ChartLegend = Y.Base.create("chartlegend", Y.Widget, [Y.Renderer], {
    /**
     * Initializes the chart.
     *
     * @method initializer
     * @private
     */
    initializer: function()
    {
        this._items = [];
    },

    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        var bb = this.get("boundingBox"),
            cb = this.get("contentBox"),
            styles = this.get("styles").background,
            background = new Y.Rect({
                graphic: cb,
                fill: styles.fill,
                stroke: styles.border
            });
        bb.setStyle("display", "block");
        bb.setStyle("position", "absolute");
        this.set("background", background);
    },
    
    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        this.get("chart").after("seriesCollectionChange", this._updateHandler);
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
    },
    
    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        var w = this.get("width"),
            h = this.get("height");
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            this._drawLegend();
        }
    },

    /**
     * Handles changes to legend.
     *
     * @method _updateHandler
     * @param {Object} e Event object
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawLegend();
        }
    },

    /** 
     * Handles position changes.
     *
     * @method _positionChangeHandler
     * @parma {Object} e Event object
     * @private
     */
    _positionChangeHandler: function(e)
    {
        var chart = this.get("chart"),
            parentNode = this._parentNode;
        if(parentNode && ((chart && this.get("includeInChartLayout"))))
        {
            this.fire("legendRendered");
        }
        else if(this.get("rendered"))
        {
            this._drawLegend();
        }
    },

    /**
     * Updates the legend when the size changes.
     *
     * @method _handleSizeChange
     * @param {Object} e Event object.
     * @private
     */
    _handleSizeChange: function(e)
    {
        var attrName = e.attrName,
            pos = this.get(POSITION),
            vert = pos == LEFT || pos == RIGHT,
            hor = pos == BOTTOM || pos == TOP;
        if((hor && attrName == WIDTH) || (vert && attrName == HEIGHT))
        {
            this._drawLegend();
        }
    },

    /**
     * Draws the legend
     *
     * @method _drawLegend
     * @private
     */
    _drawLegend: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        if(this.get("includeInChartLayout"))
        {
            this.get("chart")._itemRenderQueue.unshift(this);
        }
        var chart = this.get("chart"),
            node = this.get("contentBox"),
            seriesCollection = chart.get("seriesCollection"),
            series,
            styles = this.get("styles"),
            padding = styles.padding,
            itemStyles = styles.item,
            seriesStyles,
            hSpacing = itemStyles.hSpacing,
            vSpacing = itemStyles.vSpacing,
            hAlign = styles.hAlign,
            vAlign = styles.vAlign,
            marker = styles.marker,
            labelStyles = itemStyles.label,
            displayName,
            layout = this._layout[this.get("direction")],
            i, 
            len,
            isArray,
            shape,
            shapeClass,
            item,
            fill,
            border,
            fillColors,
            borderColors,
            borderWeight,
            items = [],
            markerWidth = marker.width,
            markerHeight = marker.height,
            totalWidth = 0 - hSpacing,
            totalHeight = 0 - vSpacing,
            maxWidth = 0,
            maxHeight = 0,
            itemWidth,
            itemHeight;
        if(marker && marker.shape)
        {
            shape = marker.shape;
        }
        this._destroyLegendItems();
        if(chart instanceof Y.PieChart)
        {
            series = seriesCollection[0];
            displayName = series.get("categoryAxis").getDataByKey(series.get("categoryKey")); 
            seriesStyles = series.get("styles").marker;
            fillColors = seriesStyles.fill.colors;
            borderColors = seriesStyles.border.colors;
            borderWeight = seriesStyles.border.weight;
            i = 0;
            len = displayName.length;
            shape = shape || Y.Circle;
            isArray = Y.Lang.isArray(shape);
            for(; i < len; ++i)
            {
                shape = isArray ? shape[i] : shape;
                fill = {
                    color: fillColors[i]
                };
                border = {
                    colors: borderColors[i],
                    weight: borderWeight
                };
                displayName = chart.getSeriesItems(series, i).category.value;
                item = this._getLegendItem(node, this._getShapeClass(shape), fill, border, labelStyles, markerWidth, markerHeight, displayName);
                itemWidth = item.width;
                itemHeight = item.height;
                maxWidth = Math.max(maxWidth, itemWidth);
                maxHeight = Math.max(maxHeight, itemHeight);
                totalWidth += itemWidth + hSpacing;
                totalHeight += itemHeight + vSpacing;
                items.push(item);
            }
        }
        else
        {
            i = 0;
            len = seriesCollection.length;
            for(; i < len; ++i)
            {
                series = seriesCollection[i];
                seriesStyles = this._getStylesBySeriesType(series, shape);
                if(!shape)
                {
                    shape = seriesStyles.shape;
                    if(!shape)
                    {
                        shape = Y.Circle;
                    }
                }
                shapeClass = Y.Lang.isArray(shape) ? shape[i] : shape;
                item = this._getLegendItem(node, this._getShapeClass(shape), seriesStyles.fill, seriesStyles.border, labelStyles, markerWidth, markerHeight, series.get("valueDisplayName"));
                itemWidth = item.width;
                itemHeight = item.height;
                maxWidth = Math.max(maxWidth, itemWidth);
                maxHeight = Math.max(maxHeight, itemHeight);
                totalWidth += itemWidth + hSpacing;
                totalHeight += itemHeight + vSpacing;
                items.push(item);
            }
        }
        this.set("items", items);
        this._drawing = false;
        if(this._callLater)
        {
            this._drawLegend();
        }
        else
        {
            layout._positionLegendItems.apply(this, [items, maxWidth, maxHeight, totalWidth, totalHeight, padding, hSpacing, vSpacing, hAlign, vAlign]);
            this._updateBackground(styles);
            this.fire("legendRendered");
        }
    },

    /**
     * Updates the background for the legend.
     *
     * @method _updateBackground
     * @param {Object} styles Reference to the legend's styles attribute
     * @private
     */
    _updateBackground: function(styles)
    {
        var backgroundStyles = styles.background,
            contentRect = this._contentRect,
            padding = styles.padding,
            x = contentRect.left - padding.left,
            y = contentRect.top - padding.top,
            w = contentRect.right - x + padding.right,
            h = contentRect.bottom - y + padding.bottom;
        this.get("background").set({
            fill: backgroundStyles.fill,
            stroke: backgroundStyles.border,
            width: w,
            height: h,
            x: x,
            y: y
        });
    },

    /**
     * Retrieves the marker styles based on the type of series. For series that contain a marker, the marker styles are returned.
     * 
     * @method _getStylesBySeriesType
     * @param {CartesianSeries | PieSeries} The series in which the style properties will be received.
     * @return Object An object containing fill, border and shape information.
     * @private
     */
    _getStylesBySeriesType: function(series)
    {
        var styles = series.get("styles");
        if(series instanceof Y.LineSeries || series instanceof Y.StackedLineSeries)
        {
            styles = series.get("styles").line;
            return {
                border: {
                    weight: 1,
                    color: styles.color
                },
                fill: {
                    color: styles.color
                }
            };
        }
        else if(series instanceof Y.AreaSeries || series instanceof Y.StackedAreaSeries)
        {
            series = series.get("styles").fill;
            return {
                border: {
                    weight: 1,
                    color: styles.color
                },
                fill: {
                    color: styles.color
                }
            };
        }
        else 
        {
            styles = series.get("styles").marker;
            return {
                fill: styles.fill,

                border: {
                    weight: styles.border.weight,

                    color: styles.border.color,

                    shape: styles.shape
                },
                shape: styles.shape
            };
        }
    },

    /**
     * Returns a legend item consisting of the following properties:
     *  <dl>
     *    <dt>node</dt><dd>The `Node` containing the legend item elements.</dd>
     *      <dt>shape</dt><dd>The `Shape` element for the legend item.</dd>
     *      <dt>textNode</dt><dd>The `Node` containing the text></dd>
     *      <dt>text</dt><dd></dd>
     *  </dl>
     *
     * @method _getLegendItem
     * @param {Node} shapeProps Reference to the `node` attribute.
     * @param {String | Class} shapeClass The type of shape
     * @param {Object} fill Properties for the shape's fill
     * @param {Object} border Properties for the shape's border
     * @param {String} text String to be rendered as the legend's text
     * @param {Number} width Total width of the legend item
     * @param {Number} height Total height of the legend item
     * @param {HTML | String} text Text for the legendItem
     * @return Object
     * @private
     */
    _getLegendItem: function(node, shapeClass, fill, border, labelStyles, w, h, text) 
    {
        var containerNode = Y.one(DOCUMENT.createElement("div")),
            textField = Y.one(DOCUMENT.createElement("span")),
            shape,
            dimension,
            padding,
            left,
            item;
        containerNode.setStyle(POSITION, "absolute");
        textField.setStyle(POSITION, "absolute");
        textField.setStyles(labelStyles);
        textField.appendChild(DOCUMENT.createTextNode(text));
        containerNode.appendChild(textField);
        node.appendChild(containerNode);
        dimension = textField.get("offsetHeight");
        padding = dimension - h;
        left = w + padding + 2;
        textField.setStyle("left", left + PX);
        containerNode.setStyle("height", dimension + PX);
        containerNode.setStyle("width", (left + textField.get("offsetWidth")) + PX);
        shape = new shapeClass({
            fill: fill,
            stroke: border,
            width: w,
            height: h,
            x: padding * 0.5,
            y: padding * 0.5,
            w: w,
            h: h,
            graphic: containerNode
        });
        textField.setStyle("left", dimension + PX);
        item = {
            node: containerNode,
            width: containerNode.get("offsetWidth"),
            height: containerNode.get("offsetHeight"),
            shape: shape,
            textNode: textField,
            text: text
        };
        this._items.push(item);
        return item;
    },

    /**
     * Evaluates and returns correct class for drawing a shape.
     *
     * @method _getShapeClass
     * @return Shape
     * @private
     */
    _getShapeClass: function()
    {   
        var graphic = this.get("background").get("graphic");
        return graphic._getShapeClass.apply(graphic, arguments);
    },
    
    /**
     * Returns the default hash for the `styles` attribute.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var styles = { 
            padding: {
                top: 8,
                right: 8,
                bottom: 8,
                left: 9
            },
            gap: 10,
            hAlign: "center",
            vAlign: "top",
            marker: this._getPlotDefaults(),
            item: {
                hSpacing: 10,
                vSpacing: 5,
                label: {
                    color:"#808080",
                    fontSize:"85%"
                }
            },
            background: {
                shape: "rect",
                fill:{
                    color:"#faf9f2"
                },
                border: {
                    color:"#dad8c9",
                    weight: 1
                }
            }
        };
        return styles;
    },

    /**
     * Gets the default values for series that use the utility. This method is used by
     * the class' `styles` attribute's getter to get build default values.
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        var defs = {
            width: 10,
            height: 10
        };
        return defs;
    },

    /**
     * Destroys legend items.
     *
     * @method _destroyLegendItems
     * @private
     */
    _destroyLegendItems: function()
    {
        var item;
        if(this._items)
        {
            while(this._items.length > 0)
            {
                item = this._items.shift();
                item.shape.get("graphic").destroy();
                item.node.empty();
                item.node.remove(true);
                item = null;
            }
        }
        this._items = [];
    },

    /**
     * Maps layout classes.
     *
     * @property _layout
     * @private
     */
    _layout: {
        vertical: VerticalLegendLayout,
        horizontal: HorizontalLegendLayout
    },

    /**
     * Destructor implementation ChartLegend class. Removes all items and the Graphic instance from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var graphic = this.get("graphic");
        this._destroyLegendItems();
        if(graphic)
        {
            graphic.destroy();
        }
    }
}, {
    ATTRS: {
        /**
         * Indicates whether the chart's contentBox is the parentNode for the legend.
         *
         * @attribute includeInChartLayout
         * @type Boolean
         * @private
         */
        includeInChartLayout: {
            value: false
        },

        /**
         * Reference to the `Chart` instance.
         *
         * @attribute chart
         * @type Chart
         */
        chart: {
            setter: function(val)
            {
                this.after("legendRendered", Y.bind(val._itemRendered, val));
                return val;
            }
        },

        /**
         * Indicates the direction in relation of the legend's layout. The `direction` of the legend is determined by its
         * `position` value.
         *
         * @attribute direction
         * @type String
         */
        direction: {
            value: "vertical"
        },
       
        /**
         * Indicates the position and direction of the legend. Possible values are `left`, `top`, `right` and `bottom`. Values of `left` and
         * `right` values have a `direction` of `vertical`. Values of `top` and `bottom` values have a `direction` of `horizontal`.
         *
         * @attribute position
         * @type String
         */
        position: {
            lazyAdd: false,

            value: "right",

            setter: function(val)
            {
                if(val == TOP || val == BOTTOM)
                {
                    this.set("direction", HORIZONTAL);
                }
                else if(val == LEFT || val == RIGHT)
                {
                    this.set("direction", VERTICAL);
                }
                return val;
            }
        },
 
        /**
         * The width of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that 
         * it references. Under this circumstance, `width` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the 
         * direction of the legend. If the `position` is `left` or `right` or the `direction` is `vertical`, width is `readOnly`. If the position is `top` or `bottom` or the `direction`
         * is `horizontal`, width can be explicitly set. If width is not explicitly set, the width will be determined by the width of the legend's parent element.
         *
         * @attribute width
         * @type Number
         */
        width: {
            getter: function()
            {
                var chart = this.get("chart"),
                    parentNode = this._parentNode;
                if(parentNode)
                {
                    if((chart && this.get("includeInChartLayout")) || this._width)
                    {
                        if(!this._width)
                        {
                            this._width = 0;
                        }
                        return this._width;
                    }
                    else
                    {
                        return parentNode.get("offsetWidth");
                    }
                }
                return "";
            },

            setter: function(val)
            {
                this._width = val;
                return val;
            }
        },

        /**
         * The height of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that 
         * it references. Under this circumstance, `height` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the 
         * direction of the legend. If the `position` is `top` or `bottom` or the `direction` is `horizontal`, height is `readOnly`. If the position is `left` or `right` or the `direction`
         * is `vertical`, height can be explicitly set. If height is not explicitly set, the height will be determined by the width of the legend's parent element.
         *
         * @attribute height 
         * @type Number
         */
        height: {
            valueFn: "_heightGetter",

            getter: function()
            {
                var chart = this.get("chart"),
                    parentNode = this._parentNode;
                if(parentNode) 
                {
                    if((chart && this.get("includeInChartLayout")) || this._height)
                    {
                        if(!this._height)
                        {
                            this._height = 0;
                        }
                        return this._height;
                    }
                    else
                    {
                        return parentNode.get("offsetHeight");
                    }
                }
                return "";
            },

            setter: function(val)
            {
                this._height = val;
                return val;
            }
        },

        /**
         * Indicates the x position of legend.
         *
         * @attribute x
         * @type Number
         * @readOnly
         */
        x: {
            lazyAdd: false,

            value: 0,
            
            setter: function(val)
            {
                var node = this.get("boundingBox");
                if(node)
                {
                    node.setStyle(LEFT, val + PX);
                }
                return val;
            }
        },

        /**
         * Indicates the y position of legend.
         *
         * @attribute y
         * @type Number
         * @readOnly
         */
        y: {
            lazyAdd: false,

            value: 0,
            
            setter: function(val)
            {
                var node = this.get("boundingBox");
                if(node)
                {
                    node.setStyle(TOP, val + PX);
                }
                return val;
            }
        },

        /**
         * Background for the legend.
         *
         * @attribute background
         * @type Rect
         */
        background: {}

        /**
         * Properties used to display and style the ChartLegend.  This attribute is inherited from `Renderer`. Below are the default values:
         *
         *  <dl>
         *      <dt>gap</dt><dd>Distance, in pixels, between the `ChartLegend` instance and the chart's content. When `ChartLegend` is rendered within a `Chart` instance this value is applied.</dd>
         *      <dt>hAlign</dt><dd>Defines the horizontal alignment of the `items` in a `ChartLegend` rendered in a horizontal direction. This value is applied when the instance's `position` is set to top or bottom. This attribute can be set to left, center or right. The default value is center.</dd>
         *      <dt>vAlign</dt><dd>Defines the vertical alignment of the `items` in a `ChartLegend` rendered in vertical direction. This value is applied when the instance's `position` is set to left or right. The attribute can be set to top, middle or bottom. The default value is middle.</dd>
         *      <dt>item</dt><dd>Set of style properties applied to the `items` of the `ChartLegend`.
         *          <dl>
         *              <dt>hSpacing</dt><dd>Horizontal distance, in pixels, between legend `items`.</dd>
         *              <dt>vSpacing</dt><dd>Vertical distance, in pixels, between legend `items`.</dd>
         *              <dt>label</dt><dd>Properties for the text of an `item`.
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the text. The default values is "#808080".</dd>
         *                      <dt>fontSize</dt><dd>Font size for the text. The default value is "85%".</dd>
         *                  </dl>
         *              </dd>
         *              <dt>marker</dt><dd>Properties for the `item` markers.
         *                  <dl>
         *                      <dt>width</dt><dd>Specifies the width of the markers.</dd>
         *                      <dt>height</dt><dd>Specifies the height of the markers.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *      <dt>background</dt><dd>Properties for the `ChartLegend` background.
         *          <dl>
         *              <dt>fill</dt><dd>Properties for the background fill.
         *                  <dl>
         *                      <dt>color</dt><dd>Color for the fill. The default value is "#faf9f2".</dd>
         *                  </dl>
         *              </dd>
         *              <dt>border</dt><dd>Properties for the background border.
         *                  <dl>
         *                      <dt>color</dt><dd>Color for the border. The default value is "#dad8c9".</dd>
         *                      <dt>weight</dt><dd>Weight of the border. The default values is 1.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         * </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
