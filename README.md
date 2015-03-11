# bottom_line.js

Javascript utility belt that takes a middle ground between sugar & underscore/lodash striving for for consistency & code readability.


## Syntax

The syntax of bottom_line tries to be as consistent with the 'object-oriented' nature of javasscript while extending native objects in the safest way possible.
It does so much in the way the window/root object is extended by many libraries by using an encapsulating namespace. For example:

```
array._.remove('element');
```



is as consistent as possible with the standard javascript syntax as possible without polluting native objects.
It takes a middle ground between something like sugar & underscore/lodash. It does extend native objects but does so in the way most libraries add a global namespace to the root object.
Adding a namespace object on the native prototype '_' not polluting it in any other way.


