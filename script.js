var player = $('#audioPlayer')[0];
var songs = $('#playlist li a');

var currentSong = 0;
var barSize = 500;

init();

function init() {  
  //Play first song from list
  player.src = songs[0];  
  refreshTime();  
  updateTime = setInterval(time, 100);
  
  //Click to song name
  songs.click(function(e) {
    e.preventDefault();       
    player.src = this;    
    refreshTime();
       
    $("#playlist li").removeClass('currentSong');
    currentSong = $(this).parent().index();
    $(this).parent().addClass('currentSong');
    $('#playButton').removeClass('play pause').addClass('play'); 
  });

  //Transition to next song when song ended
  player.addEventListener("ended", function() {
    currentSong++;
    if (currentSong == songs.length) {
      currentSong = 0;
    }
    changeSong();
    refreshTime();
    time();  
  });

}

$('#playButton').click(function(e) {
  if($(this).hasClass('play')) {
    $(this).removeClass('play').addClass('pause');    
    player.pause();
  } else {
    $(this).removeClass('pause').addClass('play');
    player.play();
  }
});

$('#muteButton').click(function(e) {
  var volume = player.volume * 100;
  
  if($(this).hasClass('mute')) {    
    $(this).removeClass('mute').addClass('unmute');
    player.muted = true;    
    $('#volume').val(0);
  } else {
    $(this).removeClass('unmute').addClass('mute');
    player.muted = false;
    $('#volume').val(volume);
  }
});

$('#nextButton').click(function(e) {
  currentSong++;  
  if (currentSong == songs.length) {
    currentSong = 0;
  }
  changeSong();
  $('#playButton').addClass('play');
});

$('#previousButton').click(function(e) {
  currentSong--;  
  if (currentSong < 0 ) {
    currentSong = songs.length - 1;
  }
  changeSong();
  $('#playButton').addClass('play');
});

$('#defaultBar').click(function(e) {
  if(!player.ended) {
    var mousePosition = e.pageX - $('#defaultBar').offset().left;
    var newTime = mousePosition * player.duration/barSize;
    player.currentTime = newTime;
  }
});

$('#volume').click(function(e) {
  var volume = $('#volume').val();
  player.volume = volume / 100;
  if (volume == 0) {
    $('#muteButton').removeClass('mute').addClass('unmute');
  } else {
    $('#muteButton').removeClass('unmute').addClass('mute');    
    player.muted = false;
  }
});

//Change song from list and play her
function changeSong() {
  $('#playlist li').removeClass('currentSong');
  $('#playlist li:eq(' + currentSong + ')').addClass('currentSong');
  player.src = songs[currentSong].href;
  refreshTime();  
}

//update  song duration time
function refreshTime() {
  player.addEventListener('loadedmetadata', function() {
    var minutes = parseInt(player.duration/60);
    var seconds = parseInt(player.duration%60).toString();
    
    if(seconds.length == 1) seconds = '0' + seconds;

    $('#fullDuration').html(minutes + ':' + seconds);
    player.play(); 
  });
}

//Update current times song
function time() {
  var minutes = parseInt(player.currentTime/60);
  var seconds = parseInt(player.currentTime%60).toString();  
  var size = parseInt(player.currentTime*barSize/player.duration);
  
  if(seconds.length == 1) seconds = '0' + seconds;

  if(!player.ended) {
    $('#currentTime').html(minutes + ':' + seconds);
    $('#progressBar').css('width', '' + size +'px');
  }
  else {
    $('#currentTime').html('0:00');
    size = 0;
    $('#progressBar').css('width', '' + size +'px');
    window.clearInterval(updateTime);
  }  
}