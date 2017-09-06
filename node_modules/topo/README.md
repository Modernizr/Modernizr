# topo

Topological sorting with grouping support.

[![Build Status](https://secure.travis-ci.org/hapijs/topo.png)](http://travis-ci.org/hapijs/topo)

Lead Maintainer: [Devin Ivy](https://github.com/devinivy)

## Usage

See the [API Reference](API.md)

**Example**
```node
var Topo = require('topo');

var morning = new Topo();

morning.add('Nap', { after: ['breakfast', 'prep'] });

morning.add([
    'Make toast',
    'Pour juice'
], { before: 'breakfast', group: 'prep' });

morning.add('Eat breakfast', { group: 'breakfast' });

morning.nodes;        // ['Make toast', 'Pour juice', 'Eat breakfast', 'Nap']
```
