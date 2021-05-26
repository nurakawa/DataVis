class BarChart{

    constructor(selection, data, config = {}) {
        let self = this;
        this.selection = selection;
        this.data = data;
        

        // Graph configuration
        this.cfg = {
            margin: {top: 23, right: 30, bottom: 34, left: 40},
            key: 'key',
            label2: 'location_cases',
            label: 'date',
            color: 'steelblue',
            greycolor: '#CCC',
            yscaleformat: '.2f',
            currentkey: false,
            title: false,
            source: false,
            mean: false,
            meanlabel: false,
            xticks: false,
        };

        Object.keys(config).forEach(function(key) {
            if(config[key] instanceof Object && config[key] instanceof Array === false){
                Object.keys(config[key]).forEach(function(sk) {
                    self.cfg[key][sk] = config[key][sk];
                });
            } else self.cfg[key] = config[key];
        });

        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right,
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        this.xScale = d3.scaleBand().rangeRound([0, this.cfg.width]).padding(0.1);
        this.yScale = d3.scaleLinear().rangeRound([0, self.cfg.height]);

        window.addEventListener("resize", function(){self.resize()});

        this.initGraph();
    }
    initGraph() {
        var self = this;

        this.xScale.domain(this.data.map(function(d) { return d[self.cfg.label]; }));
        //this.yScale.domain([d3.max(this.data, function(d){ return +d[self.cfg.key]}),0])
        
        if (self.cfg.key == 'new_cases_per_million'){
           this.yScale.domain([21,0])
        }
        
        if (self.cfg.key == 'new_deaths_per_million'){
        this.yScale.domain([4,0])
        }

        this.svg = this.selection.append('svg')
            .attr("class", "chart barchart")
            //.attr("viewBox", "0 0 "+(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)+" "+(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom))
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        this.g = this.svg.append("g")
            .attr("transform", "translate(" + (self.cfg.margin.left) + "," + (self.cfg.margin.top) + ")");

        // TITLE
        if(self.cfg.title){
            this.title = this.svg.append('text')
                .attr('class', 'title label')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate('+ (self.cfg.width/2) +',20)')
                .text(self.cfg.title)
        }

        // SOURCE
        if(self.cfg.source){
            this.source = this.svg.append('text')
                .attr('class', 'source label')
                .attr('transform', 'translate('+ (self.cfg.margin.left) +','+(self.cfg.height + self.cfg.margin.top + self.cfg.margin.bottom - 5)+')')
                .html(self.cfg.source)

        }

        // GRID
        this.yGrid = this.g.append("g")           
            .attr("class", "grid grid--y")
            //.attr("stroke", "red")
            .call(self.make_y_gridlines()
                .tickSize(-self.cfg.width)
                .ticks(3, self.cfg.yscaleformat));

        // AXIS
        if(self.cfg.xticks){
                this.xAxis = this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.cfg.height + ")")
            .call(d3.axisBottom(self.xScale));

        this.xAxis.selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
           .attr("dy", "-.6em")
            .attr("transform", "rotate(-90)");

        }

        this.itemg = this.g.selectAll('.itemgroup')
            .data(this.data)
            .enter().append('g')
            .attr('class', 'itemgroup')
            .attr('transform', function(d, i){
                return 'translate('+ self.xScale(d[self.cfg.label]) +',0)';
        })
        
        // COLORPICKER
        var accent = d3.scaleOrdinal(d3.schemeTableau10);
        
        function colorPicker(v) {
        if (v == "Asia") {
        return accent(1);}
        else if (v == "Europe") {
        return accent(2);} 
        else if (v == "North America") {
        return accent(3);}
        else if (v == "South America") {
        return accent(4);}
        else if (v == "Africa") {
        return accent(5);}
        else {
        return "#111111";}
        }

        this.rects = this.itemg.append('rect')
            .attr('x', 0)
            .attr('y', function(d, i){
                return self.yScale(+d[self.cfg.key]);
            })
            .attr('width', this.xScale.bandwidth())
            .attr('height', function(d){
                return self.cfg.height - self.yScale(+d[self.cfg.key]);
            })
            .attr('fill', function(d){
                return !self.cfg.currentkey || d[self.cfg.label] == self.cfg.currentkey ? self.cfg.color : self.cfg.greycolor;
            });

            //.attr('fill', function(d){
                
                //var c = String(d[self.cfg.label2]);
                //return !self.cfg.currentkey || d[self.cfg.key] == self.cfg.currentkey ? colorPicker(c): self.cfg.greycolor;
            //});

        this.rects.append("title")
            .attr('text-anchor', 'top')
            .text(function(d) { return d[self.cfg.key]});
            
        if(this.cfg.mean){
            this.mean = this.g.append('line')
                .attr('class', 'axis axis--mean')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('x1', 0)
                .attr('y1', this.yScale(this.cfg.mean))
                .attr('x2', this.cfg.width)
                .attr('y2', this.yScale(this.cfg.mean))

            if(this.cfg.meanlabel){
                this.meanlabel = this.g.append('text')
                    .attr('class', 'label label--mean')
                    .attr('text-anchor', 'end')
                    .attr('x', this.cfg.width)
                    .attr('y', this.yScale(this.cfg.mean) - 3)
                    .text(this.cfg.meanlabel)
            }
        }

    }

    // gridlines in x axis function
    make_x_gridlines() {       
        return d3.axisBottom(this.xScale);
    }

    // gridlines in y axis function
    make_y_gridlines() {       
        return d3.axisLeft(this.yScale);
    }

    resize(){
        var self = this;

        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        this.xScale.rangeRound([0, this.cfg.width]);
        this.yScale.rangeRound([0, this.cfg.height]);

        this.svg
            .attr("viewBox", "0 0 "+(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)+" "+(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom))
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);


        this.yGrid.call(self.make_y_gridlines()
            .tickSize(-self.cfg.width)
            .tickFormat(d3.format("d")));


        this.xAxis.attr("transform", "translate(0," + this.cfg.height + ")")
            .call(d3.axisBottom(self.xScale))

        this.itemg.attr('transform', function(d, i){
            return 'translate('+ self.xScale(d[self.cfg.label]) +',0)';
        })

        this.rects.attr('width', this.xScale.bandwidth())
            .attr('y', function(d, i){
                return self.yScale(+d[self.cfg.key]);
            })
            .attr('height', function(d){
                return self.cfg.height - self.yScale(+d[self.cfg.key]);
            })

        if(this.cfg.mean){
            this.mean.attr('y1', this.yScale(self.cfg.mean))
                .attr('x2', self.cfg.width)
                .attr('y2', self.yScale(self.cfg.mean))

            if(this.cfg.meanlabel) this.meanlabel.attr('x', this.cfg.width).attr('y', this.yScale(this.cfg.mean) - 3)

        }

        if(self.cfg.title) this.title.attr('transform', 'translate('+ (self.cfg.width/2) +',20)')
        if(self.cfg.source) this.source.attr('transform', 'translate('+ (self.cfg.margin.left) +','+(self.cfg.height + self.cfg.margin.top + self.cfg.margin.bottom - 5)+')')

    }
}
