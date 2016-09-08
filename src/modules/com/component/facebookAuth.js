(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     // js.src = "//connect.facebook.net/en_US/sdk.js";
     // modules/libs/facebook.js
     js.src = "modules/libs/facebook.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

var ko = require("ko");
var FB_loaded = ko.observable(false);
var AppData = requireLocal("AppData");
var FACEBOOK_APPID = null;
if(AppData.serverType === "PRODUCTION")
{
    // if(appId === "MyMadrid" && appMode === "EMBEDDED")
    // {
    //     FACEBOOK_APPID = 233169016830819;
    // }
    // else
    // {
        FACEBOOK_APPID = 110374572379171;
    // }
}
else
{
    // 821886847904151
    if(AppData.qsp.canvasTest)
        FACEBOOK_APPID = 821886847904151;
    else
        FACEBOOK_APPID = 156964854369573;
}


if(AppData.appMode === "EMBEDDED")
{
    // No Facebook
    log.log("index.requireDone EMBEDDED no Facebook");
}
else
{
    window.fbAsyncInit = function() {
        FB.init({
            appId      : FACEBOOK_APPID,
            xfbml      : true,
            version    : 'v2.6'
        });
        FB_loaded(true);
    };
}


var facebookAuth = function(id)
{
    var Deferred = require("Deferred"); 
    var ajax = require("ajax");
    var self = this;
    var FACEBOOK_VERSION = 'v2.3';
    
    
    this.facebookAccessToken = null;
    this.faceBookLogin = ko.observable();
    this.status = ko.observable("INIT");
    this.friends = ko.observableArray([]);

    var graphHost = "graph.facebook.com";

    var graphRequest = function(graph, method)
    {
        method = method || "GET";
        var url = "https://"+graphHost+"/"+FACEBOOK_VERSION+"/"+graph;
        var deferred = new Deferred();
        var data = {};
        data.access_token = self.facebookAccessToken;
        ajax(
        {
            url: url,
            method: method,
            data: data
        }).done(function(result){
            deferred.resolve(result);
        }).fail(function(errorObj)
        {
            deferred.reject(errorObj);
        });
        return deferred.promise();
    };
    //login to facebook
    
    var onFacebookLogin = function(response)
    {
        var deferrdedResult = new Deferred();
        var data = response;
        data.facebookId = response.id;
        data.email = response.email;
        data.photoUrl = "http://graph.facebook.com/"+response.id+"/picture";
        data.firstName = response.first_name;
        data.lastName = response.last_name;
        var local = response.locale.split("_");
        data.languageCode = local[0];
        data.countryCode = local[1];
        data.accessToken = self.facebookAccessToken;
        data.fb_appId = FACEBOOK_APPID;
        self.faceBookLogin(data);
        
        deferrdedResult.resolve(response);
        self.getFriends();
        return deferrdedResult.promise();
    };

    var handleStatus = function(response)
    {
        var deferrdedResult = new Deferred();
        log.info("facebookAuth handleStatus: {}", response);
        self.status(response.status);
        if (response.status === 'connected')
        {
            self.facebookAccessToken = response.authResponse.accessToken;
            graphRequest("me").done(function(result)
            {
                onFacebookLogin(result).done(function(result)
                {
                    deferrdedResult.resolve(result);
                }).fail(deferrdedResult.reject);
            }).fail(deferrdedResult.reject);
        } 
        else
        {
            deferrdedResult.resolve(response);
        }
        return deferrdedResult.promise();
    };

    this.getFriends = function()
    {
        var deferred = new Deferred();
        graphRequest('me/friends').done(function(response) 
        {
            if(response && response.data)
            {
                self.friends(response.data);
                deferred.resolve(response.data);
            }
            else if(response.error.type === "OAuthException")
            {
                self.getStatus().done(function(result)
                {
                    if(self.friends().length > 0)
                    {
                        deferred.resolve(self.friends());
                    }
                    else
                    {
                        self.friends.subscribe(function(friends)
                        {
                            deferred.resolve(friends);
                        });
                    }
                }); 
            }
        }).fail(function(errorObj)
        {
            deferred.reject(errorObj);
        });
        return deferred.promise();
    };

    this.getStatus = function(retry)
    {
        log.info("FB getStatus: "+retry);
        retry = retry || 0;
        retry++;
        var deferred = new Deferred();
        if(window.FB && FB_loaded())
        {
            log.info("FB getStatus FB_loaded");
            FB.getLoginStatus(function(fbStatus) //TODO UNDO
            {
                handleStatus(fbStatus).done(function(result)
                {
                    deferred.resolve(fbStatus);
                }).fail(function(errorObj){
                    log.warn("FB getStatus FB_loaded: {}", errorObj);
                    deferred.reject(errorObj);
                });
            });
        }
        else if(!window.FB)
        {
            log.info("FacebookAuth getStatus NO_FB");
            window.setTimeout(function()
            {
                self.getStatus(retry).done(deferred.resolve).fail(deferred.reject);
            }, 10*retry);
        }
        else
        {
            log.info("FacebookAuth getStatus NO_FB_loaded");
            if(retry < 30)
            {
                window.setTimeout(function()
                {
                    self.getStatus(retry).done(deferred.resolve).fail(deferred.reject);
                }, 10*retry);
            }
            else
            {
                if(FB_loaded() === false)
                {
                    deferred.reject({errorMessage: "Facebook API Timeout", errorType: "FaceBookTimeout"});
                }
            }
        }  
        return deferred.promise();
    };

    this.login = function(display)
    {
        log.info("facebookAuth Logging into facebook");
        var deferred = new Deferred();
        //https://developers.facebook.com/docs/reference/dialogs/oauth/
        if(AppData.appMode === "FACEBOOK_CANVAS")
        {
            FB.login(function(response) {
                handleStatus(response).done(function(result)
                {
                    deferred.resolve(result);
                }).fail(deferred.reject);
            }, {scope: 'public_profile, user_friends, email'});
        }
        else// if(appMode !== "EMBEDDED")
        {
            var arr = document.URL.split('?');
            var baseUrl = arr[0];
            var facebookRtn = "";
            var location = baseUrl;
            if(arr[1])
            {
                facebookRtn = arr[1].split("#")[0].replace(new RegExp("=", 'g'), "_EQUALS_").replace(new RegExp("&", 'g'), "_AND_");
                location += '?facebookRtn='+facebookRtn;
            }
            
            var newLocation = 'https://www.facebook.com/dialog/oauth?client_id='+FACEBOOK_APPID+'&redirect_uri='+location+'&scope=email,public_profile,user_friends';
            log.info("facebookAuth Logging into facebook newLocation: "+newLocation);
            window.location.href = newLocation;
        }
        return deferred.promise();
    };

    this.buy = function(data)
    {
        debugger;
        // TODO GET CURRENCY
        // TODO GET METHOD
        // TODO MAKE PURCHASE
    };
};
if ( typeof exports !== "undefined" ) {
    module.exports = facebookAuth;
}
else if ( typeof define === "function" ) {
    define("com.component.facebookAuth", facebookAuth);
}
else {
    window.facebookAuth = facebookAuth;
}
//# sourceURL=/modules/com/component/facebookAuth.js