$(document).ready(function(){
    var socket = io.connect('http://'+hostname);
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
    socket.on('voice_token', function(data){
        var session = OT.initSession(data.api_key, data.session_id);
        session.connect(data.token, function(err){
        var publisher = OT.initPublisher($('#me-on-video').get(0));
        session.publish(publisher);
        session.on('streamCreated', function(event) {
            console.log('stream created');
            session.subscribe(event.stream, $('#others-on-video').get(0), {insertMode: 'append', 
                                                                            audioVolume: 50})
        });

            console.log('connect error', err);
        });
        window.session = session;
    });
});
