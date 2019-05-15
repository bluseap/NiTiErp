
var loginController = function () {

    this.initialize = function () {
        registerEvents();
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
                UserName: user,
                PasswordHash: pass
            },
            dateType: 'json',
            url: '/admin/login/Authen',
            success: function (res) {
                window.location.href = "/Admin/Home/Index";          
                //if (res.Success) {
                //    window.location.href = "/Admin/Home/Index";                   

                //    //$.getJSON("http://jsonip.com?callback=?", function (data) {                   
                //    //    var ipAddress = data.ip;
                //    //    alert(ipAddress);
                //    //});
                //}
                //else {
                //    tedu.notify('Login failed', 'error');
                //}
            }
        });
    }

   


}