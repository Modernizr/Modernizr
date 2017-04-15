
// Determines if browser recognizes dates in dd-MMM-yyyy format ("17-MAY-2013").

Modernizr.addTest('valid_date_dd_mmm_yyyy', function() {
	return !isNaN(Date.parse("17-MAY-2013"));
});