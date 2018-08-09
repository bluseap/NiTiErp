var qdkyluatController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditKyLuat = new addeditkyluatController();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditKyLuat.initialize();
    }

    function registerEvents() {

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btnQDKyLuat', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDKL();

            $('#hidInsertQDKLIdId').val(1); // insert

            $('#modal-add-edit-QDKL').modal('show');

            $('#row-AddEditQDKL').show();
            $('#tblHoSoNhanVienQDKL').show();
            $('#row-AddEditQDKL-infoHoSoQDKL').show();

        });

        $('#btnSaveQDKL').on('click', function (e) {
            var insertQDKL = $('#hidInsertQDKLIdId').val(); // update

            if (insertQDKL === "2") {
                UpdateQDKL(e);
            }
            else {
                SaveQDKL(e);
            }

        });

        $("#ddl-show-pageQDKL").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableKyLuat(true);
        });

        $('body').on('click', '.btn-editQDKL', function (e) {
            e.preventDefault();

            $('#hidInsertQDKLIdId').val(2); // update

            var kyluatId = $(this).data('id');

            $('#hidQDKLId').val(kyluatId);

            loadKyLuat(kyluatId);

            $('#modal-add-edit-QDKL').modal('show');

            $('#row-AddEditQDKL').hide();
            $('#tblHoSoNhanVienQDKL').hide();
            $('#row-AddEditQDKL-infoHoSoQDKL').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableKyLuat();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableKyLuat();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDKL();
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

    function resetFormAddEditQDKL() {
        $('#hidQDKLId').val('0');
        $('#hidHoSoKyLuatId').val('0');
        $('#hidInsertQDKLIdId').val('0');

        $('#txtAddEditHoTen').val('');
        $('#txtAddEditPhongTo').val('');
        $('#txtLyDoQuyetDinh').val('');
        $('#ddlLoaiHinhThucKyLuat')[0].selectedIndex = 0;
        $('#txtTienKyLuat').val('0');
        $('#txtGhiChuQuyetDinh').val('');
        $('#txtSoQuyetDinh').val('');
        $('#txtNgaKyQuyetDinh').val('');
        $('#txtTenNguoiKyQuyetDinh').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');

    }

    function SaveQDKL(e) {
        e.preventDefault();

        var kyluatId = $('#hidQDKLId').val();
        var hosoId = $('#hidHoSoKyLuatId').val();
        var insertqdklId = $('#hidInsertQDKLIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        var loaihinhthuckl = $('#ddlLoaiHinhThucKyLuat').val();
        var tienkyluat = $('#txtTienKyLuat').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdkyluat/AddUpdateQDKyLuat",
            data: {
                Id: kyluatId,
                HoSoNhanVienId: hosoId,
                InsertqdklId: insertqdklId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                TienKyLuat: tienkyluat,
                HinhThucKyLuatId: loaihinhthuckl,
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

                    loadTableKyLuat(true);

                    $('#modal-add-edit-QDKL').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định ky luật', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableKyLuat(isPageChanged) {
        var template = $('#table-QDKL').html();
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
            url: '/admin/qdkyluat/GetListKyLuat',
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
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            LyDoQuyetDinh: item.LyDoQuyetDinh,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblQDKLTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDKL').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDKL(response.Result.RowCount, function () {
                        loadTableKyLuat();
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
    function wrapPagingQDKL(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDKL a').length === 0 || changePageSize === true) {
            $('#paginationULQDKL').empty();
            $('#paginationULQDKL').removeData("twbs-pagination");
            $('#paginationULQDKL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDKL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                //tedu.configs.pageIndex = p;
                //setTimeout(callBack(), 200);
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function loadKyLuat(kyluatid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdkyluat/GetKyLuatId",
            data: { kyluatId: kyluatid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var kyluat = response.Result.Results[0];

                $('#hidQDKLId').val(kyluat.Id);
                $('#hidHoSoKyLuatId').val(kyluat.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(kyluat.Ten);
                $('#txtAddEditPhongTo').val(kyluat.TenPhong);

                $('#ddlLoaiQuyetDinh').val(kyluat.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(kyluat.LyDoQuyetDinh);
                $('#ddlLoaiHinhThucKyLuat').val(kyluat.HinhThucKyLuatId);
                $('#txtTienKyLuat').val(kyluat.TienKyLuat);
                $('#txtGhiChuQuyetDinh').val(kyluat.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(kyluat.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(kyluat.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(kyluat.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(kyluat.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(kyluat.NgayKetThuc));

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDKL(e) {
        e.preventDefault();

        var kyluatId = $('#hidQDKLId').val();
        var hosoId = $('#hidHoSoKyLuatId').val();
        var insertqdklId = $('#hidInsertQDKLIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        var loaihinhthuckl = $('#ddlLoaiHinhThucKyLuat').val();
        var tienkyluat = $('#txtTienKyLuat').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdkyluat/AddUpdateQDKyLuat",
            data: {
                Id: kyluatId,
                HoSoNhanVienId: hosoId,
                InsertqdktId: insertqdklId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                TienKyLuat: tienkyluat,
                HinhThucKyLuatId: loaihinhthuckl,
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

                    loadTableKyLuat(true);

                    $('#modal-add-edit-QDKL').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định kỷ luật', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDKL() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        var that = $('#hidId').val();
        $.ajax({
            type: "POST",
            url: "/Admin/qdkyluat/ExportExcel",
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