/**
 * Extends an object with function/properties from a module object
 *
 * @public
 * @static
 * @method _.extend
 *
 * @param   {Object}   obj       - object to be extended
 * @param   {Object=} _options_  - optional settings/default descriptor
 *     @param   {boolean=}  _options_.enumerable      - boolean indicating if all properties should be enumerable. can be overwritten on a config level
 *     @param   {boolean=}  _options_.configurable    - boolean indicating if all properties should be configurable. can be overwritten on a config level
 *     @param   {boolean=}  _options_.writable        - boolean indicating if all properties should be writable. can be overwritten on a config level
 *
 *     @param   {boolean=}  _options_.override=true   - boolean indicating if properties should be overridden
 *     @param   {boolean=}  _options_.overwrite=true  - boolean indicating if properties should be overwritten
 *     @param   {boolean=}  _options_.new=true        - boolean indicating if new properties should be added
 *     @param   {boolean=}  _options_.shim            - overwrites and their actions are false
 *
 *     @param   {Array|string=} _options_.exclude     - array of properties that will be excluded
 *
 *     @param   {Function=} _options_.overwriteaction=console.warn - function containing the overwrite action
 *     @param   {Function=} _options_.overrideaction=console.warn  - function containing the override action
 *     @param   {Function=} _options_.newaction=null               - function containing the new action
 *     @param   {Function=} _options_.action                       - default action to apply
 *
 *     @param   {Object=}   _options_.overwritectx=console - context for the overwrite action
 *     @param   {Object=}   _options_.overridectx=console  - context for the override action
 *     @param   {Object=}   _options_.newctx               - context for the new action
 *     @param   {Object=}   _options_.ctx                  - context for the default action
 *
 *     @param   {function=} _options_.modifier            - modifier function to apply on all functions.
 *     @param   {boolean=}  _options_.hasOwnPropertyCheck - check if we should do a has own property check
 *     @param   {boolean=}  _options_.safe                - sets overwrites and overrides both to false
 *
 * @param   {Object}  module       - object containing functions/properties to extend the object with
 *
 * @return {Object}  obj - the extended object
 */
// TODO document attributes
// TODO add deep extend
// TODO to be able to add custom attributes and their functions i.e. inject
function extend(obj, _options_, module) {
    var options = module && _options_ || {};
    var module  = module || _options_;

    processOptions(options);

    for(var prop in module)
    {   if((options.hasOwnPropertyCheck && !module.hasOwnProperty(prop)) || (options.exclude && ~options.exclude.indexOf(prop))) {continue}

        var descriptor = getDescriptor(module, prop);

        copyPropertyConfigs(options, descriptor);

        handleAttributes(descriptor);
        finalizeDescriptor(descriptor);

        getNames(prop, descriptor).forEach(function(prop) {
            var actionType = obj.hasOwnProperty(prop) ? 'overwrite' :
                             prop in obj              ? 'override'  :
                                                        'new';

            action(actionType, prop, descriptor);
            action('', prop, descriptor); // default action

            if(!descriptor[actionType]) {return} // continue

            Object.defineProperty(obj, prop, descriptor)
        });
    }

    return obj;
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
    var action  = descriptor[type+'action'];
    var ctx     = descriptor[type+'ctx'];
    var enabled = descriptor[type];

    if(!action) return; // no action required so return

    message = enabled
        ? type +' on property: '+prop+'.'
        : 'redundant '+type+' defined in module for property '+prop+'. '+type+'s are set to false in settings/config';

    action.call(ctx, message, prop, descriptor)
}
/**
 * processes the options, setting defaults etc.
 *
 * @param options
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
    options.overwriteaction     = options.hasOwnProperty('overwriteaction')
        ? options.overwriteaction
        : console.warn;
    options.overrideaction      = options.hasOwnProperty('overrideaction')
        ? options.overrideaction
        : console.warn;
    options.overwritectx        = options.overwritectx    || console;
    options.overridectx         = options.overridectx     || console;

    if(options.shim) {
        options.overwrite       = false;
        options.overwriteaction = null;
    }

    if(typeof(options.exclude) === 'string')
    {
        options.exclude = options.exclude.split(' ');
    }
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
 * @param {Object} descriptor - the property descriptor
 */
function finalizeDescriptor(descriptor) {
    if(descriptor.clone)                        {if(descriptor.hasOwnProperty('value') && typeof(descriptor.value) !== 'function') {descriptor.value = clone(descriptor.value)}}
    if(descriptor.constant)                     {descriptor.configurable = false; descriptor.writable = false}
    if(descriptor.modifier
    && typeof(descriptor.value) === 'function') {descriptor.value        = descriptor.modifier(descriptor.value)}

    // getters & setters don't have a writable option
    if(descriptor.get || descriptor.set) {delete descriptor.writable}
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
    if(propertyConfig && propertyConfig.hasOwnProperty('value'))
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
                  Array.isArray(aliases) ? clone(aliases) :    // TODO check why we need to clone here
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