const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.render('./index.ejs');
});

app.get('/chat', function (req, res) {
    res.render('./chat.ejs');
}
);


io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});