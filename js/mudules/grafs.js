//create namespace
(function(){
	diagram = {
		PieChart: function(canvasId, data) {
			//input
			this.canvas = document.getElementById(canvasId);
			this.data = data;

			//constants
			this.padding = 10;
			this.legendBorder = 2;
			this.pieBorder = 5;
			this.colortextSize = 20;
			this.borderColor = '#555';
			this.shadowColor = '#777';
			this.shadowBlur = 10;
			this.shadowX = 2;
			this.shadowY = 2;
			this.font = '16pt Calibri';

			//relationships
			this.context = this.canvas.getContext('2d');
			this.legendWidth = 20//this.getLegendWidth();
			this.legendX = 0//this.canvas.width - this.legendWidth;
			this.legendY = 0//this.padding;
			this.pieAreaWidth = (this.canvas.width - this.legendWidth);
			this.pieAreaHeight = this.canvas.height;
			this.pieX = this.pieAreaWidth / 2;
			this.pieY = this.pieAreaHeight / 2;
			this.pieRadius = (Math.min(this.pieAreaWidth, this.pieAreaHeight) / 2) - (this.padding);

			//draw pie chart
			this.drawPieBorder();
			this.drawSlices();
			//this.drawLegend();
		}
	};
	diagram.PieChart.prototype.getLegendWidth = function() {
		//loop trought all texts and find with is the longets
		this.context.font = this.font;
		var textWidth = 0,
			i;

		for(i = 0; i < this.data.length; i += 1 ){
			var text = this.data[i].text;
			textWidth = Math.max(textWidth, this.context.measureText(text).width);
		}

		return textWidth + (this.padding * 2) + this.legendBorder + this.colortextSize;
	};
	diagram.PieChart.prototype.drawPieBorder = function() {
		var context = this.context;
		context.save();
		context.fillStyle = 'white';
		context.shadowColor = this.shadowColor;
		context.shadowBlur = this.shadowBlur;
		context.shadowOffsetX = this.shadowX;
		context.shadowOffsetY = this.shadowY;
		context.beginPath();
		context.arc(this.pieX, this.pieY, this.pieRadius + this.pieBorder, 0, Math.PI * 2, false);
		context.fill();
		context.closePath();
		context.restore();
	};
	diagram.PieChart.prototype.drawSlices = function() {
		var context = this.context,
			total, startAngle, i, slice, sliceAngle, endAngle;

		context.save();
		total = this.getTotalvoted();
		startAngle = 0;

		for (i = 0; i < this.data.length; i += 1) {
			slice = this.data[i];
			//draw slice
			sliceAngle = 2 * Math.PI * slice.voted / total;
			endAngle = startAngle + sliceAngle;

			context.beginPath();
			context.moveTo(this.pieX, this.pieY);
			context.arc(this.pieX, this.pieY, this.pieRadius, startAngle, endAngle, false);
			context.fillStyle = slice.color;
			context.fill();
			context.closePath();
			startAngle = endAngle;
		}
		context.restore();
	};
	//get the total voted of the texts
	diagram.PieChart.prototype.getTotalvoted = function() {
		var data = this.data,
			total = 0,
			i;

		for (i = 0; i < data.length; i += 1) {
			total += data[i].voted;
		}

		return total;
	};
	diagram.PieChart.prototype.drawLegend = function() {
		var context = this.context,
			textX,	textY, i, slice;
		context.save();
		textX = this.legendX;
		textY = this.legendY;

		context.strokeStyle = 'black';
		context.lineWidth = this.legendBorder;
		context.font = this.font;
		context.textBaseline = 'middle';

		for (var i = 0; i < this.data.length; i++) {
			slice = this.data[i];

			//draw legend text
			context.beginPath();
			context.rect(textX, textY, this.colortextSize, this.colortextSize);
			context.closePath();
			context.fillStyle = slice.color;
			context.fill();
			context.stroke();
			context.fillStyle = 'black';
			context.fillText(slice.text, textX + this.colortextSize + this.padding, textY + this.colortextSize / 2);
			textY += this.colortextSize + this.padding;
		};
	};
	// EXAMPLE
	// window.onload = function () {
	// 	var data = [
	// 		{
	// 			text: 'Eating',
	// 			voted: 2,
	// 			color: 'violet'
	// 		},
	// 		{
	// 			text: 'Working',
	// 			voted: 5,
	// 			color: 'blue'
	// 		},
	// 		{
	// 			text: 'Sleeping',
	// 			voted: 9,
	// 			color: 'green'
	// 		},
	// 	];
	// 	new diagram.PieChart('canvas', data);
	// }

})();