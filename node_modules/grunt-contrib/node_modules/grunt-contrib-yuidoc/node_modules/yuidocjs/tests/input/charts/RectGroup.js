/**
 * Abstract class for creating groups of rects with the same styles and dimensions.
 *
 * @module graphics
 * @class GroupRect
 * @constructor
 */
 RectGroup = function(cfg)
 {
    RectGroup.superclass.constructor.apply(this, arguments);
 };
    
 RectGroup.NAME = "rectGroup";

 Y.extend(RectGroup, Y.ShapeGroup, {    
    /**
     * Updates the rect.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawRect(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });
    
RectGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.RectGroup = RectGroup;
