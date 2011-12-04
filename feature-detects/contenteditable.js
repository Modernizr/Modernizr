// contentEditable
// http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable
// by Addy Osmani
Modernizr.addTest('contenteditable', !!('isContentEditable' in document.createElement('span')));
