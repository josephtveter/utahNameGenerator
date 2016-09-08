/* Start docReady */
(function(funcName, baseObj) {
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    function ready() {
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }
    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    baseObj[funcName] = function(callback, context) {
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            readyList.push({fn: callback, ctx: context});
        }
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };
})("docReady", window);

docReady(function() // Start the party
{
	// define("Deferred", Deferred);
	// define("ajax", ajax);
	// define("Ajax", ajax);
	// define("FN_Log", FN_Log);
	var scripts = function() {
        return document.getElementsByTagName('script');
    };
    var dataMain = null;
	//Look for a data-main script attribute, which could also adjust the baseUrl.
        //Figure out baseUrl. Get it from the script tag with require.js in it.
    var scriptsArr = scripts();
    var scriptsLen = scriptsArr.length;
    for(var i=0;i<scriptsLen;i++)
    {
    	dataMain = scriptsArr[i].getAttribute('data-main');
    	if(dataMain)
    	{
    		require(dataMain);
			break;
    	}
    }
});
    /* Start ModRewrite */
    var ModRewrite = function(moduleId)
    {
    	//TODO sort fileRules by priority
    	var path = moduleId;
    	var frLen = ModRewrite.fileRules.length;
		for(var i=0;i<frLen;i++)
		{
			var matches = ModRewrite.fileRules[i];
	        if (typeof matches.id === 'string') {
	          	if(matches.id === path) {
	            	path = matches.callback(path);
	          	}
	        }
	        else if (typeof matches.id === 'object') {
	        	try
	        	{
	        		var match = matches.id.test(path);
	        		if(match)
	        		{
	        			path = matches.callback(path);
	        		}
	        	}
	          	catch(e)
	          	{
	          		// do nothing
	          	}
	        }
		}
		// get extension
		var extensionFound = false;
		if(ModRewrite.extensions.length > 0)
		{
			var extLen = ModRewrite.extensions.length; 
			for(var x=0;x<extLen;x++)
			{
				var check = ModRewrite.extensions[x]+"!";
				if(path.indexOf(check) !== -1)
				{
					path = path.replace(check, "");
					path += "."+ModRewrite.extensions[x];
					extensionFound = true;
					break;
				}
			}
		}

		if(path.indexOf("http") === -1)
		{
			// get baseUrl
	    	if(ModRewrite.baseUrl && ModRewrite.baseUrl.length > 0)
	    	{
	    		if(ModRewrite.baseUrl.indexOf("/") === -1 || (ModRewrite.baseUrl.length > 1 && ModRewrite.baseUrl.indexOf("/") + 1 !== ModRewrite.baseUrl.length))
	    		{
	    			ModRewrite.baseUrl += "/";
	    		}
	    		path = ModRewrite.baseUrl + path;
	    	}

	    	if(ModRewrite.useHost && path.indexOf(ModRewrite.useHost) === -1)
			{
				path = ModRewrite.useHost + path;
			}

		}
		else 
		{
			if(path.substr(path.length -3, 3) === ".js") // TODO put in default extension
			{
				extensionFound = true;
			}
		}

		if(!extensionFound)
		{
			path += ".js"; // TODO put in default extension
		}
		
		
			
			
    	// use GET ? 
    	return path;
    };
	ModRewrite.noExports = {};
    ModRewrite.fileRules = [];
    ModRewrite.extensions = [];
    ModRewrite.exports = {};
    ModRewrite.deps = {};
    ModRewrite.addExtensionRule = function(ext)
    {
    	ModRewrite.extensions.push(ext);
    };
    ModRewrite.addFileRule = function(id, callback)
    {
    	ModRewrite.fileRules.push({id: id, callback: callback});
    };
    ModRewrite.setExports = function(id, exportName)
    {
    	ModRewrite.exports[id] = exportName;
    };
    ModRewrite.setDependency = function(id, dep)
    {
    	// ModRewrite.deps[id] = dep;
    	if(!ModRewrite.deps[id])
    	{
    		ModRewrite.deps[id] = [];
    	}
    	ModRewrite.deps[id].push(dep);
    };

    ModRewrite.baseUrl = "";

    // Node, AMD & window supported
	if ( typeof exports !== "undefined" ) {
		module.exports = ModRewrite;
	}
	else if ( typeof define === "function" ) {
		define( function () {
			return ModRewrite;
		} );
	}
	else {
		window.ModRewrite = ModRewrite;
	}
    /* End ModRewrite */ 	
/* Start Require */

var __modules__ = {};
var __loading__ = {};

