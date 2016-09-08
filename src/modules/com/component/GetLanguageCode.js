var GetLanguageCode = function(qsp, appId)
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
if ( typeof exports !== "undefined" ) {
    module.exports = GetLanguageCode;
}
else if ( typeof define === "function" ) {
    define("com.component.GetLanguageCode", GetLanguageCode);
}
else {
    window.GetLanguageCode = GetLanguageCode;
}
//# sourceURL=/modules/com/component/GetLanguageCode.js