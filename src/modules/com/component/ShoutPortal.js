	var ShoutCall = function(params)
	{
		var self = this;
		this.serverUri = params.serverUri || null;
		this.baseAjax = params.baseAjax || ShoutCall.BASE_AJAX;
		this.host = params.host || null;
		this.requiredFields = params.requiredFields || [];
		this.requiredHeaders = params.requiredHeaders || [];
		this.requestType = params.requestType || "deafult"; // wds
		this.srd = params.srd || null;
		this.primaryId = params.primaryId || null;

		this.DEFAULT_isSsl = params.ssl || params.ssl === false ? params.ssl : ShoutCall.DEFAULT_isSsl;
		this.dontSendRequestParams = params.dontSendRequestParams || params.dontSendRequestParams === false ? params.dontSendRequestParams : ShoutCall.DEFAULT_getDontSendRequestParams;
		this.method = params.method || ShoutCall.DEFAULT_method;
		this.cache = params.cache || ShoutCall.DEFAULT_cache;
		this.contentType = params.contentType || ShoutCall.DEFAULT_contentType;
		this.dataType = params.dataType || ShoutCall.DEFAULT_dataType;
		this.timeout = params.timeout || ShoutCall.DEFAULT_timeout;
		this.sendHeaders = params.sendHeaders || ShoutCall.DEFAULT_sendHeaders;
		this.updateCallback = params.callback || null;
		this.emailSha256Hash = null;

		var Deferred = null;
		RequireLite("Deferred", function(result)
		{
			Deferred = result;
		});
		var ajax = null;
		RequireLite("Ajax", function(result)
		{
			ajax = result;
		});
		var CryptoJS = null;
		RequireLite("CryptoJS", function(result)
		{
			CryptoJS = result;
		});
		var Long = null;
		RequireLite("Long", function(result)
		{
			Long = result;
		});

		this.serverCall = function(data)
		{
			var deferred = new Deferred();
			data = data || {};

			var params = {};
			params.url = self.generateUrlForRequest(data);
			log.info("ServerCall url: {}", params.url);
			if(typeof(params.url) !== "string")
			{
				deferred.reject(params.url);
			}
			else
			{
				params.cache = self.cache ? self.cache : ShoutCall.DEFAULT_cache;
		        params.method = self.getServerMethod();
		        params.contentType = self.getRequestContentType();
		        params.dataType = self.serverReturnType();
		        params.timeout = self.getTimeout();
		        params.data = self.formatRequestDataForServer(data);
		        params.dontSendRequestData = self.getDontSendRequestParams();
		       	params.actionType = self.getActionType();
		        params.subscriberEmail = self.primaryId || params.data.email || params.data.facebookId;
		        params.headers = self.getResponseHeaders();
		        params.requestType = self.requestType;

				var done = function(response, headers)// response, self.requestType, status, url, headers
				{
					if(response.success === false)
					{
						deferred.reject(response);
					}
					else
					{
						var result = self.deserializeFromServer(response);
						if(self.updateCallback)
						{
							self.updateCallback(result);
						}
						deferred.resolve(result);
					}					
				};
				var fail = function(responseObj, requestType, xhr) //response, self.requestType, self.xhr
				{

					responseObj.requestType = requestType;
					responseObj.statusText = xhr.statusText;
					responseObj.url = xhr.responseURL;
					if(responseObj.status === 404 && self.publish && !self.published)
					{
						self.publish(data).done(function(response)
						{
							if(response.estimatedWaitTime)
							{
								window.setTimeout(function()
								{
									self.serverCall(data).done(deferred.resolve).fail(deferred.reject);
								}, response.estimatedWaitTime);
							}
							else
							{
								deferred.resolve(response);
							}
						}).fail(deferred.reject);
					} 
					else if(responseObj.status === 503) // server maintenance
					{
						responseObj.errorType = "serverMaintenance";
						deferred.reject(responseObj);
						// deferred.reject(responseObj);
					}
					else if(responseObj.status === 403 && responseObj.success === false && responseObj.forcedUpgrade)// 403 - success === false && forcedUpgrade
					{
						responseObj.errorType = "forcedUpgrade";
						deferred.reject(responseObj);
						// deferred.reject(responseObj);
					}
					else if(responseObj.status === 401)
					{
						responseObj.errorType = "MUST_AUTHENTICATE";
						deferred.reject(responseObj);
						// deferred.resolve(responseObj);
					}
					else if(responseObj.status === 400)
					{
						responseObj.errorType = "BAD_REQUEST";
						deferred.reject(responseObj);
						// deferred.resolve(responseObj);
					}
					else
					{
						deferred.reject(responseObj);
					}
					

					console.info("BaseCallModel.serverCall FAIL - "+requestType+" responseObj: "+ JSON.stringify(responseObj));
					
				};
				ajax(params).done(done).fail(fail);
			}
				
			return deferred.promise();
		};

	    this.getSubscriberEmail = function(requestType, params)
	    {
	    	return self.primaryId || (self.subscriber ? self.subscriber.email || self.subscriber.facebookId : null);
	    };

	    this.getServerHost = function(params) // TODO GET HOST BY ACTION
		{
			var host = ShoutCall.serverType === "PRODUCTION" ? "static.shout.tv" : "dc1-static.shoutgameplay.com";
			if(self.srd)
			{
				var actionType = self.getActionType();
				var serverObj = self.getServerObjectForAction(actionType);
				if(serverObj)
				{
					var serverDomainNameSet = self.getDomainNameSetForUrl(serverObj, actionType, self.getSubscriberEmail());
					if (isEmpty(serverObj.domainNameIndex))
			            serverObj.domainNameIndex = 0;

			        host = serverDomainNameSet[serverObj.domainNameIndex];
				}
					
			}
			else if(self.requestType !== "default" && self.requestType !== "srd")
			{
				host = null;
			}
	        return host;
		};


		this.generateUrlForRequest = function(params)
		{
	        var host = self.getServerHost(params);
	        if(typeof(host) === "string")
	        {
	        	var ssl = self.isSsl(host) === true ? "https://" : "http://";
		        var base = self.baseAjax;
		        var serverUri = typeof(self.serverUri) === "function" ? self.serverUri(params, self.subscriber) : self.serverUri;
		        if(!serverUri)
		        {
		        	console.warn("BaseCallModel.generateUrlForRequest no serverUri");
		        }
				return ssl + host + base + serverUri;
	        }
	        else
	        {
	        	console.warn("ShoutCall.generateUrlForRequest: BAD_HOST");
	        	return {errorType: "BAD_HOST"};
	        }  
		};

		this.isSsl = function(host)
		{
			var rtn = false;
			
			if((host && host.indexOf(":") !== -1 && host.indexOf("44") !== -1) || (self.requestType === "publish"))
			{
				// debugger;
				rtn = true;
			}
			else if(document.location.protocol === "https:")
	        {
	        	// debugger;
	            rtn = true;
	        }
	        else
	        {
	        	rtn = self.DEFAULT_isSsl;
	        }
	        return rtn;
		};

		this.getActionType = function()
		{
		    var result = self.requestType || "default";
		 //    if(self.requestType === "sync")
			// {
			// 	debugger;
			// }
		    switch(result)
		    {
		    // 	case self.PUBLISH:
		    // 		result = "publish";
		    // 	break;
		    	case "wds":
		    	case "srd":
		    // 	case baseObj.SRD:
		    // 	case baseObj.RESPONSE_JSON:
		    		result = "wds";
		    	break;
		        case "sync":
		            result = "default";
		        break;
		    }

		    return result;
		};

		this.getServerObjectForAction = function(actionType)
	    {
	  //   	if(self.requestType === "sync")
			// {
			// 	debugger;
			// }
	        var serverClass = self.srd.action[actionType];
	        if (!serverClass)
	        {
	        	debugger;
	        	console.warn("ShoutCall.getServerObjectForAction Did not find server class for actionType: " + actionType);
	        }
	        
	        return self.srd.server[serverClass];
	    };

	    this.getServerMethod = function()
	    {
	    	// debugger;
	    	return self.method;
	    };

	    this.getRequestContentType = function()
	    {
	    	// debugger;
	    	return self.contentType;
	    };

	    this.serverReturnType = function()
	    {
	    	// debugger;
	    	return self.dataType;
	    };

	    this.getTimeout = function()
	    {
	    	// debugger;
	    	// retry = retry || 0;
	    	return self.timeout;
	    };

	    this.getDontSendRequestParams = function()
	    {
	    	// switch(requestType)
	    	// {
		    // 	case baseObj.RESPONSE_JSON:
		    // 	case baseObj.WDS:
		    // 		rtn = true;
		    // 	break;
		    // }
	    	return self.dontSendRequestParams;
	    };

	    this.formatRequestDataForServer = function(params)
	    {
	    	// debugger; // TODO Check required - TODO CHECK Allowed 
	    	params = params || {};
	    	var data = {};
	    	if(!self.dontSendRequestParams)
	    	{
	    		data = params;
	    	}
	    	
	    	switch(self.requestType)
	    	{
	    		case "publish":
	    			data.toWds = self.getToWds();
		    	break;
		    	
		    }
	    	return data;
	    };

	    this.getDontSendHeaders = function()
	    {
	    	// var rtn = !self.sendHeaders;
	    	// switch(requestType)
	    	// {
	    	// 	case baseObj.SRD:
	    	// 	case baseObj.WDS:
	    	// 	case baseObj.RESPONSE_JSON:
	    	// 		rtn = true;
	    	// 	break;
	    	// 	default:
	    	// 		rtn = false;
	    	// 	break;
	    	// }
	    	return !self.sendHeaders;
	    };

	    this.getResponseHeaders = function()
	    {
	    	var headerParams = null; 
	    	var dontSendHeaderParams = self.getDontSendHeaders();
	        if (!dontSendHeaderParams)
	        {
				headerParams = {};
				switch(self.requestType)
				{
					case "signin":
					case "sync":
					case "publish":
					case "auth":
					case "answer":
						if(self.subscriber)
			            {
		                	if (self.subscriber.sessionKey){
		                    	headerParams["X-REST-SESSION-KEY"] = self.subscriber.sessionKey;
		                	}

		                	
		            	}
		            	var deviceId = getDeviceId();
	                	if (deviceId){
	                    	headerParams["X-REST-DEVICE-ID"] = deviceId;
	                	}
		            	var appVersion = requireLocal("appVersion");
		            	headerParams["X-REST-APPLICATION-ID"] = "SHOUT_HTML5_EMBEDDED";
		            	headerParams["X-REST-APPLICATION-VERSION"] = appVersion ? appVersion.version : "4.9";

		            	if (self.requestType === "answer"){
		                	headerParams["X-MESSAGE-TYPE"] = "ADD_ANSWER";
		            	}
					break;
				}
	        }
	        return headerParams;

	    };



	    this.deserializeFromServer = function(response) // requestData
		{
			var result = null;
			switch(self.requestType)
			{
				case "srd":
					if(!response.action)
					{
						response.action = {};
						response.action.wds = "wds";
						response.action.publish = "collector";
					}

					if(!response.action.wds)
					{
						response.action.wds = "wds";
						response.action.publish = "collector";
					}
					result = response; 
				break;
				case "wds":
					if(typeof(response) === "object")
					{
						result = response;
					}
					else
					{
						result = self.decryptSyncDoc(self.subscriber.encryptKey, response);
					}
					
				break;
				default:
					result = response;
				break;
			}
			//TODO HANDLE ERRORS
			return result;
		};

		this.decryptSyncDoc = function(encryptKey, syncDocEncrypted)
		{
			
		    var responseWords = CryptoJS.enc.Base64.parse(syncDocEncrypted);
		    var ivWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(0,4));
		    var secretWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(4), responseWords.sigBytes-16);
		    var decoded = null;
		    try
		    {
		    	decoded = decodeURIComponent(encryptKey);
		    }
		    catch(e)
		    {
		    	decoded = encryptKey;
		    }
		     
		    var hash = self.getSha256Hash(decoded)
		    var keyWords = CryptoJS.enc.Hex.parse(hash);

		    // See https://code.google.com/p/crypto-js/issues/detail?id=112
		    var decrypted = CryptoJS.AES.decrypt(secretWords.toString(CryptoJS.enc.Base64), keyWords, {iv: ivWords});
		    var strResult = decrypted.toString(CryptoJS.enc.Latin1);
		    var result = null;
		    
		    if (isNotEmpty(strResult))
		    {
		        try
		        {
		            result = JSON.parse(strResult);
		        }
		        catch(ex)
		        {
		            console.error("Subscriber.decryptSyncDoc Unable to parse decrypted JSON for request type " + self.requestType + ", decryptedData: " + strResult + ", exception - " + ex);
		            result = ErrorHandler.createServerError({errorType: "jsonParseException"});
		        }
		    }

		    return result;
		};

		this.getSha256Hash = function(value)
		{
		    var message = CryptoJS.enc.Utf8.parse(value);
		    var digest = CryptoJS.SHA256(message);
		    return digest.toString();
		};

	    this.getDomainNameSetForUrl = function(serverObj, actionType, primaryId)
	    {
	    	var domainNameSets = serverObj ? serverObj.domainNameSets : null;
	        if (isEmpty(domainNameSets)){
	            console.warn("ShoutCall.getDomainNameSetForUrl Did not find domainNameSets for serverClass: " + serverClass);
	            return null;
	        }
	        else
	        {
	        	// If there is no selected domainNameSet or the email changed then reselect one.
		        if( primaryId && (isEmpty(serverObj.domainNameSetIndex) || serverObj.subscriberEmail !== primaryId))
		        {
		            serverObj.subscriberEmail = primaryId;
		            
		            var selectMethodArr = serverObj.selectMethod.split("%");
		            var selectMethod = selectMethodArr[0];
		            if (selectMethod !== "sha256")
		                return {error: "Unknown selectMethod " + selectMethod + " found while getting url for action : " + actionType};

		            var howManyBytesToUse = myParseInt(selectMethodArr[1]);
		            var byteValueAsLong = getByteValueFromEmailUsingSha256A( self.emailSha256Hash || serverObj.subscriberEmail || serverObj.subscriberFacebookId, howManyBytesToUse);
		            
		            var lengthOfDomainNameSets = domainNameSets.length;
		            var moduloAsLong = byteValueAsLong.modulo(Long.fromNumber(lengthOfDomainNameSets));
		            serverObj.domainNameSetIndex = moduloAsLong.toInt();
		        }
		        else
		        {
		        	serverObj.domainNameSetIndex = serverObj.domainNameSetIndex || 0;
		        }

		        // We now have a domain name set index, grab that domain name set.
		        var domainNameSet = domainNameSets[serverObj.domainNameSetIndex];
		        return domainNameSet;
	        }
	        
		        
	        
	        
	    };

    
	    self.getToWds = function()
		{
			var rtn = null;
			var actionType = "wds";
			var serverObj = self.getServerObjectForAction(actionType);
			if(serverObj)
			{
				var serverDomainNameSet = self.getDomainNameSetForUrl(serverObj, actionType, self.getSubscriberEmail());
				if (isEmpty(serverObj.domainNameIndex))
		            serverObj.domainNameIndex = 0;

		        rtn =  serverDomainNameSet[serverObj.domainNameIndex];

				if(rtn)
				{
					if(rtn.indexOf(":") !== -1)
					{
						rtn = rtn.substr(0, rtn.indexOf(":"));
					}
				}	
			}
			return rtn;
		};
		var getByteValueFromEmailUsingSha256A = function(email, howManyBytesToUse)
		{
		    var rtn;
		    // emailSha256Hash
			var digest;
			if(email.indexOf("@") !== -1 )
		    {
		        var message = CryptoJS.enc.Utf8.parse(email);
		        digest = CryptoJS.SHA256(message);
		    }
		    else // already encrypted
		    {
		        digest = CryptoJS.enc.Hex.parse(email);
		    }
		    var arr = wordToByteArray(digest.words);
		    
		    var byteValueAsLong = Long.fromNumber(0, false);
		    
		    for (var i = 0; i < howManyBytesToUse; i++)
		    {
		        if (i > 0) byteValueAsLong = byteValueAsLong.shiftLeft(8);
		        	byteValueAsLong = byteValueAsLong.or(Long.fromNumber(arr[i] & 0xFF, false));

		    }
		    rtn = byteValueAsLong;
		    return rtn;
		};

		var wordToByteArray = function (wordArray)
		{
		    var byteArray = [], word, i, j;
		    for (i = 0; i < wordArray.length; ++i) {
		        word = wordArray[i];
		        for (j = 3; j >= 0; --j) {
		            byteArray.push((word >> 8 * j) & 0xFF);
		        }
		    }
		    return byteArray;
		};
	    
	};



	var getTypeOf = function(value)
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

	var myParseInt = function(val)
	{
	    return parseInt(val, 10);
	};

	var isNotEmpty = function(val)
	{
		var result = false;
	    var UNDEF;

	    if (val !== UNDEF && val !== null)
	    {
	        var type = getTypeOf(val);
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
	var isEmpty = function(val)
	{
	    return !isNotEmpty(val);
	};


	var RequireLite = function(name, callback) // TODO Try with various module loaders
	{
		if(window.require && typeof(window.require) === "function")
		{
			require([name], function(mods)
			{
				if(mods[name])
				{
					callback(mods[name]);
				}
				else
				{
					debugger;
				}
			});
		}
		else
		{
			switch(name)
			{
				case "Deferred":
					if(window.Deferred)
					{
						callback(window.Deferred);
					}
					else
					{
						console.error("ShoutCall Missing Deferred Object");
					}
				break;
				case "Ajax":
					if(window.ajax)
					{
						callback(window.ajax);
					}
					else
					{
						console.error("ShoutCall Missing Ajax Object");
					}
					
				break;
				case "CryptoJS":
					if(window.CryptoJS)
					{
						callback(window.CryptoJS);
					}
					else if(window.Crypto)
					{
						callback(window.Crypto);
					}
					else
					{
						console.error("ShoutCall Missing Crypto Object");
					}
				break;
				case "Long":
					
					if(window.dcodeIO.Long)
					{
						callback(window.dcodeIO.Long);
					}
					else
					{
						console.error("ShoutCall Missing Long Object");
					}
				break;
				case "com.component.SystemDetect":
					if(window.SystemDetect)
					{
						callback(window.SystemDetect);
					}
				break;
				case "scrypt":
					if(window.scrypt)
					{
						callback(window.scrypt);
					}
				break;
			}
		}
	};

	ShoutCall.BASE_AJAX = "/mobile_api";
	ShoutCall.HOST = window.location.host;
	ShoutCall.DEFAULT_isSsl = false;
	ShoutCall.DEFAULT_contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	ShoutCall.DEFAULT_dataType = "json";
	ShoutCall.DEFAULT_timeout = 10000;
	ShoutCall.DEFAULT_getDontSendRequestParams = false;
	ShoutCall.DEFAULT_cache = true;
	ShoutCall.DEFAULT_method = "GET";
	ShoutCall.DEFAULT_sendHeaders = false;
	ShoutCall.serverType === "PRODUCTION";

	ShoutCall.Factory = {
		getWDSCall: function(serverUri, callbackOnUpdate, isSRD)
		{
			var wdsData = {
				baseAjax: "/",
				serverUri: serverUri, // "srd2.json"
				requestType: isSRD ? "srd" : "wds",
				dontSendRequestParams: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(wdsData);
		},
		getAuthCall: function(serverUri, callbackOnUpdate)
		{
			var authData = {
				baseAjax: "/gpwebapi",
				serverUri: serverUri,
				requestType: "signin",
				sendHeaders: true,
				method: "POST",
				ssl: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(authData);
		},
		getPublishCall: function(serverUri, callbackOnUpdate)
		{
			var publishData = {
				baseAjax: "/",
				serverUri: serverUri || "publish",
				requestType: "publish",
				sendHeaders: true,
				method: "POST",
				ssl: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(publishData);
		},
		// getCollectorCall: function(serverUri, callBackOnUpdate)
		// {
		// 	var collectorData = {
		// 		baseAjax: "/",
		// 		serverUri: serverUri,
		// 		requestType: "collector",
		// 		sendHeaders: true,
		// 		method: "POST",
		// 		ssl: true
		// 	};
		// 	return new ShoutCall(collectorData);
		// },
		getSyncCall: function(serverUri, callbackOnUpdate)
		{
			var syncData = {
				baseAjax: "/gpwebapi",
				serverUri: serverUri,
				requestType: "sync",
				sendHeaders: true,
				ssl: false,
				callback: callbackOnUpdate
			};
			return new ShoutCall(syncData);
		}
	};

	var saveToLocal = function(key, value)
	{
	    if (typeof(Storage) !== "undefined") {
	        localStorage.setItem(key, value);
	    }
	};


	window.getDeviceId = function()
	{
	    var rtn = null;
	    if (typeof(Storage) !== "undefined") {
	        rtn = localStorage.getItem("deviceId");
	    }
	    if(!rtn)
	    {
	        rtn = getUuid();
	        saveToLocal("deviceId", rtn);
	    }
	    return rtn;
	}; 

	var getUuid = function ()
	{
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	};

	var Cron = function(pulseTime, callback)
	{
		var self = this;
		var run = false;
		this.pulseTime = pulseTime;
		this.callback = callback;
		this.start = function()
		{
			run = true;
			cron();
		};

		this.stop = function()
		{
			run = false;
		};

		var cron = function()
		{
			if(run && self.pulseTime && self.pulseTime > 0 && self.callback && typeof(self.callback) === "function")
			{
				window.setTimeout(function()
				{
					self.callback();
					cron();
				}, self.pulseTime);
			}
		};
	};
	/**
	 * API to access SHOUT servers.
	 * @class ShoutPortal
	 */

	/**
	 * Initiates a ShoutPortal Object
	 * @memberof ShoutPortal
	 * @param {string} appId - Possible values of "SHOUT", "SHOUT5", "MyMadrid"
	 * @param {string} appMode - Possible values null, "STAND_ALONE", "EMBEDDED", will default to "STAND_ALONE"
	 * @param {string} appMode - Possible values null, "PRODUCTION", "STAGING", will default to "PRODUCTION"
	 */
	var ShoutPortal = function(appId, appMode, serverType)
	{
		var self = this;
		var Deferred = null;
		RequireLite("Deferred", function(result)
		{
			Deferred = result;
		});

		var SystemDetect = null;
		RequireLite("com.component.SystemDetect", function(result)
		{
			SystemDetect = result;
		});

		var scrypt = null;
		RequireLite("scrypt", function(result){
			scrypt = result;
		});

		this.appId = appId || "MyMadrid";
		this.appMode = appMode || "STAND_ALONE";
		this.ShoutCall = ShoutCall;
		var signupTicket = null;
		var srd = null;

		console.info("ShoutPortal");
		var srdUpdate = [];
		var subscriberUpdate = [];
		this.registerCall = function(call)
		{
			srdUpdate.push(call);
			subscriberUpdate.push(call);
		};

		
		var srdDone = function(data)
		{
			// assign result data to the srd object
			srd = data;
			var len = srdUpdate.length;
			for(var i=0;i<len;i++)
			{
				if(srdUpdate[i])
					srdUpdate[i].srd = data;
			}
			console.info("SRD DONE");
		};
		var shoutSubscriber = null;
		this.getShoutSubscriber = function()
		{
			return shoutSubscriber;
		};
		this.subscriberDone = function(data)
		{
			shoutSubscriber = data;
			var len = subscriberUpdate.length;
			for(var i=0;i<len;i++)
			{
				subscriberUpdate[i].subscriber = data;
			}
			console.info("Subscriber DONE");
		};
		// Initailize the SRD

		this.setServerType = function(serverType)
		{
			var deferred = new Deferred();
			serverType = serverType ? serverType === "PRODUCTION" || serverType === "STAGING" ? serverType : "PRODUCTION" : "PRODUCTION";
			if(self.serverType !== serverType)
			{
				self.serverType = serverType;
				ShoutCall.serverType = serverType;
				if(srd)
				{
					srdDone(null);
					SRD.serverCall().done(function(result){
						deferred.resolve(result, true);
						self.subscriberDone({});
					}).fail(deferred.reject);
				}
				else
				{
					deferred.resolve();
				}
			}
			else
			{
				deferred.resolve(srd, false);
			}
			return deferred;
				
		};
		this.setServerType(serverType);
		
		var SRD = ShoutCall.Factory.getWDSCall("srd2.json", srdDone, true);
		srdUpdate.push(SRD);
		SRD.serverCall();

		var Stadium = ShoutCall.Factory.getWDSCall(function(){
			return srd.data.virtualStadium[self.appId].path;
		});
		this.registerCall(Stadium);

		var Section = ShoutCall.Factory.getWDSCall(function(data)
		{
	        var subscriberEmailHash = null;
	        var length = null;
	        var sectionNum = null;
	        try 
	        {
	            subscriberEmailHash = this.getSha256Hash(data.data.email.toLowerCase() || data.data.facebookId);
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION subscriberEmailHash error");
	        }

	        try 
	        {
	            length = data.stadium.sectionEmailHashMethod.split("/")[1];
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION length error");
	        }

	        try 
	        {
	            sectionNum = subscriberEmailHash.substring(0,parseInt(length));
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION sectionNum error");
	        }
	        
	        return "/" + sectionNum + data.stadium.sectionPathSuffix;   
    
		});
		srdUpdate.push(Section);

		var addSessionKey = function(response)
		{
			response.subscriber.sessionKey = response.sessionKey;
			return response.subscriber;
		};
		// /authenticate/viaFacebookOrLink
		var authenticateViaFacebookOrLink = ShoutCall.Factory.getAuthCall("/authenticate/viaFacebookOrLink", this.subscriberDone);
		authenticateViaFacebookOrLink.deserializeFromServer = addSessionKey;
		srdUpdate.push(authenticateViaFacebookOrLink);

		var authenticate = ShoutCall.Factory.getAuthCall("/authenticate", this.subscriberDone);
		authenticate.deserializeFromServer = addSessionKey;
		srdUpdate.push(authenticate);

		var loginAndGetCommonSubscriber = ShoutCall.Factory.getPublishCall("loginAndGetCommonSubscriber");
		// loginAndGetCommonSubscriber.deserializeFromServer = addSessionKey;
		srdUpdate.push(loginAndGetCommonSubscriber);
		subscriberUpdate.push(loginAndGetCommonSubscriber);

		// getCommonSubscriber is Depecated use loginAndGetCommonSubscriber
		var getCommonSubscriber = ShoutCall.Factory.getPublishCall("getCommonSubscriber"); 
		srdUpdate.push(getCommonSubscriber);
		subscriberUpdate.push(getCommonSubscriber);

		var signUpCall = new ShoutCall({
				baseAjax: "/",
				serverUri: "signup",
				requestType: "signup",
				sendHeaders: true,
				method: "POST",
				ssl: true
			});
		this.registerCall(signUpCall);

		this.getResponseJSON = ShoutCall.Factory.getWDSCall(function(data)
		{
			return data.ticket+"/response.json";
		});
		this.registerCall(this.getResponseJSON);

		this.publish = ShoutCall.Factory.getPublishCall("publish");
		this.registerCall(this.publish);

		var signupAndGetCommonSubscriber = ShoutCall.Factory.getPublishCall("signupAndGetCommonSubscriber");
		this.registerCall(signupAndGetCommonSubscriber);

		var setCommonSubscriber = ShoutCall.Factory.getPublishCall("setCommonSubscriber");
		this.registerCall(setCommonSubscriber);

		var getAllItems = ShoutCall.Factory.getPublishCall("getStoreItemsForVenue");
		this.registerCall(getAllItems);

		var getClientToken = ShoutCall.Factory.getPublishCall("getStoreClientToken");
		this.registerCall(getClientToken);

		var purchaseItem = ShoutCall.Factory.getPublishCall("purchaseStoreItem");
		this.registerCall(purchaseItem);

		var getStoreReceiptsFromDate = ShoutCall.Factory.getPublishCall("getStoreReceiptsFromDate");
		this.registerCall(getStoreReceiptsFromDate);

		var getExternalSubscriber = ShoutCall.Factory.getAuthCall("/subscriber/getExternalSubscriber", this.subscriberDone);
		getExternalSubscriber.deserializeFromServer = addSessionKey;
		// getExternalSubscriber.timeout = 120000;
		this.registerCall(getExternalSubscriber);

		var getPublicProfile = ShoutCall.Factory.getWDSCall(function(data){
			return data.subscriberId + "/public_profile.json";
		});
		this.registerCall(getPublicProfile);

		var updateAndGetCommonSubscriber = ShoutCall.Factory.getPublishCall("updateAndGetCommonSubscriber");
		this.registerCall(updateAndGetCommonSubscriber);

		var getSubscriberEmailsAndAddresses = ShoutCall.Factory.getPublishCall("getSubscriberEmailsAndAddresses");
		this.registerCall(getSubscriberEmailsAndAddresses);

		// getSubscriberStats
		var getSubscriberStats = ShoutCall.Factory.getPublishCall("getSubscriberStats");
		this.registerCall(getSubscriberStats);

		// getGameBadges
		var getGameBadges = ShoutCall.Factory.getPublishCall("getGameBadges");
		this.registerCall(getGameBadges);

		var updateSubscriberInfo = ShoutCall.Factory.getAuthCall(function(data, subscriber)
	    {
	        return "/subscriber/" + subscriber.subscriberId + "/updateSubscriberInfo";
	    });
	    this.registerCall(updateSubscriberInfo);

	    var getNotifications = ShoutCall.Factory.getPublishCall("note/list");
		this.registerCall(getNotifications);
	    // updateSubscriberInfo.DEFAULT_isSsl = false;

		var getPowerups = ShoutCall.Factory.getWDSCall(function(data, subscriber){
			return subscriber.emailSha256Hash + "/powerups.json";
		});
		getPowerups.dataType = "string";
		this.registerCall(getPowerups);

		var getEvent = ShoutCall.Factory.getWDSCall(function(data){
			return data.eventId + "/event.json";
		});
		this.registerCall(getEvent);

		var getUsedPowerups = ShoutCall.Factory.getWDSCall(function(data, subscriber){
			return subscriber.emailSha256Hash + "/" + data.eventId + "/powerups_usage_counts.json";
		});
		getUsedPowerups.dataType = "string";
		this.registerCall(getUsedPowerups);

		var getSubscriberCCResults = ShoutCall.Factory.getWDSCall(function(data, subscriber){
			return subscriber.emailSha256Hash + "/" + data.eventId + "/subscriber_cc_results.json";
		});
		getSubscriberCCResults.dataType = "string";
		this.registerCall(getSubscriberCCResults);

		// <collector>/changePassword
		var changePassword = ShoutCall.Factory.getPublishCall("changePassword");
		this.registerCall(changePassword);

		var recordGamePayout = ShoutCall.Factory.getPublishCall("recordGamePayout");
		this.registerCall(recordGamePayout);

		var getGamePayouts = ShoutCall.Factory.getPublishCall("getGamePayouts");
		this.registerCall(getGamePayouts);

		var redeemGamePayout = ShoutCall.Factory.getPublishCall("getGamePayouts");
		this.registerCall(redeemGamePayout);

		var addAnswer = ShoutCall.Factory.getPublishCall("addAnswer");
		this.registerCall(addAnswer);
		addAnswer.requestType = "answer";

		// <sync>/subscriber/sendChangePasswordEmail
		var sendChangePasswordEmail = ShoutCall.Factory.getSyncCall("/subscriber/sendChangePasswordEmail");
		this.registerCall(sendChangePasswordEmail);

		var subscriberInfo = ShoutCall.Factory.getSyncCall(function(data, subscriber)
	    {
	        return "/subscriber/" + subscriber.subscriberId + "/subscriberInfo";
	    });
		this.registerCall(subscriberInfo);

		var getQuestionAnswerPercentages = ShoutCall.Factory.getSyncCall("/game/getQuestionAnswerPercentages");
		this.registerCall(getQuestionAnswerPercentages);

		/*
		    this.WDS = "getEventContests";
		    this.serverUri[this.WDS] = function(data) {return "/" + data.eventId + "/event_coca.json";};
		*/


		/*
		this.CHECK_VIPBOX_CODE_REQUEST_TYPE = "isVipboxCodeOkToUse";
		this.CREATE_VIPBOX_REQUEST_TYPE = "createVipbox";
		this.JOIN_VIPBOX_WITH_CODE_REQUEST_TYPE = "joinWithCode";

		this.serverUri[this.CHECK_VIPBOX_CODE_REQUEST_TYPE] = "/vipbox/isVipboxCodeOkToUse";
		this.serverUri[this.CREATE_VIPBOX_REQUEST_TYPE] = "/vipbox/create";
		this.serverUri[this.JOIN_VIPBOX_WITH_CODE_REQUEST_TYPE] = "/vipbox/joinWithCode";
		*/

		/*
			this.WDS = "GET_POWERUPS";
		    this.PUBLISH = "INITIATE_GET_POWERUPS";
		    this.CREATE_THROWDOWN_REQUEST_TYPE = "createThrowdown";
		    this.RESERVE_POWERUP_REQUEST_TYPE  = "powerupReservePowerup";

		    this.serverUri[this.PUBLISH] = "/publish";
		    this.serverUri[this.WDS] = function(data, subscriber)
		    {
		        var hash = self.subscriber().emailHash();
		        return "/" + hash + "/powerups.json";
		    };

		    this.serverUri[this.CREATE_THROWDOWN_REQUEST_TYPE] = "/play/createThrowdown";
		    this.serverUri[this.RESERVE_POWERUP_REQUEST_TYPE] = "/game/powerupReservePowerup";
		*/

		var powerupReservePowerup = ShoutCall.Factory.getSyncCall("/game/powerupReservePowerup");
		this.registerCall(powerupReservePowerup);

		var getCampaign = ShoutCall.Factory.getSyncCall("/sponsor/campaign");
		this.registerCall(getCampaign);

		var getAnswersForGame = ShoutCall.Factory.getSyncCall("/game/getAnswersForGame");
		this.registerCall(getAnswersForGame);

		// leaderboard
		var getLeaderboard = ShoutCall.Factory.getSyncCall(function(data)
		{
			return "/event/leaderboard/"+data.eventId;
		});
		this.registerCall(getLeaderboard);

		// getShoutOuts
		/*
			this.WDS = "shoutOuts";
			this.serverUri[this.WDS] = function(data)
			{
				var result = "/"+data.eventId;
				if (data.vipBoxId)
		        	result += "/" + data.vipBoxId;

		    	result += "/shout_feed.json";
		    return result;
			};
		*/
		var getShoutOuts = ShoutCall.Factory.getWDSCall(function(data)
		{
			var result = data.eventId;
				if (data.vipBoxId)
		        	result += "/" + data.vipBoxId;

		    	result += "/shout_feed.json";
		    return result;
		});
		this.registerCall(getShoutOuts);

		var getContests = ShoutCall.Factory.getWDSCall(function(data)
		{
			return data.eventId + "/event_coca.json";
		});
		this.registerCall(getContests);

		var getEventPlaces = ShoutCall.Factory.getSyncCall("/vipbox/list");
		this.registerCall(getEventPlaces);

		var getSubscriberOneOnOnes = ShoutCall.Factory.getSyncCall("/cc/getSubscriberOneOnOnes");
		this.registerCall(getSubscriberOneOnOnes);

		


		this.updateSubscriberInfo = function(data)
		{
			var deferred = new Deferred();
			var update = false;
			if(data.currencyCode || data.languageCode || data.fromCountryCode || data.shipCountryCode || data.username || data.facebookId || data.partnerSubscriberId || data.email || data.firstName || data.lastName)
	        {
	            update = true;
	            if(data.username)
	            {
	            	data.nickname = data.username;
	            }
	        }
	       	if(update)
	       	{
	       		updateSubscriberInfo.serverCall(data).done(function(result)
	       		{
	       			if(result.success === true)
	                {
                        log.info("Portal.updateSubscriberInfo Done:{}",result);
                        //TODO UPDATE INFO ON PLATFORM_INFO
                        deferred.resolve();
	                    // TODO PUBLISH Public Subscriber
	                }
	                else
	                {
	                    deferred.reject(result);
	                }
	       		}).fail(deferred.reject);
	       	}
	       	return deferred.promise();

		};
		this.getResponse = function(result, retryNum)
		{
			var defResponse = new Deferred();
			retryNum = retryNum || 0; 
			var to = retryNum === 0 ? result.estimatedWaitTime : retryNum * 250;
			window.setTimeout(function()
			{
				self.getResponseJSON.serverCall(result).done(function(response)
				{
					if(response.success === true)
					{
						defResponse.resolve(response);
					}
					else
					{
						defResponse.reject(response);
					}
				}).fail(function(errorObj)
				{
					if(errorObj.success === false)
					{
						defResponse.reject(errorObj);
					}
					else if(retryNum <= 10)
					{
						retryNum++;
						self.getResponse(result, retryNum).done(defResponse.resolve).fail(defResponse.reject);
					}
					else
					{
						defResponse.reject(errorObj);
					}
				});
			}, to);
				
			return defResponse.promise();
		};

		/**
		 * Logs user in with Facebook credentials
		 * @memberof ShoutPortal
		 * @param  {Object} data - Should be the user JSON from a Facebook login 
		 * @return {Object} Deferred instance
		 */
		this.loginWithFacebook = function(data)
		{
			var deferred = new Deferred();
			if(!srd)
			{
				window.setTimeout(function()
				{
					self.loginWithFacebook(data).done(deferred.resolve).fail(deferred.reject);
				}, 100);
			}
			else
			{
				// pollStadium(data).done(function(result)
				// {
					authenticateViaFacebookOrLink.serverCall(subscriberDataForServerCall(data)).done(function(result)
					{
						deferred.resolve({subscriber: result, payload: null});
						// self.getCommonSubscriber().done(function(payload)
						// {
						// 	deferred.resolve({subscriber: result, payload: payload});
						// }).fail(function(errorObj)
						// {
						// 	deferred.resolve({subscriber: result});
						// 	log.warn("ShoutPortal.loginWithFacebook authenticateViaFacebookOrLink getCommonSubscriber Failed: {}", errorObj);
						// 	// deferred.reject(errorObj);
						// });

					}).fail(function(errorObj){
						getStadium(data).done(function(result)
						{
							deferred.reject(errorObj);
						}).fail(function(stadiumErrorObj)
						{
							debugger;
							self.signup(data).done(deferred.resolve).fail(function()
							{
								deferred.reject({errorType: "NOT_IN_SYSTEM", message: "You are not in the system, please sign up."});
							});
							
						});
					});
				// }).fail(deferred.reject);
			}
				
			return deferred.promise();
		};

		this.getExternalSubscriber = function(data)
		{
			var deferred = new Deferred();
			if(!srd)
			{
				log.info("getExternalSubscriber no SRD");
				window.setTimeout(function()
				{
					self.getExternalSubscriber(data).done(deferred.resolve).fail(deferred.reject);
				}, 100);
			}
			else if(data.email)
			{
				log.log("getExternalSubscriber pollStadium");
				getExternalSubscriber.serverCall(subscriberDataForServerCall(data)).done(function(result)
				{
					log.log("getExternalSubscriber getCommonSubscriber");
					deferred.resolve(result);
					// self.getCommonSubscriber().done(function(payload)
					// {
					// 	result.payload = payload;
					// 	deferred.resolve(result);
					// }).fail(function(errorObj)
					// {
					// 	errorObj.message = "getCommonSubscriber failed";
					// 	deferred.reject(errorObj);
					// });
				}).fail(function(errorObj)
				{
					errorObj.message = "getExternalSubscriber failed";
					deferred.reject(errorObj);
				});
			}
			else
			{
				deferred.reject({errorType: "NO_EMAIL", message: "getExternalSubscriber failed NO EMAIL"});
			}
			return deferred.promise();
		};
		var stadium = null;
		var getStadium = function(data)
		{
			var deferred = new Deferred();
			if(stadium)
			{
				getSection(stadium, data).done(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				Stadium.serverCall().done(function(result)
				{
					stadium = result;
					getSection(result, data).done(deferred.resolve).fail(deferred.reject);
				}).fail(deferred.reject);
			}
				
			return deferred.promise();
		};

		var found = false;
		var getSection = function(stadium, data)
		{
			var section = {stadium: stadium, data: data};
			var deferred = new Deferred();
			if(found)
			{
				deferred.resolve({found: found});
			}
			else
			{
				Section.serverCall(section).done(function(result)
				{
					if(result.reservations && result.reservations.length > 0)
					{
						var subscriberEmailHash = Section.getSha256Hash(data.email.toLowerCase() || data.facebookId);
						var len = result.reservations.length;
						for(var i=0;i<len;i++)
						{
							if(subscriberEmailHash === result.reservations[i])
							{
								found = true;
								break;
							}
						}
						if(found)
						{
							deferred.resolve({found: found});
						}
						else
						{
							deferred.reject({found: found});
						}
					}	
					else
					{
						deferred.reject({found: false});
					}
				}).fail(deferred.reject);
			}
				
			return deferred.promise();
		};

		var subscriberDataForServerCall = function(subscriber)
        {
        	subscriber = subscriber || {};
            var systemDetect = new SystemDetect();
            var data = subscriber;
            var FACEBOOK_APPID = null;

            data.appId = subscriber.appId || self.appId;
            data.deviceId = getDeviceId();
            data.applicationId = "SHOUT_HTML5_EMBEDDED";
            data.applicationVersion = "4.9";
            data.deviceModel = systemDetect.browser || systemDetect.os;
            data.deviceName = systemDetect.os || systemDetect.browser || "BROWSER";
            data.deviceVersion = systemDetect.version || null;
            data.deviceOsName = systemDetect.os || systemDetect.mobileDevice || null;
            data.deviceOsType = systemDetect.os || systemDetect.browser || null;

            if(subscriber.email)
            {
                data.email = subscriber.email;
                data.email = data.email.toLowerCase();
            }

            if(subscriber.emailHash)
                data.emailHash = subscriber.emailHash;
            else if(data.email || data.facebookId)
            {
                data.emailHash = Section.getSha256Hash(data.email.toLowerCase() || data.facebookId);
            }

            if(subscriber.emailSignature)
                data.emailSignature = subscriber.emailSignature;

            var name = subscriber.nickName || subscriber.username || subscriber.nickname;
            if( ( name && name.indexOf("RMA") === 0) || ( name && name.indexOf("shout") !== -1 ) )
	        {
	            name = null; // TODO Maybe delete?
	            name = null;
	        }
            if(!name && data.email)
	        {
	            name = data.email.split("@")[0];
	        }
            data.username = name;
           	data.nickname = name;
           	data.nickName = name;
           	

            if(subscriber.password)
            {
                data.passwd = subscriber.password;
            }
            if(subscriber.accessToken && subscriber.facebookId)
            {
                data.fbAccessToken = subscriber.accessToken;

                if(self.appId === "MyMadrid" && self.appMode === "EMBEDDED")
                {
                    FACEBOOK_APPID = 233169016830819;
                }
                else
                {
                    FACEBOOK_APPID = 110374572379171;
                }

                data.facebookAppId = FACEBOOK_APPID || null;
            }

            if(subscriber.countryCode)
                data.fromCountryCode = subscriber.countryCode;

            if(subscriber.countryCode)
                data.shipCountryCode = subscriber.countryCode;
            return data;
        };

        /*
	        email
		    phone
		    nickName
		    fullName
		    firstName
		    lastName
		    password
		    photoUrl
		    photoUrlSmall (thumbnail)
		    photoUrlLarge (thumbnail)
		    birthDate
		    languageCode
		    countryCode
		    paypalEmail (optional)
		    homeAddrLine1 (optional)
		    homeAddrLine2 (optional; ignored if homeAddrLine1 is not provided)
		    homeAddrCity (required only if homeAddrLine1 is given)
		    homeAddrPostalCode (required only if homeAddrLine1 is given)
		    homeAddrSateProvince (required only if homeAddrLine1 is given)
		    homeAddrCountryCode (required only if homeAddrLine1 is given)
        */
        this.updateAndGetCommonSubscriber = function(data)
        {
        	var deferred = new Deferred();
        	data.appId = data.appId || self.appId;
        	if(data.username)
        	{
        		data.nickName = data.username;	
        	}
        	data.email = data.email || self.getShoutSubscriber().email;
        	updateAndGetCommonSubscriber.serverCall(data).done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(function(response)
        			{
        				deferred.resolve(response);
        			}).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred;
        };







         /**
		 * Used by clients to fetch secondary subscriber info.
		 *
		 * @memberof ShoutPortal
		 * @method getSubscriberEmailsAndAddresses
		 * @return {Object} Deferred instance
		 */
        this.getSubscriberEmailsAndAddresses = function(data)
        {
        	var deferred = new Deferred();
        	getSubscriberEmailsAndAddresses.serverCall().done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(deferred.resolve).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred.promise();
        };

        /**
		 * Used by clients to fetch Subscriber Stats.
		 *
		 * @memberof ShoutPortal
		 * @method getSubscriberStats
		 * @return {Object} Deferred instance
		 */
        this.getSubscriberStats = function()
        {
        	var deferred = new Deferred();
        	getSubscriberStats.serverCall().done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(function(response){
        				if(response.stats)
        				{
        					deferred.resolve(response.stats);
        				}
        				else
        				{
        					deferred.reject(response);
        				}
        				
        			}).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred;
        };

        /**
		 * Used by clients to fetch Subscriber Badges.
		 *
		 * @memberof ShoutPortal
		 * @method getGameBadges
		 * @return {Object} Deferred instance
		 */
        this.getGameBadges = function()
        {
        	var deferred = new Deferred();
        	getGameBadges.serverCall().done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(deferred.resolve).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred;
        };









        /**
		 * Used by clients to fetch an encrypted subscriber payload for delivery to a foreign host.
		 * Depecated use loginAndGetCommonSubscriber
		 *
		 * @memberof ShoutPortal
		 * @return {Object} Deferred instance
		 */
        this.getCommonSubscriber = function(data)
        {
        	log.warn("ShoutPortal.getCommonSubscriber");
        	var deferred = new Deferred();
        	getCommonSubscriber.serverCall().done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(deferred.resolve).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred.promise();
        };

        /**
		 * Used by host systems to delivery a common subscriber object to a foreign host for the purposes of synchronizing subscribers.
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON of subscriber object
		 * @return {Object} Deferred instance
		 */
        this.setCommonSubscriber = function(data)
        {
        	var deferred = new Deferred();
        	setCommonSubscriber.serverCall(data).done(deferred.resolve).fail(deferred.reject);
        	return deferred.promise();
        };

        /*
		 * Used by clients to fetch a list of notifications
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with toWds, status, startDate, and endDate variables
		 * @return {Object} Deferred instance
		 */
        this.getNotifications = function(data)
        {
        	var deferred = new Deferred();
        	getNotifications.serverCall(data).done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			self.getResponse(result).done(function(response)
        			{
        				deferred.resolve(response);
        			}).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
        	}).fail(deferred.reject);
        	return deferred.promise();
        };





        /**
		 * Logs user in with email and password 
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with email and password variables
		 * @return {Object} Deferred instance resolves subscriber and common subscriber payload 
		 */
        this.loginAndGetCommonSubscriber = function(data)
        {
        	var deferred = new Deferred();
			if(!srd)
			{
				console.log("NoSRD");
				window.setTimeout(function()
				{
					self.loginAndGetCommonSubscriber(data).done(deferred.resolve).fail(deferred.reject);
				}, 250)
			}
			else if(data.email && data.password)
			{
				if(!data.dontHash)
				{
					data.password = loginAndGetCommonSubscriber.getSha256Hash(data.password);
				}
				
				loginAndGetCommonSubscriber.serverCall(subscriberDataForServerCall(data)).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
	        			// window.setTimeout(function()
		        		// {
		        			self.getResponse(result).done(function(response)
		        			{
		        				if(response.success === true && response.sessionKey)
		        				{
		        					response.subscriber.sessionKey = response.sessionKey;
		        					self.subscriberDone(response.subscriber);
		        					deferred.resolve(response);
		        				}
		        				else
		        				{
		        					deferred.reject(response);
		        				}
		        			}).fail(function(errorObj){
		        				getStadium(data).done(function(result)
								{
									deferred.reject(errorObj);
								}).fail(function(stadiumErrorObj)
								{
									deferred.reject({errorType: "NOT_IN_SYSTEM", message: "You are not in the system, please sign up."});
								});
		        			});
		        		// }, result.estimatedWaitTime);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(function(errorObj)
				{
					debugger;
					deferred.reject(errorObj);
				});
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO", message: "Missing email or password"});
			}

			return deferred.promise();
        };

		/**
		 * Logs user in with email and password
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with email and password variables
		 * @return {Object} Deferred instance
		 */
		this.loginWithPassword = function(data)
		{
			var deferred = new Deferred();
			if(!srd)
			{
				console.log("NoSRD");
				window.setTimeout(function()
				{
					self.loginWithPassword(data).done(deferred.resolve).fail(deferred.reject);
				}, 250)
			}
			else if(data.email && data.password)
			{
				authenticate.serverCall(subscriberDataForServerCall(data)).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO", message: "Missing email or password"});
			}

			return deferred.promise();
		};

		/**
		 * Returns a list of purchasable Items.
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with venue variable, venue is not required.
		 * @return {Object} Deferred instance
		 */
		this.getAllItems = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			data.venue = data.venue || "com.shout.dailymillionaire";
			getAllItems.serverCall(data).done(function(result)
			{
				if(result.estimatedWaitTime)
        		{
        			// window.setTimeout(function()
	        		// {
	        			self.getResponse(result).done(function(response)
	        			{
	        				var items = response.items;
	        				for(var i=0;i<items.length;i++)
	        				{
	        					if(items[i].itemId == 33)
	        					{
	        						items[i].price = "5.99";
	        						items[i].itemPrice[0].formattedPrice = "$5.99";
	        						items[0].itemPrice[0].price = 5.99;
	        						break;
	        					}
	        				}
	        				response.items = items;
	        				deferred.resolve(items);
	        			}).fail(deferred.reject);
	        		// }, result.estimatedWaitTime);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
			}).fail(deferred.reject);
			return deferred.promise();
		};

		/**
		 * Returns a One Time Use Client Token for Braintree.
		 *
		 * @memberof ShoutPortal
		 * @return {Object} Deferred instance
		 */
		this.getClientToken = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			getClientToken.serverCall(data).done(function(result)
			{
				if(result.estimatedWaitTime)
        		{
        			// window.setTimeout(function()
	        		// {
	        			self.getResponse(result).done(function(response)
	        			{
	        				deferred.resolve(response.token);
	        			}).fail(deferred.reject);
	        		// }, result.estimatedWaitTime);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
			}).fail(deferred.reject);
			return deferred.promise();
		};
		/**
		 * Returns a list of purchasable Items.
		 *
		 * @memberof ShoutPortal
		 * @param  {String} itemUuid of item being purchased.
		 * @param  {String} nonce from Braintree.
		 * @return {Object} Deferred instance
		 */
		this.purchaseItem = function(itemUuid, nonce)
		{
			var deferred = new Deferred();
			if(itemUuid && nonce)
			{
				purchaseItem.serverCall({itemUuid: itemUuid, nonce: nonce}).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
	        			// var getResponse = function(retryNum)
	        			// {
	        			// 	var defResponse = new Deferred();
	        			// 	retryNum = retryNum || 0; 
	        				self.getResponse(result).done(function(response)
		        			{
		        				if(response.success === true && response.receipt)
		        				{
		        					deferred.resolve(response.receipt);
		        				}
		        				else
		        				{
		        					deferred.reject(response);
		        				}
		        			}).fail(deferred.reject);
		        		// 	return defResponse.promise();
	        			// };

	        			// window.setTimeout(function()
		        		// {
		        		// 	getResponse(0).done(deferred.resolve).fail(deferred.reject);
		        		// }, result.estimatedWaitTime);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred.promise();
		};
		/**
		 * Returns a list of Receipts from a date.
		 *
		 * @memberof ShoutPortal
		 * @param  {String} subscriberId of Shout Subscriber.
		 * @param  {String} lastKnownPaymentReceiptTimestamp  [[ string, date time string, yyyy-MM-dd HH:mm:ss ]].
		 * @return {Object} Deferred instance
		 */
		this.getStoreReceiptsFromDate = function(lastKnownPaymentReceiptTimestamp)
		{
			var deferred = new Deferred();
			return deferred.promise();
		};

		this.getNotices = function(data)
		{

		};

		this.loginEmbedded = function(data)
		{

		};

		var signupDataPrep = function(data)
		{
			data = subscriberDataForServerCall(data);
			var sendData = {};    
        	var failed = false;
        	sendData = data;
	        
	        // if(data.password)
	        // {
	        // 	data.password = SRD.getSha256Hash(data.password);
	        // }
        
	        for(var item in sendData)
	        {
	            if(!sendData[item])
	            {
	                delete sendData[item];
	            }
	        }
        	delete sendData.gameData;

	        if(!sendData.email) 
	        {
	            if(!data.accessToken && !data.facebookId) // KLUDGE FIND WHY THIS IS NOT SET.
	            {
	                if(facebookAuth && facebookAuth.faceBookLogin() && facebookAuth.faceBookLogin().accessToken)
	                {
	                    sendData.accessToken = facebookAuth.faceBookLogin().accessToken;
	                    sendData.fbAccessToken = facebookAuth.faceBookLogin().accessToken;
	                    sendData.languageCode = facebookAuth.faceBookLogin().languageCode;
	                    sendData.fromCountryCode = facebookAuth.faceBookLogin().fromCountryCode;
	                    sendData.countryCode = facebookAuth.faceBookLogin().fromCountryCode;
	                    sendData.birthday = facebookAuth.faceBookLogin().birthday;
	                    sendData.facebookId = facebookAuth.faceBookLogin().facebookId;
	                    sendData.firstName = facebookAuth.faceBookLogin().firstName;
	                    sendData.lastName = facebookAuth.faceBookLogin().lastName;
	                    sendData.gender = facebookAuth.faceBookLogin().gender;
	                    sendData.locale = facebookAuth.faceBookLogin().locale;
	                    if(serverType === "PRODUCTION")
	                    {
	                        if(self.appId === "MyMadrid" && self.appMode === "EMBEDDED")
	                        {
	                            FACEBOOK_APPID = 233169016830819;
	                        }
	                        else
	                        {
	                            FACEBOOK_APPID = 110374572379171;
	                        }
	                    }
	                    else
	                    {
	                        // 821886847904151
	                        if(qsp.canvasTest)
	                            FACEBOOK_APPID = 821886847904151;
	                        else
	                            FACEBOOK_APPID = 156964854369573;
	                    }
	                    sendData.facebookAppId = FACEBOOK_APPID || null;

	                    self.modelObj().firstName(sendData.firstName);
	                    self.modelObj().lastName(sendData.lastName);
	                    self.modelObj().photoUrl(facebookAuth.faceBookLogin().photoUrl);
	                    self.modelObj().currencyCode(facebookAuth.faceBookLogin().currencyCode);
	                    self.modelObj().languageCode(facebookAuth.faceBookLogin().languageCode);
	                    self.modelObj().accessToken(sendData.accessToken);
	                }
	                else
	                {
	                    failed = true;
	                }
	                
	            }
	        }
	        else
	        {
	            sendData.email = sendData.email.toLowerCase();
	        }

	        if(window.TESTING)
	        {
	            delete sendData.accessToken;
	            delete sendData.fbAccessToken;
	            delete sendData.birthday;
	            delete sendData.facebookId;
	            delete sendData.firstName;
	            delete sendData.lastName;
	            delete sendData.gender;
	            delete sendData.locale;
	        }
	        sendData = failed === true ? false : sendData;
	        return sendData;
		};

		this.signup = function(data, retry)
		{
			var deferred = new Deferred();

        	retry = retry || 0;
        	log.info("SubscriberCall.signUp");

        	sendData = signupDataPrep(data);
        	log.info("SubscriberCall.signUp sendData: {}",sendData);
	        if(sendData)
	        {
	        	Stadium.ticket = true;
	        	self.subscriberDone(sendData);
	            signUpCall.serverCall(sendData).done(function(result)
	            {
	            	signupTicket = result.ticket;
	                log.warn("SubscriberCall.signUp done: "+JSON.stringify(result)+" sendData: {}",sendData);
	                // pollStadium(sendData).done(function(){
	                // 	debugger;
	                	if(sendData.facebookId && sendData.accessToken)
	                	{
	                		// debugger;signup
	                		self.loginWithFacebook(sendData).done(deferred.resolve).fail(deferred.reject);
	                	}// TODO password method too
	                	else if(sendData.email)
	                	{
	                		self.getExternalSubscriber(sendData).done(function(result)
		                	{
		                		log.log("SubscriberCall signup getExternalSubscriber: {}", result);
		                		deferred.resolve(result);
		                	}).fail(function(errorObj)
		                	{
		                		log.log("SubscriberCall signup getExternalSubscriber FAIL : {}", errorObj);
		                		deferred.reject(errorObj);
		                	});
	                	}
	                	else 
	                	{
	                		deferred.reject({errorType: "UnknownLogin"});
		                }
	                // }).fail(deferred.reject);
	                // deferred.resolve(result.ticket);
	                	
	            }).fail(function(errorObj)
	            {
	            	debugger;
	                log.error("SubscriberCall.signUp fail: "+JSON.stringify(errorObj));
	                retry++;
	                if(retry <= 3)
	                {
	                    self.signUp(sendData, retry).done(deferred.resolve).fail(deferred.reject);
	                }
	                else
	                {
	                    log.error("SubscriberCall.signUp fail retry: "+retry);
	                    deferred.reject(false);
	                }
	            });
	        }
	        else
	        {
	            log.error("SubscriberCall.signUp failed: Not enough info for the call - sendData: {}",sendData);
	            deferred.reject();
	        }


			return deferred.promise();
		};

		var pollStadium = function(data, retry)
		{
			var deferred = new Deferred();
			retry = retry || 1;
			window.setTimeout(function()
			{
				getStadium(data).done(deferred.resolve).fail(function(errorObj){
					if(!Stadium.ticket)
					{
						self.signup(data);
					}
					if(retry < 10) // 20
					{
						log.info("ShoutPortal pollStadium retry: "+retry);
						retry++;
						pollStadium(data, retry);
					}
					else
					{
						debugger;
						deferred.reject(errorObj);
					}
					
				});
			}, 100*retry);

			return deferred.promise();
		};
		var randomString = function(length, chars) {
			length = length || 64
			chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
		    var result = '';
		    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		    return result;
		};


		var create64BitSalt = function(){
			var numbers = new Array(64);
			for (var i = 0; i < numbers.length; i++) {
				numbers[i] = randomIntInc(32,126);
			}
			var output = "";
			for (var i = 0; i < numbers.length; i++) {
				output += String.fromCharCode(numbers[i]);
			}
			output = output.toLowerCase();
    		return output;
		};

		var randomIntInc = function (low, high) {
    		return Math.floor(Math.random() * (high - low + 1) + low);
		};

		var scryptPW = function(password)
		{
			var deferred = new Deferred();
			var salt = create64BitSalt();
			// var test_salt = atob("OMUy4QHtv1VhSC1JVl+i8/DMjVFBT1prGZR47ZXgWlDdogRxehDZCg5GGvsTPLBRZjLQhqYnxre+Y5YvQXrD5A==");
			var logN = 15;
			var r = 8;
			var dkLen = 64;
			var callback = function(result)
			{
				console.log("/zRkzsqnMd9B7BO2A2PKD/8RlUOoAphDeBY+jDLwUR0a+MbJgURIVUtIJxCVkW+GDfduUhDEHIhyshHqU2HQ8Q==");
				var params = ((logN << 16) | (r << 8) | 1).toString(16);
				var response = "$s0$" + params + "$" + btoa(salt) + "$" + result;
				var obj = {
					hash: hash,
					response: response
				};
				deferred.resolve(obj);
			};
			var encoding = "base64";
			var hash = SRD.getSha256Hash(password);
			scrypt(hash, salt, logN, r, dkLen, 0, callback, encoding);
			return deferred.promise();
		};

		// window.setTimeout(function() // -- Signup Test
		// {
		// 	self.signupAndGetCommonSubscriber({email: "bob08@fracturednations.com", username: "bob08", password: "Leeds1", languageCode: "en", countryCode: "US"}).done(function(result)
		// 	{
		// 		debugger;
		// 	}).fail(function(errorObj)
		// 	{
		// 		debugger;
		// 	});
		// }, 1000);

		/*
		// fullName
			// nickName R
			// password SHA256 R
			// email R
			// phone
			// photoUrl
			// birthDate ISO 8601 R
			// languageCode R
			// countryCode R
		*/
		this.signupAndGetCommonSubscriber = function(data, retry)
		{
			var deferred = new Deferred();
			if(data.password)
			{
				Stadium.ticket = true;
				scryptPW(data.password).done(function(result)
				{
					data.password = result.response;
					var sendData = signupDataPrep(data);
					retry = retry || 0;
					signupAndGetCommonSubscriber.serverCall(data).done(function(result)
					{
						if(result.estimatedWaitTime)
		        		{
	        				self.getResponse(result).done(function(response)
		        			{
		        				if(response.success === true && response.sessionKey)
		        				{
		        					response.subscriber.sessionKey = response.sessionKey;
		        					self.subscriberDone(response.subscriber);
		        					deferred.resolve(response);
		        				}
		        				else
		        				{
		        					deferred.reject(response);
		        				}

		        			}).fail(deferred.reject);
		        		}
		        		else
		        		{
		        			deferred.reject(result);
		        		}
					}).fail(function(errorObj){
						if(retry < 10)
						{
							debugger;
							retry++;
							window.setTimeout(function()
							{
								self.signupAndGetCommonSubscriber(data, retry);
							}, 100 * retry);
							
						}
						else
						{
							debugger;
							deferred.reject(errorObj);
						}
						
					});
				});
					
			}
			else
			{
				debugger;
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
				

			return deferred.promise();
		};

		/*
			toWds
			email: if isOverride AND requester is ADMIN email is target subscriber, else target is the verified session subscriber.
			oldPassword: SHA256 of existing password
			newPassword: SHA256 *AND* sCrypted version of new password
			isOverride: Boolean, ADMIN role can reset password of any user. If isOverride == true, the subscriber associated with the email will have their password set to "password" (SHA256+sCrypted)
		*/
		this.changePassword = function(data)
		{
			var deferred = new Deferred();
			if(data.email && data.oldPassword && data.newPassword)
			{
				data.oldPassword = SRD.getSha256Hash(data.oldPassword);
				scryptPW(data.newPassword).done(function(sCrypted)
				{
					data.newPassword = sCrypted.response;
					changePassword.serverCall(data).done(function(result)
					{
						debugger;
					}).fail(function(errorObj)
					{
						debugger;
					});
				});
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
				
			return deferred.promise();
		};

		// 
		this.otherPublicProfileData = {};
		var getPublicProfileDeferred = {};
		this.getPublicProfile = function(subscriberId, forceIt)
		{
			var deferred = new Deferred();
			var processSubscriber = function(result)
			{
				result.subscriberId = subscriberId;
				self.otherPublicProfileData[subscriberId] = result;
				deferred.resolve(result);
			};
			forceIt = forceIt || false;
			if(!subscriberId)
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			else if(self.otherPublicProfileData[subscriberId] && !forceIt)
			{
				deferred.resolve(self.otherPublicProfileData[subscriberId]);
			}
			else if(getPublicProfileDeferred[subscriberId] && !forceIt)
			{
				getPublicProfileDeferred[subscriberId].done(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				getPublicProfileDeferred[subscriberId] = deferred;
				if(forceIt)
				{
					getPublicProfile.publish({subscriberId: subscriberId}).done(function(result)
					{
						if(result.estimatedWaitTime)
						{
							window.setTimeout(function()
							{
								getPublicProfile.serverCall({subscriberId: subscriberId}).done(processSubscriber).fail(deferred.reject);
							}, result.estimatedWaitTime);
						}
						else
						{
							deferred.reject(result);
						}
					}).fail(deferred.reject);
				}
				else
				{
					getPublicProfile.serverCall({subscriberId: subscriberId}).done(processSubscriber).fail(deferred.reject);
				}
				
			}
				
			return deferred.promise();
		};

		getPublicProfile.publish = function(data)
		{
			log.warn("ShoutPortal.getPublicProfile.publish");
			var deferred = new Deferred();
			if(!getPublicProfile.published || getPublicProfile.published + 2000 < (new Date()).getTime())
			{
				getPublicProfile.published = (new Date()).getTime();
				self.publish.serverCall({docType:"subPubProfile", subId: data.subscriberId}).fail(deferred.reject).done(deferred.resolve);
			}
			else
			{
				deferred.resolve();
			}
			
			return deferred.promise();
		};

		this.powerUps = null;
		this.getPowerups = function(forceIt)
		{
			var deferred = new Deferred();
			forceIt = forceIt || false;
			if(self.powerUps && !forceIt)
			{
				deferred.resolve(self.powerUps);
			}
			else
			{
				getPowerups.serverCall({}).done(function(result)
				{
					self.powerUps = result;
					deferred.resolve(result);
				}).fail(deferred.reject);

				if(!getPowerups.published || ( getPowerups.published && getPowerups.published + 2000 < (new Date()).getTime() ) )
				{
					getPowerups.publish({}).done(function(result)
					{
						if(result.estimatedWaitTime)
						{
							window.setTimeout(function(){
								getPowerups.serverCall({}).done(function(result)
								{
									self.powerUps = result;
								});

							}, result.estimatedWaitTime);
						}
					});
				}
					
			}
				
			return deferred;
		};
		getPowerups.publish = function(data)
		{
			var deferred = new Deferred();
			if(!getPowerups.published || getPowerups.published + 2000 < (new Date()).getTime())
			{
				getPowerups.published = (new Date()).getTime();
				self.publish.serverCall({docType:"powerups"}).fail(deferred.reject).done(deferred.resolve);
			}
			else
			{
				deferred.resolve();
			}
			
			return deferred;
		};

		this.getSubscriberOneOnOnes = function(data)
		{
			var deferred = new Deferred();
			if(data.ccId)
			{
				data.subscriberId = shoutSubscriber.subscriberId;
				getSubscriberOneOnOnes.serverCall(data).done(function(result){
					if(result.oneOnOnes)
					{
						deferred.resolve(result.oneOnOnes);
					}
					else
					{
						deferred.reject(result);
					}
					
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.getEvent = function(data)
		{
			var deferred = new Deferred();
			if(data.eventId)
			{
				getEvent.serverCall(data).done(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.getEventPlaces = function(data)
		{
			var deferred = new Deferred();
			if(data.eventId)
			{
				getEventPlaces.serverCall(data).done(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.getCampaign = function(data)
		{
			var deferred = new Deferred();
			if(data.campaignId)
			{
				getCampaign.serverCall(data).done(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		}
		this.getContests = function(data)
		{
			var deferred = new Deferred();
			if(data.eventId)
			{
				getContests.serverCall(data).done(function(result)
				{
					deferred.resolve(result.contests || []);
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};
		/*
		this.WDS = "USED_POWER_UPS";
		this.PUBLISH = "INITIATE_PUBLISH_POWERUPS_USAGE_COUNTS";
		this.serverUri[this.WDS] = function(data)
		{
		    var hash = self.subscriber().emailHash();
		    return "/" + hash + "/" + data.eventId + "/powerups_usage_counts.json";
		};
		this.serverUri[this.PUBLISH] = "/publish";
		*/
		this.getUsedPowerups = function(data, forceIt)
		{
			var deferred = new Deferred();
			forceIt = forceIt || false;
			if(data.eventId)
			{
				if(forceIt || !getUsedPowerups.published || ( getUsedPowerups.published && getUsedPowerups.published + 120000 < (new Date()).getTime() ) )
				{
					getUsedPowerups.publish(data).done(function(result)
					{
						if(result.estimatedWaitTime)
						{
							window.setTimeout(function(){
								getUsedPowerups.serverCall(data).done(deferred.resolve).fail(deferred.reject);
							}, result.estimatedWaitTime);
						}
						else
						{
							deferred.reject(result);
						}
					}).fail(deferred.reject);
				}
				else
				{
					getUsedPowerups.serverCall(data).done(deferred.resolve).fail(deferred.reject);
				}
					
			}
			return deferred;
		};
		getUsedPowerups.publish = function(data)
		{
			var deferred = new Deferred();
			getUsedPowerups.published = (new Date()).getTime();
			data.docType = "powerupsUsageCounts";
			self.publish.serverCall(data).fail(deferred.reject).done(deferred.resolve);
			return deferred;
		};

		/*
			// this.serverUri[this.ANSWERS] = "/game/getAnswersForGame";
			// {gameId: eventObj.eventId, subscriberId:self.subscriber().subscriberId()}
		*/
		this.getAnswersForGame = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			data.subscriberId = shoutSubscriber.subscriberId;
			if(data.gameId)
			{
				getAnswersForGame.serverCall(data).done(function(result)
				{
					if(result.answers)
					{
						deferred.resolve(result.answers);
					}
					else
					{
						deferred.reject(result);
					}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		/*
			this.SYNC = "leaderboard";
			this.serverUri[this.SYNC] = function(data)
			{
				return "/event/leaderboard/"+data.eventId;
			};
		*/
		this.getLeaderboard = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			if(data.eventId)
			{
				getLeaderboard.serverCall(data).done(function(result)
				{
					if(result && result.leaders && result.leaders.leaderboard)
					{
						deferred.resolve(result.leaders.leaderboard);
					}
					else
					{
						deferred.reject(result);
					}
					
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.getShoutOuts = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			if(data.eventId)
			{
				getShoutOuts.serverCall(data).done(function(result)
				{
					if(result && result.entries)
					{
						deferred.resolve(result.entries);
					}
					else
					{
						deferred.reject(result);
					}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.sendChangePasswordEmail = function(email)
		{
			var deferred = new Deferred();
			if(email)
			{
				sendChangePasswordEmail.serverCall({email: email}).done(function(result)
				{
					deferred.resolve(result);
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.recordGamePayout = function(data)
		{
			var deferred = new Deferred();
			debugger;
			if(data.user_winnings && data.payload)
			{
				data.user_winnings = JSON.stringify(data.user_winnings);
				data.payload = JSON.stringify(data.payload);
				recordGamePayout.serverCall(data).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
        				self.getResponse(result).done(function(response)
	        			{
	        				debugger;
	        				if(response.success === true)
	        				{
	        					deferred.resolve(response);
	        				}
	        				else
	        				{
	        					deferred.reject(response);
	        				}
	        			}).fail(deferred.reject);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.getGamePayouts = function()
		{
			var deferred = new Deferred();
			getGamePayouts.serverCall().done(function(result)
			{
				if(result.estimatedWaitTime)
        		{
    				self.getResponse(result).done(function(response)
        			{
        				if(response.success === true && response.payouts)
        				{
        					deferred.resolve(response.payouts);
        				}
        				else
        				{
        					deferred.reject(response);
        				}
        			}).fail(deferred.reject);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
			}).fail(deferred.reject);
			return deferred;
		};

		this.redeemGamePayout = function(data)
		{
			var deferred = new Deferred();
			if(data.payoutId)
			{
				redeemGamePayout.serverCall(data).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
        				self.getResponse(result).done(function(response)
	        			{
	        				if(response.success === true && response.payouts)
	        				{
	        					deferred.resolve(response.payouts);
	        				}
	        				else
	        				{
	        					deferred.reject(response);
	        				}
	        			}).fail(deferred.reject);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred;
		};

		this.subscriberInfo = function()
		{
			var deferred = new Deferred();
			if(!srd)
			{
				window.setTimeout(function()
				{
					self.subscriberInfo().done(deferred.resolve).fail(deferred.reject);
				}, 100);
			}
			else
			{
				subscriberInfo.serverCall().done(deferred.resolve).fail(deferred.reject);
			}	
			return deferred;
		};

		this.getSubscriberCCResults = function(data, forceIt)
		{
			var deferred = new Deferred();
			forceIt = forceIt || false;
			if(data.eventId)
			{
				if(forceIt || !getSubscriberCCResults.published )
				{
					getSubscriberCCResults.publish(data).done(function(result)
					{
						if(result.estimatedWaitTime)
						{
							window.setTimeout(function(){
								getSubscriberCCResults.serverCall(data).done(deferred.resolve).fail(deferred.reject);
							}, result.estimatedWaitTime);
						}
						else
						{
							deferred.reject(result);
						}
					}).fail(deferred.reject);
				}
				else
				{
					getSubscriberCCResults.serverCall(data).done(deferred.resolve).fail(deferred.reject);
				}
					
			}
			return deferred;
		};
		getSubscriberCCResults.publish = function(data)
		{
			var deferred = new Deferred();
			getSubscriberCCResults.published = (new Date()).getTime();
			data.docType = "subscriberCcResults";
			self.publish.serverCall(data).fail(deferred.reject).done(deferred.resolve);
			return deferred;
		};

		this.powerupReservePowerup = function(data)
		{
			debugger;
		};

		var questionAnswerPercentages = {};
		this.getQuestionAnswerPercentages = function(data)
		{
			var deferred = new Deferred();
			var now = (new Date()).getTime();
			var fanCheckKeepFresh = 5000;
			if(!getQuestionAnswerPercentages.published || getQuestionAnswerPercentages.published + fanCheckKeepFresh < (new Date()).getTime())
			{
				getQuestionAnswerPercentages.published = (new Date()).getTime();
				questionAnswerPercentages[data.questionId] = getQuestionAnswerPercentages.serverCall(data).done(deferred.resolve).fail(deferred.reject);
			}
			else if(questionAnswerPercentages[data.questionId])
			{
				if(questionAnswerPercentages[data.questionId].status() === "resolved")
				{
					deferred.resolve(questionAnswerPercentages[data.questionId].value[0]);
				}
				else if(questionAnswerPercentages[data.questionId].status() === "rejected")
				{
					deferred.reject(questionAnswerPercentages[data.questionId].value[0]);
				}
				else
				{
					debugger;
					questionAnswerPercentages[data.questionId].done(deferred.resolve);
				}
				
			}
			else
			{
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		
		this.addAnswer = function(answerData)
	    {
	    	var deferred = new Deferred();
	    	log.info("ShoutPortal.addAnswer: {}", answerData);
	        addAnswer.serverCall(answerData).done(deferred.resolve).fail(function(errorObj)
	        {
	        	log.warn("ShoutPortal addAnswer Failed: "+JSON.stringify(errorObj)+ " answerData: {}", answerData);
		       	deferred.reject(errorObj);
	        });
	        return deferred;
	    };



		var SRDcron = new Cron(180000, SRD.serverCall);
		SRDcron.start();
	};

	if ( typeof exports !== "undefined" ) {
	    module.exports = ShoutPortal;
	}
	else if ( typeof define === "function" ) {
	    define("com.component.ShoutPortal", ShoutPortal);
	}
	else {
	    window.ShoutPortal = ShoutPortal;
	}
//# sourceURL=/modules/com/component/ShoutPortal.js
