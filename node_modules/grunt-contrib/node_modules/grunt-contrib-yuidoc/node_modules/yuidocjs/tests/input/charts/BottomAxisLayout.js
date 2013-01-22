/**
 * Contains algorithms for rendering a bottom axis.
 *
 * @module charts
 * @class BottomAxisLayout
 * @Constructor
 */
BottomAxisLayout = function(){};

BottomAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 4,
            left: 0,
            right: 0,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffsets
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("leftTickOffset",  0);
        host.set("rightTickOffset",  0);

        switch(display)
        {
            case "inside" :
                host.set("topTickOffset", tickLength);
                host.set("bottomTickOffset", 0);
            break;
            case "outside" : 
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", tickLength);
            break;
            case "cross":
                host.set("topTickOffset",  halfTick);
                host.set("bottomTickOffset",  halfTick);
            break;
            default:
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", 0);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @protected
     */
    getLineStart: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "inside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        host.drawLine(path, start, end);
    },

    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} pt Object containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x, y:point.y + this.get("bottomTickOffset")};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(labelWidth, labelHeight)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = labelHeight;
        }
        else if(absRot === 90)
        {
            max = labelWidth;
        }
        else
        {
            max = (sinRadians * labelWidth) + (cosRadians * labelHeight); 
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },
    
    /**
     * Determines the available label height when the axis width has been explicitly set.
     *
     * @method getExplicitlySized
     * @return Boolean
     * @protected
     */
    getExplicitlySized: function(styles)
    {
        if(this._explicitHeight)
        {
            var host = this,
                h = host._explicitHeight,
                totalTitleSize = host._totalTitleSize,
                bottomTickOffset = host.get("bottomTickOffset"),
                margin = styles.label.margin.right;
            host._maxLabelSize =  h - (bottomTickOffset + margin + totalTitleSize);
            return true;
        }
        return false;
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            bounds = host._titleBounds,
            margin = host.get("styles").title.margin,
            props = host._titleRotationProps,
            h = bounds.bottom - bounds.top,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            x = (host.get("width") * 0.5) - (labelWidth * 0.5),
            y = host.get("height") - labelHeight/2 - h/2;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        if(margin && margin.bottom)
        {
            y -= margin.bottom;
        }
        props.x = x;
        props.y = y;
        props.transformOrigin = [0.5, 0.5];
        host._rotate(label, props);
    },
    
    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            tickOffset = host.get("bottomTickOffset"),
            labelStyles = styles.label,
            margin = 0,
            props = host._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            leftOffset = Math.round(pt.x),
            topOffset = Math.round(pt.y),
            labelWidth = host._labelWidths[i],
            labelHeight = host._labelHeights[i];
        if(labelStyles.margin && labelStyles.margin.top)
        {
            margin = labelStyles.margin.top;
        }
        if(rot > 0)
        {
            topOffset -= labelHeight/2 * rot/90;
        }
        else if(rot < 0)
        {
            leftOffset -= labelWidth;
            topOffset -= labelHeight/2 * absRot/90;
        }
        else
        {
            leftOffset -= labelWidth * 0.5;
        }
        topOffset += margin;
        topOffset += tickOffset;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = leftOffset;
        props.y = topOffset;
        host._rotate(label, props);
    },
    
    /**
     * Adjusts the coordinates of an axis label based on the rotation.
     *
     * @method _setRotationCoords
     * @param {Object} props Coordinates, dimension and rotation properties of the label.
     * @protected
     */
    _setRotationCoords: function(props)
    {
        var rot = props.rot,
            absRot = props.absRot,
            labelWidth = props.labelWidth,
            labelHeight = props.labelHeight,
            leftOffset,
            topOffset;

        if(rot > 0)
        {
            leftOffset = 0;
            topOffset = labelHeight/2 * rot/90;
        }
        else if(rot < 0)
        {
            leftOffset = labelWidth;
            topOffset = labelHeight/2 * absRot/90;
        }
        else
        {
            leftOffset = labelWidth * 0.5;
            topOffset = 0;
        }
        props.x -= leftOffset;
        props.y -= topOffset;
    },

    /**
     * Returns the transformOrigin to use for an axis label based on the position of the axis 
     * and the rotation of the label.
     *
     * @method _getTransformOrigin
     * @param {Number} rot The rotation (in degrees) of the label.
     * @return Array
     * @protected
     */
    _getTransformOrigin: function(rot)
    {
        var transformOrigin;
        if(rot > 0)
        {
            transformOrigin = [0, 0.5];
        }
        else if(rot < 0)
        {
            transformOrigin = [1, 0.5];
        }
        else
        {
            transformOrigin = [0, 0];
        }
        return transformOrigin;
    },

    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
        var host = this;
        host.get("contentBox").setStyle("top", 0 - host.get("topTickOffset"));
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            styles = host.get("styles"),
            labelStyle = styles.label,
            totalTitleSize = host._totalTitleSize,
            ttl = Math.round(host.get("bottomTickOffset") + host._maxLabelSize + labelStyle.margin.top + totalTitleSize);
        if(host._explicitHeight)
        {
            ttl = host._explicitHeight;
        }
        host.set("calculatedHeight", ttl);
    }
};
Y.BottomAxisLayout = BottomAxisLayout;
