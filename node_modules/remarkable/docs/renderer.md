# Renderer

Renderering is the second part of converting markdown to HTML. The renderer
converts the list of [tokens][parser] produced by the [Parsers][parser] to
produce actual HTML code.

Each rendering rule is a function taking four arguments:

* `tokens`: the list of tokens currently being processed
* `idx`: the index of the token currently being processed
* `options`: the options given to remarkable
* `env`: the key-value store created by the parsing rules

Each rule is registered with a name corresponding to a token's `type`. When the
renderer meets a token, it will invoke the rule associated to said token's
`type` and expect the function to return appropriate HTML code.

NB: Rendering rules are not provided with helpers to recursively invoke the renderer
and should not do so.

[parser]: parser.md
