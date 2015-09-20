$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    socket.on('joined', function(data){
        console.log('joined '+data.room);
    });
    socket.on('said', function(data){
        console.log(data.user+': '+data.txt);
    });
    join_room = function(name, room_id){
        socket.emit('join', {name:name, room_id:room_id});
    }
    say = function(txt){
        socket.emit('say', txt);
    }
    socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
            });
});
