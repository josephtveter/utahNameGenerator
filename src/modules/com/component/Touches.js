//Created for Global Touch Event Handeling
var Touches = function()
{
    var Touch = require("com.component.Touch");
    var ko = require("ko");
	var self = this;
	this.touchArr = ko.observableArray([]);
	var outOfScope = function(e)
	{
		for(var i=0;i<self.touchArr().length;i++)
		{
			self.touchArr()[i].isOutOfScope(e);
		}
	};

	this.addTouch = function(element, callback, eventType, screenId)
	{
		var touch = new Touch(element, callback, eventType, outOfScope, screenId);
		self.touchArr.push(touch);
	};

    this.initListeners = function(screenId)
    {
        for(var i=0;i<self.touchArr().length;i++)
        {
            if(self.touchArr()[i].status === "PASSIVE" && (self.touchArr()[i].screenId === screenId || self.touchArr()[i].screenId === "ALL_SCREENS"))
            {

                self.touchArr()[i].init(screenId);
            }
        }
    };

    this.destroyListeners = function(screenId)
    {
        for(var i=0;i<self.touchArr().length;i++)
        {
            if(self.touchArr()[i].screenId === screenId)
            {
                self.touchArr()[i].destroy(screenId);
            }
        }
    };

	this.reset = function()
	{
		for(var i=0;i<self.touchArr().length;i++)
		{
            if(self.touchArr()[i].status === "ACTIVE")
            {
                if(self.touchArr()[i].mouseDownCount)
                    self.touchArr()[i].mouseDownCount(0);
                
                self.touchArr()[i].touchHold = null;
                self.touchArr()[i].timeStart = null;
                self.touchArr()[i].timeEnd = null;
            }	
		}
	};

    this.stopScroll = function(e)
    {
        for(var i=0;i<self.touchArr().length;i++)
        {
            if(self.touchArr()[i].status === "ACTIVE" && self.touchArr()[i].iscroll)
            {
                self.touchArr()[i].iscroll._end(e);
            }
        }
    };
};

if ( typeof exports !== "undefined" ) {
    module.exports = Touches;
}
else if ( typeof define === "function" ) {
    define( "com.component.Touches", Touches);
}
else {
    window.Touches = Touches;
}
//# sourceURL=/modules/com/component/Touches.js