YUI({
    insertBefore: 'site_styles'
}).use('tabview', function(Y) {
    var classdocs = Y.one('#classdocs'),
        tabviewIndexTable = {};
    if (classdocs) {
        if (classdocs.all('li').size()) {
            var tabview = new Y.TabView({ srcNode: classdocs });
            tabview.render();
			classdocs.all('li a').each(function (item, index) {
				var hash = item.get(['hash']);
					type = hash.substring(1);
				if (!tabviewIndexTable[type]) {
					tabviewIndexTable[type] = index;
				}
			})
			Y.all('.sidebox.on-page').each(function (item, index) {
				var children = item.all('li a');
				children.each(function (cItem, cIndex) {
					return function () {
						var handleClick = function (e) {
							var node      = Y.one(this),
								hash      = node.get(['hash']),
								hashValue = hash.substring(1).split('_'),
								type      = hashValue.shift(),
								ogKey     = hashValue.join('_'); // in case the hash had other underscores
							if (tabviewIndexTable[type] > -1 && tabviewIndexTable[type] !== currentTab) {
								currentTab = tabviewIndexTable[type];
								tabview.selectChild(tabviewIndexTable[type]);
							}
						}
						Y.on('click', handleClick, cItem)
					}()
				})
			});
        }
    }
});
