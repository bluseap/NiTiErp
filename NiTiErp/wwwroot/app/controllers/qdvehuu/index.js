var qdvehuuController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditVeHuu = new addeditvehuuController();

    this.initialize = function () {
        loadKhuVuc(); 

        registerEvents();

        addeditVeHuu.initialize(); 
    }

    function registerEvents() {
        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);            
        });

        $('body').on('click', '.btnQDVeHuu', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditQDVH();

            $('#hidInsertQDVHIdId').val(1); // insert

            $('#modal-add-edit-QDVH').modal('show');

            $('#row-AddEditQDVH').show();
            $('#tblHoSoNhanVienQDVH').show();
            $('#row-AddEditQDVH-infoHoSoQDVH').show();

        });

        $('#btnSaveQDVH').on('click', function (e) {
            var insertQDVH = $('#hidInsertQDVHIdId').val(); // update

            if (insertQDVH === "2") {
                UpdateQDVH(e);
            }
            else {
                SaveQDVH(e);
            }
        });

        $("#ddl-show-pageQDVH").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            
            loadTableVeHuu(true);
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();

            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btn-editQDVH', function (e) {
            e.preventDefault();

            $('#hidInsertQDVHIdId').val(2); // update

            var vehuuId = $(this).data('id');

            $('#hidQDVHId').val(vehuuId);

            loadVeHuu(vehuuId);

            $('#modal-add-edit-QDVH').modal('show');

            $('#row-AddEditQDVH').hide();
            $('#tblHoSoNhanVienQDVH').hide();
            $('#row-AddEditQDVH-infoHoSoQDVH').hide();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableVeHuu();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableVeHuu();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDVH();
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

                loadTableVeHuu();

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
    
    function resetFormAddEditQDVH() {
        $('#hidQDVHId').val('0');
        $('#hidHoSoVeHuuId').val('0');
        $('#hidInsertQDVHIdId').val('0');

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

    function SaveQDVH(e) {
        e.preventDefault();

        var vehuuId = $('#hidQDVHId').val();
        var hosoId = $('#hidHoSoVeHuuId').val();
        var insertqdvhId = $('#hidInsertQDVHIdId').val();

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
            url: "/Admin/qdvehuu/AddUpdateQDVeHuu",
            data: {
                Id: vehuuId,
                HoSoNhanVienId: hosoId,
                InsertqdvhId: insertqdvhId,

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

                    loadTableVeHuu(true);

                    $('#modal-add-edit-QDVH').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định nghĩ hưu', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDVH(e) {
        e.preventDefault();

        var vehuuId = $('#hidQDVHId').val();
        var hosoId = $('#hidHoSoVeHuuId').val();
        var insertqdvhId = $('#hidInsertQDVHIdId').val();

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
            url: "/Admin/qdvehuu/AddUpdateQDVeHuu",
            data: {
                Id: vehuuId,
                HoSoNhanVienId: hosoId,
                InsertqdvhId: insertqdvhId,

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

                    loadTableVeHuu(true);

                    $('#modal-add-edit-QDVH').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định nghĩ hưu', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableVeHuu(isPageChanged) {
        var template = $('#table-QDVH').html();
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
            url: '/admin/qdvehuu/GetListVeHuu',
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

                $('#lblQDVHTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDVH').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDVH(response.Result.RowCount, function () {
                        loadTableVeHuu();
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
    function wrapPagingQDVH(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDVH a').length === 0 || changePageSize === true) {
            $('#paginationULQDVH').empty();
            $('#paginationULQDVH').removeData("twbs-pagination");
            $('#paginationULQDVH').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDVH').twbsPagination({
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

    function loadVeHuu(vehuuid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdvehuu/GetVeHuuId",
            data: { vehuuId: vehuuid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vehuu = response.Result.Results[0];

                $('#hidQDVHId').val(vehuu.Id);
                $('#hidHoSoVeHuuId').val(vehuu.HoSoNhanVienId);

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

    function XuatExcelQDVH() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';
        
        $.ajax({
            type: "POST",
            url: "/Admin/qdvehuu/ExportExcel",
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