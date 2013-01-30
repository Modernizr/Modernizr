/* node-markdown is based on Showdown parser (see vendor/showdown) */
/* usage: html = require("markdown").Markdown(markdown_string);    */

// import Showdown parser
var Showdown = new (require("./vendor/showdown/src/showdown.js").Showdown.converter)();

/**
 * Markdown(text, stripUnwanted, allowedtags, allowedAttribs) -> String
 * - text (String): Markdown syntax to be parsed
 * - stripUnwanted (Boolean): if TRUE strip all unwanted tags and attributes
 * - allowedTags (String): allowed HTML tags in the form of "tag1|tag2|tag3"
 * - allowedAttributes (Object): allowed attributes for specific tags
 *   format: {"tag1":"attrib1|attrib2|attrib3", "tag2":...}
 *   wildcard for all tags: "*"
 * - forceProtocol (Boolean): Force src and href to http:// if they miss a protocol.
 * 
 * Converts a markdown text into a HTML 
 **/
this.Markdown = function(text, stripUnwanted, allowedTags, allowedAttributes, forceProtocol){
    var md =  Showdown.makeHtml(text);
    if(stripUnwanted)
        return stripUnwantedHTML(md, allowedTags, allowedAttributes, forceProtocol);
    else
        return md;
}

/**
 * stripUnwantedHTML(html, allowedtags, allowedAttribs, forceProtocol) -> String
 * - html (String): HTML code to be parsed
 * - allowedTags (String): allowed HTML tags in the form of "tag1|tag2|tag3"
 * - allowedAttributes (Object): allowed attributes for specific tags
 *   format: {"tag1":"attrib1|attrib2|attrib3", "tag2":...}
 *   wildcard for all tags: "*"
 * - forceProtocol (Boolean): Force src and href to http:// if they miss a protocol.
 * 
 * Removes unwanted tags and attributes from HTML string
 **/
var stripUnwantedHTML = function(html /*, allowedTags, allowedAttributes, forceProtocol */){
    var allowedTags = arguments[1] || 
            'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|'+
            'i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr',
        allowedAttributes = arguments[2] || {
            'img': 'src|width|height|alt',
            'a':   'href',
            '*':   'title'
        }, forceProtocol = arguments[3] || false,
        
        testAllowed = new RegExp('^('+allowedTags.toLowerCase()+')$'),
        findTags = /<(\/?)\s*([\w:\-]+)([^>]*)>/g,
        findAttribs = /(\s*)([\w:-]+)\s*=\s*(?:(?:(["'])([^\3]+?)(?:\3))|([^\s]+))/g;
    
    // convert all strings patterns into regexp objects (if not already converted)
    for(var i in allowedAttributes){
        if(allowedAttributes.hasOwnProperty(i) && typeof allowedAttributes[i] === 'string'){
            allowedAttributes[i] = new RegExp('^('+
                allowedAttributes[i].toLowerCase()+')$');
        }
    }
    
    // find and match html tags
    return html.replace(findTags, function(original, lslash, tag, params){
        var tagAttr, wildcardAttr, 
            rslash = params.substr(-1)=="/" && "/" || "";

        tag = tag.toLowerCase();
        
        // tag is not allowed, return empty string
        if(!tag.match(testAllowed))
            return "";
        
        // tag is allowed
        else{
            // regexp objects for a particular tag
            tagAttr = tag in allowedAttributes && allowedAttributes[tag];
            wildcardAttr = "*" in allowedAttributes && allowedAttributes["*"];
            
            // if no attribs are allowed
            if(!tagAttr && !wildcardAttr)
                return "<"+lslash+tag+rslash+">";
            
            // remove trailing slash if any
            params = params.trim();
            if(rslash){
                params = params.substr(0, params.length-1);
            }
            
            // find and remove unwanted attributes
            params = params.replace(findAttribs, function(original, space,
                                                            name, quot, value){
                name = name.toLowerCase();
                
                if (!value && !quot) {
                  value = "";
                  quot = '"';
                } else if (!value) {
                  value = quot;
                  quot = '"';
                }
                
                // force data: and javascript: links and images to #
                if((name=="href" || name=="src") &&
                   (value.trim().substr(0, "javascript:".length)=="javascript:"
                    || value.trim().substr(0, "data:".length)=="data:")) {
                    value = "#";
                }
                
                // scope links and sources to http protocol
                if (forceProtocol &&
                     (name=="href" || name=="src") &&
                     !/^[a-zA-Z]{3,5}:\/\//.test(value)) {
                  value = "http://" + value;
                }
                
                if((wildcardAttr && name.match(wildcardAttr)) ||
                        (tagAttr && name.match(tagAttr))){
                    return space+name+"="+quot+value+quot;
                }else
                    return "";
            });

            return "<"+lslash+tag+(params?" "+params:"")+rslash+">";
        }
            
    });
}
