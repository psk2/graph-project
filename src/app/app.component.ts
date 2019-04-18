import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';

@Component({
	selector: 'app-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	@ViewChild('chart')
	private chartContainer: ElementRef;

	title = 'graph-project';
	margin = { top: 50, right: 50, bottom: 100, left: 100 };
	constructor() {

	}

	ngOnInit(){
		this.createChart();
	}

	private createChart(): void {
		var confusionMatrix = [
			["","Predicted : NO", "Predicted : YES",""],
			["Actual : NO","TN = 50", "FP = 10","60"], 
			["Actual : YES", "FN = 5", "TP = 100","105"],
			["","55","110",""]
		];

		d3.select('svg').remove();

		const element = this.chartContainer.nativeElement;

		var width = 500,
			height = 500,
			data = confusionMatrix


		if (!data) {
			throw new Error('Please pass data');
		}

		if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
			throw new Error('It should be a 2-D array');
		}

		var numrows = data.length;
		var numcols = data[0].length;

		var svg = d3.select(element).append("svg")
			.attr("width", width + this.margin.left + this.margin.right)
			.attr("height", height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		var background = svg.append("rect")
			.attr("width", width)
			.attr("height", height);

			var x = d3.scale.ordinal()
			.domain(d3.range(numcols))
			.rangeBands([0, width]);
	
		var y = d3.scale.ordinal()
			.domain(d3.range(numrows))
			.rangeBands([0, height]);
	
		var row = svg.selectAll(".row")
			.data(data)
			  .enter().append("g")
			.attr("class", "row")
			.attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
	
		var cell = row.selectAll(".cell")
			.data(function(d) { return d; })
				.enter().append("g")
			.attr("class", "cell")
			.attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });
	
		cell.append('rect')
			.attr("width", x.rangeBand())
			.attr("height", y.rangeBand())
			.style("stroke-width", 2);
	
		cell.append("text")
			.attr("dy", ".32em")
			.attr("x", x.rangeBand() / 2)
			.attr("y", y.rangeBand() / 2)
			.attr("text-anchor", "middle")
			.style("fill",'black')
			.text(function(d, i) { return d; });
	
		row.selectAll(".cell")
			.data(function(d, i) { return data[i]; })
			.style("fill", 'white')
			.style("stroke",function(d,i,j) { return !d ? "none":"black"});
	}
}
