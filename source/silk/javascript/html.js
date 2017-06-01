/*
Irritating differences between how browsers handle HTML5 video. ARGH!

Seeking:
- Firefox 3.6 - DONE pause > seeking > seek > play. unless the video has ended and you press play again, then it's just seeking > seek. AWESOME!
- Chrome 5.0 - DONE seeking > seek  (sometimes sends these 2 events twice. usually, in fact)
- Opera 10.6 - DONE seeking > seek
- Safari 4 and 5 - DONE sends 2 seek events unless you happen to seek right on a keyframe exactly. beautiful. also maybe 1 in 10 times, it doesn't send an initial 'play' event. great!
- MSIE - unknown since IE8 doesn't support it and who knows what IE9 will do. for now, we'll fully disable this for IE users.


- firefox 30:

while playing:

pause 19
seeking 19
play 19
seek 19

if paused:

seeking 19
seek 19

pressing play after an 'end':

play 0
seeking 0
seek 0

*/


var _htmlvid = [], _htmlvidi = 0;

function _htmlvid_track( e ) {
	if( typeof e == "string" ) e = document.getElementById( e );
	if( typeof e != "object" ) return false;
	
	_htmlvidi++;
	_htmlvid[ _htmlvidi ] = new _htmlvido( e, _htmlvidi );
}


function _htmlvido( e, i ) {
	if( !e || !i ) return false; 
	
	// if the browser doesn't support html5 video, we're done.
	if( !document.createElement("video").canPlayType ) return;
	
	// different browsers handle video events differentely, mainly to do with "seeking", so we have to sniff around so we can do it right for each of them.
	// these are grouped by behavior. chrome and opera have nothing to do with each other but they end up working the same way in this case.
	if( navigator.userAgent.match(/firefox/i)) {
		this.browser="firefox";
	}
	else if( navigator.userAgent.match(/chrome|opera/i)) {
		this.browser="chrome";
	}
	else if( navigator.userAgent.match(/safari/i)) {
		this.browser="safari";
	}
	else if( navigator.userAgent.match(/msie/i)) {
		return;
	}
	
	
	this.timer = null;
	this.seeking = this.ended = 0;
	
	// we use both seeking and seeked so we can track the start and end of the seeking process, which helps us deal with some browser oddities/differences.
	e.addEventListener("play",    function(){ _htmlvid[i].videoLog("play");    }, false );
	e.addEventListener("pause",   function(){ _htmlvid[i].videoLog("pause");   }, false );
	e.addEventListener("seeked",  function(){ _htmlvid[i].videoLog("seek");    }, false );
	e.addEventListener("seeking", function(){ _htmlvid[i].videoLog("seeking"); }, false );
	e.addEventListener("ended",   function(){ _htmlvid[i].videoLog("end");     }, false );
	
	this.videoLog = function( action ) {
		
		// $("#html5_log_raw").append( action + " " + this.videoTime() + "<br>" );
		
		if( this.timer ) clearTimeout( this.timer );
		this.timer = null;
		this.do_timer = 0;
		
		if( action == "end"     ) this.ended = 1; // have to keep tracking of when a video ends for firefox because it's stupid
		if( action == "seeking" ) this.seeking = 1;
		if( action == "seek" ) {
			// we ignore 'seek' events entirely, except for safari since it never sends 'seeking'
			if( this.browser == "safari" ) {
				this.seeking = 1;
			}
			else return;
		}
		
		
		if( this.seeking ) {
			// 2014-07-15 ok all browsers now seem to send a 'play' event after seeking has finished.
			// previous most of them just did seeking > seek. so we can make this logic a lot simpler. if this.seeking, we won't do anything until we get a play event.
			if( action == "play" ) {
				this.seeking = 0;
				action = "seek";
			}
			else return;
		}
		
		else if( action == "pause" ) {
			// at first just firefox but now chrome too (so probably all browsers), they send pause events when you seek. so put those in a timer so they get canceled out if we're just seeking.
			this.do_timer = 1;
		}
		
		
		// depending on the browser, we need to only log an event after a brief timeout period. this is only needed for "seeks", which every browser seems to do its own fun way.
		// basically, we unset the timer if another event comes in so this never gets logged.
		// for example with firefox, when doing a seek, it first does a 'pause', but the seek event happens immediately after so the pause gets canceled and never logged.
		if( this.do_timer ) {
			this.timer = setTimeout( function(){ _htmlvid[i].videoLogReal( action ); }, 1000 );
		}
		else this.videoLogReal( action );
	}
	
	
	
	this.videoLogReal = function( action ) {
		// we make this a seperate function so setting a timeout is a bit cleaner
		if( window._genericStats ) _genericStats.video( action, this.videoTime(), this.videoURL(), this.videoTitle());
		
		//if( action=='play'||action=='pause'||action=='seek'||action=='end' ) $("#html5_log").append( action + " " + this.videoTime() + "<br>" );
	}
	
	
	this.videoTime = function() {
		return Math.round( e.currentTime );
	}
	
	this.videoURL = function() {
		if( e.src ) return e.src;
		this.test = e.getElementsByTagName("source");
		if( this.test && this.test[0] && this.test[0].src ) return this.test[0].src;
		return "";
	}
	
	this.videoTitle = function() {
		return e.title || "";
	}
}




// the rest of this code finds all video and audio elements on a page and tracks them automatically. yesss!

function _htmlvid_auto() {
	/*
	 * CONSIDER: Converting each HTMLCollection to an array via
	 *           Array.prototype.slice.call (). Downside is that it's
	 *           supported everywhere except IE 6 (and allegedly unsupported
	 *           in IE up through 8).
	 */
	var videos = document.getElementsByTagName("video");
	var audios = document.getElementsByTagName("audio");
	var i;

	for (i = 0; i < videos.length; i++) {
		// apparently background auto-play looping videos are a thing. don't track those.
		if( videos[i].attributes['loop'] && videos[i].attributes['autoplay'] ) continue;
		_htmlvid_track( videos[i] );
	}

	for (i = 0; i < audios.length; i++) {
		// not sure if auto-play looping audio is also a thing but let's pretend it is.
		if( audios[i].attributes['loop'] && audios[i].attributes['autoplay'] ) continue;
		_htmlvid_track( audios[i] );
	}
}


// if auto-injected by tracking code, that's already on a 1 second delay, so no need to wait another second
// but if this file is included manually (the old way) then we want to wait a second to ensure dom is fully loaded before searching.
if( window._HTML5_NO_DELAY )
	_htmlvid_auto();
else
	setTimeout(_htmlvid_auto, 1000);












