var ErrorScreenController = function(navModel)
{
	var ko = require("ko");
	var self = this;
	self.init(navModel);
	
	this.message = ko.observable();
	this.title = ko.observable();

	this.clear = function()
	{
		self.message("");
	};

	this.setViewData = function(data)
	{
		if(data.message)
		{
			self.message(data.message);
		}
		self.title(data.title || "Error");
	};
};
module.exports = ErrorScreenController;
//# sourceURL=/modules/com/mil/ui/controller/ErrorScreenController.js