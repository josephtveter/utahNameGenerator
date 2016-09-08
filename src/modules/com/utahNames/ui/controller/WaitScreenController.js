var ko = require("ko");
var WaitScreenController = function(navModel)
{
	var self = this;
	self.init(navModel);
	this.message = ko.observable();
	this.message2 = ko.observable();
	this.setViewData = function(data)
	{
		data = data || {};
		var message1 = "", message2 = "";
		if(typeof(data.message) === "function")
        {
            message1 = data.message();
        }
        else
        {
        	message1 = data.message;
        }
        if(typeof(data.message2) === "function")
        {
            message2 = data.message2();
        }
        else
        {
        	message2 = data.message2;
        }
		if(message1 && typeof(message1) === "string")
		{
			self.message(message1);
		}
		else
		{
			var loading = self.getString("wait.loading");
			self.message(loading());
		}
		if(message2)
		{
			self.message2(message2);
		}
		else
		{
			self.message2("");
		}
	};
	// this.onScreenAfterShow = function()
	// {
	// 	var loading = self.getString("wait.loading")();
	// 	debugger;
	// };
};
module.exports = WaitScreenController;
//# sourceURL=/modules/com/mil/ui/controller/WaitScreenController.js