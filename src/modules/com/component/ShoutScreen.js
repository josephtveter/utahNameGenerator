var ShoutScreen = function(params)
{
    var JB = require("jBone");
    var ko = require("ko");
    
    params = params || {};

    /**
     * @property {String} id The ID of the dom element that is the root of this screen.
     */
    this.id = params.id;

    /**
     * @property {String} screenId The ID of the screen, will be same for all instances of same screen.
     */
    this.screenId = params.screenId;

    /**
     * @property {String} dialog True if this is a dialog as opposed to a screen.
     */
    this.dialog = params.dialog;
    
    /**
     * @proeprty {Object} [template] The template to use to load the HTML associated with this screen.
     * @private
     */
    this.template = params.template || null;

    /**
     * @property {Object} [controller] The controlling model to tie to the rendered view template.
     */
    this.controller = params.controller || null;

    // this.transitionDone = false;
    /**
     * @property {Mixed} [dataForClose] Set by controller firing event up to the view, Will be sent as argument to onCloseCallbackFn when screen closes.
     */

     this.screenType = params.screenType;

     this.onCloseCallbackFn = null;

     this.instance = null;

    if (this.controller)
        this.controller.setUiViewId(this.screenId);

    var self = this;
    this.initialized = false;
    /**
     * Render the HTML of the screen.  This must be done before the screen is actually created.
     */
    this.renderScreen = function()
    {
        var screenEl = JB("#" + self.screenId);
        if(screenEl.length === 0)
        {
            self.template = self.template.trim();

            var content = JB(self.template);
            if(self.dialog)
            {
                content.addClass("dialog");
                screenEl = JB('<div id="'+self.screenId+'"></div>');
                screenEl.append(content);
                screenEl.append('<div class="transparency" data-bind="shoutTap: $root.closeDialogView"></div>');
                JB("#shoutWrapper").append(screenEl);
            }
            else
            {
                content.attr("id", self.screenId);
                JB("#shoutWrapper").append(content);
            }
            
            screenEl = JB("#" + this.screenId);
        }

        if(self.dialog)
        {
            if(!screenEl.hasClass("shout-dialog"))
            {
                screenEl.addClass("shout-dialog");
            }
        }
        else
        {
            if(!screenEl.hasClass("shout-view"))
            {
                screenEl.addClass("shout-view");
            }
        }
        if(self.screenType)
        {
            screenEl.addClass(self.screenType);
        }
        ko.cleanNode(screenEl[0]);
        ko.applyBindings(self.controller, screenEl[0]);
        screenEl.css("display", "none");
    };

    this.events = {
        beforeShow: function(e) // Fires Always before a screen starts to load
        {
            self.initialized = true;
            // Util.touches.reset();
            self.controller.onScreenBeforeShow();
        },
        show: function(e) // Fires Always just before the screen is visable
        {
            // Util.touches.initListeners(self.screenId);
            self.controller.onScreenShow();
        },
        afterShow: function(e) // Fires Always just after the screen is visable or after the transition completes
        {
            if(!self.dialog)
                self.controller.navModel.hideWaitIndicator();
            
            self.controller.onScreenAfterShow();
            self.controller.visible(true);
            // window.setTimeout(Util.touches.refreshScroller, 100);
        },
        hide: function(params) // Fires Always just after the screen is visable or after the transition completes
        {
            self.controller.onScreenHide(params);
            self.controller.visible(false);
            //clear the footer
            
            var data = self.controller.dataForClose || params;
            self.controller.dataForClose = null;
            if (self.onCloseCallbackFn && typeof(self.onCloseCallbackFn) === "function")
            {
                self.onCloseCallbackFn(data);
                self.onCloseCallbackFn = null;
            }
        }
    };

    /**
     * @return {Boolean} True if the screen is open, false otherwise.
     */
    this.isOpen = function()
    {
        return JB("#" + this.screenId).css("display") !== "none";
    };
};

if ( typeof exports !== "undefined" ) {
    module.exports = ShoutScreen;
}
else if ( typeof define === "function" ) {
    define( "com.component.ShoutScreen", ShoutScreen);
}
else {
    window.ShoutScreen = ShoutScreen;
}
//# sourceURL=/modules/com/component/ShoutScreen.js