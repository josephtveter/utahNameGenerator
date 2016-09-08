/**
 * The view model controlling the Login view.
 * @class com.mil.ui.controller.WideMessageScreenController
 * @mixins com.mil.ui.controller.BaseController
 */
var WideMessageScreenController = function(navModel)
{
    var self = this;
    this.init(navModel);
    var ko = require("ko");
    
    this.message = ko.observable("");
    this.callbackFn = null;
    
    // This will be called before the dialog is shown to set the data to show in the dialog.
    this.setViewData = function(params)
    {
        params = params || {};
        self.message(params.message);
    };

    this.okTapped = function()
    {
        self.closeDialogView();
    };
    
    this.closeView = function()
    {
        self.closeDialogView();
    };
};

module.exports = WideMessageScreenController;
//# sourceURL=/modules/com/mil/ui/controller/WideMessageScreenController.js