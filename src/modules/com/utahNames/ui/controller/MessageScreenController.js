var MessageScreenController = function(navModel)
{
	var ko = require("ko");
	var self = this;
	self.init(navModel);
	
	this.message = ko.observable();
	this.title = ko.observable();
	this.yesNo = ko.observable(false);
	this.yes = ko.observable();
	this.no = ko.observable();
	this.closeBtn = ko.observable(false);
	this.shoutLAF = ko.observable(false);
	this.formIds = [];
	this.clear = function()
	{
		self.message("");
		self.yesNo(false);
		self.yes('Yes');
		self.no('No');
		self.closeBtn(false);
		self.shoutLAF(false);
		self.formIds = [];
	};

	this.setViewData = function(data)
	{
		if(data.message)
		{
			self.message(data.message);
		}
		self.shoutLAF(data.shoutLAF ? true : false);
		self.title(data.title || 'Error');
		self.yesNo(data.yesNo ? data.yesNo : false);
		if(data.yesNo)
		{
			if(data.yes)
			{
				self.yes(data.yes);
			}
			if(data.no)
			{
				self.no(data.no);
			}
		}
		if(data.formIds)
		{
			self.formIds = data.formIds;
		}
		if(data.close)
		{
			self.closeBtn(true);
		}
	};
	this.booleanResponse = function(response)
	{
		var data = {value: response};
		if(self.formIds && self.formIds.length > 0)
		{
			data.values = {};
			for(var i=0;i<self.formIds.length;i++)
			{
				var id = self.formIds[i];
				var element = document.getElementById(id);
				var val = element ? element.value : null;
				if(element)
				{
					data.values[id] = val;
				}
			}
		}
		self.closeDialogView(data);
	};
	this.goToBack = function()
	{
		self.booleanResponse('close');
	};
};
module.exports = MessageScreenController;
//# sourceURL=modules/com/vote/ui/controller/MessageScreenController.js