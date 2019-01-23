var _chuaxulyController = function () {   
   

    this.initialize = function () {

        registerEvents();

        loadDataChuaChuaXuLy();
    }
   
    this.loadNhanVienXuLyVanBanDen = function (vanbandenduyetid) {
        loadNhanVienXLVanBan(vanbandenduyetid);        
    }

    this.loadCountVBDDangXuLy = function (makv) {
        loadCountVBDDangXuLy(makv);
    }

    function registerEvents() {

        $('#txtNgayChuaXuLyXuLy').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

        $('#btnSaveChuaXuLyXuLy').on('click', function () {
            SaveVBDChuaXuLy();
        });

    }

    function SaveVBDChuaXuLy() {
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuxuly = $('#txtGhiChuXuLy').val();
        var ngaychuaxuly = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLy').val());

        var datetimeNow = new Date();
        var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/UpdateVanBanDenXuLy",
            data: {
                Id: vanbandenduyetId,
                VanBanDenDuyetId: vanbandenduyetId,
                InsertVBDXuLyLId: 2,
                NgayBatDauXuLy: ngaychuaxuly
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success === false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.notify('Văn bản xử lý.', 'success');

                    var makv = $('#ddlKhuVuc').val();
                    loadCountVBDChuaXuLy(makv);
                    loadCountVBDDangXuLy(makv);

                    $('#hidVanBanDenDuyetId').val('');
                    $('#txtGhiChuXuLy').val('');

                    $('#tblContentChuaXuLy').html('');

                    $('#modal-add-edit-ChuaXuLyXuLy').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản xử lý', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCountVBDDangXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetDangXuLyUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDangXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVBDChuaXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetCCMUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanChuaXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
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