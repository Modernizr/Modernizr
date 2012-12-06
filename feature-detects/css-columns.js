
Modernizr.addTest('csscolumns', function() {
	
	var tests = {
		columncount: Modernizr.testAllProps('columnCount'),
		columnwidth: Modernizr.testAllProps('columnWidth'),
		columngap: Modernizr.testAllProps('columnGap'),
		columnrule: Modernizr.testAllProps('columnRule'),
		columnspan: Modernizr.testAllProps('columnSpan'),
		columnfill: Modernizr.testAllProps('columnFill')
	};

	for(var feature in tests){
		console.log(feature);
		Modernizr.classes.push((tests[feature]) ? '' : 'no-') + feature);
	}

	return tests;

});