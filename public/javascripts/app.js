$(document).foundation();

$timelineBars = $('.time-bar');

function progress(curTime, timetotal, $element) {
	var currentWidth = $element.width();
    var percent = (curTime / timetotal) * 100;
    if (percent > 100) {
        percent = 100;
    }
    $element.css({ width: percent + '%' });

    // display time
    var minutes = Math.floor(curTime / 60);
    var seconds = curTime - minutes * 60;
    if (minutes > 0) {
        var disp = minutes + ':' + seconds;
    }
    else {
        var disp = seconds;
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

                    // set initial progress
                    progress($audio[0].currentTime, $audio[0].duration, $('.time-bar'));
                });
            }
        }

        $audio.on('canplaythrough', startPlayback);
        if ($audio[0].readyState > 3) {
          startPlayback();
          ontimeupdate="document.getElementById('tracktime').innerHTML = Math.floor(this.currentTime) + ' / ' + Math.floor(this.duration);"
        }

        // progress tracking

        $audio[0].ontimeupdate = function() {
            progress($audio[0].currentTime, $audio[0].duration, $('.time-bar'));
        }
    }
});
