$(document).foundation();

$timelineBars = $('.podcast-timeline .time-bar');
		


function progress(curTime, timetotal, $element) {
	var currentWidth = $element.width();
    var progressBarWidth = (curTime/timetotal)*100+'%';
    $element.css({ width: progressBarWidth });
    if(currentWidth < $element.parent().width()) {
        setTimeout(function() {
        	curTime++;
            progress(curTime, timetotal, $element);
        }, 1);
    }
};



$timelineBars.each(function(){
	$length = parseInt($(this).data('max'));
	$currentTime = parseInt($(this).data('val'));
	$element = $(this);
	progress($currentTime, $length, $element);
});