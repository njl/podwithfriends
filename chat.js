function init(io){
io.on('connection', function (socket) {
    socket.on('join', function(data){
        _.each(socket.rooms, function(r){
            socket.leave(r);
        });
        socket.name = data.name;
        socket.join(data.room_id);
        socket.emit('joined', {room:data.room_id});
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
