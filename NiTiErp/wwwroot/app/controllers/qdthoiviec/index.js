var qdthoiviecController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditThoiViec = new addeditthoiviecController();
    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditThoiViec.initialize(); 
    }

    function registerEvents() {
        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
        });

        $('body').on('click', '.btnQDThoiViec', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDTV();

            $('#hidInsertQDTVIdId').val(1); // insert

            $('#modal-add-edit-QDTV').modal('show');

            $('#row-AddEditQDTV').show();
            $('#tblHoSoNhanVienQDTV').show();
            $('#row-AddEditQDTV-infoHoSoQDTV').show();

        });

        $('#btnSaveQDTV').on('click', function (e) {
            var insertQDTV = $('#hidInsertQDTVIdId').val(); // update

            if (insertQDTV === "2") {
                UpdateQDTV(e);
            }
            else {
                SaveQDTV(e);
            }
        });

        $("#ddl-show-pageQDTV").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;

            loadTableThoiViec(true);
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();

            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btn-editQDTV', function (e) {
            e.preventDefault();

            $('#hidInsertQDTVIdId').val(2); // update

            var thoiviecId = $(this).data('id');

            $('#hidQDTVId').val(thoiviecId);

            loadThoiViec(thoiviecId);

            $('#modal-add-edit-QDTV').modal('show');

            $('#row-AddEditQDTV').hide();
            $('#tblHoSoNhanVienQDTV').hide();
            $('#row-AddEditQDTV-infoHoSoQDTV').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableThoiViec();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableThoiViec();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDTV();
        });
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());

                loadTableThoiViec(true);

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function resetFormAddEditQDTV() {
        $('#hidQDTVId').val('0');
        $('#hidHoSoThoiViecId').val('0');
        $('#hidInsertQDTVIdId').val('0');

        $('#txtAddEditHoTen').val('');
        $('#txtAddEditPhongTo').val('');
        $('#txtLyDoQuyetDinh').val('');

        $('#txtGhiChuQuyetDinh').val('');
        $('#txtSoQuyetDinh').val('');
        $('#txtNgaKyQuyetDinh').val('');
        $('#txtTenNguoiKyQuyetDinh').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');
    }

    function SaveQDTV(e) {
        e.preventDefault();

        var thoiviecId = $('#hidQDTVId').val();
        var hosoId = $('#hidHoSoThoiViecId').val();
        var insertqdtvId = $('#hidInsertQDTVIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();

        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdthoiviec/AddUpdateQDThoiViec",
            data: {
                Id: thoiviecId,
                HoSoNhanVienId: hosoId,
                InsertqdtvId: insertqdtvId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,

                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan

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
                    tedu.notify('Tạo quyết định nhân viên.', 'success');

                    loadTableThoiViec(true);

                    $('#modal-add-edit-QDTV').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định thôi việc', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDTV(e) {
        e.preventDefault();

        var thoiviecId = $('#hidQDTVId').val();
        var hosoId = $('#hidHoSoThoiViecId').val();
        var insertqdtvId = $('#hidInsertQDTVIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();

        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdthoiviec/AddUpdateQDThoiViec",
            data: {
                Id: thoiviecId,
                HoSoNhanVienId: hosoId,
                InsertqdtvId: insertqdtvId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,

                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan

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
                    tedu.notify('Tạo quyết định nhân viên.', 'success');

                    loadTableThoiViec(true);

                    $('#modal-add-edit-QDTV').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định thôi việc', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableThoiViec(isPageChanged) {
        var template = $('#table-QDTV').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#btnTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/qdthoiviec/GetListThoiViec',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            LyDoQuyetDinh: item.LyDoQuyetDinh,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblQDTVTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDTV').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDTV(response.Result.RowCount, function () {
                        loadTableThoiViec();
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }
    function wrapPagingQDTV(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDTV a').length === 0 || changePageSize === true) {
            $('#paginationULQDTV').empty();
            $('#paginationULQDTV').removeData("twbs-pagination");
            $('#paginationULQDTV').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDTV').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function loadThoiViec(thoiviecid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdthoiviec/GetThoiViecId",
            data: { thoiviecId: thoiviecid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vehuu = response.Result.Results[0];

                $('#hidQDTVId').val(thoiviecid);
                $('#hidHoSoThoiViecId').val(vehuu.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(vehuu.Ten);
                $('#txtAddEditPhongTo').val(vehuu.TenPhong);

                $('#ddlLoaiQuyetDinh').val(vehuu.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(vehuu.LyDoQuyetDinh);

                $('#txtGhiChuQuyetDinh').val(vehuu.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(vehuu.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(vehuu.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(vehuu.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(vehuu.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(vehuu.NgayKetThuc));

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDTV() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        $.ajax({
            type: "POST",
            url: "/Admin/qdthoiviec/ExportExcel",
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }


}