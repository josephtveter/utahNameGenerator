// usage var touch = new Touch(elementId, callback, eventType)
var Touch = function(element, callback, eventType, outOfScope, screenId)
{
	var ko = require("ko");
	var self = this;
	// this.iscroll;
	this.timeStart = null;
	this.timeEnd = null;
	this.screenId = screenId;
	this.touchMove = null;
	this.touching = null;
	this.touchHold = null;
	this.threshold = 10 * (window.devicePixelRatio || 1);
	this.touched = null;
	
	this.refreshingTime = 600;
	this.pullToRefreshSnapBack = 400;
	this.currentPosition = {x:0, y:0};
	this.element = element;
	this.callback = callback;
	this.eventType = eventType;
	this.mouseDownCount = null;
	this.status = "PASSIVE"; //"ACTIVE"
	this.endTouch = false;
	this.pulled = false;
	this.release = false;
	var subscribe = null;

	var touchstart = function(e)
	{
		self.endTouch = false;
		self.pulled = false;
		self.release = false;
		if(self.touching)
			self.touching(true);

		if(self.touchMove)
			self.touchMove(false);

		self.touchHold = null;
		
		self.timeStart = (new Date()).getTime();
		if(e.touches)
		{
			self.touched[0] = {x:e.touches[0].pageX, y:e.touches[0].pageY};
		}
		else
		{
			self.touched[0] = {x:e.pageX, y:e.pageY};
		}
		
		if(self.eventType === "TOUCH_START")
		{
			self.callback();
		}
		else if(self.eventType === "SCROLL")
		{
			// touchPullDown({action: "INIT"});
		}
	};

	var findDirection = function(e)
	{
		var rtn = {};
		if(e.changedTouches)
		{
			self.touched[1] = {x:e.changedTouches[0].pageX, y:e.changedTouches[0].pageY};
			rtn.changeX = self.touched[0].x - self.touched[1].x;
			rtn.changeY = self.touched[0].y - self.touched[1].y;
			rtn.distance = Math.sqrt(Math.pow(rtn.changeX, 2) + Math.pow(rtn.changeY, 2));
			rtn.diffX = self.currentPosition.x + e.changedTouches[0].pageX - self.touched[0].x;
			rtn.diffY = self.currentPosition.y + e.changedTouches[0].pageY - self.touched[0].y;

		}
		else
		{
			self.touched[1] = {x:e.pageX, y:e.pageY, timeStamp: (new Date()).getTime()};
			rtn.changeX = self.touched[0].x - self.touched[1].x;
			rtn.changeY = self.touched[0].y - self.touched[1].y;
			rtn.distance = Math.sqrt(Math.pow(rtn.changeX, 2) + Math.pow(rtn.changeY, 2));
			rtn.diffX = self.currentPosition.x + e.pageX - self.touched[0].x;
			rtn.diffY = self.currentPosition.y + e.pageY - self.touched[0].y;	
		}
		// changed = null;
		return rtn;
	};
	var getDistance = function(e)
	{
		var distance = 0;
		if(self.touched[1] && self.touched[0])
		{
			var changeX = self.touched[0].x - self.touched[1].x;
			var changeY = self.touched[0].y - self.touched[1].y;
			distance = Math.sqrt(Math.pow(changeX, 2) + Math.pow(changeY, 2));
		}
		return distance;
	};

	var touchend = function(e)
	{
		self.timeEnd = (new Date()).getTime();
		if(e.touches && e.touches.length > 0)
		{
			self.touched[1] = {x:e.touches[0].pageX, y:e.touches[0].pageY};
		}
		else if(e.pageX)
		{
			self.touched[1] = {x:e.pageX, y:e.pageY};
		}
		else if(e.changedTouches && e.changedTouches.length > 0)
		{
			self.touched[1] = {x:e.changedTouches[0].pageX, y:e.changedTouches[0].pageY};
		}

		          
		var distance = getDistance(e);
		var changeX = 0;
		var changeY = 0;
		var isOutOfScope = false;
		var diffX = 0;
		var diffY = 0;
		

		if(!self.touched[0])
		{
			isOutOfScope = true;
		}

		if(isOutOfScope)
		{
			if(self.mouseDownCount)
				self.mouseDownCount(0);
		}
		else if(self.eventType === "HOLD" && self.timeStart + 1000 < self.timeEnd) //Hold
		{
			
			if(distance < self.threshold)
			{
				// Util.info("Touch.touchend eventType HOLD");
			}
		}
		else if(self.eventType === "TAP" && self.timeStart + 200 > self.timeEnd) // Tap
		{
			// log.info("Touch.end TAP distance: "+distance+ " Threshold: "+self.threshold);
			if(distance < self.threshold)
			{
				touchTap(e);
			}
		}
		else if(self.eventType === "SWIPE") // Swipe
		{
			// Util.info("Touch,touchEnd: SWIPE");
			if(Math.abs(changeX) > Math.abs(changeY)*2)// TODO threshold
			{
				if(changeX < 0)
				{
					// Util.info("Touch.touchend SWIPE_RIGHT");
					touchSwipeRight(e);
				}
				else
				{
					// Util.info("Touch.touchend SWIPE_LEFT");
					touchSwipeLeft(e);
				}
			}
		}
		else if(self.eventType === "TOUCH_END")
		{
			self.callback(e);
		}
		self.touched = [];

		if(self.touching)
			self.touching(false);
	};

	var touchClick = function(e)
	{
		if(!self.touchMove() || distance < self.threshold) // Tap
		{
			// Util.info("Touch.touchend TAP");
			touchTap(e);
		}
	};

	var touchcancel = function(e)
	{
		// Util.info("Touch.touchcxancel");
	};

	var touchleave = function(e)
	{
		// Util.info("touchleave");
	};

	var touchmove = function(e)
	{
		// Util.warn("touchmove");
		if(self.eventType === "SCROLL" || self.eventType === "RANGE")
		{
			mouseMove(e);
		}
		else
		{
			// e.preventDefault();
			if(self.touchMove)
				self.touchMove(true);
		}
			
	};

	var touchTap = function(e)
	{
		// Util.info("Touch.touchTap");
		if(self.eventType === "TAP")
		{
			if(self.element.nodeName !== "SELECT")
			{
				if(self.endTouch) 
				{
		            return;
		        }
		        self.endTouch = true;

				self.callback(e, true); // event, touched
				e.preventDefault();
				// e.stopPropagation();
			}
			// self.element.nodeName: "SELECT"	TODO HANDEL SELECT
		}
	};

	var touchPullDown = function(e)
	{
		self.callback(e);
	};

	var touchPullUp = function(e)
	{
		// Util.info("Touch.touchPullUp");
	};

	var touchSwipeLeft = function(e)
	{
		// Util.info("Touch.touchSwipeLeft");
		if(self.eventType === "SWIPE")
		{
			self.callback({swipe: "LEFT"}); // event, touched
			e.preventDefault();
			e.stopPropagation();
		}
	};

	var touchSwipeRight = function(e)
	{
		if(self.eventType === "SWIPE")
		{
			self.callback({swipe: "RIGHT"}); // event, touched
			e.preventDefault();
			e.stopPropagation();
		}
	};


	var mouseMove = function(e)
	{
	};

	var onMouseScroll = function(e)
	{
		// Util.warn("Touch onMouseScroll");
		mouseMove(e);
	};

	var onWheel = function(e)
	{
		// Util.warn("Touch onWheel");
	};

	// MOUSE TOUCHING Logic

	var onMouseDown = function(e)
	{
		if(self.mouseDownCount)
		{
			self.mouseDownCount(self.mouseDownCount()+1);
		}
		// touchstart(e);
	};

	var onMouseUp = function(e)
	{
		if(self.mouseDownCount)
		{
			count = self.mouseDownCount()-1 < 0 ? 0 : self.mouseDownCount()-1;
			self.mouseDownCount(count);
		}
			
		// touchend(e);
	};

	var UNDEFINED = "undefined";
	var testRx = function(agent, rxs, dflt) {
        for (var rx in rxs) {
            if (rxs.hasOwnProperty(rx) && rxs[rx].test(agent)) {
                return rx;
            }
        }
        return dflt !== undefined ? dflt : agent;
    };

	var support = {};// TODO MAKE SUPPORT A CLASS

	support.detectOS = function (ua) {
        var os = false, minorVersion, match = [],
            notAndroidPhone = !/mobile safari/i.test(ua),
            agentRxs = {
                wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
                fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
                android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.(\d+(\.\d+)?)/,
                iphone: /(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,
                ipad: /(iPad).*OS\s+(\d+)[\._]([\d_]+)/,
                meego: /(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,
                webos: /(webOS)\/(\d+)\.(\d+(\.\d+)?)/,
                blackberry: /(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,
                playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
                windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
                tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
                sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,
                ffos: /(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/
            },
            osRxs = {
                ios: /^i(phone|pad|pod)$/i,
                android: /^android|fire$/i,
                blackberry: /^blackberry|playbook/i,
                windows: /windows/,
                wp: /wp/,
                flat: /sailfish|ffos|tizen/i,
                meego: /meego/
            },
            formFactorRxs = {
                tablet: /playbook|ipad|fire/i
            },
            browserRxs = {
                omini: /Opera\sMini/i,
                omobile: /Opera\sMobi/i,
                firefox: /Firefox|Fennec/i,
                mobilesafari: /version\/.*safari/i,
                ie: /MSIE|Windows\sPhone/i,
                chrome: /chrome|crios/i,
                webkit: /webkit/i
            };

        for (var agent in agentRxs) {
            if (agentRxs.hasOwnProperty(agent)) {
                match = ua.match(agentRxs[agent]);
                if (match) {
                    if (agent == "windows" && "plugins" in navigator) { return false; } // Break if not Metro/Mobile Windows

                    os = {};
                    os.device = agent;
                    os.tablet = testRx(agent, formFactorRxs, false);
                    os.browser = testRx(ua, browserRxs, "default");
                    os.name = testRx(agent, osRxs);
                    os[os.name] = true;
                    os.majorVersion = match[2];
                    os.minorVersion = match[3].replace("_", ".");
                    minorVersion = os.minorVersion.replace(".", "").substr(0, 2);
                    os.flatVersion = os.majorVersion + minorVersion + (new Array(3 - (minorVersion.length < 3 ? minorVersion.length : 2)).join("0"));
                    os.cordova = typeof window.PhoneGap !== UNDEFINED || typeof window.cordova !== UNDEFINED; // Use file protocol to detect appModes.
                    os.appMode = window.navigator.standalone || (/file|local|wmapp/).test(window.location.protocol) || os.cordova; // Use file protocol to detect appModes.

                    if (os.android && (support.devicePixelRatio < 1.5 && os.flatVersion < 400 || notAndroidPhone) && (support.screenWidth > 800 || support.screenHeight > 800)) {
                        os.tablet = agent;
                    }

                    break;
                }
            }
        }
        return os;
    };

    var mobileOS = support.mobileOS = support.detectOS(navigator.userAgent);

	support.touch = "ontouchstart" in window;
    support.msPointers = window.MSPointerEvent;
    support.pointers = window.PointerEvent;
    support.mouseAndTouchPresent = support.touch && !(support.mobileOS.ios || support.mobileOS.android);

    var eventMap = {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
        cancel: "mouseleave"
    };

    if (support.touch && (support.mobileOS.ios || support.mobileOS.android)) {
        eventMap = {
            down: "touchstart",
            move: "touchmove",
            up: "touchend", //touchcancel
            cancel: "touchcancel"
        };
    } else if (support.pointers) {
        eventMap = {
            down: "pointerdown",
            move: "pointermove",
            up: "pointerup",
            cancel: "pointercancel" //pointerleave
        };
    } else if (support.msPointers) {
        eventMap = {
            down: "MSPointerDown",
            move: "MSPointerMove",
            up: "MSPointerUp",
            cancel: "MSPointerCancel" // MSPointerLeave
        };
    }

	this.init = function(screenId)
	{
		self.status = "ACTIVE";
		self.touched = [];
		this.touchMove = ko.observable(false);
		this.touching = ko.observable(false);
		switch(self.eventType)
		{
			case "TAP":
				self.element.addEventListener(eventMap.move, touchmove, false);
				self.element.addEventListener(eventMap.down, touchstart, false);
				self.element.addEventListener(eventMap.up, touchend, false);
				// self.element.addEventListener(eventMap.cancel, touchend, false);
			break;
			case "TOUCH_START":
				self.element.addEventListener(eventMap.down, touchstart, false);
			break;
			case "RANGE":
				self.element.addEventListener(eventMap.move, touchmove, false);
				self.element.addEventListener(eventMap.down, touchstart, false);
				self.element.addEventListener(eventMap.up, touchend, false);
				// self.element.addEventListener(eventMap.cancel, touchend, false);
				self.mouseDownCount = ko.observable(0);
				if("onmousedown" in window)
				{
					self.element.addEventListener("mousedown", onMouseDown, false);
					self.element.addEventListener("mouseup", onMouseUp, false);
				}
				subscribe = self.mouseDownCount.subscribe(function(val)
				{
					if(val <= 0)
					{
						self.touching(false);
					}
					else
					{
						self.touching(true);
					}
				});

			break;
			default:
				break;
		}
	};
	if(self.status !== "ACTIVE")
	{
		self.init(self.screenId);
	}

	this.destroy = function()
	{
		self.status = "PASSIVE";
		self.touched = null;
		this.touchMove = null;
		this.touching = null;
		switch(self.eventType)
		{
			case "TAP":
			// 	self.element.removeEventListener(eventMap.move, touchmove, false);
			// 	self.element.removeEventListener(eventMap.down, touchstart, false);
			// 	self.element.removeEventListener(eventMap.up, touchend, false);
			// break;
			case "TOUCH_START":
				// self.element.removeEventListener(eventMap.down, touchstart, false);
			break;
			case "RANGE":
				// self.element.removeEventListener(eventMap.move, touchmove, false);
				// self.element.removeEventListener(eventMap.down, touchstart, false);
				// self.element.removeEventListener(eventMap.up, touchend);

				if("onmousedown" in window)
				{
					// self.element.removeEventListener("mousedown", onMouseDown, false);
					// self.element.removeEventListener("mouseup", onMouseUp, false);
				}
				if(subscribe)
				{
					subscribe.dispose();
					subscribe = null;
				}
				self.mouseDownCount = null;
			break;
			case "SWIPE":
				// self.element.removeEventListener(eventMap.down, touchstart, false);
				// self.element.removeEventListener(eventMap.up, touchend, false);
			break;
			default:
				break;
		}
	};

};

if ( typeof exports !== "undefined" ) {
    module.exports = Touch;
}
else if ( typeof define === "function" ) {
    define( "com.component.Touch", Touch);
}
else {
    window.Touch = Touch;
}
//# sourceURL=/modules/com/component/Touch.js