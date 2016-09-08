var getVidId = function(url)
{
	var vidId;
	if(url.indexOf("youtube.com/watch?v=") !== -1)//https://m.youtube.com/watch?v=e3S9KINoH2M
	{
		vidId = url.substr(url.indexOf("youtube.com/watch?v=") + 20);
	}
	else if(url.indexOf("youtube.com/watch/?v=") !== -1)//https://m.youtube.com/watch/?v=e3S9KINoH2M
	{
		vidId = url.substr(url.indexOf("youtube.com/watch/?v=") + 21);
	}
	else if(url.indexOf("youtu.be") !== -1)
	{
		vidId = url.substr(url.indexOf("youtu.be") + 9);
	}
	else if(url.indexOf("www.youtube.com/embed/") !== -1)
	{
		vidId = url.substr(url.indexOf("www.youtube.com/embed/") + 22);
	}
	else if(url.indexOf("?v=") !== -1)// http://m.youtube.com/?v=tbBTNCfe1Bc
	{
		vidId = url.substr(url.indexOf("?v=")+3, 11);
	}
	// else if(url.indexOf("www.facebook.com") !== -1) support from server.
	// {
	// 	vidId = url.substr(url.indexOf("www.facebook.com")+16).split("/")[3];
	// }
	else
	{
		log.info("YouTubeUrlNormalize getVidId not a youTube Video: "+url);
		vidId = null;
	}
	if(vidId && vidId.indexOf("&") !== -1)
	{
		vidId = vidId.substr(0, vidId.indexOf("&") );
	}
	
	return vidId;
};

var YouTubeUrlNormalize = function(url)
{
	var rtn = url;
	if(url)
	{
		var vidId = getVidId(url);
		if(url.indexOf("www.facebook.com") !== -1)
		{
			rtn = url;
		}
		else if(vidId)
		{
			rtn = "https://www.youtube.com/embed/"+vidId;
		}
		else
		{
			rtn = url;
		}
	}
		
	return rtn;
};

YouTubeUrlNormalize.getThumbnail = function(url, num)
{
	var rtn, vidId = getVidId(url);
	if(vidId)
	{
		if(!isNaN(num) && num <= 4 && num >= 0)
		{
			rtn = "http://img.youtube.com/vi/"+vidId+"/"+num+".jpg";
		}
		else
		{
			rtn = "http://img.youtube.com/vi/"+getVidId(url)+"/default.jpg";
		}
	}
	else
	{
		return null;
	}
	return rtn;
};

YouTubeUrlNormalize.getFullImage = function(url)
{
	var vidId = getVidId(url);
	if(vidId)
	{
		return "http://img.youtube.com/vi/"+vidId+"/0.jpg";
	}
	else
	{
		return null;
	}
};

YouTubeUrlNormalize.isYouTubeVideo = function(url)
{
	var vidId = getVidId(url);
	return vidId ? true : false;
};

YouTubeUrlNormalize.isFacebookURL = function(url)
{
	var rtn = false;
	if(url && (url.indexOf("fbcdn") !== -1 || url.indexOf("facebook") !== -1))
	{
		rtn = true;
	}
	return rtn;
};

if ( typeof exports !== "undefined" ) {
    module.exports = YouTubeUrlNormalize;
}
else if ( typeof define === "function" ) {
    define("com.component.YouTubeUrlNormalize" ,YouTubeUrlNormalize);
}
else {
    window.YouTubeUrlNormalize = YouTubeUrlNormalize;
}