// Updated 4/25/2016
var Transition = function(pageHistory, screenStatus)
{
	var ua = document.getElementById("userAgent");


	var JB = require("jBone");
	var Deferred = require("Deferred");
	var self = this;
	this.pageHistory = pageHistory;
	var default_time = 0.4;
    self.screenStatus = screenStatus;

    var TweenMax = {};
	TweenMax.fromTo = function(id, time, transition, callback)
	{
		// log.log("Transition fromTo");
		time = time || default_time;
		transition = transition || "fadeIn";
		if(id)
		{
			// JB(id).addClass(transition);
			// window.setTimeout(function()
			// {
				if(callback && typeof(callback) === "function")
				{
					callback();
					// JB(id).removeClass(transition);
				}
			// }, 450);
		}
		else if(callback && typeof(callback) === "function")
		{
			callback();
		}
	};

	this.transition = function(toScreen, fromScreen)
	{
		// log.log("Transition.transition");

        // ua.innerHTML += "<br>Transition.transition toScreen.screenId: "+toScreen.screenId;
		var deferred = new Deferred();
		var time = toScreen.transitionTime || default_time;
		var controller = toScreen.instance.controller;
    
        JB("#"+toScreen.screenId).removeAttr("style");
        
        if(window.noFlex)
        {
        	JB("#"+toScreen.screenId).css("display", "block");
        }
        if(fromScreen)
        {
        	JB("#"+fromScreen.screenId).removeAttr("style");
        }

        var resolve = function()
        {
        	// log.log("Transition.transition resolve");
        	controller.onAfterTransition();
	        	
        	if(!toScreen.dialog)
        	{
            	self.pageHistory.setLocation(toScreen);
        		if(window.noFlex)
				{
					// ua.innerHTML += "<br>Transition.transition noFlex: "+noFlex;
					var shortBody = JB("body").hasClass("short");
					var rem = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
					var headerH = 6.5 * rem;
					var appHeight = document.body.clientHeight || document.body.scrollHeight || document.getElementById("shoutWrapper").clientHeight;
					var pageContent = JB("#"+toScreen.screenId+" .pageContent");
					var footer = JB("#"+toScreen.screenId+" .footer");
					var footerH = footer[0] ? footer[0].clientHeight : 0;
					var contentH = appHeight - headerH - footerH; 
					pageContent.css("height", contentH+"px");
				}
				var splashScreen = JB(".splashScreen"); // .addClass("hideScreen")
				if(splashScreen[0].className.indexOf("hideScreen") === -1)
				{
					splashScreen.addClass("hideScreen");
				}
        	}
        	deferred.resolve(toScreen);
        };

        var resolveHide = function()
        {
        	// log.log("Transition.transition hide");
        	// // ua.innerHTML += "<br>Transition.transition resolveHide";
        	var disable = true;
        	if(fromScreen && fromScreen.screenId !== toScreen.screenId)
        	{
        		JB("#"+fromScreen.screenId).addClass("hideScreen");
        		disable = false;
        		if(window.noFlex)
	        	{
	        		JB("#"+fromScreen.screenId).css("display", "none");
	        	}
        	}
        	
        	
        	fromScreen.instance.events.hide(disable);
        };

		controller.onTransition();
		
		if(fromScreen)
		{
			TweenMax.fromTo("#"+fromScreen.screenId, time, "fadeOut", resolveHide);
		}
		JB("#"+toScreen.screenId).removeClass("hideScreen");
		TweenMax.fromTo("#"+toScreen.screenId, time, "fadeIn", resolve);
			
		return deferred;
	};

	var closeComplete = function(screenId)
	{
		// log.log("Transition.closeComplete");
		JB("#"+screenId).addClass("hideScreen");
		JB("#"+screenId).removeAttr("style");
        self.screenStatus("SCREEN_COMPLETE");
        if(pageHistory.openDialog() && pageHistory.openDialog().screenId === screenId)
        {
        	pageHistory.openDialog(null);
        }
	};

	this.closeDialog = function(data)
	{
		// log.log("Transition.closeDialog");
        var deferred = new Deferred();
		var screenId = data.screenId;
		var time = data.time || default_time;
		var transition = data.transition || "DEFAULT";
		switch(transition)
		{
	        default:
	        TweenMax.fromTo("#"+screenId, time, "fadeOut", function()
	        {
	        	closeComplete(screenId);
                deferred.resolve();
	        });
	        break;
		}
		return deferred;
	};
};

if ( typeof exports !== "undefined" ) {
    module.exports = Transition;
}
else if ( typeof define === "function" ) {
    define( "com.component.Transition", Transition);
}
else {
    window.Transition = Transition;
}
//# sourceURL=/modules/com/component/Transition.js