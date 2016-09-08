var SystemDetect = function()
{
    var self = this;
    self.ua = navigator.userAgent;
    this.browser = null;
    this.version = null;
    this.os = null;
    this.mobileDevice = null;
    this.standalone = null;
    self.dataOS = null;
    self.osVersion = null;

    var isFacebookEmbedded = function()
    {
        return self.ua.indexOf("FBAN") > -1;
    };

    var isFlexSupported = function()
    {
        var supported = true;
        var isPropertySupported = function(property)
        {
            var found = false;
            var prefix = ["", "-webkit-", "-moz-", "-o-"];
            if(document.body && document.body.style)
            {
                for(var i=0;i<prefix.length;i++)
                {
                    if(document.body.style[prefix[i]+property] || document.body.style[prefix[i]+property] === "")
                    {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        };

        if(!isPropertySupported("flex"))
        {
            supported = false;
        }
        return supported;
    };

    this.searchString = function(data) 
    {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            self.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    };

    this.searchVersion = function(dataString)
    {
        var index = dataString.indexOf(self.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+self.versionSearchString.length+1));
    };

    this.iosVersion = function()
    {
        var deviceAgent = self.ua.toLowerCase();
        if(/(iphone|ipod|ipad).* os 6_/.test(deviceAgent))
        {
            self.osVersion = 6;
        }
        else if(/(iphone|ipod|ipad).* os 7_/.test(deviceAgent))
        {
            self.osVersion = 7;
        }
        else if(/(iphone|ipod|ipad).* os 8_/.test(deviceAgent))
        {
            self.osVersion = 8;
        }
        else if(/(iphone|ipod|ipad).* os 9_/.test(deviceAgent))
        {
            self.osVersion = 9;
        }
        else if(/(iphone|ipod|ipad).* os 10_/.test(deviceAgent))
        {
            self.osVersion = 10;
        }
        
        return self.osVersion;
    };

    this.getMobile = function()
    {
        var mobileDevice = null;
        if(self.ua.match(/IEMobile/i) )
        {
            mobileDevice = "iemobile";
        }
        else if(self.ua.match(/Windows Phone/i))
        {
            mobileDevice = "iemobile";
        }
        else if(self.ua.match(/Android/i))
        {
            mobileDevice = "android";
        }
        else if(self.ua.match(/BlackBerry/i) )
        {
            mobileDevice = "blackBerry";
        }
        else if(self.ua.match(/iPhone/i) )
        {
            mobileDevice = "iphone";
            self.iosVersion();
        }
        else if(self.ua.match(/iPad/i) )
        {
            mobileDevice = "ipad";
            self.iosVersion();
        }
        else if(self.ua.match(/iPod/i) )
        {
            mobileDevice = "ipod";
            self.iosVersion();
        }
        else if(self.ua.match(/Opera Mini/i) )
        {
            mobileDevice = "operamini";
        }
        else
        {
            mobileDevice = null;
        }

        return mobileDevice;
    };

    this.dataBrowser = [
        {   string: self.ua,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: self.ua,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: self.ua,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: self.ua,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: self.ua,
            subString: "Trident",
            identity: "Explorer",
            versionSearch: "rv"
        },
        {
            string: self.ua,
            subString: "Edge",
            identity: "Explorer"
        },
        {
            string: self.ua,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: self.ua,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: self.ua,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ];

    this.dataOS = [
        {
            string: navigator.platform,
            subString: "Windows NT 5.1",
            identity: "Windows XP"
        },
        {
            string: self.ua,
            subString: "Windows NT 6.0",
            identity: "Windows Vista"
        },
        {
            string: self.ua,
            subString: "Windows NT 6.1",
            identity: "Windows 7"
        },
        {
            string: self.ua,
            subString: "Windows NT 6.1; Win64; x64",
            identity: "Windows 7 (Win64)"
        },
        {
            string: self.ua,
            subString: "Windows NT 6.2",
            identity: "Windows 8"
        },
        {
            string: self.ua,
            subString: "Windows NT 6.3",
            identity: "Windows 8.1"
        },
        {
            string: self.ua,
            subString: "Windows NT 10",
            identity: "Windows 10"
        },
        {
            string: self.ua,
            subString: "Windows Phone 10",
            identity: "Windows Phone 10"
        },
        {
            string: self.ua,
            subString: "Windows",
            identity: "Windows"
        },
        {
            string: self.ua,
            subString: "Intel MacOS X",
            identity: "Intel MacOS X"
        },
        {
            string: self.ua,
            subString: "Intel Mac OS X",
            identity: "Intel Mac OS X"
        },
        {
            string: self.ua,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: self.ua,
            subString: "MacOS",
            identity: "Mac OS"
        },
        {
            string: self.ua,
            subString: "Mac OS",
            identity: "Mac OS"
        },
        {
            string: self.ua,
            subString: "Linux i686",
            identity: "Linux x86"
        },
        {
            string: self.ua,
            subString: "Linux x86_64",
            identity: "Linux x64"
        },
        {
            string: self.ua,
            subString: "Linux",
            identity: "Linux"
        },
        {
            string: self.ua,
            subString: "Android",
            identity: "Android"
        },
        {
            string: self.ua,
            subString: "FreeBSD i686",
            identity: "FreeBSD x86"
        },
        {
            string: self.ua,
            subString: "FreeBSD x86_64",
            identity: "FreeBSD x64"
        },
        {
            string: self.ua,
            subString: "FreeBSD",
            identity: "FreeBSD"
        },
        {
            string: self.ua,
            subString: "Mobile",
            identity: "Mobile Android"
        },
        {
            string: self.ua,
            subString: "Tablet",
            identity: "Android Tablet"
        }
    ];

    self.browser = self.searchString(self.dataBrowser) || null;
    self.version = self.searchVersion(self.ua) || self.searchVersion(self.ua) || null;
    self.os = self.searchString(self.dataOS) || null;
    self.mobileDevice = self.getMobile();
    self.standalone = window.navigator.standalone;
    self.FBAN = isFacebookEmbedded(); // Facebook ios
    self.FBAV = self.ua.toLowerCase().indexOf("fbav") !== -1 && self.ua.toLowerCase().indexOf("android") !== -1 ? true : false; // Facebook Android
    self.twitter = self.ua.toLowerCase().indexOf("twitter") !== -1 ? true : false;
    self.flex = isFlexSupported();

    return {browser: self.browser, version: self.version, os: self.os, twitter: self.twitter, mobileDevice: self.mobileDevice, standalone: self.standalone, FBAV: self.FBAV ,FBAN: self.FBAN, flex: self.flex, osVersion: self.osVersion};
};
    
if ( typeof exports !== "undefined" ) {
    module.exports = SystemDetect;
}
else if ( typeof define === "function" ) {
    define( "com.component.SystemDetect", SystemDetect);
}
else {
    window.SystemDetect = SystemDetect;
}
//# sourceURL=/modules/com/component/SystemDetect.js