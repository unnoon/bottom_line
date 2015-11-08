/**
 * Extends an object with function/properties from a module object
 *
 * @public
 * @static
 * @method _.extend
 *
 * @param   {Object}   obj       - object to be extended
 * @param   {Object=} _options_  - optional settings/default descriptor
 *     @param   {boolean=}  _options_.mode='mixed'    - mode of extend either 'values'|'descriptors'|'mixed'. Determines if the module contains only values, descriptors or can contain both
 *
 *     @param   {boolean=}  _options_.enumerable      - boolean indicating if all properties should be enumerable. can be overwritten on a config level
 *     @param   {boolean=}  _options_.configurable    - boolean indicating if all properties should be configurable. can be overwritten on a config level
 *     @param   {boolean=}  _options_.writable        - boolean indicating if all properties should be writable. can be overwritten on a config level
 *
 *     @param   {boolean=}  _options_.override=true   - boolean indicating if properties should be overridden
 *     @param   {boolean=}  _options_.overwrite=true  - boolean indicating if properties should be overwritten
 *     @param   {boolean=}  _options_.new=true        - boolean indicating if new properties should be added
 *     @param   {boolean=}  _options_.shim            - overwrites and their actions are false
 *     @param   {boolean=}  _options_.hasOwnPropertyCheck - check if we should do a has own property check
 *     @param   {boolean=}  _options_.safe                - sets overwrites and overrides both to false
 *     @param   {boolean=}  _options_.nonenumerables=false           - includes non-enumerable properties
 *
 *     @param   {Array|string=} _options_.exclude     - array of properties that will be excluded
 *
 *     @param   {Function=} _options_.onoverwrite=console.warn - function containing the overwrite action
 *     @param   {Function=} _options_.onoverride=console.warn  - function containing the override action
 *     @param   {Function=} _options_.onnew=null               - function containing the new action
 *     @param   {Function=} _options_.action                   - action to apply on all properties
 *
 *     @param   {Object=}   _options_.onoverwritectx=console - context for the overwrite action
 *     @param   {Object=}   _options_.onoverridectx=console  - context for the override action
 *     @param   {Object=}   _options_.onnewctx               - context for the new action
 *     @param   {Object=}   _options_.actionctx            - context for the default action
 *
 * @param   {Object}  module       - object containing functions/properties to extend the object with
 *
 * @return {Object}  obj - the extended object
 */
// FIXME add mode for descriptor, values or mixed
// TODO maybe add treat as value option instead of isDescriptor
// TODO document attributes
// TODO add deep extend
// TODO to be able to add custom attributes and their functions i.e. inject
function extend(obj, _options_, module) {
    var options    = processOptions(module && _options_ || {});
    var module     = module || _options_;
    var protoChain = collectPrototypeChain(module, obj, options);

    if(options.overwrite) {protoChain.reverse()} // otherwise lower chain properties would be overwritten by higher ones

    protoChain.forEach(function(proto) {
        var properties = options.nonenumerables
            ? Object.getOwnPropertyNames(proto)
            : Object.keys(proto);

        processProperties(properties, options, proto, obj);
    });

    return obj;
}

function collectPrototypeChain(module, obj, options) {
    var protoChain = [];
    var proto      = module;

    do {
        protoChain.push(proto);

        proto = Object.getPrototypeOf(proto);
    } while(!proto.isPrototypeOf(obj) && !options.hasOwnPropertyCheck);

    return protoChain
}

function processProperties(properties, options, module, obj) {
    properties.forEach(function(prop) {
        if(options.exclude && ~options.exclude.indexOf(prop)) {return} // continue

        var descriptor = getDescriptor(module, prop);
        var actionType = obj.hasOwnProperty(prop) ? 'overwrite' :
                         prop in obj              ? 'override'  :
                                                    'new';

        copyPropertyConfigs(options, descriptor);

        handleAttributes(descriptor);
        finalizeDescriptor(prop, descriptor, actionType);

        if(!descriptor[actionType]) {return} // continue

        getNames(prop, descriptor).forEach(function(prop, i) {
            Object.defineProperty(obj, prop, descriptor)
        });
    });
}

/**
 * Performs action based on type, enabled & value.
 *
 * @param {string}  type='override'|'overwrite' - type the action is acting to
 * @param {Object}  descriptor                  - the property descriptor. this also contains the global options
 * @param {string}  prop                        - name of the property
 */
function action(type, prop, descriptor) {
    var message;
    var action  = descriptor[(type? 'on' + type : 'action')];
    var ctx     = descriptor[(type? 'on' + type : 'action')+'ctx'];
    var enabled = descriptor[type];

    if(!action) return; // no action required so return

    message = enabled
        ? (type +' on property: '+prop+'.')
        : ('redundant '+type+' defined for property '+prop+'. '+type+'s are set to false in options/descriptor.');

    action.call(ctx, message, prop, descriptor)
}
/**
 * processes the options, setting defaults etc.
 *
 * @param options
 *
 * @return options
 */
