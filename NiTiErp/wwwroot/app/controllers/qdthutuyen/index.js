var qdthutuyenController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditThuTuyen = new addeditthutuyenController();
    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditThuTuyen.initialize();
    }

    function registerEvents() {
        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
        });

        $('body').on('click', '.btnQDThuTuyen', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDTT();

            $('#hidInsertQDTTIdId').val(1); // insert

            $('#modal-add-edit-QDTT').modal('show');

            $('#row-AddEditQDTT').show();
            $('#tblHoSoNhanVienQDTT').show();
            $('#row-AddEditQDTT-infoHoSoQDTT').show();

        });

        $('#btnSaveQDTT').on('click', function (e) {
            var insertQDTT = $('#hidInsertQDTTIdId').val(); // update

            if (insertQDTT === "2") {
                UpdateQDTT(e);
            }
            else {
                SaveQDTT(e);
            }
        });

        $("#ddl-show-pageQDTT").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;

            loadTableThuTuyen(true);
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();

            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btn-editQDTT', function (e) {
            e.preventDefault();

            $('#hidInsertQDTTIdId').val(2); // update

            var thutuyenId = $(this).data('id');

            $('#hidQDTTId').val(thutuyenId);

            loadThuTuyen(thutuyenId);

            $('#modal-add-edit-QDTT').modal('show');

            $('#row-AddEditQDTT').hide();
            $('#tblHoSoNhanVienQDTT').hide();
            $('#row-AddEditQDTT-infoHoSoQDTT').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableThuTuyen();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableThuTuyen();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDTT();
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

                loadTableThuTuyen();

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

    function resetFormAddEditQDTT() {
        $('#hidQDTTId').val('0');
        $('#hidHoSoThuTuyenId').val('0');
        $('#hidInsertQDTTIdId').val('0');

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

    function SaveQDTT(e) {
        e.preventDefault();

        var thutuyenId = $('#hidQDTTId').val();
        var hosoId = $('#hidHoSoThuTuyenId').val();
        var insertqdttId = $('#hidInsertQDTTIdId').val();

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
            url: "/Admin/qdthutuyen/AddUpdateQDThuTuyen",
            data: {
                Id: thutuyenId,
                HoSoNhanVienId: hosoId,
                InsertqdttId: insertqdttId,

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

                    loadTableThuTuyen(true);

                    $('#modal-add-edit-QDTT').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định thu tuyển', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDTT(e) {
        e.preventDefault();

        var thutuyenId = $('#hidQDTTId').val();
        var hosoId = $('#hidHoSoThuTuyenId').val();
        var insertqdttId = $('#hidInsertQDTTIdId').val();

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
            url: "/Admin/qdthutuyen/AddUpdateQDThuTuyen",
            data: {
                Id: thutuyenId,
                HoSoNhanVienId: hosoId,
                InsertqdttId: insertqdttId,

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

                    loadTableThuTuyen(true);

                    $('#modal-add-edit-QDTT').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định thu tuyển', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableThuTuyen(isPageChanged) {
        var template = $('#table-QDTT').html();
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
            url: '/admin/qdthutuyen/GetListThuTuyen',
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

                $('#lblQDTTTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDTT').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDTT(response.Result.RowCount, function () {
                        loadTableThuTuyen();
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
    function wrapPagingQDTT(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDTT a').length === 0 || changePageSize === true) {
            $('#paginationULQDTT').empty();
            $('#paginationULQDTT').removeData("twbs-pagination");
            $('#paginationULQDTT').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDTT').twbsPagination({
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

    function loadThuTuyen(thutuyencid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdthutuyen/GetThuTuyenId",
            data: { thutuyenId: thutuyencid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var thutuyen = response.Result.Results[0];

                $('#hidQDTTId').val(thutuyencid);
                $('#hidHoSoThuTuyenId').val(thutuyen.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(thutuyen.Ten);
                $('#txtAddEditPhongTo').val(thutuyen.TenPhong);

                $('#ddlLoaiQuyetDinh').val(thutuyen.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(thutuyen.LyDoQuyetDinh);

                $('#txtGhiChuQuyetDinh').val(thutuyen.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(thutuyen.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(thutuyen.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(thutuyen.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(thutuyen.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(thutuyen.NgayKetThuc));

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDTT() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        $.ajax({
            type: "POST",
            url: "/Admin/qdthutuyen/ExportExcel",
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