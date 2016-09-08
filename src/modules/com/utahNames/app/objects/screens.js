var screens = function()
{
	var ScreenNames = require("com.utahNames.app.objects.screenNames");
	var screenLoaderFactory = require("com.component.screenLoaderFactory");

    var screenNames = new ScreenNames();
    var screenList = {};


    // HOME_SCREEN_ID
    screenList[screenNames.HOME_SCREEN_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.HOME_SCREEN_ID,
        css: true
    });

    screenList[screenNames.ERROR_SCREEN_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.ERROR_SCREEN_ID,
        css: true,
        dialog: true
    });
    //ERROR_DIALOG_ID
    screenList[screenNames.ERROR_DIALOG_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.ERROR_DIALOG_ID,
        css: true,
        screenType: "shoutLAF",
        dialog: true
    });
    // WIDE_MESSAGE_SCREEN_ID
    screenList[screenNames.WIDE_MESSAGE_SCREEN_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.WIDE_MESSAGE_SCREEN_ID,
        css: true,
        screenType: "shoutLAF",
        dialog: true
    });
    // MESSAGE_SCREEN_ID
    screenList[screenNames.MESSAGE_SCREEN_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.MESSAGE_SCREEN_ID,
        css: true,
        dialog: true
    });

    // WAIT_SCREEN_ID
    screenList[screenNames.WAIT_SCREEN_ID] = screenLoaderFactory(
    {
        moduleName: screenNames.WAIT_SCREEN_ID,
        css: true,
        dialog: true
    });
    
	return screenList;	
};
if ( typeof exports !== "undefined" ) {
    module.exports = screens;
}
else if ( typeof define === "function" ) {
    define( "Screens", screens);
}
else {
    window.screens = screens;
}
//# sourceURL=/modules/com/utahNames/app/objects/screens.js