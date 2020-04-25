var _quatrinhxulyController = function () {


    this.initialize = function () {

        registerEvents();

    }

    this.loadQuaTrinhXuLy = function (vanbandenid) {
        loadTableVBDQTXL(vanbandenid);
    }

    function registerEvents() {
        $('body').on('click', '.btnQTXLNhanVienXuLy', function (e) {
            e.preventDefault();
            var vanbandenqtxlId = $(this).data('id');
            tedu.notify(vanbandenqtxlId , "success");
        });

    }

    function loadTableVBDQTXL(vanbandenid) {  
        var template = $('#template-table-QuaTrinhXuLy').html();
        var render = "";
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/GetListVBDQTXL",
            data: {
                vanbandenid: vanbandenid,
                makv: '%'               
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenNhanVien: item.TenNhanVien,
                            MoTa: item.MoTa,
                            NgayNhap: tedu.getFormattedDate(item.CreateDate),
                            NhanVienXuLy: item.NhanVienXuLy
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }
                if (render !== '') {
                    $('#table-contentQuaTrinhXuLy').html(render);
                }               
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Cập nhật phối hợp xử lý nhân viên! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });   

    }

}