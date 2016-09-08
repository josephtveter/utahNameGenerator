// History 
// To be used before the transition but after the screen has been rendered.  This should be part of the transition phase, after the elemet has been prepared for the transition, or maybe after the transition is completed.

// Updated 4/25/2016
var PageHistory = function()
{
	var ko = require("ko");
	var self = this;
	var settingHash = false;
	this.history = [];
	this.openDialog = ko.observable();
	this.setLocation = function(screenObj)
	{
		if(!screenObj.dialog)
		{
			settingHash = true;
			location.hash = "#"+screenObj.screenId;
			self.history.push(screenObj);
		}
	};

	window.addEventListener('popstate', function(event) // TODO tie to androind back and detect forward
	{
		if(settingHash)
		{
			settingHash = false;
		}
		else if(self.openDialog() && self.history.length > 0)
		{
			window.setTimeout(function()
			{
				var dialog = self.openDialog();
				dialog.instance.controller.closeDialogView();
			}, 1);
		}
		else if(self.history.length > 1)
		{
			window.setTimeout(function()
			{
				var current = self.history[self.history.length-1];
				var data = {};
				var screenId = "";
				var transition = null;
				var onCloseCallbackFn = null;
				var nope = false;
				if(current.back)
				{
					if(current.back === "NOPE")
					{
						nope = true;
					}
					else
					{
						screenId = current.back;
					}
					
				}
				else
				{
					var screenObj = self.history[self.history.length-2];
					screenId = screenObj.screenId;
					data = screenObj.data;
					transition = screenObj.transition;
					onCloseCallbackFn = screenObj.onCloseCallbackFn;
				}
				
				if(!nope && current.screenId !== screenId)
				{
					current.instance.controller.navModel.showScreen(screenId, data, transition, onCloseCallbackFn).done(function(result)
					{
						var history = self.history;
						var one = self.history.pop();
						var two = self.history.pop();
					});
				}	
					
			}, 1);
		}
		
	    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
	});
};
if ( typeof exports !== "undefined" ) {
    module.exports = PageHistory;
}
else if ( typeof define === "function" ) {
    define( "com.component.PageHistory", PageHistory);
}
else {
    window.PageHistory = PageHistory;
}
//# sourceURL=/modules/com/component/PageHistory.js