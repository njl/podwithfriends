$(document).foundation();

$timelineBars = $('.time-bar');

function progress(curTime, timetotal, $element) {
	var currentWidth = $element.width();
    var progressBarWidth = (curTime/timetotal)*100+'%';
    $element.css({ width: progressBarWidth });
    if(currentWidth < $element.parent().width()) {
        setTimeout(function() {
        	curTime++;
            progress(curTime, timetotal, $element);
        }, 1000);
    }
};



$timelineBars.each(function(){
	$length = parseInt($(this).data('max'));
	$currentTime = parseInt($(this).data('val'));
	$element = $(this);
	progress($currentTime, $length, $element);
});


// audio playback-er
$( document ).ready(function() {
    $audio = $('#audio-player');
    if ($audio.length > 0) {
        var isPlaying = false;
        var startPlayback = function() {
            if (!isPlaying) {
                isPlaying = true;
                $.get(window.location + '/listen', function(data) {
                    var offsetMs = data.play_offset;
                    console.log('starting at:', offsetMs);
                    $audio[0].currentTime = (offsetMs / 1000);
                    $audio[0].play();
                });
            }
        }

        $audio.on('canplaythrough', startPlayback);
        if ($audio[0].readyState > 3) {
          startPlayback();
        }
    }
});
