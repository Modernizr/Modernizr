/**
 * Adds legend functionality to charts.
 *
 * @module charts
 * @submodule charts-legend
 */
var DOCUMENT = Y.config.doc, 
TOP = "top",
RIGHT = "right",
BOTTOM = "bottom",
LEFT = "left",
EXTERNAL = "external",
HORIZONTAL = "horizontal",
VERTICAL = "vertical",
WIDTH = "width",
HEIGHT = "height",
POSITION = "position",
_X = "x",
_Y = "y",
PX = "px",
LEGEND = {
    setter: function(val)
    {   
        var legend = this.get("legend");
        if(legend)
        {
            legend.destroy(true);
        }
        if(val instanceof Y.ChartLegend)
        {
            legend = val;
            legend.set("chart", this);
        }
        else
        {
            val.chart = this;
            if(!val.hasOwnProperty("render"))
            {
                val.render = this.get("contentBox");
                val.includeInChartLayout = true;
            }
            legend = new Y.ChartLegend(val);
        }
        return legend;
    }
},

/**
 * Contains methods for displaying items horizontally in a legend.
 *
 * @module charts
 * @submodule charts-legend
 * @class HorizontalLegendLayout
 */
HorizontalLegendLayout = {
    /**
     * Displays items horizontally in a legend.
     *
     * @method _positionLegendItems
     * @param {Array} items Array of items to display in the legend.
     * @param {Number} maxWidth The width of the largest item in the legend.
     * @param {Number} maxHeight The height of the largest item in the legend.
     * @param {Number} totalWidth The total width of all items in a legend.
     * @param {Number} totalHeight The total height of all items in a legend.
     * @param {Number} padding The left, top, right and bottom padding properties for the legend.
     * @param {Number} horizontalGap The horizontal distance between items in a legend.
     * @param {Number} verticalGap The vertical distance between items in a legend.
     * @param {String} hAlign The horizontal alignment of the legend.
     * @param {String} vAlign The vertical alignment of the legend.
     * @protected
     */
    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)
    {
        var i = 0,
            rowIterator = 0,
            item,
            node,
            itemWidth,
            itemHeight,
            len,
            width = this.get("width"),
            rows,
            rowsLen,
            row,
            totalWidthArray,
            legendWidth,
            topHeight = padding.top - verticalGap,
            limit = width - (padding.left + padding.right),
            left, 
            top,
            right,
            bottom;
        HorizontalLegendLayout._setRowArrays(items, limit, horizontalGap);
        rows = HorizontalLegendLayout.rowArray;
        totalWidthArray = HorizontalLegendLayout.totalWidthArray;
        rowsLen = rows.length;
        for(; rowIterator < rowsLen; ++ rowIterator)
        {
            topHeight += verticalGap;
            row = rows[rowIterator];
            len = row.length;
            legendWidth =  HorizontalLegendLayout.getStartPoint(width, totalWidthArray[rowIterator], hAlign, padding);
            for(i = 0; i < len; ++i)
            {
                item = row[i];
                node = item.node;
                itemWidth = item.width;
                itemHeight = item.height;
                item.x = legendWidth;
                item.y = 0;
                left = !isNaN(left) ? Math.min(left, legendWidth) : legendWidth;
                top = !isNaN(top) ? Math.min(top, topHeight) : topHeight;
                right = !isNaN(right) ? Math.max(legendWidth + itemWidth, right) : legendWidth + itemWidth;
                bottom = !isNaN(bottom) ? Math.max(topHeight + itemHeight, bottom) : topHeight + itemHeight;
                node.setStyle("left", legendWidth + PX);
                node.setStyle("top", topHeight + PX);
                legendWidth += itemWidth + horizontalGap;
            }
            topHeight += item.height;
        }
        this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        if(this.get("includeInChartLayout"))
        {
            this.set("height", topHeight + padding.bottom);
        }
    },

    /**
     * Creates row and total width arrays used for displaying multiple rows of
     * legend items based on the items, available width and horizontalGap for the legend.
     *
     * @method _setRowArrays
     * @param {Array} items Array of legend items to display in a legend.
     * @param {Number} limit Total available width for displaying items in a legend.
     * @param {Number} horizontalGap Horizontal distance between items in a legend.
     * @protected
     */
    _setRowArrays: function(items, limit, horizontalGap)
    {
        var item = items[0],
            rowArray = [[item]],
            i = 1,
            rowIterator = 0,
            len = items.length,
            totalWidth = item.width,
            itemWidth,
            totalWidthArray = [[totalWidth]];
        for(; i < len; ++i)
        {
            item = items[i];
            itemWidth = item.width;
            if((totalWidth + horizontalGap + itemWidth) <= limit)
            {
                totalWidth += horizontalGap + itemWidth;
                rowArray[rowIterator].push(item);
            }
            else
            {
                totalWidth = horizontalGap + itemWidth;
                if(rowArray[rowIterator])
                {
                    rowIterator += 1;
                }
                rowArray[rowIterator] = [item];
            }
            totalWidthArray[rowIterator] = totalWidth;
        }
        HorizontalLegendLayout.rowArray = rowArray;
        HorizontalLegendLayout.totalWidthArray = totalWidthArray;
    },

    /**
     * Returns the starting x-coordinate for a row of legend items.
     *
     * @method getStartPoint
     * @param {Number} w Width of the legend.
     * @param {Number} totalWidth Total width of all labels in the row.
     * @param {String} align Horizontal alignment of items for the legend.
     * @param {Object} padding Object contain left, top, right and bottom padding properties.
     * @return Number
     * @protected
     */
    getStartPoint: function(w, totalWidth, align, padding)
    {
        var startPoint;
        switch(align)
        {
            case LEFT :
                startPoint = padding.left;
            break;
            case "center" :
                startPoint = (w - totalWidth) * 0.5;
            break;
            case RIGHT :
                startPoint = w - totalWidth - padding.right;
            break;
        }
        return startPoint;
    }
},

