var oldScreenwidth = 0;
var oldScreenHeight = 0;

var windowSize = function(info)
{
    var FBAV = navigator.userAgent.toLowerCase().indexOf("fbav") !== -1 && navigator.userAgent.toLowerCase().indexOf("android") !== -1 ? true : false; // Facebook Android
    var screenW = screen.availWidth || screen.width;
    var screenH = screen.availHeight || screen.height;
    var self = this;
    var ratio = 42; // DEFAULT BUILD RATIO
	var oldfont = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
	var screenSize;
	var appWidth = document.body.clientWidth || document.body.scrollWidth || document.getElementById("shoutWrapper").clientWidth;
	var appHeight = document.body.clientHeight || document.body.scrollHeight || document.getElementById("shoutWrapper").clientHeight;

    var dontResize = false;
    var aspectRatio = appHeight/appWidth;
    var layout = "Portrait";
    if(FBAV)
    {
        appWidth = screenW;
        appHeight = appWidth * aspectRatio;
        if(document.body && document.body.style)
        {
            document.body.style.width = appWidth+"px";
            document.body.style.height = appHeight+"px";
        }
            
    }
    if(appWidth <= appHeight)
    {
        screenSize = appWidth;
        // ratio = 42;
    }
    else // Landscape
    {
        layout = "Landscape";
        screenSize = appHeight;
        // ratio = 42;
    }

    if(info && info.mobileDevice && info.mobileDevice !== "iphone")
    {
        if(oldScreenHeight !== 0 && oldScreenwidth !== 0)
        {
            if(oldScreenHeight > appWidth * .75 && oldScreenHeight < appWidth * 1.4)
            {
                if(oldScreenwidth > appHeight * .75 && oldScreenwidth < appHeight * 1.4)
                {
                    // Rotate
                    dontResize = false;
                }
                else
                {
                    dontResize = true;
                }
            }
            else
            {
                dontResize = true;
            }
        } // else first Time 
    }
    if(dontResize === false)
    {
        oldScreenwidth = appWidth;
        oldScreenHeight = appHeight;

        var font = Math.round(screenSize / ratio);
        if(document.body.className.indexOf("desktop") !== -1 && aspectRatio < 1.5)
        {
            font = (appHeight / 1.55)/ ratio;
        }
        
        if(oldfont !== font && font !== 0)
        {
            
            font = Math.round(font);
            if(document.body && document.body.style)
            {
                document.body.parentNode.style.fontSize = font+"px";
                document.body.style.fontSize = font+"px";  
            }
                      
        }
        else if(font === 0)
        {
            window.setTimeout(windowSize, 50);
        }
        // var desktop = false;
        // if(document.body.className.indexOf("desktop") !== -1)
        // {
        //     ratio = 30;
        //     desktop = true;
        //     var fontDesktop = Math.round(document.getElementById("shoutWrapper").clientWidth / ratio);
        // }
        
        var results = {aspectRatio:aspectRatio, font: font, appWidth: appWidth, appHeight:appHeight, layout: layout, screenW:screenW, screenH:screenH};
        log.info("windowSize results: {}",results);
        return results;
    }
    else
    {
        return {aspectRatio:aspectRatio, font: oldfont, appWidth: appWidth, appHeight:appHeight, layout: layout, screenW:screenW, screenH:screenH};
    }
    	
};

if ( typeof exports !== "undefined" ) {
    module.exports = windowSize;
}
else if ( typeof define === "function" ) {
    define( "com.component.windowSize", windowSize);
}
else {
    window.windowSize = windowSize;
}
//# sourceURL=/modules/com/component/windowSize.js