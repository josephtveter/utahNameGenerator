var HomeScreenController = function(navModel)
{
	var ko = require("ko");
	var self = this;
	self.init(navModel);

	this.onScreenAfterShow = function()
	{
		self.navModel.showScreen("ErrorDialog", {message: "Howdy", title: "Whats Up?"});
	};
};
module.exports = HomeScreenController;
//# sourceURL=/modules/com/utahNames/ui/controller/HomeScreenController.js