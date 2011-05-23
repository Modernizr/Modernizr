(function () {
    function getPropertyDescriptors(object) {
      var props = { };
      for (var prop in object) {
        props[prop] = {
          type: typeof object[prop],
          value: object[prop]
        }
      }
      return props;
    }
    
    function getCleanWindow() {
      var elIframe = document.createElement('iframe');
      elIframe.style.display = 'none';
      document.body.appendChild(elIframe);
      elIframe.src = 'about:blank';
      return elIframe.contentWindow;
    }
    
    function appendControl(el, name) {
      var elCheckbox = document.createElement('input');
      elCheckbox.type = 'checkbox';
      elCheckbox.checked = true;
      elCheckbox.id = '__' + name;
      
      var elLabel = document.createElement('label');
      elLabel.htmlFor = '__' + name;
      elLabel.innerHTML = 'Exclude ' + name + ' properties?';
      elLabel.style.marginLeft = '0.5em';
      
      var elWrapper = document.createElement('p');
      elWrapper.style.marginBottom = '0.5em';
      
      elWrapper.appendChild(elCheckbox);
      elWrapper.appendChild(elLabel);

      el.appendChild(elWrapper);
    }
    
    function appendAnalyze(el) {
      var elAnalyze = document.createElement('button');
      elAnalyze.id = '__analyze';
      elAnalyze.innerHTML = 'Analyze';
      elAnalyze.style.marginTop = '1em';
      el.appendChild(elAnalyze);
    }
    
    function appendCancel(el) {
      var elCancel = document.createElement('a');
      elCancel.href = '#';
      elCancel.innerHTML = 'Cancel';
      elCancel.style.cssText = 'color:#eee;margin-left:0.5em;';
      elCancel.onclick = function() {
        el.parentNode.removeChild(el);
        return false; 
      };
      el.appendChild(elCancel);
    }
    
    function initConfigPopup() {
      var el = document.createElement('div');
      
      el.style.cssText =  'position:fixed; left:10px; top:10px; width:300px; background:rgba(50,50,50,0.9);' +
                          '-moz-border-radius:10px; padding:1em; color: #eee; text-align: left;' +
                          'font-family: "Helvetica Neue", Verdana, Arial, sans serif; z-index: 99999;';
      
      for (var prop in propSets) {
        appendControl(el, prop);
      }
      
      appendAnalyze(el);
      appendCancel(el);
      
      document.body.appendChild(el);
    }
    
    function getPropsCount(object) {
      var count = 0;
      for (var prop in object) {
        count++;
      }
      return count;
    }
    
    function shouldDeleteProperty(propToCheck) {
      for (var prop in propSets) {
        var elCheckbox = document.getElementById('__' + prop);
        var isPropInSet = propSets[prop].indexOf(propToCheck) > -1;
        if (elCheckbox.checked && isPropInSet) {
          return true;
        }
      }
    }
    
    function analyze() {
      var global = (function(){ return this; })(),
          globalProps = getPropertyDescriptors(global),
          cleanWindow = getCleanWindow();
          
      for (var prop in cleanWindow) {
        if (globalProps[prop]) {
          delete globalProps[prop];
        }
      }
      for (var prop in globalProps) {
        if (shouldDeleteProperty(prop)) {
          delete globalProps[prop];
        }
      }
      
      console.dir(globalProps);
      console.log('Total number of properties: ' + getPropsCount(globalProps));
    }
    
    var propSets = {
      'Prototype':        '$$ $A $F $H $R $break $continue $w Abstract Ajax Class Enumerable Element Field Form ' +
                          'Hash Insertion ObjectRange PeriodicalExecuter Position Prototype Selector Template Toggle Try'.split(' '),
                        
      'Scriptaculous':    'Autocompleter Builder Control Draggable Draggables Droppables Effect Sortable SortableObserver Sound Scriptaculous'.split(' '),
      'Firebug':          'loadFirebugConsole console _getFirebugConsoleElement _FirebugConsole _FirebugCommandLine _firebug'.split(' '),
      'Mozilla':          'Components XPCNativeWrapper XPCSafeJSObjectWrapper getInterface netscape GetWeakReference'.split(' '),
      'GoogleAnalytics':  'gaJsHost gaGlobal _gat _gaq pageTracker'.split(' ')
    };
    
    initConfigPopup();
    
    document.getElementById('__analyze').onclick = analyze;
})();