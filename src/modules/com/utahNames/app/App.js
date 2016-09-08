var App = function()
{
    var self = this;
    var initAppData = require("com.utahNames.app.initAppData");
    initAppData();
    var AppDataModel = require("com.utahNames.app.AppDataModel");
    var AppNavModel = require("AppNavModel");
    var Touches = require("com.component.Touches");
    var touches = new Touches();
    var JB = require("jBone");
        
    define("touches", touches);
    // log.info("App");

    this.dataModel = new AppDataModel();
    // log.info("App dataModel Loaded");
    this.navModel = new AppNavModel(this.dataModel);
    // log.info("App navModel Loaded");

    this.epicFail = function(errorObj)
    {
        log.warn("App.epicFail {}", errorObj);
        switch(errorObj.errorType)
        {
            case "MUST_LOGIN":
                if(qsp.iA)
                {
                    showScreen("LoginScreen");
                }
                else
                {
                    showScreen("MyFeedScreen");
                }
            break;
            default:
                showScreen("MessageScreen", {message: "There was a network error. Please try again later."});
                // epicFail(errorObj);
            break;
        }
    };


    this.init = function(data)
    {
        log.log("App.init");
        var systemDetect = self.dataModel.systemDetect;
        var qsp = requireLocal("qsp");
        qsp = qsp || {};
        // debugger;
        if(data.koWindowSize)
        {
            data.koWindowSize.subscribe(function(val)
            {
                self.dataModel.windowsize = val;
                if(val && systemDetect.mobileDevice)
                {
                    log.info("App.init windowSize: {}", val);
                    if(val.layout === "Portrait")
                    {
                        if(val.aspectRatio <= 1.5)
                        {
                            JB("body").addClass("short");
                        }
                        else if(val.aspectRatio > 1.6)
                        {
                            // JB("body").addClass("tall");
                        }
                    }   
                }
                if(val.layout !== "Portrait" && JB("body").hasClass("Portrait"))
                {
                    JB("body").removeClass("Portrait");
                    JB("body").addClass(val.layout);
                }
                else if(val.layout !== "Landscape" && JB("body").hasClass("Landscape"))
                {
                    JB("body").removeClass("Landscape");
                    JB("body").addClass(val.layout);
                }
                else if(!JB("body").hasClass("Landscape") && !JB("body").hasClass("Portrait"))
                {
                    JB("body").addClass(val.layout);
                }
            });
            data.koWindowSize.valueHasMutated();
        }
        if(systemDetect.FBAN)
        {
            JB("body").addClass("FBAN");
        }
        if(systemDetect.FBAV)
        {
            JB("body").addClass("FBAV");
        }

        if(systemDetect.twitter === true)
        {
            JB("body").addClass("twitterForIphone");
        }
        else
        {
            log.info("App.init NOT twitterForIphone");
        }
        if(!systemDetect.mobileDevice)
        {
            JB("body").addClass("desktop");
        }
        else
        {
            JB("body").addClass("mobileDevice");
            JB("body").addClass(systemDetect.mobileDevice);
        }
        if(systemDetect.browser)
        {
            var browserClass = systemDetect.browser;
            if(systemDetect.version)
            {
                browserClass += systemDetect.version;
            }
            JB("body").addClass(browserClass);
        }

        if(qsp.test)
        {
            JB("body").addClass("test");
        }
        log.log("App classes: "+JB("body").attr("class"));
        
            
        
        window.setTimeout(function()
        {
            require(["com.component.windowSize"], function(mods)
            {
                var windowSize = mods["com.component.windowSize"];
                windowSize();
            })
        }, 1);    
        self.navModel.showScreen("HomeScreen");  
    };




};
if ( typeof exports !== "undefined" ) {
    module.exports = App;
}
else if ( typeof define === "function" ) {
    define( "com.mil.app.App", App);
}
else {
    window.App = App;
}
//# sourceURL=/modules/com/utahNames/app/App.js