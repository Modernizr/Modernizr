/**
 * Utility class used for creating stacked series.
 *
 * @module charts
 * @class StackingUtil
 * @constructor
 */
function StackingUtil(){}

StackingUtil.prototype = {
    /**
     * @protected
     *
     * Adjusts coordinate values for stacked series.
     *
     * @method _stackCoordinates
     */
    _stackCoordinates: function() 
    {
        var direction = this.get("direction"),
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            h = graph.get("height"), 
            seriesCollection = graph.seriesTypes[type],
            i = 0,
            len,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            prevXCoords,
            prevYCoords;
        if(order === 0)
        {
            return;
        }
        prevXCoords = seriesCollection[order - 1].get("xcoords").concat();
        prevYCoords = seriesCollection[order - 1].get("ycoords").concat();
        if(direction === "vertical")
        {
            len = prevXCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevXCoords[i]) && !isNaN(xcoords[i]))
                {
                    xcoords[i] += prevXCoords[i];
                }
            }
        }
        else
        {
            len = prevYCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevYCoords[i]) && !isNaN(ycoords[i]))
                {
                    ycoords[i] = prevYCoords[i] - (h - ycoords[i]);
                }
            }
        }
    }
};
Y.StackingUtil = StackingUtil;
