/*
* Profile Image Generator
*/

var ProfileImage = function(profiles, subscriber)
{
	var self = this;
	var ko = require("ko");
	this.profiles = profiles || {};
	this.subscriber = subscriber();
	this.get = function(subscriberId, avatarUrl)
	{
		var rtn = null;
		if(subscriberId === self.subscriber.subscriberId)
		{
			rtn = validateURL(self.subscriber.photoUrl) || validateURL(avatarUrl);
		}
		else
		{
			if(self.profiles[subscriberId]) // Check Profile
			{
				var publicData = self.profiles[subscriberId];
				if(publicData.photoUrl)
				{
					rtn = validateURL(publicData.photoUrl);
				}
			}
			if(!rtn || avatarUrl) // Check Avatar
			{
				rtn = validateURL(avatarUrl);
			}
		}	
		return rtn;
	};

	this.set = function(subscriberId, image)
	{
		if(!self.profiles[subscriberId])
			self.profiles[subscriberId] = {subscriberId: subscriberId, photoUrl: image};
		else
			self.profiles[subscriberId].image = image;
	};

	var validateURL = function(url)
	{
		if((url && url.indexOf("@") !== -1) || url === "http://graph.facebook.com/null/picture")
		{
			url = null;
		}
		return url;
	};

	var user = null;
	var bg = null;
	this.generateProfileImage = function(subscriberId)
    {
        //Generates a random profile image
        var numBGs = 28, numUsers = 9;
        if(!bg)
        {
        	bg = Math.floor(Math.random() * numBGs) + 1
        }
        if(!user)
        {
        	user = Math.floor(Math.random() * numUsers) + 1
        }

        var image = "url('images/ProfileImages/user" + user + ".png'),url('images/ProfileImages/bg" + bg + ".png')";
        
        self.set(subscriberId, image);
        
        return image;
        // return {bg: bg, user: user};
    };
	// if(player.avatarUrl)
 //    {
 //        if(player.avatarUrl.indexOf("@") !== -1 || player.avatarUrl === "http://graph.facebook.com/null/picture")
 //        {
 //            player.avatarUrl = null;
 //        }
 //    }
 //    var publicData = self.dataModel.otherPublicProfileData[player.subscriberId];
 //    if(publicData && publicData() && publicData().photoUrl)
 //    {
 //        player.avatarUrl = publicData().photoUrl;
 //    }

	// this.player1ImageData = ko.observable(null);
 //    this.player2ImageData = ko.observable(null);

 //    this.player1Image = ko.observable();

 //    this.preLoadedImages =  [];

	// this.player2Image = ko.observable();

 //    this.player2ImageCalculated = ko.computed(function()
 //   {   
 //       if (self.player2Image())
 //       {
 //           if(self.player2Image().indexOf("@") !== -1 || self.player2Image().indexOf("null") !== -1)
 //           {
 //               self.player2Image(null);
 //           }
 //       }
 //       var image = self.waitingToBePaired() ? 'url(\'images/EventScreen/questionMark.png\')' : (self.player2Image() ? 'url(\'' + self.player2Image() + '\')' : getProfileImage(2));
 //       return image;
 //   });



	// var getProfileImage = function(side)
 //    {
 //        //If there is image data, returns a generated image, otherwise returns the default noProfile Image
 //        if(side == 1)
 //        {
 //            if(self.player1ImageData())
 //                return "url('images/ProfileImages/user" + self.player1ImageData().user + ".png'),url('images/ProfileImages/bg" + self.player1ImageData().bg + ".png') ";
 //            else 
 //                return "url('images/EventScreen/noProfile.png')";
 //        }
 //        else if(side == 2)
 //        {
 //            if(self.player2ImageData())
 //                return "url('images/ProfileImages/user" + self.player2ImageData().user + ".png'),url('images/ProfileImages/bg" + self.player2ImageData().bg + ".png') ";
 //            else 
 //                return "url('images/EventScreen/noProfile.png')";
 //        }
 //    };

 //    this.player1ImageCalculated = ko.computed(function()
 //    {
 //        // var image = self.player1Image() ? 'url(\'' + self.player1Image() + '\')' : getProfileImage(1);
 //        // return image;
 //        if (self.player1Image())
 //        {
 //            if(self.player1Image().indexOf("@") !== -1 )
 //            {
 //                self.player1Image(null);
 //            }

 //        }
 //        var image = self.player1Image() ? 'url(\'' + self.player1Image() + '\')' : getProfileImage(1);
 //        return image;
 //    });

 //    log.info("EventScreenController.update persistenceDeferred");
 //        var persistenceDeferred = self.dataModel.loadPersistedImages();
 //        var personImageDeferreds = [];
 //        if(self.player1Image() && self.preLoadedImages.indexOf(self.player1Image()) == -1)
 //        {
 //            personImageDeferreds.push(Util.preLoadImg(self.player1Image()));
 //            self.preLoadedImages.push(self.player1Image());
 //        }
 //        if(self.player2Image() && self.preLoadedImages.indexOf(self.player2Image()) == -1)
 //        {
 //            personImageDeferreds.push(Util.preLoadImg(self.player2Image()));
 //            self.preLoadedImages.push(self.player2Image());
 //        }

 //        findThrowdowns(self.dataModel.powerUps.usedPowerUps());

        
 //        $.when(persistenceDeferred).always(function(persistence)
 //        {
 //            log.info("EventScreenController.update persistenceDeferred always");
 //            if(!persistence)
 //                persistence = {};
 //            //If the persistence is a sting, parse it into json
 //            if(Util.isString(persistence))
 //                persistence = JSON.parse(persistence);

 //            var image1 = persistence["p" + 1 +"e" + eventObj.eventId];
 //            var image2 = persistence["p" + 2 +"e" + eventObj.eventId];
 //            if(!self.player1Image() && !image1)
 //            {
 //                //There is no stored image and we need one, so generate it.
 //                image1 = generateProfileImage();
 //                persistence["p" + 1 +"e" + eventObj.eventId] = {bg: image1.bg, user: image1.user, createDate: new Date().getTime()};
 //            }
 //            if(!self.player2Image() && !image2)
 //            {
 //                //There is no stored image and we need one, so generate it.
 //                image2 = generateProfileImage();
 //                persistence["p" + 2 +"e" + eventObj.eventId] = {bg: image2.bg, user: image2.user, createDate: new Date().getTime()};
 //            }
 //            if(image1)
 //            {
 //                //the person image is a generic one
 //                if(self.preLoadedImages.indexOf("images/ProfileImages/user" + image1.user + ".png") == -1)
 //                {
 //                    personImageDeferreds.push(Util.preLoadImg("images/ProfileImages/user" + image1.user + ".png"));
 //                    self.preLoadedImages.push("images/ProfileImages/user" + image1.user + ".png");
 //                }
 //                if(self.preLoadedImages.indexOf("images/ProfileImages/bg" + image1.bg + ".png") == -1)
 //                {
 //                    personImageDeferreds.push(Util.preLoadImg("images/ProfileImages/bg" + image1.bg + ".png"));
 //                    self.preLoadedImages.push("images/ProfileImages/bg" + image1.bg + ".png");
 //                }
 //            }
 //            if(image2)
 //            {
 //                //the person image is a generic one
 //                if(self.preLoadedImages.indexOf("images/ProfileImages/user" + image2.user + ".png") == -1)
 //                {
 //                    personImageDeferreds.push(Util.preLoadImg("images/ProfileImages/user" + image2.user + ".png"));
 //                    self.preLoadedImages.push("images/ProfileImages/user" + image2.user + ".png");
 //                }
 //                if(self.preLoadedImages.indexOf("images/ProfileImages/bg" + image2.bg + ".png") == -1)
 //                {
 //                    personImageDeferreds.push(Util.preLoadImg("images/ProfileImages/bg" + image2.bg + ".png"));
 //                    self.preLoadedImages.push("images/ProfileImages/bg" + image2.bg + ".png");
 //                }
 //            }
 //            //if this data is there, we will use the generic image, otherwise we will use the facebook image
 //            self.player1ImageData(image1);
 //            self.player2ImageData(image2);

 //            var numSlots = 20;
 //            var images = [];
 //            for (var key in persistence)
 //            {
 //                if (persistence.hasOwnProperty(key))
 //                {
 //                    //Copy the persisted key and add the key attribute to it
 //                    var newObj = $.extend(true, {}, persistence[key]);
 //                    newObj.key = key;
 //                    images.push(newObj);
 //                }
 //            }

 //            images.sort(function(a, b){
 //                var keyA = a.createDate,
 //                keyB = b.createDate;
 //                // Compare the 2 dates, with the 
 //                if(keyA < keyB) return 1;
 //                if(keyA > keyB) return -1;
 //                return 0;
 //            });
 //            if(images.length > numSlots)
 //            {
 //                //We have too many stored images, delete the last one
 //                delete persistence[images[images.length - 1].key];
 //            }
 //            //TODO: only save the persistence if it changed
            
 //            //Save the new persistence data
 //            self.dataModel.setPersistedImages(persistence);
 //            $.when.apply($, personImageDeferreds).always(function()
 //            {
 //                log.info("EventScreenController.update personImageDeferreds always");
 //                //The images have been preloaded, animate pairing
 //                self.loadedEvent = self.eventObj().eventId;
 //                if(!self.hasAnimatedPairing())
 //                    animatePairing();
 //            });
 //        });
	
};
module.exports = ProfileImage;
//# sourceURL=/modules/com/component/ProfileImage.js
