$(function() {
    $(".characterpage").css("display", "none");
    $("#sketch-holder").css("display", "none");
    $("#chatroom").css("display", "none");
    $("#input_zone").css("display", "none");
    $("#wordtodraw").css("display", "none");
    $("#gamepage").css("display", "none");
    $("#clearbutton").css("display", "none");

    $("#mybutton").click(function() {
        $(".characterpage").css("display", "initial");
        socket.emit("joingame");
        socket.on("artist", data => {
            $("#startpage").css("display","none")
            $("#characterInfo").append("You are: " +data );
        });
        socket.on("guesser", data => {
            $("#startpage").css("display","none")
            $("#characterInfo").append("You are: " +data);
        });
    });

    $("#startbutton").click(function() {
        $("#gamepage").css("display", "initial");
        $(".characterpage").css("display", "none");
        socket.emit("startgame");
        socket.on("showcanvas", () => {
            $("#sketch-holder").css("display", "initial");
            $(".test").css("display", "initial");
            $("#chatroom").css("display", "initial");
            $("#input_zone").css("display", "initial");
        });

        socket.on("sendsecretwordtogamescript", ()=> {
            socket.emit("sendsecretword");
        }) 

        socket.on("secretword", data => {
            $("#wordtodraw").css("display", "initial");
            $("#clearbutton").css("display", "initial");
            $("#wordtodraw").append("The word you need to draw is: " + data);
        });

        socket.on("rightAnswer", (name, word) => {
            alert(name + " has guessed right, the word was: " + word);
        });

        socket.on("ihaverightanswer", function(data) {
            socket.emit("changeartist", data);
        });

        socket.on("timeToLeaveArtist", function(){
            socket.emit("leaveoldartist")
            $("#wordtodraw").css("display", "none");
            alert("Your regin has come to an end, time to begin guessing")
            $("#wordtodraw").empty().append("The word you need to draw is: " + data);
            
            
        })

        socket.on("mellansteg", function(data) {
            socket.emit("changeartist", data);
        });

        socket.on("newArtist", function(data) {   
            $("#clearbutton").css("display", "none");
            socket.emit("restartgame");    
        });
    });

    $("#clearbutton").click(function(){
        socket.emit("userwantstoclear")
    })
});
