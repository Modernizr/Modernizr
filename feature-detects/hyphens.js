/* see http://dev.davidnewton.ca/the-current-state-of-hyphenation-on-the-web */

(function() {
	function test_hyphens(delimiter, testWidth) {
		try {
			/* create a div container and a span within that
			 * these have to be appended to document.body, otherwise some browsers can give false negative */
			var div = document.createElement('div'),
				span = document.createElement('span'),
				divStyle = div.style,
				spanSize = 0,
				result = false,
				result1 = false,
				result2 = false;
			document.body.appendChild(div); 		
			div.appendChild(span);
			divStyle.cssText = 'position:absolute;top:0;left:0;overflow:visible;width:1.25em;';

			/* get height of unwrapped text */
			span.innerHTML = 'mm';
			spanSize = span.offsetHeight;

			/* compare height w/ delimiter, to see if it wraps to new line */
			span.innerHTML = 'm' + delimiter + 'm';
			result1 = (span.offsetHeight > spanSize);

			/* if we're testing the width too (i.e. for soft-hyphen, not zws),
			 * this is because tested Blackberry devices will wrap the text but not display the hyphen */
			if (testWidth) {
				/* get width of wrapped, non-hyphenated text */
				span.innerHTML = 'm<br />m';
				spanSize = span.offsetWidth;

				/* compare width w/ wrapped w/ delimiter to see if hyphen is present */
				span.innerHTML = 'm' + delimiter + 'm';
				result2 = (span.offsetWidth > spanSize);
			} else {
				result2 = true;
			}

			/* results and cleanup */
			if (result1 === true && result2 === true) { result = true; }
			div.removeChild(span);
			document.body.removeChild(div);
			return result;
		} catch(e) {
			return false;
		}
	}

	function test_hyphens_find(delimiter) {
		try {
			/* create a dummy input for resetting selection location, and a div container
			 * these have to be appended to document.body, otherwise some browsers can give false negative
			 * div container gets the doubled testword, separated by the delimiter
			 * Note: giving a width to div gives false positive in iOS Safari */
			var dummy = document.createElement('input'),
				div = document.createElement('div'),
				testword = 'lebowski',
				result = false,
				textrange;
			document.body.appendChild(dummy);
			document.body.appendChild(div);
			div.innerHTML = testword + delimiter + testword;

			/* reset the selection to the dummy input element, i.e. BEFORE the div container
			 * this conditional block based on http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area */
			if (dummy.setSelectionRange) {
				dummy.focus();
				dummy.setSelectionRange(0,0);
			} else if (dummy.createTextRange) {
				textrange = dummy.createTextRange();
				textrange.collapse(true);
				textrange.moveEnd('character', 0);
				textrange.moveStart('character', 0);
				textrange.select();
			}

			/* try to find the doubled testword, without the delimiter */
			if (window.find) {
				result = window.find(testword + testword);
			} else {
				try {
					textrange = self.document.body.createTextRange();
					result = textrange.findText(testword + testword);
				} catch(e) {
					result = false;
				}
			}
			document.body.removeChild(div);
			document.body.removeChild(dummy);
			return result;
		} catch(e) {
			return false;
		}
	}

	function test_hyphens_css() {
		try {
			/* create a div container and a span within that
			 * these have to be appended to document.body, otherwise some browsers can give false negative */
			var div = document.createElement('div'),
				span = document.createElement('span'),
				divStyle = div.style,
				spanHeight = 0,
				spanWidth = 0,
				result = false,
				result1 = false,
				result2 = false;
			document.body.appendChild(div); 		
			div.appendChild(span);
			span.innerHTML = 'Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.';

			/* get size of unhyphenated text */
			divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;';
			spanHeight = span.offsetHeight;
			spanWidth = span.offsetWidth;

			/* compare size with hyphenated text */
			divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;-moz-hyphens:auto;-webkit-hyphens:auto;-o-hyphens:auto;-ms-hyphens:auto;hyphens:auto;';
			result = (span.offsetHeight != spanHeight || span.offsetWidth != spanWidth);

			/* results and cleanup */
			div.removeChild(span);
			document.body.removeChild(div);
			return result;
			return result;
		} catch(e) {
			return false;
		}
	}


	Modernizr.addTest("csshyphens", function() {
		return Modernizr.testAllProps('hyphens');
	});

	Modernizr.addTest("workingcsshyphens", function() {
		try {
			return test_hyphens_css();
		} catch(e) {
			return false;
		}
	});

	Modernizr.addTest("softhyphens", function() {
		try {
			return test_hyphens('&#173;', true) && test_hyphens('&#8203;', false); // use numeric entity instead of &shy; in case it's XHTML
		} catch(e) {
			return false;
		}
	});

	Modernizr.addTest("softhyphensfind", function() {
		try {
			return test_hyphens_find('&#173;') && test_hyphens_find('&#8203;');
		} catch(e) {
			return false;
		}
	});
})();
