var _chuaxulyController = function () {
   
    var cachedObj = {
        phoihopxuly: []
    }

    this.initialize = function () {

        registerEvents();

        loadDataChuaChuaXuLy();
    }
   
    this.loadNhanVienXuLyVanBanDen = function (vanbandenduyetid) {
        loadNhanVienXLVanBan(vanbandenduyetid);        
    }

    function registerEvents() {

        $('#txtNgayChuaXuLyXuLy').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

    }

    function loadDataChuaChuaXuLy() {        

        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayChuaXuLyXuLy').val(nowDate);


    }    

    function loadNhanVienXLVanBan(vanbandenduyetid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/GetListVBDDNVXL",
            data: { vanbandenduyetid: vanbandenduyetid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbddnvxl = response.Result;

                var template = $('#template-table-NhanVienXuLy').html();
                var render = '';

                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(vbddnvxl, function (i, item) {
                        render += Mustache.render(template, {
                            TenNhanVien: item.TenNhanVien,
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            TenPhoiHopXuLy: item.TenPhoiHopXuLy,
                            VBDDNVXLId: item.Id
                        });
                    });
                    //tedu.notify('Nhân viên đăng ký.', 'success');                    
                }

                if (render !== '') {
                    $('#table-contentNhanVienXuLy').html(render);
                }

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}