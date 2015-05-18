# bottom_line.js
_- Adds face to your code_

Javascript utility belt that takes a middle ground between sugar & underscore/lodash striving for consistency, code readability and adding face to your code

## Installation

    npm install bottom_line
     
    bower install bottom_line

## Syntax & features

The syntax of bottom\_line is close to the 'object-oriented' style of javascript prefixed with the bottom\_line face .\_.

    ```javascript
    arr._.remove('elm1');
    ```

### Mutators over new objects

By default a method will mutate the object itself. A Pascal case variant is used to create a object while the original object is untouched.

    ```javascript
    arr._.remove('elm1'); // mutates arr  
          
    arr._.Remove('elm1'); // creates a new array leaving the original version untouched          
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

### String functions

Bottom_line comes with handy string operators such as

    ```javascript
    // normal call
    ''._.after();
    
    // negated form
    arr._.before('elm1');
    ```
### flexible each functionality



### Extensive extend method


### all object methods are available on arguments


## Future work

Still lots of stuff I want to improve such as

- better test coverage
- customizable settings object
- silent logging

If you think there is anything missing or broken let me know!