/**
 * Contains methods for displaying items vertically in a legend.
 *
 * @module charts
 * @submodule charts-legend
 * @class VerticalLegendLayout
 */
VerticalLegendLayout = {
    /**
     * Displays items vertically in a legend.
     *
     * @method _positionLegendItems
     * @param {Array} items Array of items to display in the legend.
     * @param {Number} maxWidth The width of the largest item in the legend.
     * @param {Number} maxHeight The height of the largest item in the legend.
     * @param {Number} totalWidth The total width of all items in a legend.
     * @param {Number} totalHeight The total height of all items in a legend.
     * @param {Number} padding The left, top, right and bottom padding properties for the legend.
     * @param {Number} horizontalGap The horizontal distance between items in a legend.
     * @param {Number} verticalGap The vertical distance between items in a legend.
     * @param {String} hAlign The horizontal alignment of the legend.
     * @param {String} vAlign The vertical alignment of the legend.
     * @protected
     */
    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)
    {
        var i = 0,
            columnIterator = 0,
            item,
            node,
            itemHeight,
            itemWidth,
            len,
            height = this.get("height"),
            columns,
            columnsLen,
            column,
            totalHeightArray,
            legendHeight,
            leftWidth = padding.left - horizontalGap,
            legendWidth,
            limit = height - (padding.top + padding.bottom),
            left, 
            top,
            right,
            bottom;
        VerticalLegendLayout._setColumnArrays(items, limit, verticalGap);
        columns = VerticalLegendLayout.columnArray;
        totalHeightArray = VerticalLegendLayout.totalHeightArray;
        columnsLen = columns.length;
        for(; columnIterator < columnsLen; ++ columnIterator)
        {
            leftWidth += horizontalGap;
            column = columns[columnIterator];
            len = column.length;
            legendHeight =  VerticalLegendLayout.getStartPoint(height, totalHeightArray[columnIterator], vAlign, padding);
            legendWidth = 0;
            for(i = 0; i < len; ++i)
            {
                item = column[i];
                node = item.node;
                itemHeight = item.height;
                itemWidth = item.width;
                item.y = legendHeight;
                item.x = leftWidth;
                left = !isNaN(left) ? Math.min(left, leftWidth) : leftWidth;
                top = !isNaN(top) ? Math.min(top, legendHeight) : legendHeight;
                right = !isNaN(right) ? Math.max(leftWidth + itemWidth, right) : leftWidth + itemWidth;
                bottom = !isNaN(bottom) ? Math.max(legendHeight + itemHeight, bottom) : legendHeight + itemHeight;
                node.setStyle("left", leftWidth + PX);
                node.setStyle("top", legendHeight + PX);
                legendHeight += itemHeight + verticalGap;
                legendWidth = Math.max(legendWidth, item.width);
            }
            leftWidth += legendWidth;
        }
        this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        if(this.get("includeInChartLayout"))
        {
            this.set("width", leftWidth + padding.right);
        }
    },

    /**
     * Creates column and total height arrays used for displaying multiple columns of
     * legend items based on the items, available height and verticalGap for the legend.
     *
     * @method _setColumnArrays
     * @param {Array} items Array of legend items to display in a legend.
     * @param {Number} limit Total available height for displaying items in a legend.
     * @param {Number} verticalGap Vertical distance between items in a legend.
     * @protected
     */
    _setColumnArrays: function(items, limit, verticalGap)
    {
        var item = items[0],
            columnArray = [[item]],
            i = 1,
            columnIterator = 0,
            len = items.length,
            totalHeight = item.height,
            itemHeight,
            totalHeightArray = [[totalHeight]];
        for(; i < len; ++i)
        {
            item = items[i];
            itemHeight = item.height;
            if((totalHeight + verticalGap + itemHeight) <= limit)
            {
                totalHeight += verticalGap + itemHeight;
                columnArray[columnIterator].push(item);
            }
            else
            {
                totalHeight = verticalGap + itemHeight;
                if(columnArray[columnIterator])
                {
                    columnIterator += 1;
                }
                columnArray[columnIterator] = [item];
            }
            totalHeightArray[columnIterator] = totalHeight;
        }
        VerticalLegendLayout.columnArray = columnArray;
        VerticalLegendLayout.totalHeightArray = totalHeightArray;
    },

    /**
     * Returns the starting y-coordinate for a column of legend items.
     *
     * @method getStartPoint
     * @param {Number} h Height of the legend.
     * @param {Number} totalHeight Total height of all labels in the column.
     * @param {String} align Vertical alignment of items for the legend.
     * @param {Object} padding Object contain left, top, right and bottom padding properties.
     * @return Number
     * @protected
     */
    getStartPoint: function(h, totalHeight, align, padding)
    {
        var startPoint;
        switch(align)
        {
            case TOP :
                startPoint = padding.top;
            break;
            case "middle" :
                startPoint = (h - totalHeight) * 0.5;
            break;
            case BOTTOM :
                startPoint = h - totalHeight - padding.bottom;
            break;
        }
        return startPoint;
    }
},

