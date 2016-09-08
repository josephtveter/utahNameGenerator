/*
	Utah Random Name Generator
	- Build phonetic replace strings
	- 
*/

window.appName = "utahNames"; // GLOBAL This should be the name of the folder that holds the app.
window.TESTING = false;
var mainMod = "com."+appName+".app.App";
var _appInstance = null;
var system = null;

ModRewrite.baseUrl = "modules";

define("appVersion", {version: 4.9});
// window.location.host

ModRewrite.addFileRule(/com./, function(path)
{
	return path.split(".").join("/");
});
ModRewrite.addFileRule(/i18n./, function(path)
{
    return path.split(".").join("/");
});

ModRewrite.addFileRule("ko", function(path)
{
	return "libs/knockout-3.3.0";
});
ModRewrite.addFileRule("Screens", function(path)
{
	return "com/"+appName+"/app/objects/screens";
});
//AppNavModel
ModRewrite.addFileRule("AppNavModel", function(path)
{
    return "com/component/AppNavModel";
});
ModRewrite.addFileRule("ScreenNames", function(path)
{
	return "com/"+appName+"/app/objects/screenNames";
});
ModRewrite.addFileRule("KnockoutBindings", function(path)
{
	return "com/component/KnockoutBindings";
});
ModRewrite.addFileRule("jBone", function(path)
{
    return "libs/jbone";
});

ModRewrite.addExtensionRule("json");
ModRewrite.addExtensionRule("html");
ModRewrite.addExtensionRule("css");

// App dependent functions
    
var getQueryStringParams = function()
{
    var match, urlParams,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1),
    url = document.URL,
    hashIndex = url.indexOf("#");
    if(hashIndex !== -1)
    {
        urlParams = {loadApp: false};
        window.location.replace(url.substring(0, hashIndex));
    }
    else
    {
        urlParams = {};
        while (match = search.exec(query))
        {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        if(urlParams.facebookRtn)
        {
            var facebookRtn = "";
            var arr = document.URL.split('?');
            var baseUrl = arr[0];
            var removedHash = arr[1].split("#")[0];
            var hashArr = removedHash.split("&");
            for(var i=0;i<hashArr.length;i++)
            {
                if(hashArr[i].indexOf("facebookRtn=") !== -1)
                {
                    var removeFacebook = hashArr[i].split("=")[1];
                    facebookRtn = removeFacebook.replace(new RegExp("_EQUALS_", 'g'), "=").replace(new RegExp("_AND_", 'g'), "&");
                    break;
                }
            }
            urlParams = null;

            if(location.href.indexOf("fbr") === -1)
                facebookRtn += "&fbr=1";

            window.location.replace(baseUrl+"?"+facebookRtn);
        }
        else if(urlParams.shout)
        {
            var smsRtn = "";
            var arr = document.URL.split('?');
            var baseUrl = arr[0];
            var qspArr = urlParams.shout.split('');
            var theme = qspArr[0];
            var context = qspArr[1];
            smsRtn = baseUrl+"?aM=S&t="+theme+"&aI="+context;
            if(urlParams.shout.indexOf("E_") !== -1)
            {
               smsRtn += "&eI="+urlParams.shout.substr(4); 
            }
            window.location.replace(smsRtn);
            urlParams = null;
        }
        else if(urlParams.fbr)
        {
            urlParams.fbr = 2;
        }
    }   
    if(urlParams)
    {
        urlParams.appName = appName;
    }
    return urlParams; 
};
var qsp = getQueryStringParams();
qsp = qsp || {};
define("qsp", qsp);

if(window.location.hash)
{
    window.location.hash = null;
}
    var koWindowSize = null;
    var koWindowSizeResult = null;
    var libs = ["ko"];
    var deps = ["ko", mainMod, "KnockoutBindings"];

    var initModules = function(modules)
    {
        var App = modules[mainMod];
        var ko = modules.ko;
        koWindowSize = ko.observable(koWindowSizeResult);
        if(!_appInstance && typeof(App) === "function" )
        {
            _appInstance = new App();
            _appInstance.init({koWindowSize: koWindowSize});
        }
    };
    var initDeps = function(modules)
    {
        var SystemDetect = modules["com.component.SystemDetect"];
        var system = new SystemDetect();
        var windowSize = modules["com.component.windowSize"];

        koWindowSizeResult = windowSize(system);
        window.onresize = function(val, val2)
        {
            koWindowSizeResult = windowSize(system);
            if(koWindowSize)
            {
                koWindowSize(koWindowSizeResult);
            }
        };
        if(koWindowSize)
        {
            koWindowSize(koWindowSizeResult);
        }

        var qsp = requireLocal("qsp");
        if(!qsp || (qsp && qsp.loadApp !== false) )
        {
            require(deps, initModules);
        }
    };
    var start = function(mods)
    {
        require(["com.component.windowSize", "com.component.SystemDetect"], initDeps);  
    };
        
    var depsFile = "com."+appName+".deps";
    ModRewrite.noExports[depsFile] = true;

    require(libs, start);


    var bootstrap = {};
    if ( typeof exports !== "undefined" ) {
        module.exports = bootstrap;
    }
    else if ( typeof define === "function" ) {
        define("modules/bootstrap", bootstrap);
    }
    else {
        window.bootstrap = bootstrap;
    }

    
//# sourceURL=/modules/bootstrap.js