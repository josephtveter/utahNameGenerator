/*
* BaseCallModel
* 
* INTENT:
*
* CallModel objects group all the calls that focus on one Model Object into one file.  This is so each file can focus on updating and maintaining the observable Model Object that is accessable from the dataModel.  Flash Vote has 4 call types, PUBLISH, RESPONSE_JSON, WDS, and SYNC.  Most methods are designed to be overridden on each callModel if needed.  
*
* SYNC calls should call serverCall(requestType, data).
* PUBLISH calls should call publish(data, requestType). If requestType is not set it will attempt to use baseObj.PUBLISH.
* WDS calls should call getWDS(params, requestType). If requestType is not set it will attempt to use baseObj.WDS.
* RESPONSE_JSON is built into the publish call cycle.  It will be called after every publish call.
*


The Model Object are used for the result of the call that is placed in the modelObj that will be accessable from the DataModel.   The orgional intent of this was REST service that was interfacing with my PHP CRUD file in my game I will never finish.  I have not removed all the functions from it yet, so there are still some evolutionary dead ends lurking about.
*
* TODO - Integrate ErrorHandler
* TODO - Integrate LawnChair Localstore 
*
* From Scotts email these are the 3 server patterns that this will handle
*
Case 1: A global server-maintained document (or a private server maintained document):
        examples: list of country codes/phone prefixes, promoted votes, popular votes, my feed, vote/votecomments/voteanswers, etc.

        WDS call

Case 2: A global document that’s not server maintained:
        examples: public profile

        WDS call
        if not found (404), or not fresh (older than 1 hour):
                Publish call
                wait for response
                WDS call
        else (found and fresh)
                just use it

Case 3: A private document of yours that doesn’t change often
        examples: my preferences, my notifications, my contacts who also have vote, etc..

                Publish call
                wait for response
                WDS call

*
* method FLOW
* Case 1:
- getWDS(params, requestType)
	- serverCall(requestType, data)
		- done
			- if update method
				- update(result)
			- no update method
				- modelObj(result)
		- fail
			- handleWDSFail (errorObj, data, retry)
				- reject(errorObj) Case 1 does not have a client PUBLISH call

* Case 2:
- getWDS(params, requestType)
	- serverCall(requestType, data)
		- done
			- if update method
				- update(result)
			- no update method
				- modelObj(result)
		- fail
			- handleWDSFail (errorObj, data, retry)
				- if published recently
					- reject(errorObj) 
				- if not published recently
					- publish(data, requestType, retry)
						- serverCall(requestType, data)
							- done
								- getResponseJson(response, requestType, params)
									- serverCall(requestType, data)
										- done
											- getWDS(params, requestType) --- start over ---
										- fail
											- reject - TODO RETRY
							- fail
								- reject - TODO RETRY

* Case 3:
	- publish(data, requestType, retry)
		- serverCall(requestType, data)
			- done
				- getResponseJson(response, requestType, params)
					- serverCall(requestType, data)
						- done
							- getWDS(params, requestType)
								- serverCall(requestType, data)
									- done
										- if update method
											- update(result)
										- no update method
											- modelObj(result)
						- fail
							- reject - TODO RETRY
			- fail
				- reject - TODO RETRY

*
* CallModel Example

// LiveVotes
var BaseModel = require(["com.component.BaseCallModel"]);

var MyNewCall = function(srd)
{
	var self = this;
	this.srd = srd;
	BaseModel.decorate(this);

	this.update = function(result) // if you don't have a this.update it will stick the result of self.WDS on self.modelObj;
	{
		var obj = new Obj(result);
		self.modelObj(obj);
	};

    this.PUBLISH = "publishMyNewCall";
    this.WDS = "myNewCall";
    this.SOME_SYNC_CALL = "someSyncCall";

	this.serverUri[this.PUBLISH] = "/publishMyNewCall";
	this.serverUri[this.WDS] = function(params)
	{
		return "/myNewCall.json";
	};
	this.serverUri[this.SOME_SYNC_CALL] = "/someSyncCall";
};

module.exports = MyNewCall;

*/







// var things = {};
// things.url = "http://wds-origin1.flash.vote/e5b4b361-dab7-43e9-8a8a-605e89d052d4/vote.json";
// things.headers = {};
// things.headers.stuff = "junk";
// things.headers.this = "that";
// var call = Ajax(things);
// call.done(function(result)
// {
// 	debugger;
// });
// call.fail(function(errorObj)
// {
// 	debugger;
// });

