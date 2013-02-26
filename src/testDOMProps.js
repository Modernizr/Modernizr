define(['is', 'fnBind'], function( is ) {
  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   */
  function testDOMProps( props, obj, elem ) {
    var item;

    for ( var i in props ) {
      if ( props[i] in obj ) {

        // return the property name as a string
        if (elem === false) return props[i];

        item = obj[props[i]];

        // let's bind a function (and it has a bind method -- certain native objects that report that they are a
        // function don't [such as webkitAudioContext])
        if (is(item, 'function') && 'bind' in item){
          // default to autobind unless override
          return item.bind(elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  return testDOMProps;
});
