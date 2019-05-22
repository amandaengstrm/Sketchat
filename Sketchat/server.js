
var express = require("express");
var socket_io = require("socket.io");
var axios = require("axios");

let guessWord = "";

var app = express();
var server = require("http").Server(app);
var io = socket_io(server);

server.listen(process.env.PORT || 3000);

app.use(express.static("public"));

console.log("My sock is running ^^");

newConnectionList = [];

io.on("connection", function(socket) {
    console.log("New connections: " + socket.id);

    socket.on("joingame", function() {
        newConnectionList.push(socket.id);

        if (
            newConnectionList.length == 1 ||
            typeof io.sockets.adapter.rooms["artist"] === "undefined"
        ) {
            socket.join("artist");
            socket.username = "SketchCat";
            io.in(socket.id).emit("artist", socket.username);
            console.log(socket.username + " is the artist at " + socket.id);
            getWord().then(() => {
                console.log("nu har vi fått in ordet: " + guessWord);
            });
        } else {
            socket.join("guesser");
            if (socket.id === newConnectionList[1]) {
                socket.username = "DrawDuck";
            } else if (socket.id === newConnectionList[2]) {
                socket.username = "PaintPig";
            } else if (socket.id === newConnectionList[3]) {
                socket.username = "ArtAnt";
            } else {
                console.log("Nu blev något fel ");
            }

            io.in(socket.id).emit("guesser", socket.username);
            console.log(
                socket.username + " is a guesser with id: " + socket.id
            );
        }
    });

    socket.on("disconnect", function() {
        for (var i = 0; i < newConnectionList.length; i++) {
            if (newConnectionList[i] == socket.id) {
                newConnectionList.splice(i, 1);
            }
        }
        console.log(
            socket.id +
                "with username: " +
                socket.username +
                " has disconnected"
        );

        if (typeof io.sockets.adapter.rooms["artist"] === "undefined") {
            var x = Math.floor(Math.random() * newConnectionList.length);

            var sockets = Object.keys(io.sockets.sockets);
            for (var key in sockets) {
                socket.id = sockets[key];

                if (socket.id == newConnectionList[x]) {
                    io.in(socket.id).emit("mellansteg", socket.id);
                    //break;
                }
            }
        }
    });

    socket.on("changeartist", function(data) {
        if (typeof io.sockets.adapter.artist === "undefined") {
            guessWord = "";
            getWord().then(res => {
                console.log("nu har vi fått in ordet: " + guessWord);
            });
            socket.leave("guesser");
            console.log(socket.id + " har lämnat guessers");
            socket.join("artist");
            console.log(socket.id + " har lagts till i artist");

            io.in("guesser").emit("newArtist", socket.username);
            io.in("artist").emit("newArtist", socket.username);
        }
    });

    socket.on("leaveoldartist", function() {
        socket.leave("artist");
        console.log(socket.id + " har lämnat artist");
        socket.join("guesser");
        console.log(socket.id + " har lagts till i guesser");
        //socket.emit("mellansteg", data);
    });

    socket.on("sendsecretword", function() {
        //Sending word to artist
        io.of("/")
            .in("artist")
            .clients((error, clients) => {
                console.log("ordet som ska ritas nu är: " + guessWord);
                if (error) throw error;
                console.log("clients är : " + clients);
                console.log("socket.id är: " + socket.id);
                if (clients[0] == socket.id) {
                    io.in("artist").emit("secretword", guessWord);
                }
            });
    });

    socket.on("startgame", function() {
        console.log("NEW GAME");
        //Clear canvas
        socket.emit("showcanvas");
        socket.broadcast.emit("showcanvas");

        //Sending word to artist
        socket.emit("sendsecretwordtogamescript");

        //Only the artist can broadcast the canvas
        socket.on("brush", function(data) {
            io.of("/")
                .in("artist")
                .clients((error, clients) => {
                    if (error) throw error;
                    if (clients == socket.id) {
                        socket.broadcast.emit("brush", data);
                    }
                });
        });

        socket.on("userwantstoclear", function(){
            socket.emit("clearCanvas");
            socket.broadcast.emit("clearCanvas");
        })

        socket.on("new_message", function(data) {
            CompareWordWithGuess(guessWord, data.message, socket);
            io.sockets.emit("new_message", {
                message: data.message,
                username: socket.username
            });
        });
    });

    socket.on("restartgame", function() {
        console.log("RESTART GAME");
        //Clear canvas
        socket.emit("clearCanvas");
        socket.broadcast.emit("clearCanvas");

        //Clear chat
        socket.emit("clearChat");
        socket.broadcast.emit("clearChat");

        socket.emit("sendsecretwordtogamescript");
    });
});

//get one word from the database
async function getWord() {
    axios.get("http://localhost:4000/wordslvl1/random").then(res => {
        guessWord = res.data.word;
    });
}

function CompareWordWithGuess(guessWord, guess, socket) {
    console.log("Word är: " + guessWord);
    console.log("Guess är: " + guess);
    // console.log("Name är: " + socket.username);
    if (guessWord === guess) {
        //console.log(socket.username + " has guessed right on the word: " + guessWord);
        io.in("guesser").emit("rightAnswer", socket.username, guessWord);

        io.in("artist").emit("timeToLeaveArtist");

        io.in(`${socket.id}`).emit("ihaverightanswer", socket.id);
    }
}