CartesianChartLegend = Y.Base.create("cartesianChartLegend", Y.CartesianChart, [], {
    /**
     * Redraws and position all the components of the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        var w = this.get("width"),
            h = this.get("height"),
            layoutBoxDimensions = this._getLayoutBoxDimensions(),
            leftPaneWidth = layoutBoxDimensions.left,
            rightPaneWidth = layoutBoxDimensions.right,
            topPaneHeight = layoutBoxDimensions.top,
            bottomPaneHeight = layoutBoxDimensions.bottom,
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            i = 0,
            l,
            axis,
            graphOverflow = "visible",
            graph = this.get("graph"),
            topOverflow,
            bottomOverflow,
            leftOverflow,
            rightOverflow,
            graphWidth,
            graphHeight,
            graphX,
            graphY,
            allowContentOverflow = this.get("allowContentOverflow"),
            diff,
            rightAxesXCoords,
            leftAxesXCoords,
            topAxesYCoords,
            bottomAxesYCoords,
            legend = this.get("legend"),
            graphRect = {};

        if(leftAxesCollection)
        {
            leftAxesXCoords = [];
            l = leftAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                leftAxesXCoords.unshift(leftPaneWidth);
                leftPaneWidth += leftAxesCollection[i].get("width");
            }
        }
        if(rightAxesCollection)
        {
            rightAxesXCoords = [];
            l = rightAxesCollection.length;
            i = 0;
            for(i = l - 1; i > -1; --i)
            {
                rightPaneWidth += rightAxesCollection[i].get("width");
                rightAxesXCoords.unshift(w - rightPaneWidth);
            }
        }
        if(topAxesCollection)
        {
            topAxesYCoords = [];
            l = topAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                topAxesYCoords.unshift(topPaneHeight);
                topPaneHeight += topAxesCollection[i].get("height");
            }
        }
        if(bottomAxesCollection)
        {
            bottomAxesYCoords = [];
            l = bottomAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                bottomPaneHeight += bottomAxesCollection[i].get("height");
                bottomAxesYCoords.unshift(h - bottomPaneHeight);
            }
        }
        
        graphWidth = w - (leftPaneWidth + rightPaneWidth);
        graphHeight = h - (bottomPaneHeight + topPaneHeight);
        graphRect.left = leftPaneWidth;
        graphRect.top = topPaneHeight;
        graphRect.bottom = h - bottomPaneHeight;
        graphRect.right = w - rightPaneWidth;
        if(!allowContentOverflow)
        {
            topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);
            bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);
            leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);
            rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);
            
            diff = topOverflow - topPaneHeight;
            if(diff > 0)
            {
                graphRect.top = topOverflow;
                if(topAxesYCoords)
                {
                    i = 0;
                    l = topAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        topAxesYCoords[i] += diff;
                    }
                }
            }

            diff = bottomOverflow - bottomPaneHeight;
            if(diff > 0)
            {
                graphRect.bottom = h - bottomOverflow;
                if(bottomAxesYCoords)
                {
                    i = 0;
                    l = bottomAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        bottomAxesYCoords[i] -= diff;
                    }
                }
            }

            diff = leftOverflow - leftPaneWidth;
            if(diff > 0)
            {
                graphRect.left = leftOverflow;
                if(leftAxesXCoords)
                {
                    i = 0;
                    l = leftAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        leftAxesXCoords[i] += diff;
                    }
                }
            }

            diff = rightOverflow - rightPaneWidth;
            if(diff > 0)
            {
                graphRect.right = w - rightOverflow;
                if(rightAxesXCoords)
                {
                    i = 0;
                    l = rightAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        rightAxesXCoords[i] -= diff;
                    }
                }
            }
        }
        graphWidth = graphRect.right - graphRect.left;
        graphHeight = graphRect.bottom - graphRect.top;
        graphX = graphRect.left;
        graphY = graphRect.top;
        if(legend)
        {
            if(legend.get("includeInChartLayout"))
            {
                switch(legend.get("position"))
                {
                    case "left" : 
                        legend.set("y", graphY);
                        legend.set("height", graphHeight);
                    break;
                    case "top" :
                        legend.set("x", graphX);
                        legend.set("width", graphWidth);
                    break;
                    case "bottom" : 
                        legend.set("x", graphX);
                        legend.set("width", graphWidth);
                    break;
                    case "right" :
                        legend.set("y", graphY);
                        legend.set("height", graphHeight);
                    break;
                }
            }
        }
        if(topAxesCollection)
        {
            l = topAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = topAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + PX);
                axis.get("boundingBox").setStyle("top", topAxesYCoords[i] + PX);
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(bottomAxesCollection)
        {
            l = bottomAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = bottomAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + PX);
                axis.get("boundingBox").setStyle("top", bottomAxesYCoords[i] + PX);
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(leftAxesCollection)
        {
            l = leftAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = leftAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + PX);
                axis.get("boundingBox").setStyle("left", leftAxesXCoords[i] + PX);
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(rightAxesCollection)
        {
            l = rightAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = rightAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + PX);
                axis.get("boundingBox").setStyle("left", rightAxesXCoords[i] + PX);
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.get("boundingBox").setStyle("left", graphX + PX);
            graph.get("boundingBox").setStyle("top", graphY + PX);
            graph.set("width", graphWidth);
            graph.set("height", graphHeight);
            graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        if(this._overlay)
        {
            this._overlay.setStyle("left", graphX + PX);
            this._overlay.setStyle("top", graphY + PX);
            this._overlay.setStyle("width", graphWidth + PX);
            this._overlay.setStyle("height", graphHeight + PX);
        }
    },

    /**
     * Positions the legend in a chart and returns the properties of the legend to be used in the 
     * chart's layout algorithm.
     *
     * @method _getLayoutDimensions
     * @return {Object} The left, top, right and bottom values for the legend.
     * @protected
     */
    _getLayoutBoxDimensions: function()
    {
        var box = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            legend = this.get("legend"),
            position,
            direction,
            dimension,
            size,
            w = this.get(WIDTH),
            h = this.get(HEIGHT),
            gap;
        if(legend && legend.get("includeInChartLayout"))
        {
            gap = legend.get("styles").gap;
            position = legend.get(POSITION);
            if(position != EXTERNAL)
            {
                direction = legend.get("direction");
                dimension = direction == HORIZONTAL ? HEIGHT : WIDTH;
                size = legend.get(dimension);
                box[position] = size + gap;
                switch(position)
                {
                    case TOP :
                        legend.set(_Y, 0); 
                    break;
                    case BOTTOM : 
                        legend.set(_Y, h - size); 
                    break;
                    case RIGHT :
                        legend.set(_X, w - size);
                    break;
                    case LEFT: 
                        legend.set(_X, 0);
                    break;
                }
            }
        }
        return box;
    },

    /**
     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series, legend (if available) and the Graph instance.
     * Removes the tooltip and overlay HTML elements.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var legend = this.get("legend");
        if(legend)
        {
            legend.destroy(true);
        }
    }
}, {
    ATTRS: {
        legend: LEGEND
    }
});

Y.CartesianChart = CartesianChartLegend;