function processOptions(options) {
    options.new                 = options.new !== false; // default is true
    options.override            = options.safe
        ? false
        : options.override            !== false; // default is true
    options.overwrite           = options.safe
        ? false
        : options.overwrite           !== false; // default is true
    options.hasOwnPropertyCheck = options.hasOwnPropertyCheck !== false; // default is true
    options.onoverwrite     = options.hasOwnProperty('onoverwrite')
        ? options.onoverwrite
        : console.warn;
    options.onoverride      = options.hasOwnProperty('onoverride')
        ? options.onoverride
        : console.warn;
    options.onoverwritectx        = options.onoverwritectx    || console;
    options.onoverridectx         = options.onoverridectx     || console;

    if(options.shim) {
        options.overwrite       = false;
        options.onoverwrite = null;
    }

    if(typeof(options.exclude) === 'string')
    {
        options.exclude = options.exclude.split(' ');
    }

    return options
}
/**
 * Processes the attributes and sets the correct value on the descriptor
 *
 * @param {Object} descriptor - the property descriptor
 */
function handleAttributes(descriptor) {
    if(!descriptor.value || !descriptor.value.hasOwnProperty('attrs')) {return}
    // TODO add attribute check
    var attrs      = descriptor.value.attrs.split(' '); // TODO make corrections for multiple space and add support for comma's
    var attr;
    var negated;

    for(var i = 0; i < attrs.length; i++)
    {
        attr    =  attrs[i];
        negated = !attr.indexOf('!');

        descriptor[!negated ? attr : attr.slice(1)] = !negated;
    }
}

/**
 * Will act on the actual descriptor to change some properties to final
 *
 * @param {string} prop       - name of the property
 * @param {Object} descriptor - the property descriptor
 * @param {string} actionType - the action type 'override'|'overwrite'|'new'|''
 */
function finalizeDescriptor(prop, descriptor, actionType) {
    if(descriptor.clone)                        {if(descriptor.hasOwnProperty('value') && typeof(descriptor.value) !== 'function') {descriptor.value = clone(descriptor.value)}}
    if(descriptor.constant)                     {descriptor.configurable = false; descriptor.writable = false}

    // getters & setters don't have a writable option
    if(descriptor.get || descriptor.set) {delete descriptor.writable}
    // perform actions
    action(actionType, prop, descriptor);
    action('', prop, descriptor); // default action
}
/**
 * Copies the main & property specific options to the property descriptor
 *
 * @param {Object} options    - the global options object
 * @param {Object} descriptor - the property descriptor
 */
function copyPropertyConfigs(options, descriptor) {

    // copy global options
    for(var opt in options)
    {   if(!options.hasOwnProperty(opt)) {continue}

        descriptor[opt] = options[opt];
    }

    var propertyConfig = descriptor.value;
    // copy property specific options (if any).
    // Maybe this needs to be a bit more specific
    if(options.mode !== 'values' && propertyConfig && (options.mode === 'descriptors' || isDescriptor(descriptor.value)))
    {
        for(var cfg in propertyConfig)
        {   if(!propertyConfig.hasOwnProperty(cfg)) {continue}

            descriptor[cfg] = propertyConfig[cfg];
        }
    }
}
/**
 * Generates an array of names including aliases
 *
 * @param {string} prop       - the property name
 * @param {Object} descriptor - the property descriptor
 *
 * @return {Array} names
 */
function getNames(prop, descriptor) {
    var aliases = descriptor.aliases;
    var names   = !aliases               ? [] :
                  Array.isArray(aliases) ? aliases :
                                           aliases.split(' '); // TODO better splitting including corrections;

    names.unshift(prop);
    return names
}
/**
 * Gets the descriptor of a property in prototype chain
 *
 * @param {Object} obj  - the object in the prototype chain
 * @param {string} prop - the name of the property
 *
 * @returns {Object} - the property descriptor
 */
function getDescriptor(obj, prop) {
    var proto = obj;

    do
    {
        if (proto.hasOwnProperty(prop)) {break}
    } while (proto = Object.getPrototypeOf(proto));

    return Object.getOwnPropertyDescriptor(proto, prop)
}
/**
 * Checks if a property value is actually a descriptor.
 *
 * @param {any} value - the value to check
 *
 * @returns {boolean} - boolean indicating if the value is a descriptor
 */
function isDescriptor(value)
{
    return value.nondescriptor !== true &&
           ((value.hasOwnProperty('value') && !value.hasOwnProperty('get') && !value.hasOwnProperty('set')) ||
           ((value.hasOwnProperty('get') || value.hasOwnProperty('set'))   && !value.hasOwnProperty('value')))
}