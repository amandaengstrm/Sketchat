$(function() {
    var message = $("#message");
    var send_message = $("#send_message");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    var $chat = $('#chatroom');

    const input = document.querySelector("#message");
    input.addEventListener("keyup", function(e) {
        if (e.keyCode === 13) {
            socket.emit("new_message", { message: message.val() });
        }
    });

    socket.on("new_message", data => {
        // chatroom.append("<p class='recivedemessage'>" + data.username + ": " + data.message + "</p>");
        chatroom.append($('<p class="recivedemessage">').text(data.username + ": " + data.message));
        var $scrollTop = $(this).scrollTop(); 
        var $scrollHeight = this.scrollHeight; 
        $chat.animate({scrollTop: $chat.prop("scrollHeight")},'fast');

       
    });

    socket.on("clearChat", function() {
        ClearChat();
    });

    function ClearChat() {
        void $("#chatroom").empty();
    }
});
