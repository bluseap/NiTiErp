var loginController = function () {
    this.initialize = function () {
        registerEvents();

        thongbao();
    }

    var registerEvents = function () {       
        
        $('#frmLogin').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'en',
            rules: {
                userName: {
                    required: true
                },
                password: {
                    required: true
                }
            }
        });
       
        $('#txtPassword').keypress(function (e) {
            if (e.which === 13) {
                if ($('#frmLogin').valid()) {
                    e.preventDefault();
                    var user = $('#txtUserName').val();
                    var password = $('#txtPassword').val();
                    login(user, password);
                }
            }
        });

        $('#btnLogin').on('click', function (e) {
            if ($('#frmLogin').valid()) {
                e.preventDefault();
                var user = $('#txtUserName').val();
                var password = $('#txtPassword').val();
                login(user, password);
            }
        });
    }

    var login = function (user, pass) {
        $.ajax({
            type: 'POST',
            data: {
                Email: user,
                Password: pass
            },
            dateType: 'json',
            url: '/admin/login/authen',
            success: function (res) {
                if (res.Success) {
                    window.location.href = "/Admin/Home/Index";
                    //window.location.href = "/Admin/HomeVanBan/Index";

                    $.getJSON("http://jsonip.com?callback=?", function (data) {
                        //$(".ip").text(data.ip);
                        var ipAddress = data.ip;
                        alert(ipAddress);
                    });

                }
                else {
                    tedu.notify('Login failed', 'error');
                }
            }
        });
    }

    var thongbao = function () {
        if (!window.Notification) {
            alert('Trình duyệt của bạn không hỗ trợ chức năng này.');
        }
        // Ngược lại trình duyệt có hỗ trợ thông báo
        else {
            // Gửi lời mời cho phép thông báo
            Notification.requestPermission(function (p) {
                // Nếu không cho phép
                if (p === 'denied') {
                    //alert('Bạn đã không cho phép thông báo trên trình duyệt.');
                }
                // Ngược lại cho phép
                else {
                    //alert('Bạn đã cho phép thông báo trên trình duyệt, hãy bắt đầu thử Hiển thị thông báo.');
                    //$.getJSON("http://jsonip.com?callback=?", function (data) {
                    //    //$(".ip").text(data.ip);
                    //    var ipAddress = data.ip;
                    //    alert(ipAddress);
                    //});
                }
            });
        }
    }


}