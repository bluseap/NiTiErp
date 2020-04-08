var qdbonhiemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditBoNhiem = new addeditbonhiemController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditBoNhiem.initialize();

        loadPhongTo();
        loadChucVu();
    }

    function registerEvents() {
        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btnQDBoNhiem', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDBN();

            $('#hidInsertQDBNIdId').val(1); // insert

            $('#modal-add-edit-QDBN').modal('show');

            $('#row-AddEditQDBN').show();
            $('#tblHoSoNhanVienQDBN').show();
            $('#row-AddEditQDBN-infoHoSoQDBN').show();

        });

        $('#btnSaveQDBN').on('click', function (e) {
            var insertQDBN = $('#hidInsertQDBNIdId').val(); // update

            if (insertQDBN === "2") {
                UpdateQDBN(e);
            }
            else {
                SaveQDBN(e);
            }

        });

        $("#ddl-show-pageQDBN").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableBoNhiem(true);
        });

        $('body').on('click', '.btn-editQDBN', function (e) {
            e.preventDefault();

            $('#hidInsertQDBNIdId').val(2); // update

            var bonhiemId = $(this).data('id');

            $('#hidQDBNId').val(bonhiemId);

            loadBoNhiem(bonhiemId);

            $('#modal-add-edit-QDBN').modal('show');

            $('#row-AddEditQDBN').hide();
            $('#tblHoSoNhanVienQDBN').hide();
            $('#row-AddEditQDBN-infoHoSoQDBN').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableBoNhiem();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableBoNhiem();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDBN();
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();

            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlXiNghiepMoi').on('change', function () {
            var corporationId = $('#ddlXiNghiepMoi').val();

            loadAddEditPhongKhuVuc(corporationId);
            loadAddEditChucVuKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlXiNghiepCu').on('change', function () {
            var corporationId = $('#ddlXiNghiepCu').val();

            loadAddEditPhongKhuVucCu(corporationId);
            loadAddEditChucVuKhuVucCu(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
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

                $('#ddlXiNghiepCu').html(render);
                $('#ddlXiNghiepMoi').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlXiNghiepMoi').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlXiNghiepMoi').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlXiNghiepMoi")[0].selectedIndex = 0;

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                loadAddEditChucVuKhuVuc($("#ddlKhuVuc").val());

                loadTableBoNhiem();

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

    function loadAddEditPhongKhuVuc(makhuvuc) {
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
                $('#ddlPhongToMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadAddEditPhongKhuVucCu(makhuvuc) {
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
                $('#ddlPhongToCu').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function resetFormAddEditQDBN() {
        $('#hidQDBNId').val('0');
        $('#hidHoSoBoNhiemId').val('0');
        $('#hidInsertQDBNIdId').val('0');

        $('#txtAddEditHoTen').val('');
        $('#txtAddEditPhongTo').val('');
        $('#txtLyDoQuyetDinh').val('');

        $('#ddlXiNghiepCu')[0].selectedIndex = 1;
        $('#ddlPhongToCu')[0].selectedIndex = 0;
        $('#ddlChucVuCu')[0].selectedIndex = 0;

        $('#ddlXiNghiepMoi')[0].selectIndex = 1;
        $('#ddlPhongToMoi')[0].selectedIndex = 0;
        $('#ddlChucVuMoi')[0].selectedIndex = 0;

        $('#txtGhiChuQuyetDinh').val('');
        $('#txtSoQuyetDinh').val('');
        $('#txtNgaKyQuyetDinh').val('');
        $('#txtTenNguoiKyQuyetDinh').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');

    }

    function SaveQDBN(e) {
        e.preventDefault();

        var bonhiemId = $('#hidQDBNId').val();
        var hosoId = $('#hidHoSoBoNhiemId').val();
        var insertqdbnId = $('#hidInsertQDBNIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        //var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuong').val();
        //var tienkhenthuong = $('#txtTienKhenThuong').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        var khuvuccu = $('#ddlXiNghiepCu').val();
        var phongcu = $('#ddlPhongToCu').val();
        var chucvucu = $('#ddlChucVuCu').val();

        var khuvucmoi = $('#ddlXiNghiepMoi').val();
        var phongmoi = $('#ddlPhongToMoi').val();
        var chucvumoi = $('#ddlChucVuMoi').val();

        $.ajax({
            type: "POST",
            url: "/Admin/qdbonhiem/AddUpdateQDBoNhiem",
            data: {
                Id: bonhiemId,
                HoSoNhanVienId: hosoId,
                InsertqdbnId: insertqdbnId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                //TienKhenThuong: tienkhenthuong,
                //HinhThucKhenThuongId: loaihinhthuckt,
                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan,

                CorporationCuId: khuvuccu,
                PhongBanDanhMucCuId: phongcu,
                ChucVuNhanVienCuId: chucvucu,

                CorporationMoiId: khuvucmoi,
                PhongBanDanhMucMoiId: phongmoi,
                ChucVuNhanVienMoiId: chucvumoi

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

                    loadTableBoNhiem(true);

                    $('#modal-add-edit-QDBN').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định bổ nhiệm', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableBoNhiem(isPageChanged) {
        var template = $('#table-QDBN').html();
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
            url: '/admin/qdbonhiem/GetListBoNhiem',
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

                $('#lblQDBNTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDBN').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDBN(response.Result.RowCount, function () {
                        loadTableBoNhiem();
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
    function wrapPagingQDBN(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDBN a').length === 0 || changePageSize === true) {
            $('#paginationULQDBN').empty();
            $('#paginationULQDBN').removeData("twbs-pagination");
            $('#paginationULQDBN').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDBN').twbsPagination({
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

    function loadBoNhiem(bonhiemid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdbonhiem/GetBoNhiemId",
            data: { bonhiemId: bonhiemid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var bonhiem = response.Result.Results[0];

                $('#hidQDBNId').val(bonhiem.Id);
                $('#hidHoSoBoNhiemId').val(bonhiem.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(bonhiem.Ten);
                $('#txtAddEditPhongTo').val(bonhiem.TenPhong);

                $('#ddlLoaiQuyetDinh').val(bonhiem.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(bonhiem.LyDoQuyetDinh);


                $('#txtGhiChuQuyetDinh').val(bonhiem.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(bonhiem.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(bonhiem.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(bonhiem.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(bonhiem.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(bonhiem.NgayKetThuc));

                $('#ddlXiNghiepCu').val(bonhiem.CorporationCuId);
                $('#ddlPhongToCu').val(bonhiem.PhongBanDanhMucCuId);
                $('#ddlChucVuCu').val(bonhiem.ChucVuNhanVienCuId);

                $('#ddlXiNghiepMoi').val(bonhiem.CorporationMoiId);
                $('#ddlPhongToMoi').val(bonhiem.PhongBanDanhMucMoiId);
                $('#ddlChucVuMoi').val(bonhiem.ChucVuNhanVienMoiId);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDBN(e) {
        e.preventDefault();

        var bonhiemId = $('#hidQDBNId').val();
        var hosoId = $('#hidHoSoBoNhiemId').val();
        var insertqdbnId = $('#hidInsertQDBNIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        //var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuong').val();
        //var tienkhenthuong = $('#txtTienKhenThuong').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        var khuvuccu = $('#ddlXiNghiepCu').val();
        var phongcu = $('#ddlPhongToCu').val();
        var chucvucu = $('#ddlChucVuCu').val();

        var khuvucmoi = $('#ddlXiNghiepMoi').val();
        var phongmoi = $('#ddlPhongToMoi').val();
        var chucvumoi = $('#ddlChucVuMoi').val();

        $.ajax({
            type: "POST",
            url: "/Admin/qdbonhiem/AddUpdateQDBoNhiem",
            data: {
                Id: bonhiemId,
                HoSoNhanVienId: hosoId,
                InsertqdbnId: insertqdbnId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                //TienKhenThuong: tienkhenthuong,
                //HinhThucKhenThuongId: loaihinhthuckt,
                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan,

                CorporationCuId: khuvuccu,
                PhongBanDanhMucCuId: phongcu,
                ChucVuNhanVienCuId: chucvucu,

                CorporationMoiId: khuvucmoi,
                PhongBanDanhMucMoiId: phongmoi,
                ChucVuNhanVienMoiId: chucvumoi

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

                    loadTableBoNhiem(true);

                    $('#modal-add-edit-QDBN').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định bổ nhiệm', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDBN() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        var that = $('#hidId').val();
        $.ajax({
            type: "POST",
            url: "/Admin/qdbonhiem/ExportExcel",
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

    function loadPhongTo() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdbonhiem/GetListPhong',
            //data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongToCu').html(render);
                $('#ddlPhongToMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadChucVu() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdbonhiem/ChucVuNhanVienGetList',
            //data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuCu').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
            }
        });
    }

    function loadAddEditChucVuKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuNhanVienKhuVuc',
            data: {
                makv: makhuvuc
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
        
        //$.ajax({
        //    type: 'GET',
        //    url: '/admin/qdbonhiem/ChucVuKhuVucGetList',
        //    data: { makv: makhuvuc },
        //    dataType: "json",
        //    beforeSend: function () {
        //        tedu.startLoading();
        //    },
        //    success: function (response) {
        //        var render = "<option value='%' >-- Lựa chọn --</option>";
        //        $.each(response.Result, function (i, item) {
        //            render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
        //        });
        //        $('#ddlChucVuMoi').html(render);
        //    },
        //    error: function (status) {
        //        console.log(status);
        //        tedu.notify('Không có danh mục Chức vụ.', 'error');
        //    }
        //});
    }

    function loadAddEditChucVuKhuVucCu(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuNhanVienKhuVuc',
            data: {
                makv: makhuvuc
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuCu').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
       
        //$.ajax({
        //    type: 'GET',
        //    url: '/admin/qdbonhiem/ChucVuKhuVucGetList',
        //    data: { makv: makhuvuc },
        //    dataType: "json",
        //    beforeSend: function () {
        //        tedu.startLoading();
        //    },
        //    success: function (response) {
        //        var render = "<option value='%' >-- Lựa chọn --</option>";
        //        $.each(response.Result, function (i, item) {
        //            render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
        //        });
        //        $('#ddlChucVuCu').html(render);
        //    },
        //    error: function (status) {
        //        console.log(status);
        //        tedu.notify('Không có danh mục Chức vụ.', 'error');
        //    }
        //});
    }

}