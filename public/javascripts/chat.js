var start_chat = function(hostname, name, room_id){
    var socket = io.connect('http://'+hostname);
    socket.on('joined', function(data){
        console.log('joined '+data.room);
    });
    var chat_window = $('.text-chat');
    socket.on('said', function(data){
        chat_window.append('<div class="text"><strong>'+data.user+'</strong> '+data.txt+'</div>');
        chat_window.animate({scrollTop: chat_window[0].scrollHeight});
    });
    say = function(txt){
        socket.emit('say', txt);
    }
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
    $("#chat-input").on("submit", function(ev){
        ev.preventDefault();
        var target = $('#chat-input input');
        say(target.val());
        target.val("");
    });
    socket.emit('join', {name:name, room_id:room_id})
};
