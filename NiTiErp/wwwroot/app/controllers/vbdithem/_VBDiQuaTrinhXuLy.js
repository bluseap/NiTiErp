var _vbdiqtxlController = function () {


    this.initialize = function () {

        registerEvents();

    }

    this.loadVBDiQuaTrinhXuLy = function (vanbandiid) {
        loadTableVBDiQTXL(vanbandiid);
    }

    function registerEvents() {
        $('body').on('click', '.btnVBDiQTXLNhanVienXuLy', function (e) {
            e.preventDefault();
            var vanbandiqtxlId = $(this).data('id');
            tedu.notify(vanbandiqtxlId, "success");
        });

    }

    function loadTableVBDiQTXL(vanbandiid) {
        var template = $('#template-table-VBDiQuaTrinhXuLy').html();
        var render = "";
        $.ajax({
            type: "GET",
            url: "/Admin/vbdithem/GetListVBDiQTXL",
            data: {
                vanbandiid: vanbandiid,
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
                            NgayNhap: tedu.getFormattedDate(item.CreateDate)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }
                if (render !== '') {
                    $('#table-contentVBDiQuaTrinhXuLy').html(render);
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