// Updated 4/25/2016
var AppNavModel = function(dataModel)
{
	var self = this;
	var Screens = require("Screens");
	var PageHistory = require("com.component.PageHistory");
	var Transition = require("com.component.Transition");
    var JB = require("jBone");
    var Deferred = require("Deferred");
    var ko = require("ko");

	this.dataModel = dataModel;
	this.screenStatus = ko.observable("INIT");
	this.screenStack = [];
	this.pageHistory = new PageHistory();
    this.currentScreen;
	var transition = new Transition(this.pageHistory, this.screenStatus);

	var screens = new Screens();

    this.closeDialog = function(screenId, params)
    {
    	// log.log("AppNavModel.closeDialog: "+screenId);
        if(!screenId && self.currentScreen.dialog)
        {
            screenId = self.currentScreen.screenId;
        }
        if(screenId)
        {
            var screenObj = getScreenObj({screenId:screenId});
            if(screenObj.instance && screenObj.instance.isOpen())
            {
                transition.closeDialog({screenId: screenId}).done(function()
                {
                    screenObj.instance.events.hide(params);
                    
                });
            }
        }
            
    };

    var SystemDetect = require("com.component.SystemDetect");
    var system = new SystemDetect();
    var windowSize = require("com.component.windowSize");

	this.showScreen = function(screenId, data, transition, onCloseCallbackFn)
    {
    	// log.log("AppNavModel.showScreen: "+screenId);
        
        var deferredResult = new Deferred();
        self.screenStatus("INIT_SCREEN");
        var params = {};
        data = data || {};
        params.screenId = screenId;
        params.data = data;
        params.transition = transition;
        params.onCloseCallbackFn = onCloseCallbackFn;
        loadView(params).done(function(screenObj)
        {
            loadInstanceComplete(screenObj).done(function(result)
            {
                deferredResult.resolve(result);
            });
        }).fail(function(errorObj)
        {
            deferredResult.reject(errorObj);
        });
        
        return deferredResult;
    };



    var loadView = function(params)
    {
    	// log.log("AppNavModel.loadView: "+params.screenId);
        var deferred = new Deferred();
        var screenObj = getScreenObj(params);
        if(screenObj)
        {
            var loadScreenObj = function()
            {
                self.screenStatus("LOADING_SCREEN");
                screenObj.data = params.data;
                screenObj.onCloseCallbackFn = params.onCloseCallbackFn;
                if(screenObj.loaded && screenObj.instance)
                {
                    deferred.resolve(screenObj);
                }
                else
                {
                    screenObj.loaderFn(self).done(function(result)
                    {
                        deferred.resolve(result);
                    }).fail(function(errorObj)
                    {
                        deferred.reject(errorObj);
                    });
                }
            };

            if(!screenObj.dialog)
            {
                // self.showWaitIndicator();
                var ua = document.getElementById("userAgent");
                windowSize(system);
                // ua.innerHTML += "<br>AppNavModel.loadView screenObj.screenId: "+screenObj.screenId;
                loadScreenObj();
            }
            else
            {
                window.setTimeout(loadScreenObj,1); // Let Other Dialogs Close
            }

            
        }
        else
        {
            debugger;
        	log.warn("AppNavModel.loadView NO_SCREEN_OBJ: {}",params);
            deferred.reject({errorType: "NO_SCREEN_OBJ"});
        }
            
        return deferred;
    };

    var getScreenObj = function(params)
    {
    	// log.log("AppNavModel.getScreenObj: "+params.screenId);
        var screenObj = screens[params.screenId];
        // transition
        if(params.transition)
            screenObj.transition = params.transition;

        return screenObj;
    };

    var loadInstanceComplete = function(newScreenObj)
    {
    	// log.log("AppNavModel.loadInstanceComplete: "+newScreenObj.screenId);
        var deferred = new Deferred();
        var instance = newScreenObj.instance;
        instance.onCloseCallbackFn = newScreenObj.onCloseCallbackFn;
        var controller = instance.controller;

        controller.clear();
        instance.events.beforeShow();
        self.screenStatus("LOADING_DATA");
        if(newScreenObj.data)
        {
            controller.setViewData(newScreenObj.data);
        }
        // instance.touch = new Touch(instance.screenId);
        instance.events.show();
        if(!newScreenObj.dialog)
        {
            self.currentScreen = newScreenObj;
        }
        
        self.screenStatus("TRANSITIONING");
        self.transition(newScreenObj).done(function(newScreenObj)
        {
            self.hideWaitIndicator(newScreenObj.screenId);
            instance.events.afterShow();
            deferred.resolve(newScreenObj);
            
        });
        return deferred;
    };

    this.transition = function(newScreenObj)
    {
    	// log.log("AppNavModel.transition: "+newScreenObj.screenId);
        var deferred = new Deferred();
        var lastScreen = null;
        var instance = newScreenObj.instance;
        if(!instance.dialog)
        {
            lastScreen = self.pageHistory.history[self.pageHistory.history.length-1];
            self.screenStack.push(newScreenObj);
        }
        else if(instance.dialog === true)
        {
            self.pageHistory.openDialog(newScreenObj);
        }
        instance.controller.onBeforeTransition();
        transition.transition(newScreenObj, lastScreen).done(function(result)
        {
            deferred.resolve(result);
        });
        return deferred;
    };
    var waitIndicator = ko.observable(); 
    var waitIndicatorActive = false;
    var kmLoaderActive = true;
    this.showWaitIndicator = function(message, message2)
    {
        // if(message)
        // {
        //     log.log("AppNavModel.showWaitIndicator: "+message);
        // }
        var deferred = new Deferred();
        if(waitIndicator() && waitIndicator().instance && waitIndicator().instance.isOpen())
        {
            if(message)
            {
                waitIndicator().instance.controller.message(message);
            }

            if(message2)
            {
                waitIndicator().instance.controller.message2(message2);
            }
            deferred.resolve();
        }
        else if(waitIndicatorActive === false)
        {
            waitIndicatorActive = true;
            waitLoading = true;
            self.showScreen("WaitScreen", {message: message, message2: message2}).done(function(screenObj)
            {
                waitIndicator(screenObj);
                waitLoading = false;
            }).always(function(result){
                deferred.resolve(result);
            });
            if(kmLoaderActive)
            {
                JB("div.km-loader").css("display", "none");
                kmLoaderActive = false;
            }
        }
        // else if(waitIndicator() && waitIndicator().instance)
        // {
        //     if(message)
        //     {
        //         waitIndicator().instance.controller.message(message);
        //     }

        //     if(message2)
        //     {
        //         waitIndicator().instance.controller.message2(message2);
        //     }
        //     deferred.resolve();
        // }
        else
        {
            deferred.resolve();
        }
        return deferred;
    };

    var waitLoading = false;
    this.hideWaitIndicator = function(val)
    {
    	// log.log("AppNavModel.hideWaitIndicator");
        if(val !== "WaitScreen")
        {
            waitIndicatorActive = false;
            if(waitIndicator())
            {
                if( waitIndicator().instance && waitIndicator().instance.isOpen() )
                {
                    waitIndicator().instance.controller.closeDialogView();
                }
            }
            else
            {
                var currentScreen = self.currentScreen ? self.currentScreen.screenId : null;
                if(currentScreen !== "HomeScreen" && waitLoading)
                {
                    var sub = waitIndicator.subscribe(function(val)
                    {
                        val.instance.controller.closeDialogView(); 
                        sub.dispose();
                    });
                }   
            }
            
        }
        // else
        if(kmLoaderActive)
        {
            JB("div.km-loader").css("display", "none");
            kmLoaderActive = false;
        }
    };

};
if ( typeof exports !== "undefined" ) {
    module.exports = AppNavModel;
}
else if ( typeof define === "function" ) {
    define("AppNavModel", AppNavModel);
}
else {
    window.AppNavModel = AppNavModel;
}
//# sourceURL=/modules/com/component/AppNavModel.js