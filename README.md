# bottom_line.js
_- Adds face to your code_

Javascript utility belt that takes a middle ground between sugar & underscore/lodash. Striving for consistency, code readability and adding face to your code.

## Installation

    npm install bottom_line
     
    bower install bottom_line

## Syntax & features

The syntax of bottom\_line is close to the 'object-oriented' style of javascript pimped-up with the bottom\_line face .\_.

    ```javascript
    arr._.remove('elm1');
    ```

### Extended Arguments functionality 

All bottom_line object methods are available on arguments.

    ```javascript
    function() {
        arguments._.each(function() {});       
           
        arguments._.indexOf('arg');   
    }       
    ```
### Flexible each functionality

    ```javascript
    arr._.each(function(value, index, arr, delta) { // normal call
        // do stuff
    }); 

    arr._.each(2, function(value, index, arr, delta) { // add a custom step
        // do stuff    
    }); 
    
    arr._.each(function(value, index, arr, delta) {
        // do stuff
        return i < 10; // break functionality by return false
    });  
    
    // add/remove elements from the array during iteration. delta = the difference in length
    arr._.each(function(value, index, arr, delta) {  
        if(index === 4) arr._.del(index)
    });  
    ```
    
### Negated methods

For readability every method can be negated by prefixing not.

    ```javascript
    arr._.has('elm1'); // normal call
    
    arr._.not.has('elm1'); // negated form
    ```
        
### String functions

Bottom_line comes with handy string operators such as:

    ```javascript
    'bottom:line'._.before(':');

    'bottom:line'._.after(':');
    
    ':bottom_line>'._.between(':', '>');    
    ```        
        
### Mutators over new objects

By default a method will mutate the object itself. A Pascal case variant is used to create a object while the original object is untouched.

    ```javascript   
    arr._.remove('elm1'); // mutates arr  
          
    arr._.Remove('elm1'); // creates a new array leaving the original untouched          
    ```

### Variable arguments & functional flavors

Most methods come in two flavours. One that accepts multiple parameters, the other using a callback & optional context as input. The callback variant is suffixed with Fn.

    ```javascript
    arr._.remove('elm1', 'elm2', ...); // removes the first occurrence for each parameter
    
    arr._.removeFn(function(elm) {return elm === 'elm1'}); // removes an element matched by the function
    ```

### Applying to 'all'

A method can be extended to apply to 'all' elements by suffixing $.

    ```javascript
    arr._.remove$('elm1', 'elm2'); // removes all arguments including duplicates
    
    arr._.remove$Fn(function(elm) {return elm === 'elm1'}); // removes all elements matched by the function
    ```

### Extensive extend method

    ```javascript
    // see the documentation :-) NOTE that not everything is documented yet    
    ```

## Future work

Check out my TODO.md list.
If you think there is anything missing or broken let me know!
