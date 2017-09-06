# API Reference

## `Topo`
The `Topo` object is the container for topologically sorting a list of nodes with non-circular interdependencies.

### `new Topo()`
Creates a new `Topo` object.

### `topo.add(nodes, [options])`
Specifies an additional node or list of nodes to be topologically sorted where:
  - `nodes` - a mixed value or array of mixed values to be added as nodes to the topologically sorted list.
  - `options` - optional sorting information about the `nodes`:
    - `group` - a string naming the group to which `nodes` should be assigned.  The group name `'?'` is reserved.
    - `before` - a string or array of strings specifying the groups that `nodes` must precede in the topological sort.
    - `after` - a string or array of strings specifying the groups that `nodes` must succeed in the topological sort.
    - `sort` - a numerical value used to sort items when performing a `topo.merge()`.

Returns an array of the topologically sorted nodes.

### `topo.nodes`
An array of the topologically sorted nodes.  This list is renewed upon each call to [`topo.add()`](#topoaddnodes-options).

### `topo.merge(others)`
Merges another `Topo` object into the current object where:
- `others` - the other object or array of objects to be merged into the current one. `null`
  values are ignored.

Returns an array of the topologically sorted nodes. Will throw if a dependency error is found as a result of the
combined items.

If the order in which items have been added to each list matters, use the `sort` option in `topo.add()` with an incrementing
value providing an absolute sort order among all items added to either object.