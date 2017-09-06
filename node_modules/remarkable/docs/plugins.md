# Plugins

Plugins are the most easy way to distribute an extension for remarkable.

Plugins are expected to be loaded using `md.use(plugin[, opts])` (where `md` is
your instance of Remarkable.).

Plugins are nothing more than a function taking two arguments:

1. `md`: the Remarkable instance on which the plugin needs to be activated
2. `options`: the set of options that has been provided to `md.use`

Plugins are then expected to add [parsing][parser] and [rendering][renderer]
rules and carry on appropriate modifications on the remarkable instance.

It's as simple as that.

## Extending remarkable and the Markdown syntax

Remarkable converts markdown to HTML in two steps:

1. Parsing markdown raw text to a list of tokens
2. Rendering the list of tokens to actual HTML code.

Parsing rules are divided into three differents kind of rules
([core][core parsing], [block][block parsing] and [inline][inline parsing]).

To add a parsing rule, you will need to get the relevant parser for your rule
(`core`, `block` or `inline`) and insert your rule at the appropriate position
in the `ruler`.

For example, to add a new inline for strike-through, you'd need to do:
`md.inline.ruler.push("strike-through", strikeThroughInlineRule, { strokesCount:
2 });` where `strikeThroughInlineRule` is your [parsing rule][parser] for
strike-through.

To add a rendering rule, you need to follow exactly the same process, but using
the ruler `md.renderer.rules`.

### Rulers

Rulers provide four main methods to manage their rules:

* `before(beforeName, ruleName, fn, options)`: inserts a new rule before the
  rule `beforeName`.
* `after(afterName, ruleName, fn, options)`: inserts a new rule after the
  rule `afterName`.
* `push(ruleName, fn, options)`: inserts a new rule at the end of the rule list.
* `at(ruleName, fn, options)`: replace the rule `ruleName` with a new rule.

[parser]: parser.md
[renderer]: renderer.md
[core parsing]: parsing_core.md
[block parsing]: parsing_block.md
[inline parsing]: parsing_inline.md
