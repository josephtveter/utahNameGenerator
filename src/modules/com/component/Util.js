/**
 * String extension methods.
 */
if (typeof String.prototype.startsWith != 'function')
{
    String.prototype.startsWith = function (str)
    {
        return this.slice(0, str.length) == str;
    };
}

if (!String.prototype.trim)
{
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
    //String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}


var _curDomId = 0;

/**
 * General purpose utilities and static store of app-specific data
 * such as localized strings loaded from the server.F
 *
 * @class com.shout.html5.app.Util
 */
var Util = {};

/**
 * Holds the timezone offsets and how they should appear to people (MST, MDT, EST, etc.).
 * The key is either the number of minutes (-480) or the hours and minutes without the
 * colon (800).
 *
 * @constant
 * @private
 * @type Object
 * @static
 */
Util.TIME_ZONES = {};

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-480] = "PST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-800] = "PST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-420] = "MST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-700] = "MST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-360] = "MDT";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-600] = "MDT";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-360] = "EST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-500] = "EST";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-240] = "EDT";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES[-400] = "EDT";

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES.EST = 300 * 60000; // Gives us the time in milliseconds

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.TIME_ZONES.EDT = 240 * 60000; // Gives us the time in milliseconds

/**
 * @constant
 * @private
 * @type String
 * @static
 */
