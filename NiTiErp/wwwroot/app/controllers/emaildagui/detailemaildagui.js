
var detailemaildaguiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();    
    
    this.loadDetailEmailDaGui = function (emailnoibonhanid) {
        loadDetailEmailDaGui(emailnoibonhanid);
        loadDetailEmailDaGuiFile(emailnoibonhanid);
    }

    this.initialize = function () {
        registerEvents();       

    }

    function registerEvents() {
        $('body').on('click', '.bntViewEmailFileId', function (e) {
            e.preventDefault();
            var emailnoibofileid = $(this).data('id');

            loadPatchFile(emailnoibofileid);
        });
    }

    function loadDetailEmailDaGui(emailnoibonhanid) {
        $.ajax({
            type: "GET",
            url: "/Admin/emailthem/GetEmailThem",
            data: {
                emailnoibonhanId: emailnoibonhanid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var email = response;

                $('#lbViewNguoiGui').html("<div class='btn-group'>Người gửi: <strong >" +
                    email.TenNguoiGui + "</strong></div>");
                $('#lbViewNgayGui').html('<p class="date" >' +
                    tedu.getFormattedDateTimeN(email.NgayGui) + '</p>');
                $('#lbViewNguoiNhan').html("Người nhận: <strong >" + email.TenNguoiNhan + "</strong>");
                $('#lbViewChuDe').html("<h4>" + email.TieuDe + "</h4>");
                $('#lbViewNoiDung').html('<p>' + email.NoiDung + '</p>');

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadDetailEmailDaGuiFile(emailnoiboid) {
        var template = $('#table-DetailEmailDaGui').html();
        var render = "";

        $.ajax({
            type: "GET",
            url: "/Admin/emailthem/GetListEmailFile",
            data: {
                emailnoibonhanId: emailnoiboid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Id: item.Id,
                        TenFile: item.TenFile
                        //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',                        
                        // Price: tedu.formatNumber(item.Price, 0),                          
                    });
                });
                if (render !== '') {
                    $('#tblContentDetailEmailDaGui').html(render);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadPatchFile(emailnoibonhanfileid) {
        $.ajax({
            type: "GET",
            url: "/Admin/emailthem/GetEmailFileId",
            data: {
                emailnoibonhanfileId: emailnoibonhanfileid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {

                var win = window.open(response.DuongDan, '_blank');
                win.focus();
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}