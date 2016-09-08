var initAppData = function()
{ 
    var qsp = requireLocal("qsp");
    qsp = qsp || {};
    // // App dependent functions
    var getAppMode = function(qsp)
    {
        var mode = qsp.aM || qsp.appMode;
        var rtn = null;
        if((window.getSubscriberInfo && typeof(window.getSubscriberInfo) === "function" ) || qsp.e && qsp.u)
        {
            rtn = "EMBEDDED";
        }
        else
        {
            switch(mode)
            {
                case "S":
                case "STAND_ALONE":
                rtn = "STAND_ALONE";
                break;
                case "FACEBOOK_CANVAS":
                case "F":
                rtn = "FACEBOOK_CANVAS";
                break;
                case "M":
                rtn = "MEMORY_LOW";
                break;
                default:
                rtn = "STAND_ALONE";
            }
        }
            
        return rtn;
    };

    var getAppId = function(qsp, appMode)
    {
        qsp = qsp || {};
        var appIds = ["SHOUT","SHOUT5","MyMadrid","Carrusel"];
        var appId = qsp.appId || qsp.aI;
        var rtn;
        switch(appId)
        {
            case "4":
            appId = "Carrusel";
            break;
            case "3":
            appId = "SHOUT5";
            break;
            case "2":
            appId = "MyMadrid";
            break;
            case "1":
            appId = "SHOUT";
            break;
            default:
            appId = "MyMadrid";
            break;
        }
        if(appId)
        {
            for(var i=0;i<appIds.length;i++)// Is the AppId Aproved?
            {
                if(appId === appIds[i])
                {
                    rtn = appId;
                    break;
                }
            }
            if(!rtn) // AppId is not approved Check for similar.
            {
                for(var j=0;j<appIds.length;j++)// Is the AppId Aproved?
                {
                    if(appId.indexOf(appIds[j]) !== -1)
                    {
                        rtn = appIds[j];
                        break;
                    }
                }
            }
        }
        
        if(!rtn)
        {
            log.warn("App.approvedAppId AppId NOT FOUND, FINDING ALTERNATES");
            if(qsp.t)
            {
                switch(qsp.t)
                {
                    case "s":
                        rtn = "SHOUT";
                    break;
                    case "r":
                        rtn = "MyMadrid";
                    break;
                    case "d":
                        rtn = "Carrusel";
                    break;
                    default:
                        rtn = "SHOUT";
                    break;
                }
            }
            else if(appMode === "EMBEDDED")
            {
                rtn = "MyMadrid";
            }
            else
            {
                rtn = "SHOUT";
            }
        }
        return rtn;
    };



    var getTheme = function(qsp, appId)
    {
        var theme = "shout";
        qsp = qsp || {};
        if (qsp && qsp.t)
        {
            switch(qsp.t)
            {
                case "r":
                    theme = "real";
                break;
                case "d":
                    theme = "deportivo";
                break;
                case "s":
                default:
                    theme = "shout";
            }
        }
        else if(appId)
        {
            switch(appId)
            {
                case "MyMadrid":
                    theme = "real";
                break;
            }
        }
        return theme;
    };

    var getLanguageCode = function(qsp, appId)
    {
        qsp = qsp || {};
        var languageCode = "en";
        if(subscriberData && subscriberData.languageCode)
        {
            languageCode = subscriberData.languageCode;
        }
        else if(qsp.lc)
        {
            languageCode = qsp.lc;
        }
        else if(qsp.languageCode)
        {
            languageCode = qsp.languageCode;
        }
        else if(appId === "MyMadrid")
        {
            languageCode = "es";
        }
        else
        {
            languageCode = "en";
        }
        return languageCode;
    };



    var subscriberData = null;
    var facebookAuth = null;
    var appMode = getAppMode(qsp);
    var appId = getAppId(qsp, appMode);
    var themeName = getTheme(qsp, appId);
    var serverType = location.host.indexOf("shout.tv") !== -1 ? "PRODUCTION" : "STAGING";
    var languageCode = getLanguageCode(qsp, appId);

    define("AppData", {appMode: appMode, appId: appId, themeName: themeName, serverType: serverType, languageCode: languageCode});
};

if ( typeof exports !== "undefined" ) {
    module.exports = initAppData;
}
else if ( typeof define === "function" ) {
    define("com.mil.app.initAppData", initAppData);
}
else {
    window.initAppData = initAppData;
}
//# sourceURL=/modules/com/utahNames/app/initAppData.js