/**
 * Gridlines draws gridlines on a Graph.
 *
 * @module charts
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 */
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * Reference to the `Path` element used for drawing Gridlines.
     *
     * @property _path
     * @type Path
     * @private
     */
    _path: null,

    /**
     * Removes the Gridlines.
     *
     * @method remove
     * @private
     */
    remove: function()
    {
        var path = this._path;
        if(path)
        {
            path.destroy();
        }
    },

    /**
     * Draws the gridlines
     *
     * @method draw
     * @protected
     */
    draw: function()
    {
        if(this.get("axis") && this.get("graph"))
        {
            this._drawGridlines();
        }
    },

    /**
     * Algorithm for drawing gridlines
     *
     * @method _drawGridlines
     * @private
     */
    _drawGridlines: function()
    {
        var path,
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            i = 0,
            l,
            direction = this.get("direction"),
            graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height"),
            line = this.get("styles").line,
            color = line.color,
            weight = line.weight,
            alpha = line.alpha,
            lineFunction = direction == "vertical" ? this._verticalLine : this._horizontalLine;
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            if(axisPosition != "none" && axis && axis.get("tickPoints"))
            {
                points = axis.get("tickPoints");
                l = points.length;
            }
            else
            {
                points = [];
                l = axis.get("styles").majorUnit.count;
                for(; i < l; ++i)
                {
                    points[i] = {
                        x: w * (i/(l-1)),
                        y: h * (i/(l-1))
                    };
                }
                i = 0;
            }
            path = graph.get("gridlines");
            path.set("width", w);
            path.set("height", h);
            path.set("stroke", {
                weight: weight,
                color: color,
                opacity: alpha
            });
            for(; i < l; ++i)
            {
                lineFunction(path, points[i], w, h);
            }
            path.end();
        }
    },

    /**
     * Algorithm for horizontal lines.
     *
     * @method _horizontalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _horizontalLine: function(path, pt, w, h)
    {
        path.moveTo(0, pt.y);
        path.lineTo(w, pt.y);
    },

    /**
     * Algorithm for vertical lines.
     *
     * @method _verticalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _verticalLine: function(path, pt, w, h)
    {
        path.moveTo(pt.x, 0);
        path.lineTo(pt.x, h);
    },
    
    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            }
        };
        return defs;
    }

},
{
    ATTRS: {
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},
        
        /**
         * Indicate the `Axis` in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},
        
        /**
         * Indicates the `Graph` in which the gridlines 
         * are drawn.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {}
    }
});
