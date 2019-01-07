const connection = new signalR.HubConnectionBuilder()
    .withUrl("/tinnhan")
    .build();

var messageCallback = function (message) {
    new PNotify({
        title: 'Có văn bản đến mới ',
        text: 'Kiểm tra và xử lý văn bản mới!',
        type: 'success',
        styling: 'bootstrap3'
    });
};
connection.on("ThongBaoMauXanh", messageCallback);

connection.start()
            .then(function () {
                onConnected(connection);
            })
            .catch(function (error) {
                console.error(error.message);
            });

//connection.invoke("SendThongBaoMauXanh", "99").catch(function (err) {
//    //new PNotify({
//    //    title: 'Có văn bản đến mới',
//    //    text: 'Kiểm tra và xử lý văn bản mới!',
//    //    type: 'success',
//    //    styling: 'bootstrap3'
//    //});
//});