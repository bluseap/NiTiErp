const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .build();

connection.on("broadcastMessage", (user, message) => {

    var notify;
    notify = new Notification(
        'Bạn có một thông báo mới từ POWACO', // Tiêu đề thông báo
        {
            //body: 'qqqqFreetuts vừa đăng một bài viết mới.', // Nội dung thông báo
            body: 'hfghf',
            icon: 'http://powaco.com.vn/content/images/powacmo.png', // Hình ảnh
            tag: 'http://powaco.com.vn/' // Đường dẫn 
        }
    );
    // Thực hiện khi nhấp vào thông báo
    notify.onclick = function () {
        window.location.href = this.tag; // Di chuyển đến trang cho url = tag
    }

});

connection.start().catch(err => console.error(err.toString()));
