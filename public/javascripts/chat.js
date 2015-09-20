var start_chat = function(hostname, name, room_id){
    var socket = io.connect('http://'+hostname);
    socket.on('joined', function(data){
        console.log('joined '+data.room);
    });
    socket.on('said', function(data){
        console.log(data.user+': '+data.txt);
    });
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
        var publisher = OT.initPublisher($('.listener-all').get(0), {height:80, width:80, insertMode:"append", name:name, });
        session.publish(publisher);
        session.on('streamCreated', function(event) {
            console.log('stream created');
            session.subscribe(event.stream, $('.listener-all').get(0), {insertMode: 'append', height:80, width:80,
                                                                            audioVolume: 50})
        });

            console.log('connect error', err);
        });
        window.session = session;
    });
    socket.emit('join', {name:name, room_id:room_id})
};
