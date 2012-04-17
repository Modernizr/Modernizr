// CSS Regions
// http://www.w3.org/TR/css3-regions/
// By: Mihai Balan

// Simple, CSS parser based
Modernizr.addTest('regions', function() {
	/* Attempt a quick-to-fail test */
	if (Modernizr.testAllProps('flowInto')) {
		/* If CSS parsing is there, try to determine if regions actually work. */
		var container = document.createElement('div'),
		content = document.createElement('div'),
		region = document.createElement('div'),
		/* we create a random, unlikely to be generated flow number to make sure we don't
		clash with anything more vanilla, like 'flow', or 'article', or 'f1' */
		flowName = 'modernizr_flow_for_regions_check';

		/* First create a div with two adjacent divs inside it. The first will be the
		content, the second will be the region. To be able to distinguish between the two,
		we'll give the region a particular padding */
		content.innerText = 'M';
		container.style.cssText = 'top: 150px; left: 150px; padding: 0px;'
		region.style.cssText = 'width: 50px; height: 50px; padding: 42px;';

		/* Get the 'flowFrom' property name available in the browser. Either default or vendor prefixed.
		If the property name can't be found we'll get Boolean 'false' and fail quickly */
		var flowFromProperty = Modernizr.prefixed("flowFrom")
		if (!flowFromProperty){
		    return false
		}
		region.style[flowFromProperty] = flowName;
		container.appendChild(content);
		container.appendChild(region);
		document.body.appendChild(container);

		/* Now compute the bounding client rect, before and after attempting to flow the
		content div in the region div. If regions are enabled, the after bounding rect
		should reflect the padding of the region div.*/
		var plainRect, flowedRect, delta;
		plainRect = content.getBoundingClientRect()

		var flowIntoProperty = Modernizr.prefixed("flowInto")
		if (!flowIntoProperty){
		    return false
		}
		content.style[flowIntoProperty] = flowName;
		flowedRect = content.getBoundingClientRect();
		
		delta = flowedRect.left - plainRect.left;
		document.body.removeChild(container);
		delete content;
		delete region;
		delete container;

		if (delta == 42) {
		  return true;
		}
	}
	return false;
});