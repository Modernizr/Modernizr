<!-- version -->
# 6.10.0 API Reference
<!-- versionstop -->

<img src="https://raw.github.com/hapijs/joi/master/images/validation.png" align="right" />

<!-- toc -->

- [Joi](#joi)
  - [`validate(value, schema, [options], [callback])`](#validatevalue-schema-options-callback)
  - [`compile(schema)`](#compileschema)
  - [`assert(value, schema, [message])`](#assertvalue-schema-message)
  - [`attempt(value, schema, [message])`](#attemptvalue-schema-message)
  - [`isRef(ref)`](#isrefref)
  - [`any`](#any)
    - [`any.allow(value)`](#anyallowvalue)
    - [`any.valid(value)` - aliases: `only`, `equal`](#anyvalidvalue---aliases-only-equal)
    - [`any.invalid(value)` - aliases: `disallow`, `not`](#anyinvalidvalue---aliases-disallow-not)
    - [`any.required()`](#anyrequired)
    - [`any.optional()`](#anyoptional)
    - [`any.forbidden()`](#anyforbidden)
    - [`any.strip()`](#anystrip)
    - [`any.description(desc)`](#anydescriptiondesc)
    - [`any.notes(notes)`](#anynotesnotes)
    - [`any.tags(tags)`](#anytagstags)
    - [`any.meta(meta)`](#anymetameta)
    - [`any.example(value)`](#anyexamplevalue)
    - [`any.unit(name)`](#anyunitname)
    - [`any.options(options)`](#anyoptionsoptions)
    - [`any.strict(isStrict)`](#anystrictisstrict)
    - [`any.default([value, [description]])`](#anydefaultvalue-description)
    - [`any.concat(schema)`](#anyconcatschema)
    - [`any.when(ref, options)`](#anywhenref-options)
    - [`any.label(name)`](#anylabelname)
    - [`any.raw(isRaw)`](#anyrawisraw)
    - [`any.empty(schema)`](#anyemptyschema)
  - [`array`](#array)
    - [`array.sparse(enabled)`](#arraysparseenabled)
    - [`array.single(enabled)`](#arraysingleenabled)
    - [`array.items(type)`](#arrayitemstype)
    - [`array.ordered(type)`](#arrayorderedtype)
    - [`array.min(limit)`](#arrayminlimit)
    - [`array.max(limit)`](#arraymaxlimit)
    - [`array.length(limit)`](#arraylengthlimit)
    - [`array.unique()`](#arrayunique)
  - [`boolean`](#boolean)
  - [`binary`](#binary)
    - [`binary.encoding(encoding)`](#binaryencodingencoding)
    - [`binary.min(limit)`](#binaryminlimit)
    - [`binary.max(limit)`](#binarymaxlimit)
    - [`binary.length(limit)`](#binarylengthlimit)
  - [`date`](#date)
    - [`date.min(date)`](#datemindate)
    - [`date.max(date)`](#datemaxdate)
    - [`date.format(format)`](#dateformatformat)
    - [`date.iso()`](#dateiso)
  - [`func`](#func)
  - [`number`](#number)
    - [`number.min(limit)`](#numberminlimit)
    - [`number.max(limit)`](#numbermaxlimit)
    - [`number.greater(limit)`](#numbergreaterlimit)
    - [`number.less(limit)`](#numberlesslimit)
    - [`number.integer()`](#numberinteger)
    - [`number.precision(limit)`](#numberprecisionlimit)
    - [`number.multiple(base)`](#numbermultiplebase)
    - [`number.positive()`](#numberpositive)
    - [`number.negative()`](#numbernegative)
  - [`object`](#object)
    - [`object.keys([schema])`](#objectkeysschema)
      - [`{} notation`](#-notation)
      - [`Joi.object([schema]) notation`](#joiobjectschema-notation)
      - [`Joi.object().keys([schema]) notation`](#joiobjectkeysschema-notation)
    - [`object.min(limit)`](#objectminlimit)
    - [`object.max(limit)`](#objectmaxlimit)
    - [`object.length(limit)`](#objectlengthlimit)
    - [`object.pattern(regex, schema)`](#objectpatternregex-schema)
    - [`object.and(peers)`](#objectandpeers)
    - [`object.nand(peers)`](#objectnandpeers)
    - [`object.or(peers)`](#objectorpeers)
    - [`object.xor(peers)`](#objectxorpeers)
    - [`object.with(key, peers)`](#objectwithkey-peers)
    - [`object.without(key, peers)`](#objectwithoutkey-peers)
    - [`object.rename(from, to, [options])`](#objectrenamefrom-to-options)
    - [`object.assert(ref, schema, [message])`](#objectassertref-schema-message)
    - [`object.unknown([allow])`](#objectunknownallow)
    - [`object.type(constructor, [name])`](#objecttypeconstructor-name)
    - [`object.requiredKeys(children)`](#objectrequiredkeyschildren)
    - [`object.optionalKeys(children)`](#objectoptionalkeyschildren)
  - [`string`](#string)
    - [`string.insensitive()`](#stringinsensitive)
    - [`string.min(limit, [encoding])`](#stringminlimit-encoding)
    - [`string.max(limit, [encoding])`](#stringmaxlimit-encoding)
    - [`string.creditCard()`](#stringcreditcard)
    - [`string.length(limit, [encoding])`](#stringlengthlimit-encoding)
    - [`string.regex(pattern, [name])`](#stringregexpattern-name)
    - [`string.replace(pattern, replacement)`](#stringreplacepattern-replacement)
    - [`string.alphanum()`](#stringalphanum)
    - [`string.token()`](#stringtoken)
    - [`string.email([options])`](#stringemailoptions)
    - [`string.ip([options])`](#stringipoptions)
    - [`string.uri([options])`](#stringurioptions)
    - [`string.guid()`](#stringguid)
    - [`string.hex()`](#stringhex)
    - [`string.hostname()`](#stringhostname)
    - [`string.lowercase()`](#stringlowercase)
    - [`string.uppercase()`](#stringuppercase)
    - [`string.trim()`](#stringtrim)
    - [`string.isoDate()`](#stringisodate)
  - [`alternatives`](#alternatives)
    - [`alternatives.try(schemas)`](#alternativestryschemas)
    - [`alternatives.when(ref, options)`](#alternativeswhenref-options)
  - [`ref(key, [options])`](#refkey-options)
- [Errors](#errors)

<!-- tocstop -->

## Joi

### `validate(value, schema, [options], [callback])`

Validates a value using the given schema and options where:
- `value` - the value being validated.
- `schema` - the validation schema. Can be a **joi** type object or a plain object where every key is assigned a **joi** type object.
- `options` - an optional object with the following optional keys:
  - `abortEarly` - when `true`, stops validation on the first error, otherwise returns all the errors found. Defaults to `true`.
  - `convert` - when `true`, attempts to cast values to the required types (e.g. a string to a number). Defaults to `true`.
  - `allowUnknown` - when `true`, allows object to contain unknown keys which are ignored. Defaults to `false`.
  - `skipFunctions` - when `true`, ignores unknown keys with a function value. Defaults to `false`.
  - `stripUnknown` - when `true`, unknown keys are deleted (only when value is an object or an array). Defaults to `false`.
  - `language` - overrides individual error messages, when `'label'` is set, it overrides the key name in the error message. Defaults to no override (`{}`).
  - `presence` - sets the default presence requirements. Supported modes: `'optional'`, `'required'`, and `'forbidden'`.
    Defaults to `'optional'`.
  - `context` - provides an external data set to be used in [references](#refkey-options). Can only be set as an external option to
    `validate()` and not using `any.options()`.
  - `noDefaults` - when `true`, do not apply default values. Defaults to `false`.
- `callback` - the optional synchronous callback method using the signature `function(err, value)` where:
  - `err` - if validation failed, the [error](#errors) reason, otherwise `null`.
  - `value` - the validated value with any type conversions and other modifiers applied (the input is left unchanged). `value` can be
    incomplete if validation failed and `abortEarly` is `true`. If callback is not provided, then returns an object with [error](#errors)
    and value properties.

```javascript
var schema = {
    a: Joi.number()
};

var value = {
    a: '123'
};

Joi.validate(value, schema, function (err, value) { });
// err -> null
// value.a -> 123 (number, not string)

// or
var result = Joi.validate(value, schema);
// result.error -> null
// result.value -> { "a" : 123 }
```

### `compile(schema)`

Converts literal schema definition to **joi** schema object (or returns the same back if already a **joi** schema object) where:
- `schema` - the schema definition to compile.

```javascript
var definition = ['key', 5, { a: true, b: [/^a/, 'boom'] }];
var schema = Joi.compile(definition);

// Same as:

var schema = Joi.alternatives().try([
    Joi.string().valid('key'),
    Joi.number().valid(5),
    Joi.object().keys({
        a: Joi.boolean().valid(true),
        b: Joi.alternatives().try([
            Joi.string().regex(/^a/),
            Joi.string().valid('boom')
        ])
    })
]);
```

### `assert(value, schema, [message])`

Validates a value against a schema and [throws](#errors) if validation fails where:
- `value` - the value to validate.
- `schema` - the schema object.
- `message` - optional message string prefix added in front of the error message. may also be an Error object.

```javascript
Joi.assert('x', Joi.number());
```

### `attempt(value, schema, [message])`

Validates a value against a schema, returns valid object, and [throws](#errors) if validation fails where:
- `value` - the value to validate.
- `schema` - the schema object.
- `message` - optional message string prefix added in front of the error message. may also be an Error object.

```javascript
Joi.attempt('x', Joi.number()); // throws error
var result = Joi.attempt('4', Joi.number()); // result -> 4
```

### `isRef(ref)`

Checks whether or not the provided argument is a reference.
It's especially useful if you want to post-process error messages.

```js
var ref = Joi.ref('a');
Joi.isRef(ref); // returns true
```

### `any`

Generates a schema object that matches any data type.

```javascript
var any = Joi.any();
any.validate('a', function (err, value) { });
```

#### `any.allow(value)`

Whitelists a value where:
- `value` - the allowed value which can be of any type and will be matched against the validated value before applying any other rules.
  `value` can be an array of values, or multiple values can be passed as individual arguments. `value` supports [references](#refkey-options).

Note that this whitelist of allowed values is in *addition* to any other permitted values.
To create an exclusive whitelist of values, see [`any.valid(value)`](#anyvalidvalue).

```javascript
var schema = {
    a: Joi.any().allow('a'),
    b: Joi.any().allow('b', 'B'),
    c: Joi.any().allow(['c', 'C'])
};
```

#### `any.valid(value)` - aliases: `only`, `equal`

Adds the provided values into the allowed whitelist and marks them as the only valid values allowed where:
- `value` - the allowed value which can be of any type and will be matched against the validated value before applying any other rules.
  `value` can be an array of values, or multiple values can be passed as individual arguments. `value` supports [references](#refkey-options).

```javascript
var schema = {
    a: Joi.any().valid('a'),
    b: Joi.any().valid('b', 'B'),
    c: Joi.any().valid(['c', 'C'])
};
```

#### `any.invalid(value)` - aliases: `disallow`, `not`

Blacklists a value where:
- `value` - the forbidden value which can be of any type and will be matched against the validated value before applying any other rules.
  `value` can be an array of values, or multiple values can be passed as individual arguments. `value` supports [references](#refkey-options).

```javascript
var schema = {
    a: Joi.any().invalid('a'),
    b: Joi.any().invalid('b', 'B'),
    c: Joi.any().invalid(['c', 'C'])
};
```

#### `any.required()`

Marks a key as required which will not allow `undefined` as value. All keys are optional by default.

```javascript
var schema = Joi.any().required();
```

#### `any.optional()`

Marks a key as optional which will allow `undefined` as values. Used to annotate the schema for readability as all keys are optional by default.

```javascript
var schema = Joi.any().optional();
```

#### `any.forbidden()`

Marks a key as forbidden which will not allow any value except `undefined`. Used to explicitly forbid keys.

```javascript
var schema = {
    a: Joi.any().forbidden()
};
```

#### `any.strip()`

Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.

```javascript
var schema = {
    username: Joi.string(),
    password: Joi.string().strip()
};

schema.validate({ username: 'test', password: 'hunter2' }, function (err, value) {
    // value = { username: 'test' }
});

var schema = Joi.array().items(Joi.string(), Joi.any().strip());

schema.validate(['one', 'two', true, false, 1, 2], function (err, value) {
    // value = ['one', 'two']
});
```

#### `any.description(desc)`

Annotates the key where:
- `desc` - the description string.

```javascript
var schema = Joi.any().description('this key will match anything you give it');
```

#### `any.notes(notes)`

Annotates the key where:
- `notes` - the notes string or array of strings.

```javascript
var schema = Joi.any().notes(['this is special', 'this is important']);
```

#### `any.tags(tags)`

Annotates the key where:
- `tags` - the tag string or array of strings.

```javascript
var schema = Joi.any().tags(['api', 'user']);
```

#### `any.meta(meta)`

Attaches metadata to the key where:
- `meta` - the meta object to attach.

```javascript
var schema = Joi.any().meta({ index: true });
```

#### `any.example(value)`

Annotates the key where:
- `value` - an example value.

If the example fails to pass validation, the function will throw.

```javascript
var schema = Joi.string().min(4).example('abcd');
```

#### `any.unit(name)`

Annotates the key where:
- `name` - the unit name of the value.

```javascript
var schema = Joi.number().unit('milliseconds');
```

#### `any.options(options)`

Overrides the global `validate()` options for the current key and any sub-key where:
- `options` - an object with the same optional keys as [`Joi.validate(value, schema, options, callback)`](#validatevalue-schema-options-callback).

```javascript
var schema = Joi.any().options({ convert: false });
```

#### `any.strict(isStrict)`

Strict mode sets the `options.convert` options to `false` which prevent type casting for the current key and any child keys.
- `isStrict` - whether strict mode is enabled or not. Defaults to true.

```javascript
var schema = Joi.any().strict();
```

#### `any.default([value, [description]])`

Sets a default value if the original value is undefined where:
- `value` - the value.
  - `value` supports [references](#refkey-options).
  - `value` may also be a function which returns the default value. If `value` is specified as a function that accepts a single parameter, that parameter will be a context object that can be used to derive the resulting value. **This clones the object however, which incurs some overhead so if you don't need access to the context define your method so that it does not accept any parameters**.
  - without any `value`, `default` has no effect, except for `object` that will then create nested defaults (applying inner defaults of that object).

Note that if `value` is an object, any changes to the object after `default()` is called will change the reference
and any future assignment.

Additionally, when specifying a method you must either have a `description` property on your method or the second parameter is required.

```javascript
var generateUsername = function (context) {

  return context.firstname.toLowerCase() + '-' + context.lastname.toLowerCase();
};
generateUsername.description = 'generated username';

var schema = {
    username: Joi.string().default(generateUsername),
    firstname: Joi.string(),
    lastname: Joi.string(),
    created: Joi.date().default(Date.now, 'time of creation'),
    status: Joi.string().default('registered')
};

Joi.validate({
    firstname: 'Jane',
    lastname: 'Doe'
}, schema, function (err, value) {

    // value.status === 'registered'
    // value.username === 'jane-doe'
    // value.created will be the time of validation
});
```

#### `any.concat(schema)`

Returns a new type that is the result of adding the rules of one type to another where:
- `schema` - a **joi** type to merge into the current schema. Can only be of the same type as the context type or `any`. If applied to an `any` type, the schema can be any other schema.

```javascript
var a = Joi.string().valid('a');
var b = Joi.string().valid('b');
var ab = a.concat(b);
```

#### `any.when(ref, options)`

Converts the type into an [`alternatives`](#alternatives) type where the conditions are merged into the type definition where:
- `ref` - the key name or [reference](#refkey-options).
- `options` - an object with:
    - `is` - the required condition **joi** type.
    - `then` - the alternative schema type if the condition is true. Required if `otherwise` is missing.
    - `otherwise` - the alternative schema type if the condition is false. Required if `then` is missing.

```javascript
var schema = {
    a: Joi.any().valid('x').when('b', { is: 5, then: Joi.valid('y'), otherwise: Joi.valid('z') }),
    b: Joi.any()
};
```

Alternatively, if you want to specify a specific type such as `string`, `array`, etc, you can do so like this:

```javascript
var schema = {
    a: Joi.valid('a', 'b', 'other'),
    other: Joi.string()
        .when('a', { is: 'other', then: Joi.required() }),
};
```

#### `any.label(name)`

Overrides the key name in error messages.
- `name` - the name of the key.

```javascript
var schema = {
    first_name: Joi.string().label('First Name')
};
```

#### `any.raw(isRaw)`

Outputs the original untouched value instead of the casted value.
- `isRaw` - whether to enable raw mode or not. Defaults to true.

```javascript
var schema = {
    timestamp: Joi.date().format('YYYYMMDD').raw()
};
```

#### `any.empty(schema)`

Considers anything that matches the schema to be empty (`undefined`).
- `schema` - any object or joi schema to match. An undefined schema unsets that rule.

```js
var schema = Joi.string().empty('');
schema.validate(''); // returns { error: null, value: undefined }
schema = schema.empty();
schema.validate(''); // returns { error: "value" is not allowed to be empty, value: '' }
```

### `array`

Generates a schema object that matches an array data type. Note that undefined values inside arrays are not allowed by default but can be by using `sparse()`.

Supports the same methods of the [`any()`](#any) type.

```javascript
var array = Joi.array().items(Joi.string().valid('a', 'b'));
array.validate(['a', 'b', 'a'], function (err, value) { });
```

#### `array.sparse(enabled)`

Allow this array to be sparse. `enabled` can be used with a falsy value to go back to the default behavior.

```javascript
var schema = Joi.array().sparse(); // undefined values are now allowed
schema = schema.sparse(false); // undefined values are now denied
```

#### `array.single(enabled)`

Allow single values to be checked against rules as if it were provided as an array.

`enabled` can be used with a falsy value to go back to the default behavior.

```javascript
var schema = Joi.array().items(Joi.number()).single();
schema.validate([4]); // returns `{ error: null, value: [ 4 ] }`
schema.validate(4); // returns `{ error: null, value: [ 4 ] }`
```

#### `array.items(type)`

List the types allowed for the array values where:
- `type` - a **joi** schema object to validate each array item against. `type` can be an array of values, or multiple values can be passed as individual arguments.

If a given type is `.required()` then there must be a matching item in the array.
If a type is `.forbidden()` then it cannot appear in the array.
Required items can be added multiple times to signify that multiple items must be found.
Errors will contain the number of items that didn't match. Any unmatched item having a [label](#anylabelname) will be mentioned explicitly.

```javascript
var schema = Joi.array().items(Joi.string(), Joi.number()); // array may contain strings and numbers
var schema = Joi.array().items(Joi.string().required(), Joi.string().required()); // array must contain at least two strings
var schema = Joi.array().items(Joi.string().valid('not allowed').forbidden(), Joi.string()); // array may contain strings, but none of those strings can match 'not allowed'
var schema = Joi.array().items(Joi.string().label('My string').required(), Joi.number().required()); // If this fails it can result in `[ValidationError: "value" does not contain [My string] and 1 other required value(s)]`
```

#### `array.ordered(type)`

List the types in sequence order for the array values where:
- `type` - a **joi** schema object to validate against each array item in sequence order. `type` can be an array of values, or multiple values can be passed as individual arguments.

If a given type is `.required()` then there must be a matching item with the same index position in the array.
Errors will contain the number of items that didn't match. Any unmatched item having a [label](#anylabelname) will be mentioned explicitly.

```javascript
var schema = Joi.array().ordered(Joi.string().required(), Joi.number().required()); // array must have first item as string and second item as number
var schema = Joi.array().ordered(Joi.string().required()).items(Joi.number().required()); // array must have first item as string and 1 or more subsequent items as number
var schema = Joi.array().ordered(Joi.string().required(), Joi.number()); // array must have first item as string and optionally second item as number
```

#### `array.min(limit)`

Specifies the minimum number of items in the array where:
- `limit` - the lowest number of array items allowed.

```javascript
var schema = Joi.array().min(2);
```

#### `array.max(limit)`

Specifies the maximum number of items in the array where:
- `limit` - the highest number of array items allowed.

```javascript
var schema = Joi.array().max(10);
```

#### `array.length(limit)`

Specifies the exact number of items in the array where:
- `limit` - the number of array items allowed.

```javascript
var schema = Joi.array().length(5);
```

#### `array.unique()`

Requires the array values to be unique.

Be aware that a deep equality is performed on elements of the array having a type of `object`, a performance penalty is to be expected for this kind of operation.

```javascript
var schema = Joi.array().unique();
```

### `boolean`

Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', 'no', 'on' or 'off'). Can also be called via `bool()`.

Supports the same methods of the [`any()`](#any) type.

```javascript
var boolean = Joi.boolean();
boolean.validate(true, function (err, value) { });
```

### `binary`

Generates a schema object that matches a Buffer data type (as well as the strings which will be converted to Buffers).

Supports the same methods of the [`any()`](#any) type.

```javascript
var schema = Joi.binary();
```

#### `binary.encoding(encoding)`

Sets the string encoding format if a string input is converted to a buffer where:
- `encoding` - the encoding scheme.

```javascript
var schema = Joi.binary().encoding('base64');
```

#### `binary.min(limit)`

Specifies the minimum length of the buffer where:
- `limit` - the lowest size of the buffer.

```javascript
var schema = Joi.binary().min(2);
```

#### `binary.max(limit)`

Specifies the maximum length of the buffer where:
- `limit` - the highest size of the buffer.

```javascript
var schema = Joi.binary().max(10);
```

#### `binary.length(limit)`

Specifies the exact length of the buffer:
- `limit` - the size of buffer allowed.

```javascript
var schema = Joi.binary().length(5);
```

### `date`

Generates a schema object that matches a date type (as well as a JavaScript date string or number of milliseconds).

Supports the same methods of the [`any()`](#any) type.

```javascript
var date = Joi.date();
date.validate('12-21-2012', function (err, value) { });
```

#### `date.min(date)`

Specifies the oldest date allowed where:
- `date` - the oldest date allowed.

```javascript
var schema = Joi.date().min('1-1-1974');
```

Notes: `'now'` can be passed in lieu of `date` so as to always compare relatively to the current date, allowing to explicitly ensure a date is either in the past or in the future.

```javascript
var schema = Joi.date().min('now');
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  from: Joi.date().required(),
  to: Joi.date().min(Joi.ref('from')).required()
});
```

#### `date.max(date)`

Specifies the latest date allowed where:
- `date` - the latest date allowed.

```javascript
var schema = Joi.date().max('12-31-2020');
```

Notes: `'now'` can be passed in lieu of `date` so as to always compare relatively to the current date, allowing to explicitly ensure a date is either in the past or in the future.

```javascript
var schema = Joi.date().max('now');
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  from: Joi.date().max(Joi.ref('to')).required(),
  to: Joi.date().required()
});
```

#### `date.format(format)`

Specifies the allowed date format:
- `format` - string or array of strings that follow the `moment.js` [format](http://momentjs.com/docs/#/parsing/string-format/).

```javascript
var schema = Joi.date().format('YYYY/MM/DD');
```

#### `date.iso()`

Requires the string value to be in valid ISO 8601 date format.

```javascript
var schema = Joi.date().iso();
```

### `func`

Generates a schema object that matches a function type.

Supports the same methods of the [`object()`](#object) type. Note that validating a function keys will cause the function
to be cloned. While the function will retain its prototype and closure, it will lose its `length` property value (will be
set to `0`).

```javascript
var func = Joi.func();
func.validate(function () {}, function (err, value) { });
```

### `number`

Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).

`Infinity` and `-Infinity` are invalid by default, you can change that behavior by calling `allow(Infinity, -Infinity)`.

Supports the same methods of the [`any()`](#any) type.

```javascript
var number = Joi.number();
number.validate(5, function (err, value) { });
```

#### `number.min(limit)`

Specifies the minimum value where:
- `limit` - the minimum value allowed.

```javascript
var schema = Joi.number().min(2);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().min(Joi.ref('min')).required()
});
```

#### `number.max(limit)`

Specifies the maximum value where:
- `limit` - the maximum value allowed.

```javascript
var schema = Joi.number().max(10);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  min: Joi.number().max(Joi.ref('max')).required(),
  max: Joi.number().required()
});
```

#### `number.greater(limit)`

Specifies that the value must be greater than `limit`.

```javascript
var schema = Joi.number().greater(5);
```

```javascript
var schema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().greater(Joi.ref('min')).required()
});
```

#### `number.less(limit)`

Specifies that the value must be less than `limit`.

```javascript
var schema = Joi.number().less(10);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  min: Joi.number().less(Joi.ref('max')).required(),
  max: Joi.number().required()
});
```

#### `number.integer()`

Requires the number to be an integer (no floating point).

```javascript
var schema = Joi.number().integer();
```

#### `number.precision(limit)`

Specifies the maximum number of decimal places where:
- `limit` - the maximum number of decimal places allowed.

```javascript
var schema = Joi.number().precision(2);
```

#### `number.multiple(base)`

Specifies that the value must be a multiple of `base`:

```javascript
var schema = Joi.number().multiple(3);
```

#### `number.positive()`

Requires the number to be positive.

```javascript
var schema = Joi.number().positive();
```

#### `number.negative()`

Requires the number to be negative.

```javascript
var schema = Joi.number().negative();
```

### `object`

Generates a schema object that matches an object data type (as well as JSON strings that parsed into objects). Defaults
to allowing any child key.

Supports the same methods of the [`any()`](#any) type.

```javascript
var object = Joi.object().keys({
    a: Joi.number().min(1).max(10).integer(),
    b: 'some string'
});

object.validate({ a: 5 }, function (err, value) { });
```

#### `object.keys([schema])`

Sets or extends the allowed object keys where:
- `schema` - optional object where each key is assigned a **joi** type object. If `schema` is `{}` no keys allowed.
  If `schema` is `null` or `undefined`, any key allowed. If `schema` is an object with keys, the keys are added to any
  previously defined keys (but narrows the selection if all keys previously allowed). Defaults to 'undefined' which
  allows any child key.

```javascript
var base = Joi.object().keys({
    a: Joi.number(),
    b: Joi.string()
});
// Validate keys a, b and c.
var extended = base.keys({
    c: Joi.boolean()
});
```

Notes: We have three different ways to define a schema for performing a validation

- Using the plain JS object notation:
```javascript
var schema = {
    a: Joi.string(),
    b: Joi.number()
};
```
- Using the `Joi.object([schema])` notation
```javascript
var schema = Joi.object({
    a: Joi.string(),
    b: Joi.number()
});
```
- Using the `Joi.object().keys([schema])` notation
```javascript
var schema = Joi.object().keys({
    a: Joi.string(),
    b: Joi.number()
});
```

While all these three objects defined above will result in the same validation object, there are some differences in using one or another:

##### `{} notation`

When using the `{}` notation, you are just defining a plain JS object, which isn't a schema object.
You can pass it to the validation method but you can't call `validate()` method of the object because it's just a plain JS object.

Besides, passing the `{}` object to the `validate()` method each time, will perform an expensive schema compilation operation on every validation.

##### `Joi.object([schema]) notation`

Using `Joi.object([schema])` will return a schema object, so you can call the `validate()` method directly, e.g:

```javascript
var schema = Joi.object({
    a: Joi.boolean()
});

schema.validate(true, function (err, value) {
    console.log('err: ', err);
});
```

When you use `Joi.object([schema])`, it gets compiled the first time, so you can pass it to the `validate()` method multiple times and no overhead is added.

Another benefits of using `Joi.object([schema])` instead of a plain JS object is that you can set any options on the object like allowing unknown keys, e.g:

```javascript
var schema = Joi.object({
    arg: Joi.string().valid('firstname', 'lastname', 'title', 'company', 'jobtitle'),
    value: Joi.string(),
}).pattern(/firstname|lastname/, Joi.string().min(2));
```

##### `Joi.object().keys([schema]) notation`

This is basically the same as `Joi.object([schema])`, but using `Joi.object().keys([schema])` is more useful when you want to add more keys (e.g. call `keys()` multiple times). If you are only adding one set of keys, you can skip the `keys()` method and just use `object()` directly.

Some people like to use `keys()` to make the code more explicit (this is style only).


#### `object.min(limit)`

Specifies the minimum number of keys in the object where:
- `limit` - the lowest number of keys allowed.

```javascript
var schema = Joi.object().min(2);
```

#### `object.max(limit)`

Specifies the maximum number of keys in the object where:
- `limit` - the highest number of object keys allowed.

```javascript
var schema = Joi.object().max(10);
```

#### `object.length(limit)`

Specifies the exact number of keys in the object where:
- `limit` - the number of object keys allowed.

```javascript
var schema = Joi.object().length(5);
```

#### `object.pattern(regex, schema)`

Specify validation rules for unknown keys matching a pattern where:
- `regex` - a regular expression tested against the unknown key names.
- `schema` - the schema object matching keys much validate against.

```javascrip
var schema = Joi.object({
    a: Joi.string()
}).pattern(/\w\d/, Joi.boolean());
```

#### `object.and(peers)`

Defines an all-or-nothing relationship between keys where if one of the peers is present, all of them are required as
well where:
- `peers` - the key names of which if one present, all are required. `peers` can be a single string value, an
  array of string values, or each peer provided as an argument.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).and('a', 'b');
```

#### `object.nand(peers)`

Defines a relationship between keys where not all peers can be present at the
same time where:
- `peers` - the key names of which if one present, the others may not all be present. `peers` can be a single string value, an
  array of string values, or each peer provided as an argument.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).nand('a', 'b');
```

#### `object.or(peers)`

Defines a relationship between keys where one of the peers is required (and more than one is allowed) where:
- `peers` - the key names of which at least one must appear. `peers` can be a single string value, an
  array of string values, or each peer provided as an argument.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).or('a', 'b');
```

#### `object.xor(peers)`

Defines an exclusive relationship between a set of keys where one of them is required but not at the same time where:
- `peers` - the exclusive key names that must not appear together but where one of them is required. `peers` can be a single string value, an
  array of string values, or each peer provided as an argument.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).xor('a', 'b');
```

#### `object.with(key, peers)`

Requires the presence of other keys whenever the specified key is present where:
- `key` - the reference key.
- `peers` - the required peer key names that must appear together with `key`. `peers` can be a single string value or an array of string values.

Note that unlike [`object.and()`](#objectandpeers), `with()` creates a dependency only between the `key` and each of the `peers`, not
between the `peers` themselves.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).with('a', 'b');
```

#### `object.without(key, peers)`

Forbids the presence of other keys whenever the specified is present where:
- `key` - the reference key.
- `peers` - the forbidden peer key names that must not appear together with `key`. `peers` can be a single string value or an array of string values.

```javascript
var schema = Joi.object().keys({
    a: Joi.any(),
    b: Joi.any()
}).without('a', ['b']);
```

#### `object.rename(from, to, [options])`

Renames a key to another name (deletes the renamed key) where:
- `from` - the original key name.
- `to` - the new key name.
- `options` - an optional object with the following optional keys:
    - `alias` - if `true`, does not delete the old key name, keeping both the new and old keys in place. Defaults to `false`.
    - `multiple` - if `true`, allows renaming multiple keys to the same destination where the last rename wins. Defaults to `false`.
    - `override` - if `true`, allows renaming a key over an existing key. Defaults to `false`.
    - `ignoreUndefined` - if `true`, skip renaming of a key if it's undefined. Defaults to `false`.

Keys are renamed before any other validation rules are applied.

```javascript
var object = Joi.object().keys({
    a: Joi.number()
}).rename('b', 'a');

object.validate({ b: 5 }, function (err, value) { });
```

#### `object.assert(ref, schema, [message])`

Verifies an assertion where:
- `ref` - the key name or [reference](#refkey-options).
- `schema` - the validation rules required to satisfy the assertion. If the `schema` includes references, they are resolved against
  the object value, not the value of the `ref` target.
- `message` - optional human-readable message used when the assertion fails. Defaults to 'failed to pass the assertion test'.

```javascript
var schema = Joi.object().keys({
    a: {
        b: Joi.string(),
        c: Joi.number()
    },
    d: {
        e: Joi.any()
    }
}).assert('d.e', Joi.ref('a.c'), 'equal to a.c');
```

#### `object.unknown([allow])`

Overrides the handling of unknown keys for the scope of the current object only (does not apply to children) where:
- `allow` - if `false`, unknown keys are not allowed, otherwise unknown keys are ignored.

```javascript
var schema = Joi.object({ a: Joi.any() }).unknown();
```

#### `object.type(constructor, [name])`

Requires the object to be an instance of a given constructor where:
- `constructor` - the constructor function that the object must be an instance of.
- `name` - an alternate name to use in validation errors. This is useful when the constructor function does not have a name.

```javascript
var schema = Joi.object().type(RegExp);
```

#### `object.requiredKeys(children)`

Sets the specified children to required.
- `children` - can be a single string value, an array of string values, or each child provided as an argument.

```javascript
var schema = Joi.object().keys({ a: { b: Joi.number() }, c: { d: Joi.string() } });
var requiredSchema = schema.requiredKeys('', 'a.b', 'c', 'c.d');
```

Note that in this example `''` means the current object, `a` is not required but `b` is, as well as `c` and `d`.

#### `object.optionalKeys(children)`

Sets the specified children to optional.
- `children` - can be a single string value, an array of string values, or each child provided as an argument.

```javascript
var schema = Joi.object().keys({ a: { b: Joi.number().required() }, c: { d: Joi.string().required() } });
var requiredSchema = schema.optionalKeys('a.b', 'c.d');
```

The behavior is exactly the same as `requiredKeys`.

### `string`

Generates a schema object that matches a string data type. Note that empty strings are not allowed by default and must be enabled with `allow('')`.

Supports the same methods of the [`any()`](#any) type.

```javascript
var schema = Joi.string().min(1).max(10);
schema.validate('12345', function (err, value) { });
```

#### `string.insensitive()`

Allows the value to match any whitelist of blacklist item in a case insensitive comparison.

```javascript
var schema = Joi.string().valid('a').insensitive();
```

#### `string.min(limit, [encoding])`

Specifies the minimum number string characters where:
- `limit` - the minimum number of string characters required.
- `encoding` - is specified, the string length is calculated in bytes using the provided encoding.

```javascript
var schema = Joi.string().min(2);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  min: Joi.string().required(),
  value: Joi.string().min(Joi.ref('min'), 'utf8').required()
});
```

#### `string.max(limit, [encoding])`

Specifies the maximum number of string characters where:
- `limit` - the maximum number of string characters allowed.
- `encoding` - is specified, the string length is calculated in bytes using the provided encoding.

```javascript
var schema = Joi.string().max(10);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  max: Joi.string().required(),
  value: Joi.string().max(Joi.ref('max'), 'utf8').required()
});
```

#### `string.creditCard()`

Requires the number to be a credit card number (Using [Lunh
Algorithm](http://en.wikipedia.org/wiki/Luhn_algorithm)).

```javascript
var schema = Joi.string().creditCard();
```

#### `string.length(limit, [encoding])`

Specifies the exact string length required where:
- `limit` - the required string length.
- `encoding` - is specified, the string length is calculated in bytes using the provided encoding.

```javascript
var schema = Joi.string().length(5);
```

It can also be a reference to another field.

```javascript
var schema = Joi.object({
  length: Joi.string().required(),
  value: Joi.string().length(Joi.ref('length'), 'utf8').required()
});
```

#### `string.regex(pattern, [name])`

Defines a regular expression rule where:
- `pattern` - a regular expression object the string value must match against.
- `name` - optional name for patterns (useful with multiple patterns). Defaults to 'required'.

```javascript
var schema = Joi.string().regex(/^[abc]+$/);
```

#### `string.replace(pattern, replacement)`

Replace characters matching the given _pattern_ with the specified
_replacement_ string where:
- `pattern` - a regular expression object to match against, or a string of which _all_ occurrences will be replaced.
- `replacement` - the string that will replace the pattern.


```javascript
var schema = Joi.string().replace(/b/gi, 'x');
schema.validate('abBc', function (err, value) {
  // here value will be 'axxc'
});
```

When `pattern` is a _string_ all its occurrences will be replaced.

#### `string.alphanum()`

Requires the string value to only contain a-z, A-Z, and 0-9.

```javascript
var schema = Joi.string().alphanum();
```

#### `string.token()`

Requires the string value to only contain a-z, A-Z, 0-9, and underscore _.

```javascript
var schema = Joi.string().token();
```

#### `string.email([options])`

Requires the string value to be a valid email address.

- `options` - optional settings:
    - `errorLevel` - Numerical threshold at which an email address is considered invalid.
    - `tldWhitelist` - Specifies a list of acceptable TLDs.
    - `minDomainAtoms` - Number of atoms required for the domain. Be careful since some domains, such as `io`, directly allow email.

```javascript
var schema = Joi.string().email();
```

#### `string.ip([options])`

Requires the string value to be a valid ip address.

- `options` - optional settings:
    - `version` - One or more IP address versions to validate against. Valid values: `ipv4`, `ipv6`, `ipvfuture`
    - `cidr` - Used to determine if a CIDR is allowed or not. Valid values: `optional`, `required`, `forbidden`

```javascript
// Accept only ipv4 and ipv6 addresses with a CIDR
var schema = Joi.string().ip({
  version: [
    'ipv4',
    'ipv6'
  ],
  cidr: 'required'
});
```

#### `string.uri([options])`

Requires the string value to be a valid [RFC 3986](http://tools.ietf.org/html/rfc3986) URI.

- `options` - optional settings:
    - `scheme` - Specifies one or more acceptable Schemes, should only include the scheme name. Can be an Array or String (strings are automatically escaped for use in a Regular Expression).

```javascript
// Accept git or git http/https
var schema = Joi.string().uri({
  scheme: [
    'git',
    /git\+https?/
  ]
});
```

#### `string.guid()`

Requires the string value to be a valid GUID.

```javascript
var schema = Joi.string().guid();
```

#### `string.hex()`

Requires the string value to be a valid hexadecimal string.

```javascript
var schema = Joi.string().hex();
```

#### `string.hostname()`

Requires the string value to be a valid hostname as per [RFC1123](http://tools.ietf.org/html/rfc1123).

```javascript
var schema = Joi.string().hostname();
```

#### `string.lowercase()`

Requires the string value to be all lowercase. If the validation `convert` option is on (enabled by default), the string
will be forced to lowercase.

```javascript
var schema = Joi.string().lowercase();
```

#### `string.uppercase()`

Requires the string value to be all uppercase. If the validation `convert` option is on (enabled by default), the string
will be forced to uppercase.

```javascript
var schema = Joi.string().uppercase();
```

#### `string.trim()`

Requires the string value to contain no whitespace before or after. If the validation `convert` option is on (enabled by
default), the string will be trimmed.

```javascript
var schema = Joi.string().trim();
```

#### `string.isoDate()`

Requires the string value to be in valid ISO 8601 date format.

```js
var schema = Joi.string().isoDate();
```

### `alternatives`

Generates a type that will match one of the provided alternative schemas via the [`try()`](#alternativestryschemas)
method. If no schemas are added, the type will not match any value except for `undefined`.

Supports the same methods of the [`any()`](#any) type.

Alternatives can be expressed using the shorter `[]` notation.

```javascript
var alt = Joi.alternatives().try(Joi.number(), Joi.string());
// Same as [Joi.number(), Joi.string()]
```

#### `alternatives.try(schemas)`

Adds an alternative schema type for attempting to match against the validated value where:
- `schema` - an array of alternative **joi** types. Also supports providing each type as a separate argument.

```javascript
var alt = Joi.alternatives().try(Joi.number(), Joi.string());
alt.validate('a', function (err, value) { });
```

#### `alternatives.when(ref, options)`

Adds a conditional alternative schema type based on another key (not the same as `any.when()`) value where:
- `ref` - the key name or [reference](#refkey-options).
- `options` - an object with:
    - `is` - the required condition **joi** type.
    - `then` - the alternative schema type to **try** if the condition is true. Required if `otherwise` is missing.
    - `otherwise` - the alternative schema type to **try** if the condition is false. Required if `then` is missing.

```javascript
var schema = {
    a: Joi.alternatives().when('b', { is: 5, then: Joi.string(), otherwise: Joi.number() }),
    b: Joi.any()
};
```

Note that `when()` only adds additional alternatives to try and does not impact the overall type. Setting
a `required()` rule on a single alternative will not apply to the overall key. For example,
this definition of `a`:

```javascript
var schema = {
    a: Joi.alternatives().when('b', { is: true, then: Joi.required() }),
    b: Joi.boolean()
};
```

Does not turn `a` into a required key when `b` is `true`. Instead, it tells the validator to try and match the
value to anything that's not `undefined`. However, since `Joi.alternatives()` by itself allows `undefined`, the rule
does not accomplish turning `a` to a required value. This rule is the same as `Joi.alternatives([Joi.required()])`
when `b` is `true` which will allow any value including `undefined`.

To accomplish the desired result above use:

```javascript
var schema = {
    a: Joi.when('b', { is: true, then: Joi.required() }),
    b: Joi.boolean()
};
```

### `ref(key, [options])`

Generates a reference to the value of the named key. References are resolved at validation time and in order of dependency
so that if one key validation depends on another, the dependent key is validated second after the reference is validated.
References support the following arguments:
- `key` - the reference target. References cannot point up the object tree, only to sibling keys, but they can point to
  their siblings' children (e.g. 'a.b.c') using the `.` separator. If a `key` starts with `$` is signifies a context reference
  which is looked up in the `context` option object.
- `options` - optional settings:
    - `separator` - overrides the default `.` hierarchy separator.
    - `contextPrefix` - overrides the default `$` context prefix signifier.

Note that references can only be used where explicitly supported such as in `valid()` or `invalid()` rules. If upwards
(parents) references are needed, use [`object.assert()`](#objectassertref-schema-message).

```javascript
var schema = Joi.object().keys({
    a: Joi.ref('b.c'),
    b: {
        c: Joi.any()
    },
    c: Joi.ref('$x')
});

Joi.validate({ a: 5, b: { c: 5 } }, schema, { context: { x: 5 } }, function (err, value) {});
```

## Errors

Joi throws classical javascript `Error`s containing :
- `name` - `ValidationError`.
- `details` - an array of errors :
    - `message` - string with a description of the error.
    - `path` - dotted path to the key where the error happened.
    - `type` - type of the error.
    - `context` - object providing context of the error.
- `annotate` - function that returns a string with an annotated version of the object pointing at the places where errors occured.
- `_object` - the original object to validate.