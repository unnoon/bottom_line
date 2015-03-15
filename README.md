# bottom_line.js

Javascript utility belt that takes a middle ground between sugar & underscore/lodash striving for consistency, code readability and faces in your code

## Syntax & features

The syntax of bottom\_line is close to the 'object-oriented' style of javascript prefixed with the bottom\_line face .\_.

```javascript
arr._.remove('elm1');
```

### Mutators over new objects

By default a method will mutate the object itself. A Pascal case variant is used to create a object while the original object is untouched.

```javascript
// mutates arr
arr._.remove('elm1');

// creates a new array leaving the original version untouched
arr._.Remove('elm1');
```

### Variable arguments & functions

Most methods come in two variants. One that accepts multiple arguments the other using a callback & optional context as input. The callback variant is postfixed with Fn

```javascript
// multiple arguments
arr._.remove('elm1', 'elm2');

// remove elements by function
arr._.removeFn(function(elm) {return elm === 'elm1'});
```

### Applying to 'all'

A method can be extended to apply to 'all' elements by postfixing it with $

```javascript
// removes all arguments including duplicates
arr._.remove$('elm1', 'elm2');

// removes all elements matched by the function
arr._.remove$Fn(function(elm) {return elm === 'elm1'});
```

### Negated methods

For readability every method can be negated by prefixing not.

```javascript
// normal call
arr._.has('elm1');

// negated form
arr._.not.has('elm1');
```

### Much more

Besides the stuff mentioned above it has lots of other features. Such as a collection of integer functions, string functions a super elaborate extend function etc. For more information checkout the the docs folder!

## Future work

Still lots of stuff I want to improve such as

- better test coverage
- complete instance converters & tests (i.e. _.is.array(obj) _.to.array(obj))
- bower & node packages
- customizable settings object

If you think there is anything missing or broken let me know!