window.require = function(moduleIds, callback, errorCallBack, local) // TODO errorCallBack
{
	var deferred = null;
	local = local || false;
	callback = typeof callback === "function" ? callback : null;
	errorCallBack = typeof errorCallBack === "function" ? errorCallBack : null;

	var processMod = function(deferredMod, moduleId, result, module)
	{
		log.info("require processMod: "+moduleId);
		if(!ModRewrite.noExports[moduleId])
		{
			var exports = {};
		}
		else
		{
			// debugger;
		}

		if(moduleId.indexOf("!") !== -1 && typeof result === "string")
		{
			if(moduleId.indexOf("json!") !== -1 || moduleId.indexOf("!json") !== -1)
			{
				try 
				{
					module.exports = JSON.parse(result);
				}
				catch(e)
				{
					console.warn(e.message);
					log.handleCatch(e, "require createModule getExports processMod catch 1: "+moduleId);
					
				}
			}
			else
			{
				module.exports = result;
			}
		}
		else if(result.indexOf("module.exports") !== -1)
		{
			try 
			{
				var evalFn = eval(result);
			}
			catch(e)
			{
				module.exports = result;
				log.handleCatch(e, "require createModule getExports processMod catch 2: "+moduleId);
			}
		}
		else if(ModRewrite.exports[moduleId])// wrapIt
		{
			try 
			{
				var evalFn = eval(result);
				if(window[ModRewrite.exports[moduleId]])
				{
					module.exports = window[ModRewrite.exports[moduleId]];
				}
				else if(this[ModRewrite.exports[moduleId]])
				{
					module.exports = this[ModRewrite.exports[moduleId]];
				}
				else
				{
					module.exports = result;
				}
			}
			catch(e)
			{
				log.handleCatch(e, "require createModule getExports processMod catch 3: "+moduleId);
				module.exports = result;
			}
		}
		else
		{
			try 
			{
				eval(result); // Run the script
			}
			catch(e) 
			{
				log.handleCatch(e, "require createModule getExports processMod catch 4: "+moduleId);
			}
			module.exports = result;
			
		}
		module.loaded = true;
		__modules__[moduleId] = module;
		deferredMod.resolve(module.exports);
		if(callback && typeof callback === "function")
		{
			callback(module.exports);
		}
	};

	var getExports = function(result, deferredMod, module, moduleId)
	{
		if(ModRewrite.deps[moduleId])
		{
			var str = '';
			var len = ModRewrite.deps[moduleId].length;
			for(var i=0;i<len;i++)
			{
				str += 'var '+ModRewrite.deps[moduleId][i]+' = require("'+ModRewrite.deps[moduleId][i]+'");';
			}
			result = str+result;
		}
		
		// If js
		if(ModRewrite.noExports[moduleId])
		{
			processMod(deferredMod, moduleId, result, module);
		}
		else if(result.indexOf("require") !== -1)
		{
			var regexp = /require\(/g;
			var match, matches = [];

			while ((match = regexp.exec(result)) !== null) {
			  matches.push(match.index);
			}
			var dependencies = [];
			var matchLen = matches.length;
			for(var m=0;m<matchLen;m++)
			{
				var end = result.substr(matches[m]).indexOf(")");
				var lib = result.substr(matches[m]+8, end-8);
				if(lib.indexOf("\"") === 0 && lib.substr(lib.length -1) === '"')
				{
					lib = lib.split("\"").join("");
					var load = require(lib);
					if(load instanceof Deferred)
					{
						dependencies.push(load);
					}
				} // Else wait till we are using that module.
				
			}
			if(dependencies && dependencies.length > 0)
			{
				// when
				Deferred.when(dependencies, function()
				{
					processMod(deferredMod, moduleId, result, module);
				}, function()
				{
					debugger;
				});
			}
			else
			{
				processMod(deferredMod, moduleId, result, module);
			}
		}
		else
		{
			processMod(deferredMod, moduleId, result, module);
		}

	};

	var createModule = function(moduleId)
	{
		if(moduleId.indexOf("LogglyTracker") !== -1)
		{
			// debugger;
		}
		var deferredMod = new Deferred();
		__loading__[moduleId] = deferredMod;
		var module = {
		  	exports: {}
		};
		
		module.moduleId = moduleId;
		var path = ModRewrite(moduleId);
		module.path = path;
		module.loaded = false;
		
		// TODO change content Type by extension
		if(path.indexOf("undefined") !== -1)
		{
			debugger;
		}
		ajax({url: path, method:"GET", contentType: "text/plain", dataType: "text"}).done(function(result)
		{
			getExports(result, deferredMod, module, moduleId);
		}).fail(function(errorObj){
			log.warn("require ajax FAILED to load Path: "+path+" - {}",errorObj);
			deferredMod.reject(errorObj);
		});

		return deferredMod;
	};
    //Start the craziness
	if(typeof moduleIds === "string")
	{
		if(__modules__[moduleIds] && __modules__[moduleIds].exports)
		{
			deferred = __modules__[moduleIds].exports;
			if(callback && typeof callback === "function")
			{
				var rtn = {};
				rtn[moduleIds] = deferred
				callback(rtn);
			}
		}
		else if(local)
		{
			deferred = null; // We don't have it yet.
		}
		else if(__loading__[moduleIds])
		{
			deferred = __loading__[moduleIds];
			deferred.done(function(result)
			{
				deferred.resolve(result);
			});
		}
		else
		{
			deferred = new Deferred();
			var create = createModule(moduleIds);
			create.done(function(result)
			{
				deferred.resolve(result);
			});
			create.fail(function(errorObj)
			{
				errorObj.moduleId = moduleIds;
				deferred.reject(errorObj);
			});
		}
	}
	else if(moduleIds instanceof Array)
	{
		deferred = new Deferred();
		var defArr = [];
		var len = moduleIds.length;

		for(var i=0;i<len;i++)
		{
			var lib = moduleIds[i];
			var load = require(lib);
			if(load instanceof Deferred)
			{
				defArr.push(load);
			}
		}
		var defDone = function()
		{
			var resolveArr = {};
			for(var d=0;d<len;d++)
			{
				var mod = require(moduleIds[d]);
				if(!(mod instanceof Deferred) )
				{
					resolveArr[moduleIds[d]] = mod;
				}
				else
				{
					log.warn("FN_CommonJS - Error loading Module: "+moduleIds[d]);
				}
			}
			deferred.resolve(resolveArr);
			if(callback && typeof callback === "function")
			{
				callback(resolveArr);
			}
		};
		if(defArr.length > 0)
		{
			Deferred.when(defArr, function(obj)
			{
				delay(defDone);
			}, deferred.reject);
		}
		else
		{
			defDone();
		}
	}
	else
	{
		debugger;
	}
	return deferred; // Not always a deferred
};
var define = function(id, script, name)
{
	var mod = null;
	if(name && typeof name === "function")
	{
		log.info("define id: "+id);
		if(script && script instanceof Array && script.length > 0)
		{
			debugger;
		}
		else
		{
			if(id === "Math/Long")
			{
				id = "Long";
			}
			__modules__[id] = {exports: name()};
		}
	}
	else if(script && typeof id === "string")
	{
		if(log)
		{
			log.info("define id: "+id);
			if(id.indexOf("LogglyTracker") !== -1)
			{
				// debugger;
			}
		}
		__modules__[id] = {exports: script};
	}
	else if(name && script && typeof script === "function")
	{
		mod = {};
		script(mod, false);
		__modules__[name] = {exports: mod};
	}
	else if(id && script instanceof Array && name)
	{
		
		if(script.length > 0)
		{
			debugger;
		}
		else
		{
			debugger;
			__modules__[id] = {exports: name};
		}
		
	}
	else if(id && typeof id === "function")
	{
		mod = id();
		if(mod.name && typeof mod.name === "string")
		{
			__modules__[mod.name.toLowerCase()] = {exports: mod};
		}
		else
		{
			debugger;
		}
	}
	else
	{
		debugger;
	}
	
};

var requireLocal = function(id)
{
	return __modules__[id] ? __modules__[id].exports : null;
};




/* End Require */

// DEPENDENCIES
/* Changed 1/15/2016

/* End docReady */

var delay = function () {
	if ( typeof setImmediate != "undefined" ) {
		return setImmediate;
	}
	else if ( typeof process != "undefined" ) {
		return process.nextTick;
	}
	else {
		return function ( arg ) {
			if(arg){
				setTimeout( arg, 0 );
			}
		};
	}
}();

/* Start Log */
var FN_Log = function(logLevel)
{
	var self = this;
	var LogglyTracker = null;
	this.initLoggly = function(key, tracker)
	{
		delay(function()
		{
			LogglyTracker = tracker;
			if(tracker)
			{
				LogglyTracker.push({logglyKey: key});
			}
		});
	};
	var format = function(msg)
	{
	    var result = null;
	    var numArgs = arguments.length - 1;
	    var iterCount = 0;
	    var outerArgs = arguments;

	    if (numArgs === 0 )
	    {
	        result = msg;
	    }
	    else if(msg)
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

	this.logLevel = logLevel || 0;
	this.logOnly = null;
	this.EXPORT_LOG = true;
	var LOG_TRACE = 50;
	var LOG_LOG = 40;
	var LOG_INFO = 30;
	var LOG_WARN = 20;
	var LOG_ERROR = 10;
	var LOG_SILENT = 0;

	this.nullLogger = function(){};

	var logDiv = null;
	var checkLogDiv = function(log, type)
	{
		if(!logDiv)
		{
			logDiv = document.getElementById("logDiv");
			// logDiv.style.display = 'block';
		}
		if(logDiv)
		{

			logDiv.innerHTML += '<div class="'+type+'Log">'+log+'</div>';
		}
	};

	this.traceLoggerPlus = function(val)
	{
	    if((!self.logOnly && self.logLevel >= LOG_TRACE) || (self.logOnly && self.logOnly === LOG_TRACE))
	    {
	        console.trace(val);
	        checkLogDiv(val, "trace");
	        if(window.iosLog)
		    {
		    	window.iosLog(val);
		    } 
	    }

	};

	this.logLoggerPlus = function(val)
	{
	    if((!self.logOnly && self.logLevel >= LOG_LOG) || (self.logOnly && self.logOnly === LOG_LOG))
	    {
	        console.log(val);
	        checkLogDiv(val, "log");
	        if(window.iosLog)
		    {
		    	window.iosLog(val);
		    } 
	    }
	};


	this.infoLoggerPlus = function(val)
	{
	    if((!self.logOnly && self.logLevel >= LOG_INFO) || (self.logOnly && self.logOnly === LOG_INFO))
	    {
	        console.info(val);
	        checkLogDiv(val, "info");
	        if(window.iosLog)
		    {
		    	window.iosLog(val);
		    } 
	    }
	};

	this.warnLoggerPlus = function(val)
	{
	    if((!self.logOnly && self.logLevel >= LOG_WARN) || (self.logOnly && self.logOnly === LOG_WARN))
	    {
	        console.warn(val);
	        checkLogDiv(val, "warn");
	       	if(self.EXPORT_LOG && LogglyTracker)
	        {
	            LogglyTracker.push({warn: {log: val, platformInfo: self.platformInfo}});
	        }
	        if(window.iosLog)
		    {
		    	window.iosLog(val);
		    } 
	    }
	};

	this.errorLoggerPlus = function(val)
	{
	    if((!self.logOnly && self.logLevel >= LOG_ERROR) || (self.logOnly && self.logOnly === LOG_ERROR))
	    {
	        console.error(val);
	        checkLogDiv(val, "error");
	       	if(self.EXPORT_LOG && LogglyTracker)
	        {
	            LogglyTracker.push({error: {log: val, platformInfo: self.platformInfo}});
	        }
	        if(window.iosLog)
		    {
		    	window.iosLog(val);
		    } 
	    }  
	};

	window.onerror = function(message, file, line, relLine, errorObj)
	{
		file = file || "";
		var error = {message: message, file: file, line: line, relLine: relLine};
		self.warn("FN_Log onerror: {}", error);
	};
	this.handleCatch = function(e, message)
	{
		e = e || {};
		message = message || "";
		message += " -- ErrorMessage " + e.message;
		if(e.stack)
		{
			message += e.stack.split("\n")[1];
			var str = e.stack.toString();
			var idx = str.lastIndexOf(":")+1;
			var line = str.substring(idx);
			message += " -- Line " + line;
		}
		self.warn(message);
	};
	this.trace = function(val, var2, var3)
	{
        var args = Array.prototype.slice.call(arguments);
        self.traceLogger(format.apply(this, args));
	};

	this.log = function()
	{
		var args = Array.prototype.slice.call(arguments);
        self.logLogger(format.apply(this, args));
	};

	this.info = function(val)
	{
        var args = Array.prototype.slice.call(arguments);
        self.infoLogger(format.apply(this, args));
	};

	this.warn = function()
	{
        var args = Array.prototype.slice.call(arguments);
        self.warnLogger(format.apply(this, args));
	};

	this.error = function()
	{
        var args = Array.prototype.slice.call(arguments);
        self.errorLogger(format.apply(this, args));
	};

	this.debugLogger = this.log;
	this.traceLogger = this.log;
	this.infoLogger = this.log;
	this.warnLogger = this.log;
	this.errorLogger = this.log;


	if (!console || !console.log || this.logLevel === LOG_SILENT)
    {
        this.log = this.nullLogger;
        this.trace = this.nullLogger;
        this.info = this.nullLogger;
        this.warn = this.nullLogger;
        this.error = this.nullLogger;
    }
    else
    {
        if (console.trace)
            this.traceLogger = this.traceLoggerPlus;
        
        if (console.log)
            this.logLogger = this.logLoggerPlus;

        if (console.info)
            this.infoLogger = this.infoLoggerPlus;
        
        if (console.warn)
            this.warnLogger = this.warnLoggerPlus;
        
        if (console.error)
            this.errorLogger = this.errorLoggerPlus;
    }
};

if ( typeof exports !== "undefined" ) {
    module.exports = FN_Log;
}
else if ( typeof define === "function" ) {
    define("FN_Log", function () {
        return FN_Log;
    } );
}
else {
    window.FN_Log = FN_Log;
}
var log = new FN_Log(40);
/* End Log */

/* Start Deferred */
	var Deferred = function(resolvedCallBack, rejectedCallBack, timeout, id)
	{
		var self = this;
		this.id = id || null;
		timeout = !isNaN(timeout) && timeout !== true ? timeout : 0;

		var onDone = [];
		var onAlways = [];
		var onFail = [];

		this.state = Deferred.state.PENDING;
		this.value = null;

		if(resolvedCallBack)
		{
			onDone.push(resolvedCallBack);
		}
		if(rejectedCallBack)
		{
			onFail.push(rejectedCallBack);
		}

		/**
		 * Rejects the Promise
		 *
		 * @method reject
		 * @param  {Mixed} arg Rejection outcome
		 * @return {Object}    Deferred instance
		 */
		this.reject = function ( arg ) {
			if ( self.state > Deferred.state.PENDING ) {
				return self;
			}
			self.state = Deferred.state.FAILURE;
			process.apply(this, arguments);
			return self;
		};

		/**
		 * Resolves the Promise
		 *
		 * @method resolve
		 * @param  {Mixed} arg Resolution outcome
		 * @return {Object}    Deferred instance
		 */
		this.resolve = function ( arg ) {
			if ( self.state > Deferred.state.PENDING ) {
				return self;
			}
			self.state = Deferred.state.SUCCESS;
			process.apply(this, arguments);
			return self;
		};

		/**
		 * Returns the Deferred Promise. This is included to ease in jquery replacement
		 *
		 * @method promise
		 * @return {Object}       Deferred instance
		 */
		this.promise = function ( arg ) {
			return self;
		};

		/**
		 * Registers a function to execute after Promise is reconciled
		 *
		 * @method always
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		this.always = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state !== Deferred.state.PENDING)
				{
					// delay(arg(self.value, self.isResolved()));
					delay(arg.apply(this, self.value));
				}
				onAlways.push( arg );
			}
			return self;
		};

		/**
		 * Registers a function to execute after Promise is resolved
		 *
		 * @method done
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		this.done = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state === Deferred.state.SUCCESS)
				{
					delay(arg.apply(this, self.value));
				}
				onDone.push( arg );
			}
			return self;
		};

		/**
		 * Registers handler(s) for the Promise
		 *
		 * @method then
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		this.then = function ( onFulfilled, onRejected ) {
			self.done( onFulfilled );
			self.fail( onRejected );
			return self;
		};

		/**
		 * Registers a function to execute after Promise is rejected
		 *
		 * @method fail
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		self.fail = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state === Deferred.state.FAILURE)
				{
					// delay(arg(self.value, false));
					delay(arg.apply(this, self.value));
				}
				onFail.push( arg );
			}
			return self;
		};
		/**
		 * Registers a function to execute after Promise is rejected
		 *
		 * @method catch
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		this.catch = this.fail;

		/**
		 * Determines if Deferred is rejected
		 *
		 * @method isRejected
		 * @return {Boolean} `true` if rejected
		 */
		this.isRejected = function () {
			return ( self.state === Deferred.state.FAILURE );
		};

		/**
		 * Determines if Deferred is resolved
		 *
		 * @method isResolved
		 * @return {Boolean} `true` if resolved
		 */
		this.isResolved = function () {
			return ( self.state === Deferred.state.SUCCESS );
		};

		/**
		 * Gets the state of the Promise
		 *
		 * @method state
		 * @return {String} Describes the status
		 */
		this.status = function () {
			var state = self.state;
			var rtn = Deferred.status[state];
			
			return rtn;
		};

		var retryProcess = true;
		var process = function(arg) {
			if ( self.state === Deferred.state.PENDING ) {
				return self;
			}

			self.value = arguments;

			var mapped = function(arr, context, args)
			{
				var i=0;
				try 
				{
					arr.map(function(val)
					{
						val.apply(context, args);
						return val;
					});
				}
				catch(e)
				{
					console.error("Deferred callback Failed for state - "+self.status()+": "+e.message);
					// TODO FAIL???
					if(retryProcess)
					{
						retryProcess = false;
						self.state = Deferred.state.FAILURE;
						process({errorType: "deferred_callback_error", error: e, message: "An Error occured in this function: "+arr[i].toString()});
					}
				}
			};
			if(self.state === Deferred.state.SUCCESS)
			{
				mapped(onDone, this, arguments);
			}
			else if(self.state === Deferred.state.FAILURE)
			{
				mapped(onFail, this, arguments);
			}
			mapped(onAlways, this, arguments);
			return self;
		};

		if(timeout)
		{
			window.setTimeout(function()
			{
				if(self.state === Deferred.state.PENDING)
				{
					self.reject({errorType: "deferred_timed_out"});
				}
			}, timeout);
		}
	};

	/**
	 * States of a Promise
	 *
	 * @private
	 * @type {Object}
	 */
	Deferred.state = {
		PENDING : 0,
		FAILURE : 1,
		SUCCESS : 2
	};

	/**
	 * Status of a Promise
	 *
	 * @private
	 * @type {Array}
	 */
	Deferred.status = [
		"pending",
		"rejected",
		"resolved"
	];

	/**
	 * Accepts Deferreds or Promises as arguments or an Array
	 *
	 * @method when
	 * @return {Object} Deferred instance
	 */
	Deferred.when = function () {
		var i     = 0,
		    defer = new Deferred(),
		    args  = [].slice.call( arguments ),
		    nth,
		    callback = null;

		// Did we receive an Array? if so it overrides any other arguments
		if ( args[0] instanceof Array ) {
			args = args[0];
		}
		if( typeof arguments[1] === "function")
		{
			callback = arguments[1];
		}

		// How many instances to observe?
		nth = args.length;

		// None, end on next tick
		if ( nth === 0 ) {
			defer.resolve( null );
		}
		// Setup and wait
		else {
			each( args, function ( p ) {
				p.then( function () {
					if ( ++i === nth && !defer.isResolved() ) {
						// if ( args.length > 1 ) {
							defer.resolve.apply(this, args);
							if ( callback ) {
								callback.apply(this, args);
							}
						// }
						// else {
						// 	defer.resolve.apply(this, args);
						// 	// defer.resolve( args[0].value );

						// 	if ( callback ) {
						// 		callback.apply(this, args);
						// 	}
						// }
					}
				}, function () {
					if ( !defer.isResolved() ) {
						// if ( args.length > 1 ) {
							defer.reject.apply(this, args);
							if ( callback ) {
								callback.apply(this, args);
							}
						// }
						// else {
						// 	defer.reject.apply(this, args);
						// 	if ( callback ) {
						// 		callback.apply(this, args)
						// 	}
						// }
					}
				} );
			} );
		}

		return defer;
	};

	/**
	 * Iterates obj and executes fn
	 *
	 * Parameters for fn are 'value', 'index'
	 *
	 * @method each
	 * @private
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute on index values
	 * @return {Array}        Array
	 */
	function each ( obj, fn ) {
		var nth = obj.length,
		    i   = -1;

		while ( ++i < nth ) {
			if ( fn.call( obj, obj[i], i ) === false ) {
				break;
			}
		}

		return obj;
	}

	if ( typeof exports !== "undefined" ) {
	    module.exports = Deferred;
	}
	else if ( typeof define === "function" ) {
	    define( "Deferred", Deferred);
	}
	else {
	    window.Deferred = Deferred;
	}


	/* End Deferred */


/*
Multipart notes

try {
  if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
    XMLHttpRequest.prototype.sendAsBinary = function(text){
      var data = new ArrayBuffer(text.length);
      var ui8a = new Uint8Array(data, 0);
      for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);
      this.send(ui8a);
    }
  }
} catch (e) {}



var xhr  = new XMLHttpRequest();
...
xhr.open("POST", url, true);

var boundary = '------multipartformboundary' + (new Date).getTime(),
dashdash = '--',
crlf = '\r\n',


content = dashdash+boundary+crlf+'Content-Disposition: form-data; name="NAMEOFVARIABLEINPHP";"'+crlf+crlf+VARIABLEWITHBASE64IMAGE+crlf+dashdash+boundary+dashdash+crlf;


xhr.setRequestHeader("Content-type", "multipart/form-data; boundary="+boundary);
xhr.setRequestHeader("Content-length", content.length);
xhr.setRequestHeader("Connection", "close");
// execute
xhr.send(content);


*/

	try {
	  	if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
	    	XMLHttpRequest.prototype.sendAsBinary = function(text){
	      		var data = new ArrayBuffer(text.length);
	      		var ui8a = new Uint8Array(data, 0);
	      		for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);
	      		this.send(ui8a);
	    	}
	  	}
	} catch (e)
	{
		log.warn("Ajax sendAsBinary not set");
	}


	/* Start Ajax */
	function ajax (params, retry) {
		return new Ajax(params, retry);
	}

	var DEFAULT_TIMEOUT = 20000;
	var DEFAULT_METHOD = "GET";
	var DEFAULT_RETRY = 5;
	var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
	var DEFAULT_DATA_TYPE = "json"; // dataType (default: Intelligent Guess (xml, json, script, or html))
	var Ajax = function(params, retry)
	{
		if(retry)
		{
			log.log("Ajax retry {}", retry);
		}
		var boundary = '------multipartformboundary' + (new Date).getTime();
		var dashdash = '--';
		var crlf = '\r\n';
		var multipart = params.contentType && params.contentType.indexOf("multipart") !== -1 ? true : false;
		var content = null;
		params = params || {};
		retry = retry || 0;
		var self = this;
		this.requestParams = params;
		this.onDone = [];
		this.onAlways = [];
		this.onFail = [];
		this.requestType = params.requestType;
		this.url = params.url;
		this.retry = params.maxRetry || this.url.indexOf("http") === -1 ? 1 : DEFAULT_RETRY;
		this.xhr = new XMLHttpRequest();
		var dataType = params.dataType || DEFAULT_DATA_TYPE;
		var method = params.method === "GET" || params.method === "POST" ? params.method : DEFAULT_METHOD;
		var async = params.async || true;

		var sendData = "";
		if(params.data)
		{
			if(typeof params.data === "object")
			{
				for(var item in params.data)
				{
					var getVal = item+"="+encodeURIComponent(params.data[item]);
					if(method === "GET" && this.url.indexOf(getVal) !== -1 )
					{
						// Skip it
					}
					else
					{
						if(sendData.length > 0)
						{
							sendData += "&";
						}
						sendData += getVal;
					}
				}
			}
			else if(typeof params.data === "string")
			{
				sendData = params.data;
			}

			if(sendData.length > 0 && method === "GET")
			{
				if(this.url.indexOf("?") === -1)
				{
					this.url += "?";
				}
				else
				{
					this.url += "&";
				}
				this.url += sendData;
			}

		}

		// navigator.userAgent	"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; HPDTDF; BRI/1; .NET4.0E; .NET4.0C; GWX:QUALIFIED; rv:11.0) like Gecko"
		// || navigator.userAgent.indexOf("Windows Phone") !== -1
		var ua = navigator.userAgent.toString();
		var isTrident = ua.indexOf("Trident") !== -1 ? true : false;
		if(isTrident === false)
		{
			this.xhr.timeout = params.timeout ? params.timeout : DEFAULT_TIMEOUT; // Set timeout to 4 seconds (4000 milliseconds)
		}
		

		this.xhr.open(method, this.url, async);
		this.contentType = params.contentType ? params.contentType : DEFAULT_CONTENT_TYPE;
		
		if(multipart)
		{
			// content = params.data.data;
			this.contentType += "; boundary="+boundary;
/*

> Expect: 100-continue
> 
< HTTP/1.1 100 Continue
< HTTP/1.1 200 OK
< Server: nginx/1.6.2
< Date: Tue, 01 Mar 2016 00:29:55 GMT
< Content-Type: image/jpeg
< Transfer-Encoding: chunked
< Connection: keep-alive
< Keep-Alive: timeout=270
< Access-Control-Allow-Origin: http://lt1-static.shoutgameplay.com
< Access-Control-Allow-Credentials: true

*/



		}
		if(!params.headers || ( params.headers && !params.headers["Content-Type"] ) )
		{
			this.xhr.setRequestHeader("Content-Type", this.contentType);
		}
		if(params.headers)
		{
			if(typeof(params.headers) === "object")
			{
				for(var item in params.headers)
				{
					this.xhr.setRequestHeader(item, params.headers[item]);
				}
			}
			if(!params.headers["X-Requested-With"])
			{
				this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}
			
		}
		this.statusCode = null;
		this.responseObj = {};
		

		var responseType = params.responseType || params.dataType || DEFAULT_DATA_TYPE;
		var failed = false;
		
		this.done = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onDone.push(fun);
			}
			return this;
		};
		this.success = this.done;
		
		this.fail = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onFail.push(fun);
			}
			return this;
		};
		this.always = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onAlways.push(fun);
			}
			return this;
		};
		if(params.error)
		{
			this.fail(params.error);
		}
		if(params.success)
		{
			this.done(params.success);
		}
		if(params.complete)
		{
			this.always(params.complete);
		}
		this.resolveCompletedFile = function(url, status, responseText, headers)
		{
			var response = responseText;
			switch(responseType)
			{
				case "json":
					try 
					{
						if(typeof(responseText) === "string")
						{
							responseText = responseText.replace(/(\r\n|\n|\r)/gm,"");
							response = JSON.parse(responseText);
						}
						else
						{
							response = responseText;
						}
						
					}
					catch(e)
					{
						log.handleCatch(e, "fnAjax JSON.parse Fail: "+responseText);
						response = responseText;
					}
				break;
				default:
					response = responseText;
				break;
			}
			var fireFun = function()
			{
				var len = self.onDone.length, i=0, alen = self.onAlways.length;
				for(i=0;i<len;i++)
				{
					self.onDone[i](response, headers, self.requestType, self.xhr);
				}
				for(i=0;i<alen;i++)
				{
					self.onAlways[i](response, headers, self.requestType, self.xhr);
				}
				self.xhr = null;
			};
			delay(fireFun());
		};

		this.resolveFailFile = function(e, errorObj)
		{
			var fireFun = function()
			{
				var len = self.onFail.length, i=0, alen = self.onAlways.length;
				var response = errorObj;
				for(i=0;i<len;i++)
				{
					self.onFail[i](response, self.requestType, self.xhr);
				}
				for(i=0;i<alen;i++)
				{
					self.onAlways[i](response, self.requestType, self.xhr);
				}
			};
			if(!failed)
			{
				failed = true;
				delay(fireFun());
			}
		};

		var parseHeaders = function()
		{
			var headers = {};
			var arr = self.xhr.getAllResponseHeaders().split("\n");
			var len = arr.length;
			for(var i=0;i<len;i++)
			{
				if(arr[i].length > 0)
				{
					var idx = arr[i].indexOf(":");
					if(idx > 0)
					{
						var key = arr[i].substring(0, idx);
						var val = arr[i].substring(idx+1).trim();
						headers[key] = val;
					}
				}
			}
			return headers;
		};
		this.xhr.onreadystatechange = function() 
		{
			self.statusCode = self.xhr.status;
	    	if(self.xhr.readyState === 4 && self.xhr.status === 200) 
	    	{
	    		self.responseObj = {
	    			url: self.url, 
	    			status: self.xhr.status, 
	    			responseText: self.xhr.responseText,
	    			requestType: self.requestType
	    		};
	    		var headers = parseHeaders();
	      		self.resolveCompletedFile(self.url, self.xhr.status, self.xhr.responseText, headers);
	    	}
	    	else if(self.xhr.status !== 200 && self.xhr.status !== 0) // fail fast
	    	{
	    		var errorType = null;
	    		switch(self.xhr.status)
	    		{
	    			case 404:
	    				errorType = "NotFound";
	    			break;
	    			default:
	    				errorType = "unknown";
	    			break;
	    		}
	    		self.resolveFailFile({}, {errorType: errorType, status: self.xhr.status, requestType: self.requestType, requestParams: params});
	    	}
	  	};

		this.xhr.ontimeout = function(e)
		{ 
			if(retry <= self.retry)
			{
				retry++;
				params.timeout = self.xhr.timeout + (retry * 1000);
				delay(function(){
					var nextCall = ajax(params, retry);
					nextCall.fail(function(result)
					{
						self.resolveFailFile(e, {errorType: "xhrTimeout"});
					});
					nextCall.done(function(responseText, requestType, status, url)
					{
						self.resolveCompletedFile(url, status, responseText);
					});
				});
					
			}
			else
			{
				self.resolveFailFile(e, {errorType: "xhrTimeout"});
			}
		};

		this.xhr.onabort = function(e)
		{ 
			self.resolveFailFile(e, {errorType: "xhrAbort"});
		};

		// this.xhr.onload = function(e) {
		// 	debugger;
		//     var text = e.target.responseText;
		//     debugger;
		// };

		this.xhr.onerror = function(e)
		{
			self.resolveFailFile(e, {errorType: "xhrError", status: self.xhr.status, requestType: self.requestType, requestParams: params});
		};

		if(multipart)
		{
			var filetype = null;
			var fileObject = params.data.file;
			if ( fileObject.type == '' ){
		        filetype = 'application/octet-stream';
		    } else {
		        filetype = fileObject.type;
		    }
		    //this used to work
			// content = dashdash + boundary + crlf 
			// + "Content-Transfer-Encoding: BASE64;"
			// + "Content-Disposition: form-data;" + "name=\"file\";" 
			// + "filename=\"" + unescape(encodeURIComponent(params.data.filename)) 
			// + "\"" + crlf + "Content-Type: " + filetype 
			// + crlf + crlf + params.data.result 
			// + crlf + dashdash + boundary + dashdash;

			/* iframe way



			var f = document.createElement("form");
			f.setAttribute('method',"post");
			f.setAttribute('action',"submit.php");

			var i = document.createElement("input"); //input element, text
			i.setAttribute('type',"text");
			i.setAttribute('name',"username");

			var s = document.createElement("input"); //input element, Submit button
			s.setAttribute('type',"submit");
			s.setAttribute('value',"Submit");

			f.appendChild(i);
			f.appendChild(s);

			//and some more input elements here
			//and dont forget to add a submit button

			document.getElementsByTagName('body')[0].appendChild(f);

			*/

			
			// Content-Transfer-Encoding := "BASE64"

			// content = dashdash+boundary+crlf+'Content-Disposition: form-data; name="";"'+crlf+crlf+params.data.file+crlf+dashdash+boundary+dashdash+crlf;

			// var iframe = document.createElement("iframe");
			// iframe.src="about:blank";
			// iframe.addEventListener('load', function (e) {
				debugger;
				var file = params.data.file;
			    // var myElement= document.createElement("label");
			    // myElement.innerHTML="blabla";
			    // miiframe.contentDocument.body.appendChild(myElement);
			    // var form = iframe.contentDocument.getElementById("submitFile");
			    // if(!form)
			    // {
			  //   	var f = document.createElement("form");
					// // f.setAttribute('method',"post");
					
					// // f.setAttribute('id',"submitFile");

					// // f.setAttribute('action',params.data.fileUrl);

					// var i = document.createElement("input"); 
					// i.setAttribute('type',"file");
					// i.setAttribute('name',"file");
					// i.value = params.value.;
					// // i.setAttribute('value', file);
					// f.appendChild(i);
					// // document.body.appendChild(f);
					// // f.submit();
			  //   // }
			  //   // else
			    // {
			    // 	form.submit();
			    // }
					
				

			// }, false);

			// document.body.appendChild(iframe);

			
				
			var formData = new FormData(params.data.form);
			// formData.append("file", file);
			// var iframe = document.createElement('iframe');
			// document.body.appendChild(formData);
			// debugger;
			


			// this.xhr.sendAsBinary(formData);
			this.xhr.send(formData);
			// this.xhr.sendAsBinary(content);
			// f.style.display="none";
			// this.xhr.send(formData);
		}
	  	else if(method === "GET")
	  	{
	  		this.xhr.send(null);
	  	}
	  	else
	  	{
	  		var data = sendData.length > 0 ? sendData : null;
	  		this.xhr.send( data );
	  	}
	  	return this;
	  	
	};

	// Setting constructor loop
	Ajax.prototype.constructor = Ajax;
	// Node, AMD & window supported
	if ( typeof exports !== "undefined" ) {
		module.exports = ajax;
	}
	else if ( typeof define === "function" ) {
		define("ajax", ajax);
		define("Ajax", ajax);
	}
	else {
		window.ajax = ajax;
	}
	/* End Ajax */
