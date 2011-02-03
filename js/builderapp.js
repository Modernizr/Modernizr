jQuery(function($){
  // var run = false;
  // $(':checkbox').attr('checked', true);

  // Add dynamic toggle buttons; should inverse current selection per group, not just toggle all on OR off only
  $("a.toggle-group").live('click', function() {
    var group = $(this).closest(".features");
    var checkbox = $(group).find(':checkbox');
    checkbox.each(function(){
      $(this).attr('checked', !$(this).is(':checked'));
    });
    //event.preventDefault();
    return false;
  });
  $("legend.title").append('<a href="#" class="toggle-group">toggle</a>');

  // Generate the custom download
  $('#generate').click(function(){
    // Get all the tests and enhancements
    var tests = [],
        mLoad =  $('#load input:checked').length,
        selections = true; // ALWAYS ON !!!!! $('#selectioncomment input:checked').length;
    
    $('.features input:checked').each(function(){
      // Special case for Modernizr.load and selection comment
      if ( this.value !== 'load' && this.value !== 'selectioncomment' ) {
        tests.push( this.value );
      }
    });

    function addExtras (modularBuild) {


      if ( selections ) {
        if ( mLoad ) {
          modularBuild = "\/* Modernizr.load enabled *\/\n" + modularBuild;
        }
        modularBuild = "\/* Modernizr custom build of " + Modernizr._version + ": " + tests.join(' | ') + " *\/\n" + modularBuild;
      }
      return modularBuild;
    }

    function handleInjection(modularBuild) {
      window.location = '#' + tests.join('-') + ( mLoad ? '-load' : ''); // I killed it cuz it's always on now. + ( selections ? '-selectioncomment' : '' );
      $("#generatedSource").addClass('sourceView').val( modularBuild );
    }

    function buildFile( modularBuild, appended ) {
      var uglifiedModularBuild = uglify( modularBuild + ( appended || '' ), ['--extra', '--unsafe'] );

      // Track the different builds
      _gaq.push(['_trackPageview', '/build/'+[].slice.call($('ul li input:checked').map(function(key, val){ return ($(this).closest('li')[0].id || undefined); }), 0).join("^")]);
      
      uglifiedModularBuild = addExtras(uglifiedModularBuild);
      handleInjection(uglifiedModularBuild);

      // Create Download Button
      Downloadify.create('modulizrize',{
        filename: function(){
          return 'modernizr.custom.'+((+new Date) + "").substr(8)+'.js';
        },
        data: function(){ 
          return uglifiedModularBuild;
        },
        swf: '../media/downloadify.swf',
        downloadImage: '../media/download.png',
        width: 170,
        height: 38,
        transparent: true,
        append: false
      });

      $('#buildArea').fadeIn();
    }

    // Grab the modernizr source and run it through modulizr
    $.ajax({
      dataType: 'text',
      cache: false,
      type: 'GET',
      url: $('script[src*=modernizr]').attr('src'),
      success:function(script) {
        // Call the modulr function to create a modular build
        var modularBuild = Modulizr.ize(script, [].slice.call(tests,0));
        if ( $('#load input:checked').length ) {
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '../js/modernizr.load.js',
            success : function ( loader ) {
              buildFile( modularBuild, loader );
            }
          });
        }
        else {
          buildFile( modularBuild );
        }
      }
    });
  });

  // Check for preselections
  function loadFromHash () {
    var hash = window.location.hash;
    if ( hash.length > 1 ) {
      hash = hash.substr(1);
      var selections = hash.split('-');
      // Unselect everything
      $('input[type="checkbox"]').removeAttr('checked');
      for(var i in selections) {
        $('input[value="'+selections[i]+'"]').attr('checked', 'checked');
      }
      $('#generate').click();
    }
  }
  loadFromHash();
});
