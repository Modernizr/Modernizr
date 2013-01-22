/**
 * The Axis class. Generates axes for a chart.
 *
 * @module charts
 * @class Axis
 * @extends Widget
 * @uses Renderer
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 */
Y.Axis = Y.Base.create("axis", Y.Widget, [Y.Renderer], {
    /**
     * Storage for calculatedWidth value.
     *
     * @property _calculatedWidth
     * @type Number
     * @private
     */
    _calculatedWidth: 0,

    /**
     * Storage for calculatedHeight value.
     *
     * @property _calculatedHeight
     * @type Number
     * @private
     */
    _calculatedHeight: 0,

    /**
     * Handles change to the dataProvider
     * 
     * @method _dataChangeHandler
     * @param {Object} e Event object
     * @private
     */
    _dataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * Handles change to the position attribute
     *
     * @method _positionChangeHandler
     * @param {Object} e Event object
     * @private
     */
    _positionChangeHandler: function(e)
    {
        this._updateGraphic(e.newVal);
        this._updateHandler();
    },

    /**
     * Updates the the Graphic instance
     *
     * @method _updateGraphic
     * @param {String} position Position of axis 
     * @private
     */
    _updateGraphic: function(position)
    {
        var graphic = this.get("graphic");
        if(position == "none")
        {
            if(graphic)
            {
                graphic.destroy();
            }
        }
        else
        {
            if(!graphic)
            {
                this._setCanvas();
            }
        }
    },

    /**
     * Handles changes to axis.
     *
     * @method _updateHandler
     * @param {Object} e Event object
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },
   
    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        this._updateGraphic(this.get("position"));
    },

    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        var layout = this._layout,
            defaultMargins,
            styles,
            label,
            title,
            i;
        if(layout)
        {
            defaultMargins = layout._getDefaultMargins();
            styles = this.get("styles");
            label = styles.label.margin;
            title =styles.title.margin;
            //need to defaultMargins method to the layout classes.
            for(i in defaultMargins)
            {
                if(defaultMargins.hasOwnProperty(i))
                {
                    label[i] = label[i] === undefined ? defaultMargins[i] : label[i];
                    title[i] = title[i] === undefined ? defaultMargins[i] : title[i];
                }
            }
        }
        this._drawAxis();
    },

    /**
     * Creates a graphic instance to be used for the axis line and ticks.
     *
     * @method _setCanvas
     * @private
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            bb = this.get("boundingBox"),
            p = this.get("position"),
            pn = this._parentNode,
            w = this.get("width"),
            h = this.get("height");
        bb.setStyle("position", "absolute");
        bb.setStyle("zIndex", 2);
        w = w ? w + "px" : pn.getStyle("width");
        h = h ? h + "px" : pn.getStyle("height");
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", w);
        }
        else
        {
            cb.setStyle("height", h);
        }
        cb.setStyle("position", "relative");
        cb.setStyle("left", "0px");
        cb.setStyle("top", "0px");
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(cb);
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
        var axisstyles = {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#dad8c9",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#dad8c9",
                weight:1
            },
            line: {
                weight:1,
                color:"#dad8c9",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: 0,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            title: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: undefined,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            hideOverlappingLabelTicks: false
        };
        
        return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles); 
    },

    /**
     * Updates the axis when the size changes.
     *
     * @method _handleSizeChange
     * @param {Object} e Event object.
     * @private
     */
    _handleSizeChange: function(e)
    {
        var attrName = e.attrName,
            pos = this.get("position"),
            vert = pos == "left" || pos == "right",
            cb = this.get("contentBox"),
            hor = pos == "bottom" || pos == "top";
        cb.setStyle("width", this.get("width"));
        cb.setStyle("height", this.get("height"));
        if((hor && attrName == "width") || (vert && attrName == "height"))
        {
            this._drawAxis();
        }
    },
   
    /**
     * Maps key values to classes containing layout algorithms
     *
     * @property _layoutClasses
     * @type Object
     * @private
     */
    _layoutClasses: 
    {
        top : TopAxisLayout,
        bottom: BottomAxisLayout,
        left: LeftAxisLayout,
        right : RightAxisLayout
    },
    
    /**
     * Draws a line segment between 2 points
     *
     * @method drawLine
     * @param {Object} startPoint x and y coordinates for the start point of the line segment
     * @param {Object} endPoint x and y coordinates for the for the end point of the line segment
     * @param {Object} line styles (weight, color and alpha to be applied to the line segment)
     * @private
     */
    drawLine: function(path, startPoint, endPoint)
    {
        path.moveTo(startPoint.x, startPoint.y);
        path.lineTo(endPoint.x, endPoint.y);
    },

    /**
     * Generates the properties necessary for rotating and positioning a text field.
     *
     * @method _getTextRotationProps
     * @param {Object} styles properties for the text field
     * @return Object
     * @private
     */
    _getTextRotationProps: function(styles)
    {
        if(styles.rotation === undefined)
        {
            switch(this.get("position"))
            {
                case "left" :
                    styles.rotation = -90;
                break; 
                case "right" : 
                    styles.rotation = 90;
                break;
                default :
                    styles.rotation = 0;
                break;
            }
        }
        var rot =  Math.min(90, Math.max(-90, styles.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8));
        return {
            rot: rot,
            absRot: absRot,
            radCon: radCon,
            sinRadians: sinRadians,
            cosRadians: cosRadians,
            textAlpha: styles.alpha
        };
    },

    /**
     * Draws an axis. 
     *
     * @method _drawAxis
     * @private
     */
    _drawAxis: function ()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        if(this._layout)
        {
            var styles = this.get("styles"),
                line = styles.line,
                labelStyles = styles.label,
                majorTickStyles = styles.majorTicks,
                drawTicks = majorTickStyles.display != "none",
                tickPoint,
                majorUnit = styles.majorUnit,
                len,
                majorUnitDistance,
                i = 0,
                layout = this._layout,
                layoutLength,
                position,
                lineStart,
                label,
                labelWidth,
                labelHeight,
                labelFunction = this.get("labelFunction"),
                labelFunctionScope = this.get("labelFunctionScope"),
                labelFormat = this.get("labelFormat"),
                graphic = this.get("graphic"),
                path = this.get("path"),
                tickPath,
                explicitlySized;
            this._labelWidths = [];
            this._labelHeights = [];
            graphic.set("autoDraw", false);
            path.clear();
            path.set("stroke", {
                weight: line.weight, 
                color: line.color, 
                opacity: line.alpha
            });
            this._labelRotationProps = this._getTextRotationProps(labelStyles);
            this._labelRotationProps.transformOrigin = layout._getTransformOrigin(this._labelRotationProps.rot);
            layout.setTickOffsets.apply(this);
            layoutLength = this.getLength();
            lineStart = layout.getLineStart.apply(this);
            len = this.getTotalMajorUnits(majorUnit);
            majorUnitDistance = this.getMajorUnitDistance(len, layoutLength, majorUnit);
            this.set("edgeOffset", this.getEdgeOffset(len, layoutLength) * 0.5);
            if(len < 1)
            {
                this._clearLabelCache();
            }
            else
            {
                tickPoint = this.getFirstPoint(lineStart);
                this.drawLine(path, lineStart, this.getLineEnd(tickPoint));
                if(drawTicks) 
                {
                    tickPath = this.get("tickPath");
                    tickPath.clear();
                    tickPath.set("stroke", {
                        weight: majorTickStyles.weight,
                        color: majorTickStyles.color,
                        opacity: majorTickStyles.alpha
                    });
                   layout.drawTick.apply(this, [tickPath, tickPoint, majorTickStyles]);
                }
                this._createLabelCache();
                this._tickPoints = [];
                this._maxLabelSize = 0; 
                this._totalTitleSize = 0;
                this._titleSize = 0;
                this._setTitle();
                explicitlySized = layout.getExplicitlySized.apply(this, [styles]);
                for(; i < len; ++i)
                {
                    if(drawTicks) 
                    {
                        layout.drawTick.apply(this, [tickPath, tickPoint, majorTickStyles]);
                    }
                    position = this.getPosition(tickPoint);
                    label = this.getLabel(tickPoint, labelStyles);
                    this._labels.push(label);
                    this._tickPoints.push({x:tickPoint.x, y:tickPoint.y});
                    this.get("appendLabelFunction")(label, labelFunction.apply(labelFunctionScope, [this.getLabelByIndex(i, len), labelFormat]));
                    labelWidth = Math.round(label.offsetWidth);
                    labelHeight = Math.round(label.offsetHeight);
                    if(!explicitlySized)
                    {
                        this._layout.updateMaxLabelSize.apply(this, [labelWidth, labelHeight]);
                    }
                    this._labelWidths.push(labelWidth);
                    this._labelHeights.push(labelHeight);
                    tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
                }
                this._clearLabelCache();
                if(this.get("overlapGraph"))
                {
                   layout.offsetNodeForTick.apply(this, [this.get("contentBox")]);
                }
                layout.setCalculatedSize.apply(this);
                if(this._titleTextField)
                {
                    this._layout.positionTitle.apply(this, [this._titleTextField]);
                }
                for(i = 0; i < len; ++i)
                {
                    layout.positionLabel.apply(this, [this.get("labels")[i], this._tickPoints[i], styles, i]);
                }
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawAxis();
        }
        else
        {
            this._updatePathElement();
            this.fire("axisRendered");
        }
    },
    
    /**
     * Calculates and sets the total size of a title.
     *
     * @method _setTotalTitleSize
     * @param {Object} styles Properties for the title field.
     * @private
     */
    _setTotalTitleSize: function(styles)
    {
        var title = this._titleTextField,
            w = title.offsetWidth,
            h = title.offsetHeight,
            rot = this._titleRotationProps.rot,
            bounds,
            size,
            margin = styles.margin,
            position = this.get("position"),
            matrix = new Y.Matrix();
        matrix.rotate(rot);
        bounds = matrix.getContentRect(w, h);
        if(position == "left" || position == "right")
        {
            size = bounds.right - bounds.left;
            if(margin)
            {
                size += margin.left + margin.right;
            }
        }
        else
        {
            size = bounds.bottom - bounds.top;
            if(margin)
            {
                size += margin.top + margin.bottom;
            }
        }
        this._titleBounds = bounds;
        this._totalTitleSize = size;
    },

    /**
     *  Updates path.
     *
     *  @method _updatePathElement
     *  @private
     */
    _updatePathElement: function()
    {
        var path = this._path,
            tickPath = this._tickPath,
            redrawGraphic = false,
            graphic = this.get("graphic");
        if(path)
        {
            redrawGraphic = true;
            path.end();
        }
        if(tickPath)
        {
            redrawGraphic = true;
            tickPath.end();
        }
        if(redrawGraphic)
        {
            graphic._redraw();
        }
    },

    /**
     * Updates the content and style properties for a title field.
     *
     * @method _updateTitle
     * @private
     */
    _setTitle: function()
    {
        var i,
            styles,
            customStyles,
            title = this.get("title"),
            titleTextField = this._titleTextField,
            parentNode;
        if(title !== null && title !== undefined)
        {
            customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
            };
            styles = this.get("styles").title;
            if(!titleTextField)
            {
                titleTextField = DOCUMENT.createElement('span');
                titleTextField.style.display = "block";
                titleTextField.style.whiteSpace = "nowrap";
                titleTextField.setAttribute("class", "axisTitle");
                this.get("contentBox").append(titleTextField);
            }
            else if(!DOCUMENT.createElementNS)
            {
                if(titleTextField.style.filter)
                {
                    titleTextField.style.filter = null;
                }
            }
            titleTextField.style.position = "absolute";
            for(i in styles)
            {
                if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
                {
                    titleTextField.style[i] = styles[i];
                }
            }
            this.get("appendTitleFunction")(titleTextField, title);
            this._titleTextField = titleTextField;
            this._titleRotationProps = this._getTextRotationProps(styles);
            this._setTotalTitleSize(styles);
        }
        else if(titleTextField)
        {
            parentNode = titleTextField.parentNode;
            if(parentNode)
            {
                parentNode.removeChild(titleTextField);
            }
            this._titleTextField = null;
            this._totalTitleSize = 0;
        }
    },

    /**
     * Creates or updates an axis label.
     *
     * @method getLabel
     * @param {Object} pt x and y coordinates for the label
     * @param {Object} styles styles applied to label
     * @return HTMLElement 
     * @private
     */
    getLabel: function(pt, styles)
    {
        var i,
            label,
            labelCache = this._labelCache,
            customStyles = {
                rotation: "rotation",
                margin: "margin",
                alpha: "alpha"
            };
        if(labelCache && labelCache.length > 0)
        {
            label = labelCache.shift();
        }
        else
        {
            label = DOCUMENT.createElement("span");
            label.className = Y.Lang.trim([label.className, "axisLabel"].join(' '));
            this.get("contentBox").append(label);
        }
        if(!DOCUMENT.createElementNS)
        {
            if(label.style.filter)
            {
                label.style.filter = null;
            }
        }
        label.style.display = "block";
        label.style.whiteSpace = "nowrap";
        label.style.position = "absolute";
        for(i in styles)
        {
            if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
            {
                label.style[i] = styles[i];
            }
        }
        return label;
    },

    /**
     * Creates a cache of labels that can be re-used when the axis redraws.
     *
     * @method _createLabelCache
     * @private
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            while(this._labels.length > 0)
            {
                this._labelCache.push(this._labels.shift());
            }
        }
        else
        {
            this._clearLabelCache();
        }
        this._labels = [];
    },
    
    /**
     * Removes axis labels from the dom and clears the label cache.
     *
     * @method _clearLabelCache
     * @private
     */
    _clearLabelCache: function()
    {
        if(this._labelCache)
        {
            var len = this._labelCache.length,
                i = 0,
                label;
            for(; i < len; ++i)
            {
                label = this._labelCache[i];
                this._removeChildren(label);
                Y.Event.purgeElement(label, true);
                label.parentNode.removeChild(label);
            }
        }
        this._labelCache = [];
    },

    /**
     * Gets the end point of an axis.
     *
     * @method getLineEnd
     * @return Object
     * @private 
     */
    getLineEnd: function(pt)
    {
        var w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * Calcuates the width or height of an axis depending on its direction.
     *
     * @method getLength
     * @return Number
     * @private
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    /**
     * Gets the position of the first point on an axis.
     *
     * @method getFirstPoint
     * @param {Object} pt Object containing x and y coordinates.
     * @return Object
     * @private
     */
    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = this.get("position"),
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left + this.get("edgeOffset");
        }
        else
        {
            np.y += this.get("height") - (padding.top + this.get("edgeOffset"));
        }
        return np;
    },

    /**
     * Gets the position of the next point on an axis.
     *
     * @method getNextPoint
     * @param {Object} point Object containing x and y coordinates.
     * @param {Number} majorUnitDistance Distance in pixels between ticks.
     * @return Object
     * @private
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y - majorUnitDistance;
        }
        return point;
    },

    /**
     * Calculates the placement of last tick on an axis.
     *
     * @method getLastPoint
     * @return Object
     * @private 
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * Calculates position on the axis.
     *
     * @method getPosition
     * @param {Object} point contains x and y values
     * @private 
     */
    getPosition: function(point)
    {
        var p,
            h = this.get("height"),
            style = this.get("styles"),
            padding = style.padding,
            pos = this.get("position"),
            dataType = this.get("dataType");
        if(pos === "left" || pos === "right") 
        {
            //Numeric data on a vertical axis is displayed from bottom to top.
            //Categorical and Timeline data is displayed from top to bottom.
            if(dataType === "numeric")
            {
                p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
            }
            else
            {
                p = point.y - padding.top;
            }
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    },

    /**
     * Rotates and positions a text field.
     *
     * @method _rotate
     * @param {HTMLElement} label text field to rotate and position
     * @param {Object} props properties to be applied to the text field. 
     * @private
     */
    _rotate: function(label, props)
    {
        var rot = props.rot,
            x = props.x,
            y = props.y,
            filterString,
            textAlpha,
            matrix = new Y.Matrix(),
            transformOrigin = props.transformOrigin || [0, 0],
            offsetRect;
        if(DOCUMENT.createElementNS)
        {
            matrix.translate(x, y);
            matrix.rotate(rot);
            label.style.MozTransformOrigin = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
            label.style.MozTransform = matrix.toCSSText();
            label.style.webkitTransformOrigin = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
            label.style.webkitTransform = matrix.toCSSText();
            label.style.msTransformOrigin = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
            label.style.msTransform = matrix.toCSSText();
            label.style.OTransformOrigin = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
            label.style.OTransform = matrix.toCSSText();
        }
        else
        {
            textAlpha = props.textAlpha;
            if(Y_Lang.isNumber(textAlpha) && textAlpha < 1 && textAlpha > -1 && !isNaN(textAlpha))
            {
                filterString = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(textAlpha * 100) + ")";
            }
            if(rot !== 0)
            {
                //ms filters kind of, sort of uses a transformOrigin of 0, 0. 
                //we'll translate the difference to create a true 0, 0 origin.
                matrix.rotate(rot);
                offsetRect = matrix.getContentRect(props.labelWidth, props.labelHeight);
                matrix.init();
                matrix.translate(offsetRect.left, offsetRect.top);
                matrix.translate(x, y);
                this._simulateRotateWithTransformOrigin(matrix, rot, transformOrigin, props.labelWidth, props.labelHeight);
                if(filterString)
                {
                    filterString += " ";
                }
                else
                {
                    filterString = ""; 
                }
                filterString += matrix.toFilterText();
                label.style.left = matrix.dx + "px";
                label.style.top = matrix.dy + "px";
            }
            else
            {
                label.style.left = x + "px";
                label.style.top = y + "px";
            }
            if(filterString)
            {
                label.style.filter = filterString;
            }
        }
    },
    
    /**
     * Simulates a rotation with a specified transformOrigin. 
     *
     * @method _simulateTransformOrigin
     * @param {Matrix} matrix Reference to a `Matrix` instance.
     * @param {Number} rot The rotation (in degrees) that will be performed on a matrix.
     * @param {Array} transformOrigin An array represeniting the origin in which to perform the transform. The first 
     * index represents the x origin and the second index represents the y origin.
     * @param {Number} w The width of the object that will be transformed.
     * @param {Number} h The height of the object that will be transformed.
     * @private
     */
    _simulateRotateWithTransformOrigin: function(matrix, rot, transformOrigin, w, h)
    {
        var transformX = transformOrigin[0] * w,
            transformY = transformOrigin[1] * h;
        transformX = !isNaN(transformX) ? transformX : 0;
        transformY = !isNaN(transformY) ? transformY : 0;
        matrix.translate(transformX, transformY);
        matrix.rotate(rot);
        matrix.translate(-transformX, -transformY);
    },

    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of the last label. 
     *
     * @method getMaxLabelBounds
     * @return Object
     */
    getMaxLabelBounds: function()
    {
        return this._getLabelBounds(this.getMaximumValue());
    },

    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of the first label. 
     *
     * @method getMinLabelBounds
     * @return Object
     */
    getMinLabelBounds: function()
    {
        return this._getLabelBounds(this.getMinimumValue());
    },
    
    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of a label. 
     *
     * @method _getLabelBounds
     * @param {String} Value of the label
     * @return Object
     * @private
     */
    _getLabelBounds: function(val)
    {
        var layout = this._layout,
            labelStyles = this.get("styles").label,
            matrix = new Y.Matrix(),
            label,
            props = this._getTextRotationProps(labelStyles);
            props.transformOrigin = layout._getTransformOrigin(props.rot);
        label = this.getLabel({x: 0, y: 0}, labelStyles);
        this.get("appendLabelFunction")(label, this.get("labelFunction").apply(this, [val, this.get("labelFormat")]));
        props.labelWidth = label.offsetWidth;
        props.labelHeight = label.offsetHeight;
        this._removeChildren(label);
        Y.Event.purgeElement(label, true);
        label.parentNode.removeChild(label);
        props.x = 0;
        props.y = 0;
        layout._setRotationCoords(props);
        matrix.translate(props.x, props.y);
        this._simulateRotateWithTransformOrigin(matrix, props.rot, props.transformOrigin, props.labelWidth, props.labelHeight);
        return matrix.getContentRect(props.labelWidth, props.labelHeight);
    },

    /**
     * Removes all DOM elements from an HTML element. Used to clear out labels during detruction
     * phase.
     *
     * @method _removeChildren
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },
    
    /**
     * Destructor implementation Axis class. Removes all labels and the Graphic instance from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var cb = this.get("contentBox").getDOMNode(),
            labels = this.get("labels"),
            graphic = this.get("graphic"),
            label,
            len = labels ? labels.length : 0;
        if(len > 0)
        {
            while(labels.length > 0)
            {
                label = labels.shift();
                this._removeChildren(label);
                cb.removeChild(label);
                label = null;
            }
        }
        if(graphic)
        {
            graphic.destroy();
        }
    },

    /**
     * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
     *
     * @property maxLabelSize
     * @type Number
     * @protected
     */
    _maxLabelSize: 0,
    
    /**
     * Updates the content of text field. This method writes a value into a text field using 
     * `appendChild`. If the value is a `String`, it is converted to a `TextNode` first. 
     *
     * @method _setText
     * @param label {HTMLElement} label to be updated
     * @param val {String} value with which to update the label
     * @private
     */
    _setText: function(textField, val)
    { 
        textField.innerHTML = "";
        if(Y_Lang.isNumber(val))
        {
            val = val + "";
        }
        else if(!val)
        {
            val = "";
        }
        if(IS_STRING(val))
        {
            val = DOCUMENT.createTextNode(val);
        }
        textField.appendChild(val);
    }
}, {
    ATTRS: 
    {
        /**
         * When set, defines the width of a vertical axis instance. By default, vertical axes automatically size based on their contents. When the
         * width attribute is set, the axis will not calculate its width. When the width attribute is explicitly set, axis labels will postion themselves off of the 
         * the inner edge of the axis and the title, if present, will position itself off of the outer edge. If a specified width is less than the sum of 
         * the axis' contents, excess content will overflow.
         *
         * @attribute width
         * @type Number
         */
        width: {
            lazyAdd: false,

            getter: function() 
            {
                if(this._explicitWidth)
                {
                    return this._explicitWidth;        
                }
                return this._calculatedWidth;
            },

            setter: function(val)
            {
                this._explicitWidth = val;
                return val;
            }
        },

        /**
         * When set, defines the height of a horizontal axis instance. By default, horizontal axes automatically size based on their contents. When the
         * height attribute is set, the axis will not calculate its height. When the height attribute is explicitly set, axis labels will postion themselves off of the 
         * the inner edge of the axis and the title, if present, will position itself off of the outer edge. If a specified height is less than the sum of 
         * the axis' contents, excess content will overflow.
         *
         * @attribute height
         * @type Number
         */
        height: {
            lazyAdd: false,

            getter: function() 
            {
                if(this._explicitHeight)
                {
                    return this._explicitHeight;        
                }
                return this._calculatedHeight;
            },

            setter: function(val)
            {
                this._explicitHeight = val;
                return val;
            }
        },

        /**
         * Calculated value of an axis' width. By default, the value is used internally for vertical axes. If the `width` attribute is explicitly set, this value will be ignored.
         *
         * @attribute calculatedWidth
         * @type Number
         * @private
         */
        calculatedWidth: {
            getter: function()
            {
                return this._calculatedWidth;
            },

            setter: function(val)
            {
                this._calculatedWidth = val;
                return val;
            }
        },

        /**
         * Calculated value of an axis' height. By default, the value is used internally for horizontal axes. If the `height` attribute is explicitly set, this value will be ignored.
         *
         * @attribute calculatedHeight
         * @type Number
         * @private
         */
        calculatedHeight: {
            getter: function()
            {
                return this._calculatedHeight;
            },

            setter: function(val)
            {
                this._calculatedHeight = val;
                return val;
            }
        },

        /**
         * Difference betweend the first/last tick and edge of axis.
         *
         * @attribute edgeOffset
         * @type Number
         * @protected
         */
        edgeOffset: 
        {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {},
    
        /**
         *  @attribute path
         *  @type Shape
         *  @readOnly
         *  @private
         */
        path: {
            readOnly: true,

            getter: function()
            {
                if(!this._path)
                {
                    var graphic = this.get("graphic");
                    if(graphic)
                    {
                        this._path = graphic.addShape({type:"path"});
                    }
                }
                return this._path;
            }
        },

        /**
         *  @attribute tickPath
         *  @type Shape
         *  @readOnly
         *  @private
         */
        tickPath: {
            readOnly: true,

            getter: function()
            {
                if(!this._tickPath)
                {
                    var graphic = this.get("graphic");
                    if(graphic)
                    {
                        this._tickPath = graphic.addShape({type:"path"});
                    }
                }
                return this._tickPath;
            }
        },
        
        /**
         * Contains the contents of the axis. 
         *
         * @attribute node
         * @type HTMLElement
         */
        node: {},

        /**
         * Direction of the axis.
         *
         * @attribute position
         * @type String
         */
        position: {
            setter: function(val)
            {
                var layoutClass = this._layoutClasses[val];
                if(val && val != "none")
                {
                    this._layout = new layoutClass();
                }
                return val;
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         *
         * @attribute topTickOffset
         * @type Number
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         *
         * @attribute bottomTickOffset
         * @type Number
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         *
         * @attribute leftTickOffset
         * @type Number
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         *
         * @attribute rightTickOffset
         * @type Number
         */
        rightTickOffset: {
            value: 0
        },
        
        /**
         * Collection of labels used to render the axis.
         *
         * @attribute labels
         * @type Array
         */
        labels: {
            readOnly: true,
            getter: function()
            {
                return this._labels;
            }
        },

        /**
         * Collection of points used for placement of labels and ticks along the axis.
         *
         * @attribute tickPoints
         * @type Array
         */
        tickPoints: {
            readOnly: true,

            getter: function()
            {
                if(this.get("position") == "none")
                {
                    return this.get("styles").majorUnit.count;
                }
                return this._tickPoints;
            }
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         *
         * @attribute overlapGraph
         * @type Boolean
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y_Lang.isBoolean(val);
            }
        },

        /**
         * Object which should have by the labelFunction
         *
         * @attribute labelFunctionScope
         * @type Object
         */
        labelFunctionScope: {},
        
        /**
         * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
         *
         * @attribute maxLabelSize
         * @type Number
         * @protected
         */
        maxLabelSize: {
            getter: function()
            {
                return this._maxLabelSize;
            },

            setter: function(val)
            {
                this._maxLabelSize = val;
                return val; 
            }
        },
        
        /**
         *  Title for the axis. When specified, the title will display. The position of the title is determined by the axis position. 
         *  <dl>
         *      <dt>top</dt><dd>Appears above the axis and it labels. The default rotation is 0.</dd>
         *      <dt>right</dt><dd>Appears to the right of the axis and its labels. The default rotation is 90.</dd>
         *      <dt>bottom</dt><dd>Appears below the axis and its labels. The default rotation is 0.</dd>
         *      <dt>left</dt><dd>Appears to the left of the axis and its labels. The default rotation is -90.</dd>
         *  </dl>
         *
         *  @attribute title
         *  @type String
         */
        title: {
            value: null
        },
        
        /**
         * Method used for formatting a label. This attribute allows for the default label formatting method to overridden. The method use would need
         * to implement the arguments below and return a `String` or `HTMLElement`. 
         * <dl>
         *      <dt>val</dt><dd>Label to be formatted. (`String`)</dd>
         *      <dt>format</dt><dd>Template for formatting label. (optional)</dd>
         * </dl>
         *
         * @attribute labelFunction
         * @type Function
         */
        labelFunction: {
            value: function(val, format)
            {
                return val;
            }
        },
        
        /**
         * Function used to append an axis value to an axis label. This function has the following signature:
         *  <dl>
         *      <dt>textField</dt><dd>The axis label to be appended. (`HTMLElement`)</dd>
         *      <dt>val</dt><dd>The value to attach to the text field. This method will accept an `HTMLELement`
         *      or a `String`. This method does not use (`HTMLElement` | `String`)</dd>
         *  </dl>
         * The default method appends a value to the `HTMLElement` using the `appendChild` method. If the given 
         * value is a `String`, the method will convert the the value to a `textNode` before appending to the 
         * `HTMLElement`. This method will not convert an `HTMLString` to an `HTMLElement`. 
         *
         * @attribute appendLabelFunction
         * @type Function
         */
        appendLabelFunction: {
            getter: function()
            {
                return this._setText;
            }
        },
        
        /**
         * Function used to append a title value to the title object. This function has the following signature:
         *  <dl>
         *      <dt>textField</dt><dd>The title text field to be appended. (`HTMLElement`)</dd>
         *      <dt>val</dt><dd>The value to attach to the text field. This method will accept an `HTMLELement`
         *      or a `String`. This method does not use (`HTMLElement` | `String`)</dd>
         *  </dl>
         * The default method appends a value to the `HTMLElement` using the `appendChild` method. If the given 
         * value is a `String`, the method will convert the the value to a `textNode` before appending to the 
         * `HTMLElement` element. This method will not convert an `HTMLString` to an `HTMLElement`. 
         *
         * @attribute appendTitleFunction
         * @type Function
         */
        appendTitleFunction: {
            getter: function()
            {
                return this._setText;
            }
        }
            
        /**
         * Style properties used for drawing an axis. This attribute is inherited from `Renderer`. Below are the default values:
         *  <dl>
         *      <dt>majorTicks</dt><dd>Properties used for drawing ticks.
         *          <dl>
         *              <dt>display</dt><dd>Position of the tick. Possible values are `inside`, `outside`, `cross` and `none`. The
         *              default value is `inside`.</dd>
         *              <dt>length</dt><dd>The length (in pixels) of the tick. The default value is 4.</dd>
         *              <dt>color</dt><dd>The color of the tick. The default value is `#dad8c9`</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the tick. The default value is 1.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>line</dt><dd>Properties used for drawing the axis line. 
         *          <dl>
         *              <dt>weight</dt><dd>Number indicating the width of the axis line. The default value is 1.</dd>
         *              <dt>color</dt><dd>The color of the axis line. The default value is `#dad8c9`.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>majorUnit</dt><dd>Properties used to calculate the `majorUnit` for the axis. 
         *          <dl>
         *              <dt>determinant</dt><dd>The algorithm used for calculating distance between ticks. The possible options are `count` and `distance`. If
         *              the `determinant` is `count`, the axis ticks will spaced so that a specified number of ticks appear on the axis. If the `determinant`
         *              is `distance`, the axis ticks will spaced out according to the specified distance. The default value is `count`.</dd>
         *              <dt>count</dt><dd>Number of ticks to appear on the axis when the `determinant` is `count`. The default value is 11.</dd>
         *              <dt>distance</dt><dd>The distance (in pixels) between ticks when the `determinant` is `distance`. The default value is 75.</dd>
         *          </dl>
         *      </dd>
         *      <dt>label</dt><dd>Properties and styles applied to the axis labels.
         *          <dl>
         *              <dt>color</dt><dd>The color of the labels. The default value is `#808080`.</dd>
         *              <dt>alpha</dt><dd>Number between 0 and 1 indicating the opacity of the labels. The default value is 1.</dd>
         *              <dt>fontSize</dt><dd>The font-size of the labels. The default value is 85%</dd>
         *              <dt>rotation</dt><dd>The rotation, in degrees (between -90 and 90) of the labels. The default value is 0.</dd>
         *              <dt>margin</dt><dd>The distance between the label and the axis/tick. Depending on the position of the `Axis`, only one of the properties used.
         *                  <dl>
         *                      <dt>top</dt><dd>Pixel value used for an axis with a `position` of `bottom`. The default value is 4.</dd>
         *                      <dt>right</dt><dd>Pixel value used for an axis with a `position` of `left`. The default value is 4.</dd>
         *                      <dt>bottom</dt><dd>Pixel value used for an axis with a `position` of `top`. The default value is 4.</dd>
         *                      <dt>left</dt><dd>Pixel value used for an axis with a `position` of `right`. The default value is 4.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
