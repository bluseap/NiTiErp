
$(function () {
    
    //$('#spanDenChuaXuLy').text("30");

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/vanban")
        .build();

    connection.start().catch(err => console.error(err.toString()));

    connection.on("VanBanDenChuaXuLy", (message) => {
        //var template = $('#announcement-template').html();
        //var html = Mustache.render(template, {
        //    Content: message.content,
        //    Id: message.id,
        //    Title: message.title,
        //    FullName: message.fullName,
        //    Avatar: message.avatar
        //});
        //$('#annoncementList').prepend(html);

        //var totalAnnounce = parseInt($('#totalAnnouncement').text()) + 1;

        $('#spanDenChuaXuLy').text("99");
    });

    connection.invoke("SendVanBanDenChuaXuLy", "9").catch(function (err) {
        $('#spanDenChuaXuLy').text("199");
    });

    //connection.start()
    //    .then(function () {
    //        onConnected(connection);
    //    })
    //    .catch(function (error) {
    //        console.error(error.message);
    //    });

    //var messageCallback = function (message) {
    //    console.log('vanbanden: ' + message);
    //    if (!message)
    //        return;
    //    $('#spanDenChuaXuLy').text("99");
    //}; 

    //connection.on("VanBanDenChuaXuLy", messageCallback);

    

    

    

    //connection.invoke("SendVanBanDenChuaXuLy", "55").catch(function (err) {
    //    return console.error(err.toString());
    //});

});


//function bindConnectionMessage(connection) {
//    var messageCallback = function (message) {
//        console.log('messagevbd: ' + message);
//        if (!message)
//            return;
//        $('#spanDenChuaXuLy').text(message);
//    };

//    connection.on("VanBanDenChuaXuLy", messageCallback);
//    connection.invoke("SendVanBanDenChuaXuLy", message).catch(function (err) {
//        return console.error(err.toString());
//    });
//}
function onConnected(connection) {
    console.log('Bắt đầu kết nối văn bản xử lý.');
}
function onConnectionError(error) {
    if (error && error.message) {
        console.error(error.message);
    }
    else {
        console.log('Close kết nối văn bản xử lý.');
    }
}


