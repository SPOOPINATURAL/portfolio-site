/*
* JS Redirection Mobile
*
* Copyright (c) 2011-2012 Sebastiano Armeli-Battana (http://www.sebastianoarmelibattana.com)
*
* By Sebastiano Armeli-Battana (@sebarmeli) - http://www.sebastianoarmelibattana.com
* Licensed under the MIT license.
* https://github.com/sebarmeli/JS-Redirection-Mobile-Site/blob/master/MIT-LICENSE.txt
*
* @link http://github.com/sebarmeli/JS-Redirection-Mobile-Site
* @author Sebastiano Armeli-Battana
* @date 29/10/2012
* @version 1.0.0
*
*/
	
/*globals window,document, navigator, SA */
if (!window.SA) {window.SA = {};}

SA.redirection_mobile = function(configuration) {

	// Helper function for adding time to the current date -> used by cookie
	var addTimeToDate = function(msec) {
		var exdate = new Date();
		exdate.setTime(exdate.getTime() + msec);
		return exdate;
	};

	// Helper function for getting a value from a parameter in the querystring of a URL
	var getQueryValue = function(param) {

		if (!param) {
			return;
		}

		var querystring = document.location.search,
			queryStringArray = querystring && querystring.substring(1).split("&"),
			i = 0,
			length = queryStringArray.length;

		for (; i < length; i++) {
			var token = queryStringArray[i],
				firstPart = token && token.substring(0, token.indexOf("="));
			if (firstPart === param ) {
				return token.substring(token.indexOf("=") + 1, token.length);
			}
		}

	};
				
	// Retrieve the User Agent of the browser
	var agent = navigator.userAgent.toLowerCase(),
		FALSE = "false",
		TRUE = "true",

		// configuration object
		config = configuration || {},
	
		// parameter to pass in the URL to avoid the redirection
		redirection_param = config.redirection_param || "mobile_redirect",
		
		// prefix appended to the hostname
		mobile_prefix = config.mobile_prefix || "m",
		
		// new url for the mobile site domain 
		mobile_url = config.mobile_url,
		
		// protocol for the mobile site domain 
		mobile_protocol = config.mobile_scheme ?
			config.mobile_scheme + ":" :
				document.location.protocol,
		
		host = document.location.host,

		// value for the parameter passed in the URL to avoid the redirection
		queryValue = getQueryValue(redirection_param),

		// Compose the mobile hostname considering "mobile_url" or "mobile_prefix" + hostname
		mobile_host = mobile_url ||
			(mobile_prefix + "." + 
				(!!host.match(/^www\./i) ?
					host.substring(4) : 
						host)),

		// Expiry hours for cookie
		cookie_hours = config.cookie_hours || 1,
		
		// Parameters to determine if the pathname and the querystring need to be kept
		keep_path = config.keep_path || false,
		keep_query = config.keep_query || false,
		
		//append referrer 
		append_referrer = config.append_referrer || false,
		append_referrer_key = config.append_referrer_key || "original_referrer",

		// new url for the tablet site 
		tablet_host = config.tablet_host || mobile_host,
		isUAMobile = false,
		isUATablet = false;

		// Check if the UA is a mobile one (regexp from http://detectmobilebrowsers.com/ (WURFL))
		if (/(android|bb\d+|meego|iphone|ipod|iemobile|opera mini)/i.test(agent))
			isUAMobile = true;
		}	

	// Check if the referrer was a mobile page (probably the user clicked "Go to full site") or in the 
	// querystring there is a parameter to avoid the redirection such as "?noredireciton=true"
	// (in that case we need to set a variable in the sessionStorage or in the cookie)
	if (document.referrer.indexOf(mobile_host) >= 0 || queryValue === FALSE ) {

		if (window.sessionStorage) {
			window.sessionStorage.setItem(redirection_param, FALSE);
		} else {
			document.cookie = redirection_param + "=" + FALSE + ";expires="+
				addTimeToDate(3600*1000*cookie_hours).toUTCString();
		}
	}

	// Check if the sessionStorage contain the parameter
	var isSessionStorage = (window.sessionStorage) ? 
			(window.sessionStorage.getItem(redirection_param) === FALSE) :
				false,

		// Check if the Cookie has been set up
		isCookieSet = document.cookie ? 
			(document.cookie.indexOf(redirection_param) >= 0) :
				false;

	// Check if the device is a Tablet such as iPad, Samsung Tab, Motorola Xoom or Amazon Kindle
	if (!!(agent.match(/(iPad|SCH-I|xoom|NOOK|silk|kindle|GT-P|touchpad|kindle|sch-t|viewpad|bolt|playbook|Nexus 7)/i))) {
		
		// Check if the redirection needs to happen for tablets
		isUATablet = (config.tablet_redirection === TRUE || !!config.tablet_host) ? true : false;
		isUAMobile = false;
	}

	// Check that User Agent is mobile, cookie is not set or value in the sessionStorage not present
	if ((isUATablet || isUAMobile) && !(isCookieSet || isSessionStorage)) {

		// Callback call
		if (config.beforeredirection_callback) {
			if (!config.beforeredirection_callback.call(this)) {
				return;
			}
		}
		
		var path_query = "";
		
		if(keep_path) { 
			path_query += document.location.pathname;
		}
		
		if (keep_query) {
			path_query += document.location.search;
		}
		
		if (append_referrer && document.referrer) {
			if (path_query.indexOf('?') === -1) {
				path_query += "?";
			} else {
				path_query += "&";
			}
			path_query += append_referrer_key + "=" + encodeURIComponent(document.referrer);
		}
		
		if (isUATablet){
			document.location.href = mobile_protocol + "//" + tablet_host + path_query;
		} else if (isUAMobile) {
			document.location.href = mobile_protocol + "//" + mobile_host + path_query;
		}
		
	} 
};	