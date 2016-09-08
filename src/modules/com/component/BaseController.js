var Deferred = require("Deferred");
var BaseController = function()
{
    // obj.dataForClose = {};
    var self = this;
    var JB = require("jBone");
    var ko = require("ko");
    this.navModel = null;
    this.dataModel = null;
    this.i18n = null;

    this.visible = ko.observable(false);
    // this.touchEnd = ko.observable(null);
    this.dataForClose = null;
    this.pulling = ko.observable(false);
    this.currentPage = ko.observable("HOME");
    this.lastScreen = null;
    this.isDev = function()
    {
        var qsp = requireLocal("qsp");
        return qsp && qsp.su ? qsp.su : false;
    };
    this.init = function(navModel)
    {
        self.navModel = navModel;
        self.dataModel = navModel.dataModel;
    };

    this.afterInit = function(){};

    this.setViewData = function(viewData)
    {
    };

    /**
     * The corresponding screen is about to show.  Descendants should override to know when this occurs.
     */
    this.onScreenBeforeShow = function()
    {
    };

    this.onBeforeTransition = function()
    {
    };
    
    this.onTransition = function()
    {
    };

    this.onAfterTransition = function()
    {
    };

    /**
     * The corresponding screen is appearing now.  Descendants should override to know when this occurs.
     */
    this.onScreenShow = function()
    {
    };
    
    /**
     * The corresponding screen is done appearing.  Descendants should override to know when this occurs.
     */
    this.onScreenAfterShow = function()
    {
    };
    
    /**
     * The corresponding screen is now hidden.  Descendants should override to know when this occurs.
     */
    this.onScreenHide = function()
    {
    };

    /**
     * Show the app wait indicator.
     * @param {String} [message] The message to show with the wait indicator.
     * @param {String} [message2] Optional secondary message in a smaller font.
     */
    this.showWaitIndicator = function(message, message2)
    {
        self.navModel.showWaitIndicator(message, message2);
    };

    this.hideWaitIndicator = function()
    {
        self.navModel.hideWaitIndicator();
    };

    this.closeDialogView = function(params)
    {
        var screenId = params && params.screenId ? params.screenId : self.screenId;
        self.navModel.closeDialog(screenId, params);
    };

    /**
     * Views can set the dom element ID of the view on the controller, allowing the controller to fire events back up to the view.
     * @param {Object} uiViewId The dom element ID of the view.
     */
    this.setUiViewId = function(uiViewId)
    {
        self.screenId = uiViewId;
    };

    this.getString = function(id)
    {
        var stringId = id;
        if(id.indexOf(".") === -1)
        {
            stringId = self.screenId+"."+id;
        }
        return self.dataModel.i18n.getString(stringId);
    };

    this.getLanguageString = function(str, defaultStr)
    {
        var lanStr = getLanguageString(str);
        if(!lanStr && defaultStr)
            lanStr = defaultStr;

        return lanStr;
    };

    var getLanguageString = function(arr)
    {
        var str = null;
        var languageCode = self.dataModel.subscriber() && self.dataModel.subscriber().languageCode ? self.dataModel.subscriber().languageCode : "en";
        if(arr)
        {   
            str = languageStringFailOver(arr, languageCode);
            if(!str)
            {
                str = languageStringFailOver(arr, "es");
                // if(!str)
                // {
                //     str = Util.languageStringFailOver(arr, "");
                //     if(!str)
                //     {
                //         str = Util.languageStringFailOver(arr, Util.languageCodeFail3);
                //     }
                // }
            }
        }
        return str;
    };

    var languageStringFailOver = function(arr, code)
    {
        var str;
        if(arr.find)
        {
            var obj = arr.find(function(val)
            {
                if(val.languageCode === code)
                {
                    return val;
                }
            });
            if(obj)
            {
                str = obj.value;
            }
            
        }
        else
        {
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i].languageCode === code)
                {
                    str = arr[i] ? arr[i].value : arr[i];
                    break;
                }
            }
        }
            
        return str;
    };



    /**
     * This should be overriden by descendants to clear the data in a window before it is shown.
     */
    this.clear = function()
    {
        // noop
    };

    this.refreshScroller = function()
    {
        if(self.visible)
        {
            window.setTimeout(function()
            {
                self.visible.valueHasMutated();
            }, 400);
        }
    };

    /*
    * Call this if you change segmented control with a scroller. IOS will sometimes lose the listener.
    */
    this.resetTouchListeners = function() 
    {
        // Util.touches.destroyListeners(obj.screenId);
        // Util.touches.initListeners(obj.screenId);
        // window.setTimeout(Util.touches.reset, 100);
    };

    this.gotoMain = function()
    {
        this.navModel.showScreen("MainMenuScreen");
    };

    // Shake
    this.shake = function(targets, delay)
    {
        var deferred = new Deferred();
        delay = delay || 0;
        window.setTimeout(function()
        {
            JB(targets).addClass("shake");
            window.setTimeout(function()
            {
                JB(targets).removeClass("shake");
                deferred.resolve();
            }, 2000);
        }, delay * 1000);
        return deferred;
    };

    this.appWidth = function()
    {
        var width = 0;
        // JB(".shout-view")[0].clientWidth
        var arr = JB(".shout-view");
        var len = JB(".shout-view").length;
        for(var i=0;i<len;i++)
        {
            if(arr[i].clientWidth > 0)
            {
                width = arr[i].clientWidth;
                break;
            }
        }
        if(width === 0)
        {
            width = JB("#shoutWrapper")[0].clientWidth;
        }
        return width;
    };
    this.scrollHWidth = function(arr)
    {
        var rtn = "0px";
        if(arr && arr.length > 0)
        {
            rtn = (self.appWidth() + 2) * arr.length;
        }
        return rtn;
    };
    this.getLeft = function(data)
    {
        var width = 0;
        var landscape = JB("body").hasClass('Landscape');
        // JB(".shout-view")[0].clientWidth
        var arr = JB(".shout-view");
        var len = JB(".shout-view").length;
        for(var i=0;i<len;i++)
        {
            if(arr[i].clientWidth > 0)
            {
                width = arr[i].clientWidth;
                break;
            }
        }
        if(width === 0)
        {
            width = JB("#shoutWrapper")[0].clientWidth;
        }
        if(landscape && self.screenId === "VoteScreen")
        {
            width = width * 0.66;
        }
        return (width*data.idx).toString()+"px";
    };

    this.openMenu = function()
    {
        self.navModel.showScreen("MainMenuScreen");
    };

    this.getFlag = function()
    {
        var subscriber = self.dataModel.subscriber();
        var countryCode = subscriber && subscriber.fromCountryCode ? subscriber.fromCountryCode : null;
        if(countryCode)
        {
            return "images/flags64/"+countryCode.toLowerCase()+".png";
        }
        else
        {
            return "images/flags64/defaultFlag.png";
        }
        
        subscriber = null;
        countryCode = null;
    };

    this.getLocation = function()
    {
        var subscriber = self.dataModel.subscriber();
        var countryCode = subscriber && subscriber.fromCountryCode ? subscriber.fromCountryCode : "US";
        return self.getString('country.'+countryCode.toUpperCase());
        subscriber = null;
        countryCode = null;
    };

    this.getUserImage = function()
    {
        var subscriber = self.dataModel.subscriber();
        var photoUrl = subscriber && subscriber.photoUrl ? subscriber.photoUrl : "images/app/ProfileImage.png";
        return photoUrl;
        subscriber = null;
        photoUrl = null;
    };

    this.getOpponentImage = function()
    {
        return self.dataModel.opponent() && self.dataModel.opponent().photoUrl ? self.dataModel.opponent().photoUrl : "images/app/ProfileImage.png";
    };

    this.getOpponentFlag = function()
    {
        if(self.dataModel.opponent() && self.dataModel.opponent().countryCode)
        {
            return "images/flags64/"+self.dataModel.opponent().countryCode.toLowerCase()+".png";
        }
        else
        {
            return "images/flags64/defaultFlag.png";
        }
    };

    this.getOpponentLocation = function()
    {
        return self.dataModel.opponent() && self.dataModel.opponent().countryCode ? self.getString("country."+self.dataModel.opponent().countryCode)() : "";
    };

    this.back = function(last)
    {
        last = last && typeof(last) == "string" ? last : null;
        if(!last)
        {
            if(self.lastScreen)
            {
                last = self.lastScreen;
            }
            else if(self.navModel.currentScreen.back)
            {
                last = self.navModel.currentScreen.back
            }   
            else
            {
                last = self.navModel.screenStack[self.navModel.screenStack.length - 2].screenId;
            }
        }
        
        if(!last || last === "EXIT")
        {
            self.dataModel.bridge.closeShout();
        }
        else
        {
            self.navModel.showScreen(last);
        }
        
    };

    this.gotoFeed = function()
    {
        self.navModel.showScreen("FeedScreen");
    };

    this.gotoPrizes = function(lastScreen)
    {
        self.navModel.showScreen("PrizesScreen", {lastScreen: lastScreen});
    };

    this.gotoStart = function()
    {
        if(self.navModel.currentScreen.screenId !== "MainScreen")
        {
            self.navModel.showScreen("MainScreen");
        }
        else if(self.dataModel.levelCost() <= self.dataModel.creds())
        {
            self.navModel.showScreen("StartScreen");
        }
        else
        {
            // TODO MESSAGE AND SEND TO PRODUCT SCREEN
            self.navModel.showScreen("PackagesScreen");
        }
        
    };

    this.gotoWinnings = function()
    {
        if(document.body.className.indexOf("unlock") !== -1)
        {
            self.navModel.showScreen("WinningsScreen");
        }   
    };

    this.gotoMe = function()
    {
        self.navModel.showScreen("ProfileScreen");
    };

    this.setImageSSL = function(image)
    {
        image = image || "";
        if(document.location.protocol === "https:" && image.indexOf("http:") !== -1)
        {
            image = image.replace("http:", "https:");
        }

        return image;
    };

    this.addCommasToNumber = function(x)
    {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
};

if ( typeof exports !== "undefined" ) {
    module.exports = BaseController;
}
else if ( typeof define === "function" ) {
    define("com.component.BaseController", BaseController);
}
else {
    window.BaseController = BaseController;
}
//# sourceURL=/modules/com/component/BaseController.js
