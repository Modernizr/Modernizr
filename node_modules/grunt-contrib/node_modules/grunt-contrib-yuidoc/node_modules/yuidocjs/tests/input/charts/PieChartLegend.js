var PieChartLegend = Y.Base.create("pieChartLegend", Y.PieChart, [], {
    /**
     * Redraws the chart instance.
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
        var graph = this.get("graph"),
            w = this.get("width"),
            h = this.get("height"),
            graphWidth,
            graphHeight,
            legend = this.get("legend"),
            x = 0,
            y = 0,
            legendX = 0,
            legendY = 0,
            legendWidth,
            legendHeight,
            dimension,
            gap,
            position,
            direction;
        if(graph)
        {
            if(legend)
            {
                position = legend.get("position");
                direction = legend.get("direction");
                graphWidth = graph.get("width");
                graphHeight = graph.get("height");
                legendWidth = legend.get("width");
                legendHeight = legend.get("height");
                gap = legend.get("styles").gap;
                
                if((direction == "vertical" && (graphWidth + legendWidth + gap !== w)) || (direction == "horizontal" &&  (graphHeight + legendHeight + gap !== h)))
                {
                    switch(legend.get("position"))
                    {
                        case LEFT :
                            dimension = Math.min(w - (legendWidth + gap), h);
                            legendHeight = h;
                            x = legendWidth + gap;
                            legend.set(HEIGHT, legendHeight);
                        break;
                        case TOP :
                            dimension = Math.min(h - (legendHeight + gap), w); 
                            legendWidth = w;
                            y = legendHeight + gap;
                            legend.set(WIDTH, legendWidth);
                        break;
                        case RIGHT :
                            dimension = Math.min(w - (legendWidth + gap), h);
                            legendHeight = h;
                            legendX = dimension + gap;
                            legend.set(HEIGHT, legendHeight);
                        break;
                        case BOTTOM :
                            dimension = Math.min(h - (legendHeight + gap), w); 
                            legendWidth = w;
                            legendY = dimension + gap; 
                            legend.set(WIDTH, legendWidth);
                        break;
                    }
                    graph.set(WIDTH, dimension);
                    graph.set(HEIGHT, dimension);
                }
                else
                {
                    switch(legend.get("position"))
                    {   
                        case LEFT :
                            x = legendWidth + gap;
                        break;
                        case TOP :
                            y = legendHeight + gap;
                        break;
                        case RIGHT :
                            legendX = graphWidth + gap;
                        break;
                        case BOTTOM :
                            legendY = graphHeight + gap; 
                        break;
                    }
                }
            }
            else
            {
                graph.set(_X, 0);
                graph.set(_Y, 0);
                graph.set(WIDTH, w);
                graph.set(HEIGHT, h);
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
            graph.set(_X, x);
            graph.set(_Y, y);
        }
        if(legend)
        {
            legend.set(_X, legendX);
            legend.set(_Y, legendY);
        }
    }
}, {
    ATTRS: {
        /**
         * The legend for the chart.
         *
         * @attribute
         * @type Legend
         */
        legend: LEGEND
    }
});
Y.PieChart = PieChartLegend;
