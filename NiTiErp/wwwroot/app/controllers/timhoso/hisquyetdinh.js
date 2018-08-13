var hisquyetdinhController = function () {
    var hisaddbonhiem = new hisaddbonhiemController();

    this.initialize = function () {        
        loadDataHisQuyetDinh();

        registerEvents();

        hisaddbonhiem.initialize();

        var hosiid = $("#hidHisHoSoQuyetDinhId").val();
        tedu.notify(hosiid, 'error');

        //loadTableHisQuyetDinh();
    }

    function registerEvents() {

        $("#ddl-show-pageHisQuyetDinh").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            //tedu.notify("change His quyet dinh table qd","error");
            loadTableHisQuyetDinh2(true);
        });

        $('#btnSaveQDBN').on('click', function () {
            ///var insertQDBN = $('#hidInsertQDBNIdId').val(); // update
            saveQDBoNhiem();   
        });

        $('#btnTaoMoiQuyetDinh').on('click', function () {
            var quyetdinh = $('#ddlQuyetDinh').val();

            if (quyetdinh === '%') {
                tedu.notify("Chọn Quyết định tạo mới.", "error");
            }
            else {
                if (quyetdinh === 'BN01') {
                    taomoiQuyetDinhBoNhiem();
                }
                else if (quyetdinh === 'DD02') {
                    taomoiQuyetDinhDieuDong();
                }
            }            
        });

    }

    function taomoiQuyetDinhDieuDong() {
        tedu.notify("Quyetd dinh dieu dong", "success");
    }

    function taomoiQuyetDinhBoNhiem() {
        $('#hidInsertQDBNIdId').val(1); // insert

        var hosoId = $('#hidHisHoSoQuyetDinhId').val();

        $('#hidQDBNId').val('0');
        $('#hidHoSoBoNhiemId').val(hosoId);

        loadQDBoNhiem(hosoId);        

        loadKhuVucQDBoNhiem();

        $('#modal-add-edit-QDBN').modal('show');
    }    

    function loadQDBoNhiem(hosoid) { 
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetHoSoId",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hoso = response.Result.Results[0];
                $('#txtAddEditHoTen').val(hoso.Ten);
                $('#txtAddEditPhongTo').val(hoso.TenPhong);

                $('#ddlXiNghiepCu').val(hoso.CorporationId);
                $('#ddlPhongToCu').val(hoso.PhongBanDanhMucId);
                $('#ddlChucVuCu').val(hoso.ChucVuNhanVienId);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadPhongToQDBoNhiem() {
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

    function loadChucVuQDBoNhiem() {
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

    function resetQDBoNhiem() {
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

    function saveQDBoNhiem() {       
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

                    loadTableHisQuyetDinh2(true);                    

                    $('#modal-add-edit-QDBN').modal('hide');

                    resetQDBoNhiem();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định bổ nhiệm', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadDataHisQuyetDinh() {
        //loadLoaiQuyetDinh();       

        loadPhongToQDBoNhiem();
        loadChucVuQDBoNhiem();
    }      

    //function loadLoaiQuyetDinh() {
    //    $.ajax({
    //        type: 'GET',
    //        url: '/admin/qdkhenthuong/LoaiQuyetDinh',
    //        dataType: "json",
    //        beforeSend: function () {
    //            tedu.startLoading();
    //        },
    //        success: function (response) {
    //            var render = "<option value='%' >--- Lựa chọn ---</option>";
    //            $.each(response.Result, function (i, item) {
    //                render += "<option value='" + item.Id + "'>" + item.TenLoaiQuyetDinh + "</option>";
    //            });
    //            $('#ddlQuyetDinh').html(render);  
    //        },
    //        error: function (status) {
    //            console.log(status);
    //            tedu.notify('Không có Loại quyết định.', 'error');
    //        }
    //    });
    //}

    function loadTableHisQuyetDinh2(isPageChanged) {        
        var template = $('#table-HisQuyetDinh').html();
        var render = "";

        var makhuvuc = "";
        var phongId = "";
        var timnhanvien = "";
        var hosoid = $('#hidHisHoSoQuyetDinhId').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                hosoId: hosoid,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/timhoso/HisQuyetDinhGetAll',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TempTenLoaiQuyeDinh: item.TempTenLoaiQuyeDinh,
                            TempNoiDung: item.TempNoiDung,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TempNgayKyQuyetDinh: tedu.getFormattedDate(item.TempNgayKyQuyetDinh),
                            TempNgayHieuLuc: tedu.getFormattedDate(item.TempNgayHieuLuc)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lbl-total-recordsHisQuyetDinh').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHisQuyetDinh').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHisQDBoNhiem2(response.Result.RowCount, function () {
                        loadTableHisQuyetDinh2();
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
    function wrapPagingHisQDBoNhiem2(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHisQuyetDinh a').length === 0 || changePageSize === true) {
            $('#paginationULHisQuyetDinh').empty();
            $('#paginationULHisQuyetDinh').removeData("twbs-pagination");
            $('#paginationULHisQuyetDinh').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHisQuyetDinh').twbsPagination({
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

    function loadKhuVucQDBoNhiem() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVucAddEdit').html(render);

                $('#ddlXiNghiepCu').html(render);
                $('#ddlXiNghiepMoi').html(render);
                //$('#ddlXiNghiepMoi')[0].selectedIndex = 1;

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVucAddEdit').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVucAddEdit').prop('disabled', false);
                }

                $("#ddlKhuVucAddEdit")[0].selectedIndex = 1;

                loadPhongKhuVucQDBoNhiem($("#ddlKhuVucAddEdit").val());

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    

}