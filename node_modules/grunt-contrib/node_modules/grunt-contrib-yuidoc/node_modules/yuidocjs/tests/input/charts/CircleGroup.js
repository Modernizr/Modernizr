/**
 * Abstract class for creating groups of circles with the same styles and dimensions.
 *
 * @module graphics
 * @class GroupCircle
 * @constructor
 */
 CircleGroup = function(cfg)
 {
    CircleGroup.superclass.constructor.apply(this, arguments);
 };
    
 CircleGroup.NAME = "circleGroup";

 Y.extend(CircleGroup, Y.ShapeGroup, {    
    /**
     * Algorithm for drawing shape.
     *
     * @method drawShape
     * @param {Object} cfg Parameters used to draw the shape.
     */
    drawShape: function(cfg)
    {
        this.drawCircle(cfg.x, cfg.y, cfg.radius);
    }
 });

CircleGroup.ATTRS = Y.merge(Y.ShapeGroup.ATTRS, {
    dimensions: {
        getter: function()
        {
            var dimensions = this._dimensions,
                radius,
                yRadius,
                width,
                height;
            if(dimensions.hasOwnProperty("radius"))
            {
                return dimensions;
            }
            else
            {
                width = dimensions.width;
                height = dimensions.height;
                radius = Y_Lang.isArray(width) ? this._getRadiusCollection(width) : (width * 0.5);
                yRadius = radius;
                return {
                    width: width,
                    height: height,
                    radius: radius,
                    yRadius: yRadius
                };
            }
        }
    }
});
    
CircleGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.CircleGroup = CircleGroup;
