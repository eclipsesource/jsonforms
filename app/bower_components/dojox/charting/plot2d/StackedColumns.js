define(["dojo/_base/declare", "./Columns", "./commonStacked"], 
	function( declare, Columns, commonStacked){

	return declare("dojox.charting.plot2d.StackedColumns", Columns, {
		// summary:
		//		The plot object representing a stacked column chart (vertical bars).
		getSeriesStats: function(){
			// summary:
			//		Calculate the min/max on all attached series in both directions.
			// returns: Object
			//		{hmin, hmax, vmin, vmax} min/max in both directions.
			var stats = commonStacked.collectStats(this.series);
			stats.hmin -= 0.5;
			stats.hmax += 0.5;
			return stats; // Object
		},
		getValue: function(value, index, seriesIndex, indexed){
			var x, y;
			if(indexed){
				x = index;
				y = commonStacked.getIndexValue(this.series, seriesIndex, x);
			}else{
				x = value.x - 1;
				y = commonStacked.getValue(this.series, seriesIndex, value.x);
				y = [  y[0]?y[0].y:null, y[1]?y[1]:null ];
			}
			// in py we return the previous stack value as we need it to position labels on columns
			return { x: x, y: y[0], py: y[1] };
		}
	});
});
