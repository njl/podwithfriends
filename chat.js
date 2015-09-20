var OpenTok = require('opentok'),
        opentok = new OpenTok(process.env.TOKBOX_API_KEY, process.env.TOKBOX_API_SECRET);

var voice_sessions = {};

function start_voice(name, cb){
    if(voice_sessions[name]){
        cb(voice_sessions[name]);
        return;
    }
    opentok.createSession(function(err, session) {
        if(err) return console.log(err);
        console.log('session', session);
        console.log(session.sessionId);
        voice_sessions[name] = session.sessionId;
        cb(voice_sessions[name]);
    });

}

function init(io){
io.on('connection', function (socket) {
    socket.on('join', function(data){
        _.each(socket.rooms, function(r){
            socket.leave(r);
        });
        socket.name = data.name;
        socket.join(data.room_id);
        socket.emit('joined', {room:data.room_id});
        start_voice(data.room_id, function(session_id){
            socket.emit('voice_token', {api_key:process.env.TOKBOX_API_KEY,
                                        session_id:session_id,
                                        token: opentok.generateToken(session_id, {data:'name='+data.name})});
        });
    });
    socket.on('name', function(data){
        socket.name = name;
    });
    socket.on('say', function(data){
        console.log('say received', data);
        console.log(socket.rooms[0], socket.name, data);
        io.in(socket.rooms[0]).emit('said', {'user':socket.name, 'txt':data});
    });
});
}
module.exports = init;
