var hisquyetdinhController = function () {
    var hisaddbonhiem = new hisaddbonhiemController();
    var hisadddieudong = new hisadddieudongController();
    var hisaddkyluat = new hisaddkyluatController();
    var hisaddkhenthuong = new hisaddkhenthuongController();
    var hisaddvehuu = new hisaddvehuuController();
    var hisaddnangluong = new hisaddnangluongController();
    var hisaddthutuyen = new hisaddthutuyenController();
    var hisaddthoiviec = new hisaddthoiviecController();

    this.initialize = function () {        
        loadDataHisQuyetDinh();

        registerEvents();

        hisaddthoiviec.initialize();
        hisaddthutuyen.initialize();
        hisaddnangluong.initialize();
        hisaddvehuu.initialize();
        hisaddkhenthuong.initialize();
        hisaddkyluat.initialize();
        hisadddieudong.initialize();
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

        $('#btnSaveQDVH').on('click', function () {
            saveQDVeHuu();
        });

        $('#btnSaveQDKT').on('click', function () {
            saveQDKhenThuong();
        });

        $('#btnSaveQDKL').on('click', function () {
            saveQDKyLuat();
        });

        $('#btnSaveQDDD').on('click', function () {            
            saveQDDieuDong();
        });

        $('#btnSaveQDBN').on('click', function () {            
            saveQDBoNhiem();   
        });

        $('#btnTaoMoiQuyetDinh').on('click', function () {
            var quyetdinh = $('#ddlQuyetDinh').val();

            if (quyetdinh === '%') {
                tedu.notify("Chọn Quyết định tạo mới.", "error");
            }
            else {
                if (quyetdinh === 'BN01') {
                    $('#table-responsiveQDBN').hide();
                    taomoiQuyetDinhBoNhiem();
                }
                else if (quyetdinh === 'DD02') {
                    taomoiQuyetDinhDieuDong();
                }
                else if (quyetdinh === 'KL03') {
                    taomoiQuyetDinhKyLuat();
                }
                else if (quyetdinh === 'KT04') {
                    taomoiQuyetDinhKhenThuong();
                }
                else if (quyetdinh === 'NH08') {
                    taomoiQuyetDinhNghiHuu();
                }
                else if (quyetdinh === 'NN05') {
                    taomoiQuyetDinhNangLuong();
                }
                else if (quyetdinh === 'TT06') {
                    taomoiQuyetDinhThuTuyen();
                }
                else if (quyetdinh === 'TV07') {
                    taomoiQuyetDinhThoiViec();
                }
            }            
        });

    }

    function taomoiQuyetDinhThoiViec() {

    }
    function taomoiQuyetDinhThuTuyen() {

    }
    function taomoiQuyetDinhNangLuong() {

    }
    function taomoiQuyetDinhNghiHuu() {        
        $('#hidInsertQDVHIdId').val(1); // insert

        var hosoId = $('#hidHisHoSoQuyetDinhId').val(); 

        loadQDVeHuu(hosoId);

        $('#modal-add-edit-QDVH').modal('show');        
    }

    function taomoiQuyetDinhKhenThuong() {
        $('#hidInsertQDKTIdId').val(1); // insert

        var hosoId = $('#hidHisHoSoQuyetDinhId').val();  

        loadQDKhenThuong(hosoId);

        $('#modal-add-edit-QDKT').modal('show');     
    }

    function taomoiQuyetDinhKyLuat() { 
        $('#hidInsertQDKLIdId').val(1); // insert

        var hosoId = $('#hidHisHoSoQuyetDinhId').val();      

        loadQDKyLuat(hosoId);

        $('#modal-add-edit-QDKL').modal('show');        
    }

    function taomoiQuyetDinhDieuDong() {
        $('#hidInsertQDDDIdId').val(1); // insert

        var hosoId = $('#hidHisHoSoQuyetDinhId').val();        

        $('#hidQDDDId').val('0');
        $('#hidHoSoDieuDongId').val(hosoId);

        loadQDDieuDong(hosoId);

        $('#modal-add-edit-QDDD').modal('show');
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

    function resetQDDieuDong() {
        $('#hidQDDDId').val('0');
        $('#hidHoSoDieuDongId').val('0');
        $('#hidInsertQDDDIdId').val('0');

        $('#txtAddEditHoTenQDDieuDong').val('');
        $('#txtAddEditPhongToQDDieuDong').val('');
        $('#txtLyDoQuyetDinhQDDieuDong').val('');

        $('#ddlXiNghiepCuQDDieuDong')[0].selectedIndex = 1;
        $('#ddlPhongToCuQDDieuDong')[0].selectedIndex = 0;
        $('#ddlChucVuCuQDDieuDong')[0].selectedIndex = 0;

        $('#ddlXiNghiepMoiQDDieuDong')[0].selectIndex = 1;
        $('#ddlPhongToMoiQDDieuDong')[0].selectedIndex = 0;
        $('#ddlChucVuMoiQDDieuDong')[0].selectedIndex = 0;

        $('#txtGhiChuQuyetDinhQDDieuDong').val('');
        $('#txtSoQuyetDinhQDDieuDong').val('');
        $('#txtNgaKyQuyetDinhQDDieuDong').val('');
        $('#txtTenNguoiKyQuyetDinhQDDieuDong').val('');
        $('#txtNgayHieuLucQDDieuDong').val('');
        $('#txtNgayHetHanQDDieuDong').val('');
    }

    function loadQDDieuDong(hosoid) {
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
                $('#txtAddEditHoTenQDDieuDong').val(hoso.Ten);
                $('#txtAddEditPhongToQDDieuDong').val(hoso.TenPhong);

                $('#ddlXiNghiepCuQDDieuDong').val(hoso.CorporationId);
                $('#ddlPhongToCuQDDieuDong').val(hoso.PhongBanDanhMucId);
                $('#ddlChucVuCuQDDieuDong').val(hoso.ChucVuNhanVienId);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function saveQDDieuDong() {
        var dieudongId = $('#hidQDDDId').val();
        var hosoId = $('#hidHoSoDieuDongId').val();
        var insertqdddId = $('#hidInsertQDDDIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinhQDDieuDong').val();
        var lydoqd = $('#txtLyDoQuyetDinhQDDieuDong').val();
        //var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuong').val();
        //var tienkhenthuong = $('#txtTienKhenThuong').val();
        var ghichuqd = $('#txtGhiChuQuyetDinhQDDieuDong').val();
        var soquyetdinh = $('#txtSoQuyetDinhQDDieuDong').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinhQDDieuDong').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinhQDDieuDong').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucQDDieuDong').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanQDDieuDong').val());

        var khuvuccu = $('#ddlXiNghiepCuQDDieuDong').val();
        var phongcu = $('#ddlPhongToCuQDDieuDong').val();
        var chucvucu = $('#ddlChucVuCuQDDieuDong').val();

        var khuvucmoi = $('#ddlXiNghiepMoiQDDieuDong').val();
        var phongmoi = $('#ddlPhongToMoiQDDieuDong').val();
        var chucvumoi = $('#ddlChucVuMoiQDDieuDong').val();

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

                    loadTableHisQuyetDinh2(true);

                    $('#modal-add-edit-QDDD').modal('hide');

                    resetQDDieuDong();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định điều động', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetQDKyLuat() {
        $('#hidQDKLId').val('0');
        $('#hidHoSoKyLuatId').val('0');
        $('#hidInsertQDKLIdId').val('0');

        $('#txtAddEditHoTenQDKL').val('');
        $('#txtAddEditPhongToQDKL').val('');
        $('#txtLyDoQuyetDinhQDKL').val('');
        $('#ddlLoaiHinhThucKyLuatQDKL')[0].selectedIndex = 0;
        $('#txtTienKyLuatQDKL').val('0');
        $('#txtGhiChuQuyetDinhQDKL').val('');
        $('#txtSoQuyetDinhQDKL').val('');
        $('#txtNgaKyQuyetDinhQDKL').val('');
        $('#txtTenNguoiKyQuyetDinhQDKL').val('');
        $('#txtNgayHieuLucQDKL').val('');
        $('#txtNgayHetHanQDKL').val('');
    }

    function loadQDKyLuat(hosoid) {
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
                $('#txtAddEditHoTenQDKL').val(hoso.Ten);
                $('#txtAddEditPhongToQDKL').val(hoso.TenPhong);               

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function saveQDKyLuat() {        
        var hosoId = $('#hidHisHoSoQuyetDinhId').val();      

        var kyluatId = $('#hidQDKLId').val();
        //var hosoId = $('#hidHoSoKyLuatId').val();
        var insertqdklId = $('#hidInsertQDKLIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinhQDKL').val();
        var lydoqd = $('#txtLyDoQuyetDinhQDKL').val();
        var loaihinhthuckl = $('#ddlLoaiHinhThucKyLuatQDKL').val();
        var tienkyluat = $('#txtTienKyLuatQDKL').val();
        var ghichuqd = $('#txtGhiChuQuyetDinhQDKL').val();
        var soquyetdinh = $('#txtSoQuyetDinhQDKL').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinhQDKL').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinhQDKL').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucQDKL').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanQDKL').val());

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

                    loadTableHisQuyetDinh2(true);

                    $('#modal-add-edit-QDKL').modal('hide');

                    resetQDKyLuat();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định ky luật', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetQDKhenThuong() {
        $('#hidQDKTId').val('0');
        $('#hidHoSoKhenThuongId').val('0');
        $('#hidInsertQDKTIdId').val('0');

        $('#txtAddEditHoTenQDKT').val('');
        $('#txtAddEditPhongToQDKT').val('');
        $('#txtLyDoQuyetDinhQDKT').val('');
        $('#ddlLoaiHinhThucKhenThuongQDKT')[0].selectedIndex = 0;
        $('#txtTienKhenThuongQDKT').val('0');
        $('#txtGhiChuQuyetDinhQDKT').val('');
        $('#txtSoQuyetDinhQDKT').val('');
        $('#txtNgaKyQuyetDinhQDKT').val('');
        $('#txtTenNguoiKyQuyetDinhQDKT').val('');
        $('#txtNgayHieuLucQDKT').val('');
        $('#txtNgayHetHanQDKT').val('');
    }

    function loadQDKhenThuong(hosoid) {
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
                $('#txtAddEditHoTenQDKT').val(hoso.Ten);
                $('#txtAddEditPhongToQDKT').val(hoso.TenPhong);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function saveQDKhenThuong() {
        var hosoId = $('#hidHisHoSoQuyetDinhId').val();    
        var khenthuongId = $('#hidQDKTId').val();
        //var hosoId = $('#hidHoSoKhenThuongId').val();
        var insertqdktId = $('#hidInsertQDKTIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinhQDKT').val();
        var lydoqd = $('#txtLyDoQuyetDinhQDKT').val();
        var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuongQDKT').val();
        var tienkhenthuong = $('#txtTienKhenThuongQDKT').val();
        var ghichuqd = $('#txtGhiChuQuyetDinhQDKT').val();
        var soquyetdinh = $('#txtSoQuyetDinhQDKT').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinhQDKT').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinhQDKT').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucQDKT').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanQDKT').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdkhenthuong/AddUpdateQDKhenThuong",
            data: {
                Id: khenthuongId,
                HoSoNhanVienId: hosoId,
                InsertqdktId: insertqdktId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                TienKhenThuong: tienkhenthuong,
                HinhThucKhenThuongId: loaihinhthuckt,
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

                    loadTableHisQuyetDinh2(true);                    

                    $('#modal-add-edit-QDKT').modal('hide');

                    resetQDKhenThuong();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định khen thưởng', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadQDVeHuu(hosoid) {
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
                $('#txtAddEditHoTenQDVH').val(hoso.Ten);
                $('#txtAddEditPhongToQDVH').val(hoso.TenPhong);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetQDVeHuu() {
        $('#hidQDVHId').val('0');
        $('#hidHoSoVeHuuId').val('0');
        $('#hidInsertQDVHIdId').val('0');

        $('#txtAddEditHoTenQDVH').val('');
        $('#txtAddEditPhongToQDVH').val('');
        $('#txtLyDoQuyetDinhQDVH').val('');

        $('#txtGhiChuQuyetDinhQDVH').val('');
        $('#txtSoQuyetDinhQDVH').val('');
        $('#txtNgaKyQuyetDinhQDVH').val('');
        $('#txtTenNguoiKyQuyetDinhQDVH').val('');
        $('#txtNgayHieuLucQDVH').val('');
        $('#txtNgayHetHanQDVH').val('');
    }

    function saveQDVeHuu() {
        var hosoId = $('#hidHisHoSoQuyetDinhId').val();    

        var vehuuId = $('#hidQDVHId').val();
        //var hosoId = $('#hidHoSoVeHuuId').val();
        var insertqdvhId = $('#hidInsertQDVHIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinhQDVH').val();
        var lydoqd = $('#txtLyDoQuyetDinhQDVH').val();

        var ghichuqd = $('#txtGhiChuQuyetDinhQDVH').val();
        var soquyetdinh = $('#txtSoQuyetDinhQDVH').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinhQDVH').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinhQDVH').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucQDVH').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanQDVH').val());

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

                    loadTableHisQuyetDinh2(true);

                    $('#modal-add-edit-QDVH').modal('hide');

                    resetQDVeHuu();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định nghĩ hưu', 'error');
                tedu.stopLoading();
            }
        });
    }

}