Util.dateRfc2445RegEx = /(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z/;


/**
 * Used to store app state.
 * @type {Object}
 * @private
 */
var appState = {};

/**
 * @type {Object}
 * @private
 * Initialized in the init method, holds localized strings object.
 */
var _localizedStrings = null;

/**
 * @type {Object}
 * @public
 * Initialized in the init method, holds server response latencey and time object.
 */
Util.serverTime = {};
Util.serverTime.latMean = 6000;

/**
 * @property {String} The base module "path" to the controllers. Won't be set until after Util is initialized.
 */
Util.controllerModuleBase = null;

/**
 * @property {String} The base module "path" to the templates. Won't be set until after Util is initialized.
 */
Util.templateModuleBase = null;

/**
 * @property {String} The base module "path" to the css. Won't be set until after Util is initialized.
 */
Util.cssModuleBase = null;

/**
 * @property {Object} The app properties object loaded from the server.
 */
Util.appProperties = require("json!appproperties");
if(Util.appProperties instanceof Deferred)
{
    Util.appProperties.done(function(result)
    {
        Util.appProperties = result;
    });
}

/**
 * @property {Object} The current apps theme.
 */
Util.currentTheme = null;

/**
 * @property {Object} The current apps theme name.
 */
Util.themeName = null;

/**
 * @property {Object} The serverType loaded from the server.
 */
Util.serverType = null;


Util.facebookAuth = {};
Util.FACEBOOK_APPID = null;

/**
 * Get a value from the app property file loaded from the server.
 *
 * @param {Object} key The key to retrieve the value by.
 * @return {Object} Null if not found, string otherwise.
 * @static
 */
Util.getAppProperty = function(key)
{
    var result = null;
    var obj = Util.appProperties, arr = key ? key.split(".") : [];
    var i, count = arr.length;
    var parentObj = null;

    for (i = 0; i < count; i++)
    {
        parentObj = obj;
        obj = obj[arr[i]];

        if (!obj)
            break;

        if ((i + 1) === count)
            result = obj;
    }

    if (result && result.PRODUCTION)
    {
        result = result[Util.serverType];
        parentObj[arr[count - 1]] = result;
    }

    return result;
};

/**
 * Get a value from the app state memory space.
 * @param {Object} key The key to retrieve the value by.
 * @return {Object} The corresponding value for the key.
 * @static
 */
Util.getFromAppState = function(key)
{
    return appState[key];
};

/**
 * Adds a value to the app state memory space.
 * @param {Object} key The key to save it with.
 * @param {Object} value The value to associate with the key.
 * @static
 */
Util.addToAppState = function(key, value)
{
    appState[key] = value;
};

/**
 * Deletes a value to the app state memory space.
 * @param {Object} key The key to delete the value of.
 * @static
 */
Util.deleteFromAppState = function(key)
{
    delete appState[key];
};

/**
 * Returns the string passed in with any {} found in the string
 * replaced with additional arguments passed in.  So, 
 * Util.str("what is {} value", "the");
 * returns 
 * what is the value
 * 
 * @param {String} msg The string to check for optional {} replacements.
 * @returns {String} The resulting string.
 */
Util.format = function(msg)
{
    var result = null;
    var numArgs = arguments.length - 1;
    var iterCount = 0;
    var outerArgs = arguments;

    if (numArgs === 0 )
    {
        result = msg;
    }
    else
    {
        result = msg.replace(/(\{\})/g, function ()
        {
            var result2 = "{}";
            if (iterCount < numArgs)
            {
                var obj = outerArgs[iterCount + 1];
                try
                {
                    result2 = (obj !== undefined && obj !== null && 'object' === typeof(obj)) ? JSON.stringify(obj) : (obj === undefined || obj === null ? "<null>" : obj.toString());
                }
                catch(ex)
                {
                    result = obj;
                }
                iterCount++;
            }
            return result2;
        });
    }
    
    return result;
};

/**
 * Returns a new Dom ID based on the name passed in.
 * If there isn't one, then it uses the name "object",
 *
 * @param {Object} baseName The base name to tack an ID on to make unique.
 * @return {String} The unique string to use in the dom.
 * @static
 */
Util.getUniqueDomId = function(baseName)
{
    return (baseName ? baseName : "object") + (_curDomId++).toString();
};

/**
 * @param {Object} obj The object we want a unique attr for.
 * @param {String} name The name we want to ensure is unique.
 * @return {String} Returns name arg if unique, otherwise appends numbers to name until is unique.
 */
Util.getUniqueAttrNameInObject = function(obj, name)
{
    var result = name;
    var i = 0;
    while (Util.isDefined(obj[result]))
    {
        i++;
        result = name + i;
    }

    return result;
};

/**
 * @param {Mixed} value The value to check.
 * @return {Boolean} Whether the value is defined and not null.
 * @static
 */
Util.isDefined = function(value)
{
    return (typeof value !== "undefined" && value !== null);
};

/**
 * @param {Mixed} value The value to check.
 * @return {Boolean} Whether the value is not defined or is null.
 * @static
 */
Util.isNotDefined = function(value)
{
    return (typeof value === "undefined" || value === null);
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is a boolean.
 * @static
 */
Util.isBoolean = function(obj)
{
    //TODO: does this work instead of toString.call(obj)
    return obj === true || obj === false || Object.prototype.toString.call(obj) == "[object Boolean]";
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is a string.
 * @static
 */
Util.isString = function(obj)
{
    return Util.isDefined(obj) && typeof(obj) === 'string';
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is an array.
 * @static
 */
Util.isArray = function(val)
{
    //TODO: does this work instead of toString.call(obj)
    return Object.prototype.toString.call(val) == "[object Array]";
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is a plain hash object (map).
 * @static
 */
Util.isHashObject = function(obj)
{
    return obj === Object(obj);
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is a function.
 * @static
 */
Util.isFunction = function(obj)
{
    return obj && typeof(obj) === 'function';
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is a javascript Date object.
 * @static
 */
Util.isDate = function(obj)
{
    return obj && Object.prototype.toString.call(obj) == "[object Date]";
};

/**
 * @param {Object} obj The object to check.
 * @return {Boolean} True if obj is true.
 * @static
 */
Util.isTrue = function(obj)
{
    var rtn = false;
    if(obj === 1 || obj === true || obj === "true")
        rtn = true;

    return rtn;
};

Util.isEmptie = function(obj)
{
    var rtn = true;
    for(var val in obj)
    {
        rtn = false;
        break;
    }

    return rtn;
};

/**
 * @param {String} str The string to search within.
 * @param {String} value The value to search for.
 * @return {Boolean} True if found, false otherwise.
 */
Util.stringContains = function(str, value)
{
    var result = false;

    if (Util.isDefined(str) && Util.isDefined(value))
    {
        result = (str.indexOf(value) !== -1);
    }

    return result;
};

/**
 * @param {Any} value The value to look for.
 * @param {Array} arr The arr to search within.
 * @param {String} [objectField] If present, the arr is expected to contain objects whose field named
 *                               objectField will be used to determine if the array contains the value.
 * @return {Boolean} True if value found in array with strict comparison, else otherwise.
 */
Util.arrayContains = function(value, arr, objectField)
{
    var result = false;
    
    arr = Util.unwrapObs(arr);
    
    if (Util.isArray(arr))
    {
        var tmpVal, i, count = arr.length;
        if(objectField && arr[objectField] === value)
        {
            result = true;
        }
        else
        {
            for (i = 0; i < count; i++)
            {
                tmpVal = Util.isFunction(arr[i]) ? arr[i]() : arr[i];
                if (tmpVal === value)
                {
                    result = true;
                    break;
                }
            }
        }
    }

    return result;
};

/**
 * Note that value may not be a function (you can't search for a function).
 * 
 * @param {Any} value The value to look for, cannot be a function.
 * @param {Array} arr The arr to search within.
 * @param {String} [objectField] If present, the arr is expected to contain objects whose field named
 *                               objectField will be used to determine if the array contains the value.
 * @return {Number} The index of the element in the array that matched the value if found; if not found -1.
 */
Util.arrayIndexOf = function(value, arr, objectField, isKoObject)
{
    if(objectField === "correct")
    {
        
    }

    var result = -1;
    
    // arr = isKoObject || Util.isFunction(arr) ? arr() : arr;
    arr = Util.isFunction(arr) ? arr() : arr;
    var tmpVal, i, count =  arr.length;
    for (i = 0; i < count; i++)
    {
        tmpVal = arr[i];
        if (objectField && tmpVal)
        {
            tmpVal = tmpVal[objectField];
            // tmpVal = isKoObject && Util.isFunction(tmpVal) ? tmpVal() : tmpVal; // Unwraps potential observable.
            tmpVal = Util.isFunction(tmpVal) ? tmpVal() : tmpVal; // Unwraps potential observable.
        }

        if (tmpVal === value)
        {
            result = i;
            break;
        }
    }

    return result;
};

/**
 * @param {Any} value The value to look for.
 * @param {Array} arr The arr to search within.
 * @param {String} [objectField] If present, the arr is expected to contain objects whose field named
 *                               objectField will be used to determine if the array contains the value.
 * @param {Boolean} [isKoArray] If true then treats array as possible ko.observableArray and object field values 
 *                              as possible observables.                               
 * @return {Object|null} The object found that matched the value passed in or null if not found.
 */
Util.getArrayObject = function(value, arr, objectField, isKoArray)
{
    var idx, result = null;
    if(objectField === "correct")
    {
        
    }

    // arr = isKoArray && Util.isFunction(arr) ? arr() : arr; // Unwrap possible observable array.
    arr = Util.isFunction(arr) ? arr() : arr; // Unwrap possible observable array.
    idx = Util.arrayIndexOf(value, arr, objectField, isKoArray);

    if (idx !== -1)
        result = arr[idx];

    return result;
};

/**
 * Merge all changes from the source array to the target array.  All objects must be of the same model type
 * in both arrays.
 * 
 * @param {ko.observableArray} source The target array whose objects must have a member named objectField.
 * @param {ko.observableArray|Array} target The source array whose objects must have a member named objectField.
 * @param {Object} modelObjectType The model object that has a "sync" method that knows how to merge a source to a target object.
 * @param {String} objectFieldId The name of the unique ID field of the objects that populate both arrays.
 * @returns Boolean Whether the target array was modified or not.
 */
Util.syncArrays = function(targetObjectsKOA, sourceObjectsKOA, modelObjectType, objectFieldId)
{
    var modified = false;
    var i, sourceCount, targetCount, targetObject, sourceObject;
    var targetIsObservableArray = Util.isFunction(targetObjectsKOA);
    var targetObjects = (targetIsObservableArray ? targetObjectsKOA() : targetObjectsKOA), sourceObjects = (Util.isFunction(sourceObjectsKOA) ? sourceObjectsKOA() : sourceObjectsKOA);
    
    sourceCount = sourceObjects ? sourceObjects.length : 0;
    targetCount = targetObjects ? targetObjects.length : 0;

    if (sourceCount === 0 && targetCount === 0)
    {
        // Nothing to do here, they're the same so don't change any state.
    }
    else if (sourceCount > 0 && targetCount === 0)
    {
        // Copy all the source objects over to the target.
        modified = true;
        for (i = 0; i < sourceCount; i++)
        {
            targetObjects[i] = sourceObjects[i];
        }
    }
    else
    {
        // We need to diff them, first loop through the source events and merge them with the target.
        var foundIds = [];
        for (i = 0; i < sourceCount; i++)
        {
            sourceObject = sourceObjects[i];
            targetObject = Util.getArrayObject( Util.isFunction(sourceObject[objectFieldId]) ? sourceObject[objectFieldId]() : sourceObject[objectFieldId], targetObjects, objectFieldId, true);
            foundIds[foundIds.length] = sourceObject[objectFieldId];
            
            if(i === 15)
            

            if (targetObject)
            {
                modelObjectType.sync(targetObject, sourceObject);
            }
            else
            {
                targetObjects[targetObjects.length] = sourceObject;
                modified = true;
            }
        }
        
        for (i = targetCount - 1; i >= 0; i--)
        {
            targetObject = targetObjects[i];
            if (!Util.arrayContains(Util.isFunction(targetObject[objectFieldId]) ? targetObject[objectFieldId]() : targetObject[objectFieldId], foundIds, objectFieldId))
            {
                // Remove the since no longer in source array.
                modified = true;
                targetObjects.splice(i, 1);
            }
        }
    }
    
    if (modified && targetIsObservableArray)
        targetObjectsKOA.valueHasMutated();
    
    return modified;
};


/**
 * @param {Object} val The value to check.
 * @param {Object} defaultVal A default value to return if val is undefined or null.
 * @return {Object} Returns val if val is not undefined or null otherwise returns defaultVal.
 * @static
 */
Util.get = function(val, defaultVal)
{
    return (Util.isDefined(val) ? val : defaultVal);
};

// /**
//  * @param {Object} val The value to check.
//  * @return {Object} Returns true if the value is true or the string "true", false othewise.
//  * @static
//  */
// Util.getBool = function(val)
// {
//     return (val === true || val === "true");
// };

/**
 * @param {Object} value The value to check.
 * @return {String} Returns a string type of the object including "null" if is null and "array" if is array.
 * @static
 */
Util.typeOf = function(value)
{
    var s = typeof value;

    if (s === 'object')
    {
        if (value)
        {
            if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')) && typeof value.splice === 'function')
            {
                s = 'array';
            }
        }
        else
        {
            s = 'null';
        }
    }

    return s;
};

/**
 * @param {Object} val The value to check.
 * @return {Boolean} Returns true if val is not undefined and not null and if a string then the trimmed string
 *                   has characters and if an array there's at least one element.  Otherwise returns false.
 * @static
 */
Util.isNotEmpty = function(val)
{
    var result = false;
    var UNDEF;

    if (val !== UNDEF && val !== null)
    {
        var type = Util.typeOf(val);
        if (type === "string")
        {
            result = val.trim().length > 0;
        }
        else if (type === "array")
        {
            result = val.length > 0;
        }
        else
        {
            result = true;
        }
    }

    return result;
};

/**
 * @return boolean Returns true if obj is undefined, null, empty string, an empty array or an object 
 *                 with no attributes of its own.
 */
Util.isEmptyObj = function(obj)
{
    var result = Util.isEmpty(obj);
    
    if (!result && !Util.isArray(obj))
    {
        for (var key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                result = true;
                break;
            }
        }
    }
        
    return result;
};

/**
 * @param {Object} val The value to check.
 * @return {Boolean} Returns true if val is undefined or null or if a string then the trimmed string
 *                   has no characters or if an array there are no elements.  Otherwise returns false.
 * @static
 */
Util.isEmpty = function(val)
{
    return !Util.isNotEmpty(val);
};

/**
 * Mixin function uses to do comparison check for empty object.
 * @type {Object}
 * @private
 * @constant
 */
var EMPTY_OBJ = {};

/**
 * Copies attrs from source to target, replacing any that already exist in target.
 *
 * @param {Object} target The target object to which all source properties will be copied.
 * @param {Object} source The source object from which all properties will be copied.
 * @private
 */
function mixinHelper(target, source)
{
    var name, s;

    for (name in source)
    {
        if (name)
        {
            s = source[name];
            if (!(name in target) || (target[name] !== s && (!(name in EMPTY_OBJ) || EMPTY_OBJ[name] !== s)))
            {
                target[name] = s;
            }
        }
    }

    return target;
}

/**
 * This is the preferred approach for getting an object-oriented-like approach
 * with the absolute minimum performance and memory penalty.
 *
 * All "members" of the objects arguments starting from the second one will be
 * copied onto the first object, overriding any that were there before that had
 * the same name.  By member, of course, we mean property which can point to
 * variables and functions alike.
 *
 * @param {Object} source The source object to copy subsequent properties onto.
 * @param {Object...} target One or more Object arguments to copy properties from.
 * @returns {Object} The new object with the mixed properties.
 * @static
 */
Util.mixin = function(source) /* source, target args */
{
    if (!source)
    {
        source = {};
    }

    for ( var i = 1, l = arguments.length; i < l; i++)
    {
        mixinHelper(source, arguments[i]);
    }

    return source;
};

//TODO: I removed date stuff, use Moment instead

/*
 * Get a string or group of strings from the current langauge file.
 *
 * @method
 * @param {String} key The key to the desired string.
 * @return {String|Object} Null if not found, string or object otherwise.
 * @static
 */
Util.L = function(key)
{
    var message = null;
    var obj = _localizedStrings, arr = key ? key.split(".") : [];
    var i, count = arr.length;

    for (i = 0; i < count; i++)
    {
        obj = obj[arr[i]];

        if (!obj)
            break;

        if ((i + 1) === count)
            message = obj;
    }
    return message;
};

/**
 * Gets around compiler warnings around not asssuming base 10.
 * @param {Mixed} val The value to turn into an integer.
 * @return {Integer} The parsed int value.
 * @static
 */
Util.parseInt = function(val)
{
    return parseInt(val, 10);
};

/**
 * Gets around compiler warnings around not asssuming base 10.
 * @param {Mixed} val The value to turn into an float.
 * @return {Float} The parsed int value.
 * @static
 */
Util.parseFloat = function(val)
{
    return parseFloat(val, 10);
};

Util.printStackTrace = function()
{
    if (console && console.trace)
        console.trace();
};

Util.lastInfoTime = null;
Util.lastTime = null;

Util.hexToRgbaCssString = function(hex, alpha)
{
    alpha = alpha ? alpha : 0;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
           "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + "," + alpha + ")"
           : "";
};

/**
 * @param {Object} val The value to check.
 * @return {Object} Returns true if the value is true or the string "true", false othewise.
 * @static
 */
Util.getBool = function(val)
{
    return (val === true || val === "true");
};

/**
 * @return {Boolean} True if the data passed in is the same day as today (year, month, day).
 */
Util.isToday = function(date)
{
    var now = new Date();
    return date && date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

/**
 * @param {String} text The text to convert.
 * @return {String} The new text with line feeds converted to HTML breaks.
 */
Util.turnLineFeedsIntoHtmlBreaks = function(text)
{
    return text ? text.replace(/(\r\n|\n|\r)/g,"<br />") : text;
};

Util.getUuid = function ()
{
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

var dateRegEx = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.\d\d\d)?([+-\/])(\d\d):?(\d\d)/;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Util.getUTCiso8601Date = function(jsDate)
{
    if(!jsDate)
    {
        jsDate = new Date();
    }
    else if(typeof(jsDate) === "string")
    {
        jsDate = new Date(jsDate);
    }
    
    var year = jsDate.getUTCFullYear();
    var month = parseInt(jsDate.getUTCMonth(),10)+1;
    if(month < 10)
    {
        month = "0"+month.toString();
    }
    var day = jsDate.getUTCDate();
    if(day < 10)
    {
        day = "0"+day.toString();
    }
    var hours = jsDate.getUTCHours();
    if(hours < 10)
    {
        hours = "0"+hours.toString();
    }
    var mins = jsDate.getUTCMinutes();
    if(mins < 10)
    {
        mins = "0"+mins.toString();
    }
    var secs = jsDate.getUTCSeconds();
    if(secs < 10)
    {
        secs = "0"+secs.toString();
    }
    return year+"-"+month+"-"+day+"T"+hours+":"+mins+":"+secs;
    
};
Util.getJSDateFromYYYYMMDDinTimeZone = function(YYMMDD)
{
    if(YYMMDD)
    {
        var rawDate = new Date(YYMMDD);
        var timeZoneOffsetMinutes = new Date().getTimezoneOffset();
        var dst = rawDate.dst() === false ? 60000 * 60 : 0;
        var newDateObj = new Date(rawDate.getTime() + timeZoneOffsetMinutes*60000 + dst);

        return newDateObj;
    }
    else
    {
        return new Date();
    }
};
Util.getYYYYMMDDfromJSdate = function(jsDate)
{
    if(!jsDate)
    {
        jsDate = new Date();
    }
    
    var year = jsDate.getUTCFullYear();
    // year = year.toString().substr(2,2);

    var month = parseInt(jsDate.getUTCMonth(),10)+1;
    if(month < 10)
    {
        month = "0"+month.toString();
    }
    var day = jsDate.getUTCDate();
    if(day < 10)
    {
        day = "0"+day.toString();
    }
    return year+"-"+month+"-"+day;
};
Util.getJsDateFromIsoDateInCurrentTimeZone = function(iso8601Date)
{
    if (!iso8601Date || !iso8601Date.match) 
    {
        return new Date();
    }
    var newDate, year, month, day, hours, mins, secs;
    var dt = iso8601Date.match(dateRegEx);
    if(dt)
    {
        year = dt[1];
        month = dt[2];
        day = dt[3];
        hours = parseInt(dt[4], 10);
        mins = dt[5];
        secs = dt[6];
    }
    else
    {
        debugger;
    }
    
    
    
    var UTC = Date.UTC(year, parseInt(month, 10) - 1, day, hours, mins, secs);
    newDate = new Date(UTC);
    
    return newDate;
};

/**
 * Turn an iso 8601 date in GMT/UTC time into a JS date object in eastern time.
 * So, turn the iso date into current time zone and then take the difference between
 * the current timezone and eastern time. So, ignore the timezone defined in the
 * js date, the time is not showing time as it will be in the eastern time zone.
 *
 *    2011-11-16T00:00:00+00:00  Fri Nov 16 9:00P EST
 * OR 2011-11-16T00:00:00.000+00:00
 * OR 2011-11-16T00:00:00.000+0000
 *
 * NOTE!!!! This completely assumes the iso8601Date is
 *          in UTC.
 * @param {String} iso8601Date The date to convert.
 * @return {Date} The javascript date object.
 * @static
 */
Util.getJsDateFromIsoDateEasternTime = function(iso8601Date)
{
    if (!iso8601Date || !iso8601Date.match) 
    {
        debugger;
        return new Date();
    }
    var dt = iso8601Date.match(dateRegEx);
    var year = dt[1];
    var month = dt[2];
    var day = dt[3];
    var hours = Util.parseInt(dt[4]);
    var mins = dt[5];

    var dateObj = new Date(Date.UTC(year, Util.parseInt(month) - 1, day, hours, mins));
    var easternTimeOffset = Util.isDaylightSavingsInEffect(dateObj) ? Util.TIME_ZONES.EDT : Util.TIME_ZONES.EST;

    return new Date(dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000) - easternTimeOffset);
};

Util.getJsDateFromIsoDate = function(iso8601Date)
{
    if(iso8601Date.getMonth)
    {
        return iso8601Date;
    }
    else if (!iso8601Date || !iso8601Date.match) 
    {
        return new Date();
    }
    var year, month, day, hours, mins, secs;

    var dt = iso8601Date.match(dateRegEx);

    if(dt && dt !== null)
    {
        year = dt[1];
        month = dt[2];
        day = dt[3];
        hours = parseInt(dt[4], 10);
        mins = dt[5];
        secs = dt[6];
    }
    else
    {
        var cutTime = iso8601Date.split("T");
        var dateArr = cutTime[0].split("-");
        var timeArr = cutTime[1].split(":");
        year = dateArr[0];
        month = dateArr[1];
        day = dateArr[2];
        hours = parseInt(timeArr[0], 10);
        mins = parseInt(timeArr[1], 10);
        secs = parseInt(timeArr[1], 10);
        secs = parseFloat(timeArr[2].replace("Z", ""), 10);
    }


    var dateObj = new Date(Date.UTC(year, Util.parseInt(month) - 1, day, hours, mins, secs));
    return new Date(dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000));
};
Util.IMAGE_TYPE_TEAM = "team";
Util.IMAGE_TYPE_TEAM_TEXT_LOGO = "teamTextLogo";

Util.getImageUrl = function(image, type)
{
    var imageHomeUrl = Util.getAppProperty("URL.IMAGE_HOME_URL");
    var teamImageBaseUri = Util.getAppProperty("URL.TEAM_IMAGE_BASE_URI");
    var teamTextLogoImageBaseUri = Util.getAppProperty("URL.TEAM_TEXT_LOGO_IMAGE_BASE_URI");
    var result = image;
    if (image)
    {
        image = image.trim();
        if (!image.startsWith("http://") && !image.startsWith("https://"))
        {
            if (type === Util.IMAGE_TYPE_TEAM)
                result = imageHomeUrl + teamImageBaseUri + image;
            else if (type === Util.IMAGE_TYPE_TEAM_TEXT_LOGO)
                result = imageHomeUrl + teamTextLogoImageBaseUri + image;
        }
    }
    return result;
};

Util.getJsDateForRfc2445 = function(isoDate)
{
    var result = null;

    if (isoDate)
    {
        var dt = isoDate.match(Util.dateRfc2445RegEx);
        if (dt && dt.length >= 7)
        {
            var year = dt[1];
            var month = Util.parseInt(dt[2]) - 1;
            var day = dt[3];
            var hours = dt[4];
            var mins = dt[5];
            var secs = dt[6];

            result =  new Date(Date.UTC(year, month, day, hours, mins, secs));
        }
    }

    return result;
};

/**
 * Turn a javascript date object into an iso date string:
 *
 * 2010-12-16T20:30:00-07:00
 *
 * Note, that this only accept US timezones.
 *
 * @param {String} jsDate The date to convert.
 * @param {Boolean} zeroTime If true sets time to zero and timezone to 0.
 * @return {String} String iso date.
 * @static
 */
Util.getIsoDateFromJsDate = function(jsDate, zeroTime)
{
    var arr, result = null;
    if(typeof jsDate === "string")
    {        
        var testDate = jsDate.match(Util.dateRegEx);
        if(testDate)
            jsDate = new Date(testDate[1], testDate[2]-1, testDate[3], testDate[4], testDate[5], testDate[6]);
        else if(jsDate.match(Util.dateRfc2445RegEx))
            jsDate = Util.getJsDateForRfc2445(jsDate);
        else 
        {
            try 
            {
                jsDate = new Date(jsDate);
            }
            catch (e)
            {
                log.warn("Util.getIsoDateFromJsDate: "+jsDate);
                jsDate = new Date();
            }
        }

    }
    if (jsDate)
    {
        if (zeroTime === true)
        {
            Util.zeroOutTimeForDate(jsDate);
        }

        arr = [];
        arr.push(jsDate.getFullYear());
        arr.push("-");
        arr.push(Util.padToTwoChars((jsDate.getMonth() + 1)));
        arr.push("-");
        arr.push(Util.padToTwoChars(jsDate.getDate()));
        arr.push("T");
        arr.push(Util.padToTwoChars(jsDate.getHours()));
        arr.push(":");
        arr.push(Util.padToTwoChars(jsDate.getMinutes()));
        arr.push(":");
        arr.push(Util.padToTwoChars(jsDate.getSeconds()));


        var tzOffset = zeroTime === true ? 0 : jsDate.getTimezoneOffset() * -1;
        if (tzOffset < 0)
        {
            // Account for negative number and then get rid of the negative sign.
            arr.push("-");
            tzOffset = tzOffset * -1;
        }
        else
        {
            arr.push("+");
        }

        var h = Util.parseInt(tzOffset / 60);
        var m = tzOffset % 60;

        arr.push(Util.padToTwoChars(h));
        arr.push(":");
        arr.push(Util.padToTwoChars(m));

        result = arr.join("");
    }

    return result;
};

Util.padToTwoChars = function(val)
{
    val = val + "";
    return val.length === 1 ? ("0" + val) : val;
};

var diffTime = function(date1, date2, increment)
{
    var time = {};
    time.sec = 1000;
    time.min = time.sec * 60;
    time.hour = time.min * 60;
    time.day = time.hour * 24;
    time.month = time.day * 30;
    time.year = time.day * 265.4;
    return Math.round((date1.getTime() - date2.getTime()) / time[increment]);
};
Util.getShortDateWithTodaySupport = function(jsDate, getString)
{
    var result = null;
    try 
    {
        var nowMoment = new Date();
        var dateMoment = jsDate;
        var daysDiff = diffTime(dateMoment, nowMoment, 'day');
        if(getString)
        {
            if (daysDiff === 0 || daysDiff === 1)
            {
                result = getString("app.today")();
            }
            else if (daysDiff === 2)
            {
                result = getString("app.tomorrow")();
            }
            else if (daysDiff === -1)
            {
                result = getString("app.yesterday")();
            }
            else
            {
                var MMM = months[dateMoment.getMonth()].toLowerCase();
                var month = getString('util.monthsOfYear.'+MMM+'Short')();
                result = month + " " +dateMoment.getDate();
            }
        }
            
    }
    catch(e)
    {
        log.warn("Util.getShortDateWithTodaySupport error: "+e.message);
    }
        
    
    return result;
};

if ( typeof exports !== "undefined" ) {
    module.exports = Util;
}
else if ( typeof define === "function" ) {
    define( "com.component.Util", Util);
}
else {
    window.Util = Util;
}
//# sourceURL=/modules/com/component/Util.js
