var qddieudongController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditDieuDong = new addeditdieudongController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditDieuDong.initialize();

        loadPhongTo();
        loadChucVu();
    }

    function registerEvents() {
        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btnQDDieuDong', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDDD();

            $('#hidInsertQDDDIdId').val(1); // insert

            $('#modal-add-edit-QDDD').modal('show');

            $('#row-AddEditQDDD').show();
            $('#tblHoSoNhanVienQDDD').show();
            $('#row-AddEditQDDD-infoHoSoQDDD').show();

        });

        $('#btnSaveQDDD').on('click', function (e) {
            var insertQDDD = $('#hidInsertQDDDIdId').val(); // update

            if (insertQDDD === "2") {
                UpdateQDDD(e);
            }
            else {
                SaveQDDD(e);
            }

        });

        $("#ddl-show-pageQDDD").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableDieuDong(true);
        });

        $('body').on('click', '.btn-editQDDD', function (e) {
            e.preventDefault();

            $('#hidInsertQDDDIdId').val(2); // update

            var dieudongId = $(this).data('id');

            $('#hidQDDDId').val(dieudongId);

            loadDieuDong(dieudongId);

            $('#modal-add-edit-QDDD').modal('show');

            $('#row-AddEditQDDD').hide();
            $('#tblHoSoNhanVienQDDD').hide();
            $('#row-AddEditQDDD-infoHoSoQDDD').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableDieuDong();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableDieuDong();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDDD();
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

                loadTableDieuDong();

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

    function resetFormAddEditQDDD() {
        $('#hidQDDDId').val('0');
        $('#hidHoSoDieuDongId').val('0');
        $('#hidInsertQDDDIdId').val('0');

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

    function SaveQDDD(e) {
        e.preventDefault();

        var dieudongId = $('#hidQDDDId').val();
        var hosoId = $('#hidHoSoDieuDongId').val();
        var insertqdddId = $('#hidInsertQDDDIdId').val();

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
            url: "/Admin/qddieudong/AddUpdateQDDieuDong",
            data: {
                Id: dieudongId,
                HoSoNhanVienId: hosoId,
                InsertqdddId: insertqdddId,

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

                    loadTableDieuDong(true);

                    loadPhongTo();

                    $('#modal-add-edit-QDDD').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định điều động', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableDieuDong(isPageChanged) {
        var template = $('#table-QDDD').html();
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
            url: '/admin/qddieudong/GetListDieuDong',
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

                $('#lblQDDDTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDDD').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDDD(response.Result.RowCount, function () {
                        loadTableDieuDong();
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
    function wrapPagingQDDD(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDDD a').length === 0 || changePageSize === true) {
            $('#paginationULQDDD').empty();
            $('#paginationULQDDD').removeData("twbs-pagination");
            $('#paginationULQDDD').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDDD').twbsPagination({
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

    function loadDieuDong(dieudongid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qddieudong/GetDieuDongId",
            data: { dieudongId: dieudongid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var dieudong = response.Result.Results[0];

                $('#hidQDDDId').val(dieudong.Id);
                $('#hidHoSoDieuDongId').val(dieudong.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(dieudong.Ten);
                $('#txtAddEditPhongTo').val(dieudong.TenPhong);

                $('#ddlLoaiQuyetDinh').val(dieudong.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(dieudong.LyDoQuyetDinh);

                $('#txtGhiChuQuyetDinh').val(dieudong.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(dieudong.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(dieudong.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(dieudong.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(dieudong.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(dieudong.NgayKetThuc));

                $('#ddlXiNghiepCu').val(dieudong.CorporationCuId);
                $('#ddlPhongToCu').val(dieudong.PhongBanDanhMucCuId);
                $('#ddlChucVuCu').val(dieudong.ChucVuNhanVienCuId);

                $('#ddlXiNghiepMoi').val(dieudong.CorporationMoiId);
                $('#ddlPhongToMoi').val(dieudong.PhongBanDanhMucMoiId);
                $('#ddlChucVuMoi').val(dieudong.ChucVuNhanVienMoiId);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDDD(e) {
        e.preventDefault();

        var dieudongId = $('#hidQDDDId').val();
        var hosoId = $('#hidHoSoDieuDongId').val();
        var insertqdddId = $('#hidInsertQDDDIdId').val();

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
            url: "/Admin/qdnangngach/AddUpdateQDNangNgach",
            data: {
                Id: dieudongId,
                HoSoNhanVienId: hosoId,
                InsertqdddId: insertqdddId,

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

                    loadTableDieuDong(true);

                    $('#modal-add-edit-QDDD').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định điều động', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDDD() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        var that = $('#hidId').val();
        $.ajax({
            type: "POST",
            url: "/Admin/qddieudong/ExportExcel",
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
            url: '/admin/qddieudong/GetListPhong',
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
            url: '/admin/qddieudong/ChucVuNhanVienGetList',
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
            url: '/admin/qddieudong/ChucVuKhuVucGetList',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
            }
        });
    }


}