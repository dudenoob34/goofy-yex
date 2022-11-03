var link = window.location.href;
SendMessage = gameInstance.SendMessage;

gapi.load('auth2', 
	function()
	{
		gapi.auth2.init({
			client_id: "915464709242-rfu2rodvrmno16hb1l960rsemisjjhej.apps.googleusercontent.com",
			scope: "profile email" // this isn't required
			//ux_mode: "redirect"
		}).then(function(auth2) {
			console.log( "signed in: " + auth2.isSignedIn.get() );  
		}, function(error) {
			console.log(error);
		});
	}
);

function OnApplicationQuit()
{
   SendMessage('CanvasHome', 'OnWebGLApplicationQuit', '');
   return true;
}

window.onbeforeunload = OnApplicationQuit;

window.addEventListener('message', function(event) {
	if(document.referrer.indexOf(".gamedistribution.com/") !== -1)
	{
		origin = document.referrer;
	}
	// Now we check if the origin domain is correct.
	if (!origin.startsWith(event.origin)) return;

	// Did we get data?
	if (!event.data) return;

	// What kind of data?
	if (event.data === 'resume') {
		resumeGame();
	} else if (event.data === 'pause') {
		pauseGame();
	} else if (event.data.referrer) {
		// Partner can use this referrer domain for affiliate purposes.
		console.log('[Partner] Publisher domain: ' +
			event.data.referrer);
	}
}, false);

function resumeGame() {
	console.log('[Partner] Partner resumed the game!');
	// Invoke the game resume method here.
	SendMessage('CanvasBlock', 'ResumeGame', '');
}

function pauseGame() {
	console.log('[Partner] Partner paused the game!');
	// Invoke the game pause method here.
}

function refreshSlot(id) {
	if (typeof aipDisplayTag !== 'undefined')
		aipDisplayTag.refresh(id);
}

var games = 0;
function requestAdvertisement() {
	if(document.referrer.indexOf(".gamedistribution.com") == -1)
	{
		if(games == 0)
		{
			if (typeof adplayer !== 'undefined')
				adplayer.startPreRoll();
			else
				SendMessage('CanvasBlock', 'AdCompleted');
			games = 1;
		}
		else
		{
			SendMessage('CanvasBlock', 'AdCompleted');
			games--;
		}		
	}
	else
	{
		console.log('[Partner] Partner requests advertisement.');
		if(document.referrer.indexOf(".gamedistribution.com/") !== -1)
		{
			origin = document.referrer;
		}
		parent.postMessage('requestAdvertisement', origin);
	}		
}

window.addEventListener ('resize', resizeHomepage, false);
function resizeHomepage () {

	const width = window.innerWidth;
	const height = window.innerHeight;

	let vw = width / 1270;
	let vh = window.innerHeight / 685;

	const scale = Math.min (1, Math.min (vw, vh));

	const ads = document.getElementById ("lordz-io_300x250_2");
	const style = ads.style;

	const W1 = 1115;
	const R1 = 107;
	const W2 = 900;
	const R2 = 0;

	const Y = (R2 - R1) / (W2 - W1);
	const X = -W2 * Y + R2;
	
	style.right = ((Y * width) + X) + "px";
};

function firstResize () {

	const ads = document.getElementById ("lordz-io_300x250_2");

	if (ads) resizeHomepage ();
	else setTimeout (firstResize, 100);
}

firstResize ();