var BaseCallModel = function()
{

};
BaseCallModel.decorate = function(baseObj, logout, subscriber)
{
	var Deferred = require("Deferred");
	var Ajax = require("ajax");
	var Util = require("com.component.Util");
	var ko = require("ko");
	var CryptoJS = require("CryptoJS");
	var Long = require("Long");

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
	// End Helper functions

	if(subscriber)
	{
		baseObj.subscriber = subscriber;
	}


	baseObj.logout = logout || function(){};
	baseObj.modelObj = ko.observable(); // Resulting observable Object
	baseObj.localStore = {}; // TODO NEED TO CHECK STORAGE BEFORE WDS
	baseObj.srd = null; // SHOUT ROUTING DOCUMENT
	baseObj.primaryId = null; // NOTE: I A USING THIS?
	baseObj.emailSha256Hash = null; // SHOULD I JUST USE THE SUBSCRIBER?

	// defaults	
	baseObj.DEFAULT_dataType = "json";
	baseObj.DEFAULT_cache = true; 
   	// baseObj.DEFAULT_generateUrl = false; // DEPRECATED
   	baseObj.DEFAULT_method = "GET";
   	baseObj.DEFAULT_timeout = 10000; // 10000 TODO UNDO
   	baseObj.DEFAULT_contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
   	baseObj.DEFAULT_dontSendRequestData = true;
   	baseObj.DEFAULT_isSsl = false;
   	baseObj.DEFAULT_actionType = "default";
   	baseObj.DEFAULT_getDontSendRequestParams = false;
	
	// URI ARRAY
	baseObj.serverUri = [];
	// base Requests

	baseObj.SRD = "SRD";
	baseObj.RESPONSE_JSON = "responseJson";
	//Global
	baseObj.serverUri[baseObj.RESPONSE_JSON] = function(params)
	{
		return "/"+params.ticket+"/response.json";
	};
	
	// Flags and timers for published
	baseObj.published = null; // DATE OF LAST PUBLISH
	baseObj.keepFresh = 60000 * 15;


	baseObj.create = function(type, params)
	{
		var deferred = new Deferred();
		return deferred;
	};

	baseObj.read = function(params, type)
	{
		var deferred = new Deferred();
		if(!type && !baseObj.WDS)
		{
			deferred.reject({errorType: "NO_REQUEST_TYPE"});
		}
		else 
		{
			if(!type && baseObj.WDS)
				type = baseObj.WDS;

			baseObj.get(params,null,type).done(function(result)
			{
				deferred.resolve(result);
			}).fail(function(errorObj)
			{
				deferred.reject(errorObj);
			});
		}
		return deferred;
	};

	baseObj.delete = function(type, params)
	{
		var deferred = new Deferred();
		return deferred;
	};

	baseObj.get = function(params, sync, requestType)
	{
		var deferred = new Deferred();
		var stored = null;
		sync = sync || false;
		if(!requestType && !baseObj.WDS)
		{
			deferred.reject({errorType: "NO_REQUEST_TYPE"});
		}
		else
		{
			requestType = requestType || baseObj.WDS;
			
			// TODO BUILD AND CHECK LOCALSTORE, IT SHOULD BE STORED IN AN OBJECT FROM lawnchair, perhaps open the store to unpack the contents so they are ready.
			var instorage = false;
			if(instorage)
			{
				// RESOLVE THE CALL WITH STORAGE DATA
			}
			else if(requestType === baseObj.WDS)
			{
				baseObj.getWDS(params, requestType).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			}
			else
			{
				baseObj.serverCall(requestType, params).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			}

			if(sync)
			{
				baseObj.publish();// Fire and forget
			}
		}
		return deferred;
	};
	// baseObj.modelObj.get = baseObj.get; // TODO - SEE IF THIS IS A GOOD IDEA

	baseObj.set = function()
	{

	};

	baseObj.handlePublishFail = function(errorObj, params, retry)
	{
		var deferred = new Deferred();
		deferred.reject(errorObj);
		return deferred;
	};

	baseObj.publish = function(data, requestType, retry)
	{
		var deferred = new Deferred();
		requestType = requestType || baseObj.PUBLISH;
		if(requestType)
		{
			retry = retry || 0;
			baseObj.published = (new Date()).getTime();
			baseObj.serverCall(requestType, data).done(function(result)
			{
				var wdsData = data;
				window.setTimeout(function()
				{
					baseObj.getWDS(wdsData, baseObj.WDS, "NO_RETRY").done(function(result)
					{
						deferred.resolve(result);
					}).fail(function(errorObj)
					{
						deferred.reject(errorObj);
					});
				}, result.estimatedWaitTime);
			}).fail(function(errorObj)
			{
				// TODO HANDLE FAIL GET RESPONSE DOC
				baseObj.handlePublishFail(errorObj, data, retry+1).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
				// errorObj.errorType = errorObj.errorType || "FAILED_TO_PUBLISH";
				// deferred.reject(errorObj);
			});
		}
		else
		{
			deferred.reject({errorType: "NO_PUBLISH_CALL"});
		}
		return deferred;
	};

	var handleWDSFail = function(requestType, errorObj, data, retry)
	{
		var deferred = new Deferred();
		retry = retry || 0;
		if(baseObj.PUBLISH && (!baseObj.published || (baseObj.published && baseObj.published + baseObj.keepFresh < (new Date()).getTime() ) ) )
		{
			baseObj.publish(data).done(function(result)
			{
				deferred.resolve(result);
			}).fail(function(errorObj)
			{
				deferred.reject(errorObj);
			});// Fire and forget
		}
		else if(errorObj.success === false)
		{
			deferred.reject(errorObj);
		}
		else if(errorObj.errorType)
		{
			deferred.reject(errorObj);
		}
		else
		{
			if(retry < 5)
			{
				retry++;
				window.setTimeout(function(){
					baseObj.getWDS(data, requestType, retry).done(function(result)
					{
						deferred.resolve(result);
					}).fail(function(errorObj)
					{
						deferred.reject(errorObj);
					});
				}, retry*100);
			}
			else
			{
				deferred.reject(errorObj);
			}	
		}
		return deferred;
	};

	var testData = {};
	testData.voteUuid = "12345";
	var goodData = {};
	baseObj.getWDS = function(data, request, retry)
	{
		var deferred = new Deferred();
		retry = retry || 0;
		var requestType = request || baseObj.WDS;
		// if(requestType === "vote") // TODO UNDO TESTING 
		// {
		// 	if(retry === 0)
		// 	{
		// 		goodData = data;
		// 		data = testData;
		// 	}
		// 	else if(retry === 5)
		// 	{
		// 		data = goodData;
		// 	}
		// }
		// log.info("BaseCallModel.getWDS: "+requestType+" retry: "+retry);
		
		if(requestType)
		{
			retry = retry || 0;
			baseObj.serverCall(requestType, data).done(function(result)
			{
				// log.log("BaseCallModel.getWDS: "+requestType+" DONE");
				// TODO STORE LOCAL
				// TODO STORE AS NEW MODEL OBJ or UPDATE
				var subscriber = typeof baseObj.subscriber === "function" ? baseObj.subscriber() : baseObj.subscriber;
				if(subscriber && typeof(result) === "string" && subscriber.encryptKey)
				{
					result = baseObj.decryptSyncDoc(subscriber.encryptKey, result, requestType);
				}
				result = baseObj.deserializeFromServer(result, requestType, data);

				if(requestType === baseObj.WDS || (baseObj.TEMP_WDS && requestType === baseObj.TEMP_WDS))
				{
					if(baseObj.update)
					{
						baseObj.update(result, data);
					}
					else
					{
						baseObj.modelObj(result);
					}
				}
				deferred.resolve(result);
			}).fail(function(errorObj)
			{
				//TODO publish on fail and resubmit request
				log.warn("BaseCallModel.getWDS FAIL: {}", errorObj);
				handleWDSFail(requestType, errorObj, data, retry).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			});
			if(retry !== "NO_RETRY" && baseObj.PUBLISH && (!baseObj.published || (baseObj.published && baseObj.published + baseObj.keepFresh < (new Date()).getTime() ) ) )
			{
				// log.log("BaseCallModel.getWDS publish: "+requestType);
				baseObj.publish(data);// Fire and forget
			}
		}
		else
		{
			deferred.reject({errorType: "NO_WDS_CALL"});
		}
		
		return deferred;
	};

    baseObj.getBaseRequest = function(requestType)
    {
        return Util.getAppProperty("URL.BASE_AJAX");
    };

    baseObj.getSubscriberEmail = function(requestType)
    {
    	return baseObj.primaryId;
    };

    //subscriberEmail
    baseObj.getDomainNameSetForUrl = function(serverObj, actionType, primaryId)
    {
    	var domainNameSets = serverObj.domainNameSets;
        if (Util.isEmpty(domainNameSets))
            return {error: "Did not find domainNameSets for serverClass: " + serverClass};
        
        // If there is no selected domainNameSet or the email changed then reselect one.
        if( primaryId && (Util.isEmpty(serverObj.domainNameSetIndex) || serverObj.subscriberEmail !== primaryId))
        {
            serverObj.subscriberEmail = primaryId;
            
            var selectMethodArr = serverObj.selectMethod.split("%");
            var selectMethod = selectMethodArr[0];
            if (selectMethod !== "sha256")
                return {error: "Unknown selectMethod " + selectMethod + " found while getting url for action : " + actionType};

            var howManyBytesToUse = Util.parseInt(selectMethodArr[1]);
            var byteValueAsLong = getByteValueFromEmailUsingSha256A( baseObj.emailSha256Hash || serverObj.subscriberEmail || serverObj.subscriberFacebookId, howManyBytesToUse);
            
            var lengthOfDomainNameSets = domainNameSets.length;
            var moduloAsLong = byteValueAsLong.modulo(Long.fromNumber(lengthOfDomainNameSets));
            serverObj.domainNameSetIndex = moduloAsLong.toInt();
        }
        else
        {
        	serverObj.domainNameSetIndex = 0;
        }

        // We now have a domain name set index, grab that domain name set.
        var domainNameSet = domainNameSets[serverObj.domainNameSetIndex];
        
        return domainNameSet;
    };


	baseObj.getServerUri = function(requestType, params)
	{
		var host = Util.getAppProperty("URL.HOST");
		// if(requestType === baseObj.SRD)
		// {
		// 	if(window.location.host === "flash.vote")
		// 	{
		// 		host = "static.flash.vote";
		// 	}
		// 	else if(window.location.host.indexOf("dc2") !== -1 && window.location.host.indexOf("shoutgameplay") !== -1)
		// 	{
		// 		host = "dc2-static.shoutgameplay.com";
		// 	}	
		// 	else if(window.location.host.indexOf("dc3") !== -1 && window.location.host.indexOf("shoutgameplay") !== -1)
		// 	{
		// 		host = "dc3-static.shoutgameplay.com";
		// 	}
		// 	else
		// 	{
		// 		host = window.location.host.replace("web", "wds");
		// 	}
		// }
		// else
		// {
		// 	var actionType = baseObj.getActionType(requestType);
		// 	if (!actionType)
	 //            return {errorType: "SRD_FAIL",error: "URL not provided and didn't find action type: " + requestType};

	 //        var serverObj = baseObj.getServerObjectForAction(actionType);
	 //        if (serverObj.error)
	 //        {

	 //            return {errorType: "SRD_FAIL", error: "URL not provided and did not find a server object for the given action type: " + actionType};
	 //        }

	 //        var serverDomainNameSet = baseObj.getDomainNameSetForUrl(serverObj, actionType, baseObj.getSubscriberEmail(requestType));
	 //        if (Util.isEmpty(serverDomainNameSet))
	 //            return {errorType: "SRD_FAIL", error: "URL not provided and didn't get back a server domain name set " + " " + JSON.stringify(params)};

	 //        if (serverDomainNameSet.error)
	 //        {
	 //            serverDomainNameSet.error =  serverDomainNameSet.error + " " + requestType;
	 //            return serverDomainNameSet;
	 //        }
	        
	 //        if (Util.isEmpty(serverObj.domainNameIndex))
	 //            serverObj.domainNameIndex = 0;

	 //        host = serverDomainNameSet[serverObj.domainNameIndex];
	 //        if (!host)
	 //            return {error: "Expected a host for index " + serverObj.domainNameIndex + " of domain name set but didn't find one " + JSON.stringify(params)};
	 //        // else if(actionType === "wds" || actionType === "collector" || actionType === "signup")
		// }
			
            
        return host;
	};

	baseObj.getToWds = function(requestType)
	{
		var rtn = null;
		if(baseObj.srd)
		{
			if(requestType !== baseObj.SRD && requestType !== baseObj.WDS)
			{
				var actionType = "wds";
				var serverObj = baseObj.getServerObjectForAction(actionType);
				var serverDomainNameSet = baseObj.getDomainNameSetForUrl(serverObj, actionType, baseObj.getSubscriberEmail(requestType));
				if (Util.isEmpty(serverObj.domainNameIndex))
		            serverObj.domainNameIndex = 0;

		        rtn =  serverDomainNameSet[serverObj.domainNameIndex];
			}
			else
			{
				rtn = null;
			}

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

	baseObj.generateUrlForRequest = function(requestType, params)
	{
        var host = baseObj.getServerUri(requestType, params);
        if(typeof(host) === "string")
        {
        	var ssl = baseObj.isSsl(requestType, host) === true ? "https://" : "http://";
	        // if(ssl === "https://" && host.indexOf("wds") !== -1 && host.indexOf(":") !== -1)
	        // {
	        // 	var hostArr = host.split(":");
	        // 	if(hostArr.length > 1)
	        // 	{
	        // 		var port = hostArr[1];
		       //  	if (port >= 10000) 
		       //  	{
		       //  		log.log("BaseCallModel.generateUrlForRequest old Port: "+port);
		       //      	var portPrefix = Math.floor(port / 1000) * 1000;
		       //      	var portSuffix = port - (Math.floor(port / 10) * 10);
		       //      	var portHttps = 44 * 10;
		       //      	// map all calls to port 443/https
		       //      	port = portPrefix + portHttps + portSuffix;
		       //      	host = hostArr[0] + ":" +port;
		       //      	// port = 443;
		       //      	log.info("BaseCallModel.generateUrlForRequest New Port: "+port);
		       //  	}
		       //  	else
		       //  	{
		       //  		host = hostArr[0];
		       //  	}
	        // 	}
		        	
	        // }
	        
	        var base = baseObj.getBaseRequest(requestType);
	        var serverUri = typeof(baseObj.serverUri[requestType]) === "function" ? baseObj.serverUri[requestType](params) : baseObj.serverUri[requestType];
	        if(!serverUri)
	        {
	        	log.warn("BaseCallModel.generateUrlForRequest no serverUri");
	        }
			return ssl + host + base + serverUri;
        }
        else
        {
        	debugger;
        	host.errorType = host && host.ErrorType ? host.ErrorType : "BAD_HOST";
        	return host;
        }  
	};

	baseObj.isSsl = function(requestType, host)
	{
		var rtn = false;
		
		if((host && host.indexOf(":") !== -1 && host.indexOf("44") !== -1) || (requestType === baseObj.PUBLISH))
		{
			rtn = true;
		}
		else if(document.location.protocol === "https:")
        {
            rtn = true;
        }
        else
        {
        	rtn = baseObj.DEFAULT_isSsl;
        }
        return rtn;
	};

	baseObj.getActionType = function(type)
	{
	    var result;

	    switch(type)
	    {
	    	case baseObj.PUBLISH:
	    		result = "publish";
	    	break;
	    	case baseObj.WDS:
	    	case baseObj.SRD:
	    	case baseObj.RESPONSE_JSON:
	    		result = "wds";
	    	break;
	        default:
	            result = "default";
	        break;
	    }

	    return result;
	};

	baseObj.getServerObjectForAction = function(actionType)
    {

        var serverClass = baseObj.srd.action[actionType];
        if (!serverClass)
        {
            return {error: "Did not find server class for actionType: " + actionType};
        }
        
        return baseObj.srd.server[serverClass];
    };

    baseObj.getServerMethod = function(requestType)
    {
    	var rtn = baseObj.DEFAULT_method;
    	if(baseObj.PUBLISH === requestType)
    	{
    		rtn = "POST";
    	}
    	else
    	{
    		rtn = "GET";
    	}
    	return rtn;
    };

    baseObj.getRequestContentType = function(requestType)
    {
    	return baseObj.DEFAULT_contentType;
    };

    baseObj.serverReturnType = function(requestType)
    {
    	return baseObj.DEFAULT_dataType;
    };

    baseObj.getTimeout = function(requestType, retry)
    {
    	retry = retry || 0;
    	return baseObj.DEFAULT_timeout;
    };

    baseObj.getDontSendRequestParams = function(requestType)
    {
    	var rtn = baseObj.DEFAULT_getDontSendRequestParams
    	switch(requestType)
    	{
	    	case baseObj.RESPONSE_JSON:
	    	case baseObj.WDS:
	    		rtn = true;
	    	break;
	    }
    	return rtn;
    };

    baseObj.formatRequestDataForServer = function(requestType, params)
    {
    	var data = {};
    	switch(requestType)
    	{
    		case baseObj.PUBLISH:
    			data.toWds = params.toWds;
	    	break;
	    	case baseObj.RESPONSE_JSON:
	    	case baseObj.WDS:
	    	break;
	    	default:
	    		data = params || {};
	    	break;
	    }
    	return data;
    };

    baseObj.getDontSendHeaders = function(requestType)
    {
    	var rtn = false;
    	switch(requestType)
    	{
    		case baseObj.SRD:
    		case baseObj.WDS:
    		case baseObj.RESPONSE_JSON:
    			rtn = true;
    		break;
    		default:
    			rtn = false;
    		break;
    	}
    	return rtn;
    };

    baseObj.getResponseHeaders = function(requestType)
    {
    	var headerParams; 
    	var dontSendHeaderParams = baseObj.getDontSendHeaders(requestType);
           
        if (!dontSendHeaderParams)
        {
        	/*
        		device-type: the type of device: ‘android’, ‘ios’, ‘web’, ...
				device-id: the id of the device using the app
				app-version: current app version
				app-id: current app ID
				auth-token: This is the authentication token retrieved only upon a successful login, will 
			*/

            headerParams = {}; //"Access-Control-Expose-Headers": "Date"
            if(baseObj.subscriber)
            {
            	var subscriber = typeof baseObj.subscriber === "function" ? baseObj.subscriber() : baseObj.subscriber;
                if (subscriber.deviceType)
                {
                	headerParams["device-type"] = subscriber.deviceType;
                }
                if(subscriber.deviceId)
                {
                	headerParams["device-id"] = subscriber.deviceId;
                }
                if(subscriber.auth_token)
                {
                	headerParams["auth-token"] = subscriber.auth_token;
                }
                var appVersion = Util.getAppProperty("APP.APP_VERSION");
                if(appVersion)
                {
                	headerParams["app-version"] = appVersion;
                }
                var appId = Util.getAppProperty("APP.APPLICATION_ID");
                if(appId)
                {
                	headerParams["app-id"] = appId;
                }
                // headers.put("device-type", "android");
// headers.put("app-id", "DailyMil”);
// headers.put("device-id", mDeviceId);           // pulled from the device as: Settings.Secure.ANDROID_ID
// headers.put("app-version", mAppVersion);  // pulled from the manifest, currently: “1.0”


            }
        }
        return headerParams;

    };

    baseObj.getResponseJson = function(result, type, params, retry)
    {
    	var deferred = new Deferred();
    	retry = retry || 0;
    	if(result.estimatedWaitTime && result.ticket) // get Response Json
    	{
    		baseObj.wdsWait = result.estimatedWaitTime;
    		baseObj.waitStart = (new Date()).getTime();
    		window.setTimeout(function()
    		{
    			baseObj.serverCall(baseObj.RESPONSE_JSON, result).done(function(response)
	    		{
	    			if(response.success === true)
	    			{
	    				for(var item in response)
		    			{
		    				result[item] = response[item];
		    			}
	    				deferred.resolve(result, type, params);
	    			}
	    			else
	    			{
	    				deferred.reject(response);
	    			}
	    			
	    			
	    		}).fail(function(errorObj)
	    		{
					log.warn("BaseCallModel.getResponseJson: {}", errorObj);
	    			if(errorObj.status === 404 && retry < baseObj.responseMaxRetry)
	    			{
	    				retry++;
	    				baseObj.getResponseJson(result, type, params, retry).done(function(result)
						{
							deferred.resolve(result);
						}).fail(function(errorObj)
						{
							deferred.reject(errorObj);
						});
	    			}
	    			else
	    			{
	    				errorObj.errorType = "RESPONSE_FAILED";
	    				deferred.reject(errorObj);
	    			}
	    			
	    		});
    		}, baseObj.wdsWait * retry);
    	}
    	else
    	{
    		deferred.resolve(result, type, params);
    	}
    	return deferred;
    };

    baseObj.wdsWait = 10;
    baseObj.responseMaxRetry = 10;
    baseObj.waitStart = (new Date()).getTime();
	baseObj.serverCall = function(requestType, data)
	{
		// log.info("BaseCallModel.serverCall: "+requestType);
		var deferred = new Deferred();
		data = data || {};
		
		var sendRequest = function()
		{
			var toWds = baseObj.getToWds(requestType);
			if(toWds)
				data.toWds = toWds;

			var params = {
				url: baseObj.generateUrlForRequest(requestType, data),
				cache: Util.isNotEmpty(baseObj.cache) ? baseObj.cache : baseObj.DEFAULT_cache,
	            method: baseObj.getServerMethod(requestType),
	            contentType: baseObj.getRequestContentType(requestType),
	            dataType: baseObj.serverReturnType(requestType),
	            timeout: baseObj.getTimeout(requestType, 0),
	            data: baseObj.formatRequestDataForServer(requestType, data),
	            dontSendRequestData: baseObj.getDontSendRequestParams(requestType),
	        	actionType: baseObj.getActionType(requestType),
	            subscriberEmail: baseObj.primaryId,
	            headers: baseObj.getResponseHeaders(requestType),
	            requestType: requestType
			};
			if(data.encryptKey)
				params.encryptKey = data.encryptKey;

			if(data.estimatedWaitTime)
				params.estimatedWaitTime = data.estimatedWaitTime;

			if(data.ticket)
				params.ticket = data.ticket;

			if(typeof(params.url) !== "string")
			{
				log.warn("BaseCallModel url not a String - "+requestType+": {}", params.url);
			}
			else if(params.url.indexOf("undefined") !== -1)
			{
				log.warn("BaseCallModel undefined in url - "+requestType+": {}", data);
			}

			if(params.dontSendRequestData)
			{
				params.data = {};
			}
			//url / params
			//before
			//after
			var type = requestType;
			var retry = 0;
			// encryptKey
			// estimatedWaitTime
			// ticket
			/*
			baseObj.NetworkRequest.sendRequest(params, null, 10, requestType, null).done(function(response){
				log.info("BaseCallModel.serverCall DONE: "+requestType);
				if(requestType === baseObj.PUBLISH)
				{
					baseObj.getResponseJson(response, requestType, params).done(function(result)
					{
						deferred.resolve(result);
					}).fail(function(errorObj)
					{
						deferred.reject(errorObj);
					});
				}
				else
				{
					deferred.resolve(response);
				}
			}).fail(function(responseObj, params, numRetries, requestType, startTime)
			{
				responseObj.requestType = requestType;
				if(responseObj.status === 503) // server maintenance
				{
					responseObj.errorType = "serverMaintenance";
				}
				else if(responseObj.status === 403 && responseObj.success === false && responseObj.forcedUpgrade)// 403 - success === false && forcedUpgrade
				{
					responseObj.errorType = "forcedUpgrade";
				}

				log.info("BaseCallModel.serverCall FAIL - "+requestType+" responseObj: {}", responseObj);
				deferred.reject(responseObj);
			});
			*/
			var done = function(response, headers, requestType)// response, self.requestType, status, url, headers
			{
				// log.info("BaseCallModel.serverCall DONE: "+requestType);
				if(requestType === baseObj.PUBLISH)
				{
					baseObj.getResponseJson(response, requestType, params).done(function(result)
					{
						deferred.resolve(result);
					}).fail(function(errorObj)
					{
						deferred.reject(errorObj);
					});
				}
				else if(response && response.status && response.status === "ERROR")
				{
					deferred.reject(response);
				}
				else
				{
					/*
						message:"Wrong Username / password"
						remember:false
						status:"ERROR"
					*/
					deferred.resolve(response);
				}
			};
			var fail = function(responseObj, requestType, xhr) //response, self.requestType, self.xhr
			{
				responseObj.requestType = requestType;
				if(responseObj.status === 503) // server maintenance
				{
					responseObj.errorType = "serverMaintenance";
					deferred.reject(responseObj);
				}
				else if(responseObj.status === 403 && responseObj.success === false && responseObj.forcedUpgrade)// 403 - success === false && forcedUpgrade
				{
					responseObj.errorType = "forcedUpgrade";
					deferred.reject(responseObj);
				}
				else if(responseObj.status === 401)
				{
					responseObj.errorType = "MUST_AUTHENTICATE";
					baseObj.logout();
					deferred.resolve();
				}
				else
				{
					deferred.reject(responseObj);
				}

				log.info("BaseCallModel.serverCall FAIL - "+requestType+" responseObj: {}", responseObj);
				
			};
			if(params.url && typeof(params.url) === "string")
			{
				// log.log("BaseCallModel url: "+params.url);
				var sendRequest = Ajax(params);
				sendRequest.done(done);
				sendRequest.fail(fail);
			}
			else
			{
				deferred.reject(params.url);
			}
				
		};

		var hasSrd = baseObj.srd && baseObj.srd.action ? true : false;
		if(requestType !== baseObj.SRD && !hasSrd && baseObj.srd)
		{
			var timedOut = false;
			baseObj.srd.modelObj.subscribe(function()
			{
				timedOut = true;
				sendRequest();
			});
			window.setTimeout(function()
			{
				if(!timedOut)
				{
					deferred.reject({errorType: "NO_SRD", success: false});
				}
			}, 5000);
		}
		else
		{
			sendRequest();
		}
		
			
		return deferred;
	};

	baseObj.deserializeFromServer = function(response, type, requestData)
	{
		var result = response;
		var subscriber = typeof baseObj.subscriber === "function" ? baseObj.subscriber() : baseObj.subscriber;
		if(subscriber && baseObj.WDS === type && typeof(response) === "string" && subscriber.encryptKey)
		{
			result = baseObj.decryptSyncDoc(subscriber.encryptKey, result, type);
		}
		//TODO HANDLE ERRORS
		return result;
		// if (ErrorHandler.serverResponseIsError(response) && !response.ticket && !response.events)
	 //    {
	 //        Util.warn("Error in Event deserializeFromServer Type: {}, requestData: {}, : {}", type, requestData, response);
	 //        result = ErrorHandler.getServerError(response, ["failedAuth", "mustResetPassword", "invalidEmail", "emailError", "passwordTooWeak", "invalidCredentials", "emailAlreadyUsed", "missingRequiredParam", "invalidParam", "notAuthenticated"], ["failureMessage"]);
	 //    }
	 //    else
	 //    {

	 //    }
	};

	baseObj.decryptSyncDoc = function(encryptKey, syncDocEncrypted, requestType)
	{
	    var responseWords = CryptoJS.enc.Base64.parse(syncDocEncrypted);
	    var ivWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(0,4));
	    var secretWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(4), responseWords.sigBytes-16);

	    var keyWords = CryptoJS.enc.Hex.parse(baseObj.getSha256Hash(decodeURIComponent(encryptKey)));

	    // See https://code.google.com/p/crypto-js/issues/detail?id=112
	    var decrypted = CryptoJS.AES.decrypt(secretWords.toString(CryptoJS.enc.Base64), keyWords, {iv: ivWords});
	    var strResult = decrypted.toString(CryptoJS.enc.Latin1);
	    var result = null;
	    
	    if (Util.isNotEmpty(strResult))
	    {
	        try
	        {
	            result = JSON.parse(strResult);
	        }
	        catch(ex)
	        {
	            log.error("Subscriber.decryptSyncDoc Unable to parse decrypted JSON for request type " + requestType + ", decryptedData: " + strResult + ", exception - " + ex);
	            result = ErrorHandler.createServerError({errorType: "jsonParseException"});
	        }
	    }

	    return result;
	};

	baseObj.getSha256Hash = function(value)
	{
	    var message = CryptoJS.enc.Utf8.parse(value);
	    var digest = CryptoJS.SHA256(message);
	    return digest.toString();
	};
};

if ( typeof exports !== "undefined" ) {
    module.exports = BaseCallModel;
}
else if ( typeof define === "function" ) {
    define("com.component.BaseCallModel", BaseCallModel);
}
else {
    window.BaseCallModel = BaseCallModel;
}
//# sourceURL=/modules/com/component/BaseCallModel.js