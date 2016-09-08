var screenNames = function(obj)
{
	obj = obj || {};
    
    obj.HOME_SCREEN_ID = "HomeScreen";
    obj.WIDE_MESSAGE_SCREEN_ID = "WideMessageScreen";
    obj.ERROR_DIALOG_ID = "ErrorDialog";
    obj.ERROR_SCREEN_ID = "ErrorScreen";
    obj.MESSAGE_SCREEN_ID = "MessageScreen";
    obj.WAIT_SCREEN_ID = "WaitScreen";

	return obj;
};

if ( typeof exports !== "undefined" ) {
    module.exports = screenNames;
}
else if ( typeof define === "function" ) {
    define( "com.utahNames.app.objects.screenNames", screenNames);
}
else {
    window.screenNames = screenNames;
}
//# sourceURL=/modules/com/utahNames/app/objects/screenNames.js