var Languages = [
	{code: "en", text: "English"},
	{code: "fr", text: "Francais"}, 
	{code: "de", text: "Deutsche"}, 
	{code: "it", text: "Italiano"}, 
	{code: "hi", text: "हिंदुस्तानी"}, 
	{code: "ja", text: "日本語"}, 
	{code: "es", text: "Español"}, 
	{code: "ru", text: "Pусский"}, 
	{code: "pt", text: "Português"}, 
	{code: "zh-cn", text: "中文"}, 
	{code: "ar", text: "العربية"}
	];
Languages.getLanguage = function(lc)
{
	var len = this.length;
	var rtn = null;
	for(var i=0;i<len;i++)
	{
		if(lc === this[i].code)
		{
			rtn = this[i];
			break;
		}
	}
	return rtn;
};
if ( typeof exports !== "undefined" ) {
    module.exports = Languages;
}
else if ( typeof define === "function" ) {
    define("com.component.Languages", Languages);
}
else {
    window.Languages = Languages;
}