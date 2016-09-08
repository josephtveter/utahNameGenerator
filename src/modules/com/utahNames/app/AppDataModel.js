var AppDataModel = function()
{
    log.log("AppDataModel");
    var SystemDetect = require("com.component.SystemDetect");

    this.systemDetect = new SystemDetect(); 

};

if ( typeof exports !== "undefined" ) {
    module.exports = AppDataModel;
}
else if ( typeof define === "function" ) {
    define( "com.mil.app.AppDataModel", AppDataModel);
}
else {
    window.AppDataModel = AppDataModel;
}
//# sourceURL=/modules/com/mil/app/AppDataModel.js