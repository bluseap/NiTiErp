var addeditvbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    
    var fielvanbanden = new filevanbandenController();

    this.initialize = function () {        
        //loadThongBao();
        registerEvents();

        loadAddEditData();
        
    }

    this.loadDanhMucHoSoAddEdit = function (makv) {
        loadDanhMucHoSo(makv);
    }

    this.vanbandanhmuc = function () {
        loadVanBanKhanList();
        loadVanBanMatList();
        loadVanBanLinhVucList();
        loadVanBanLoaiList();
        loadVanBanCoQuanList();
        loadNhomLanhDaoDuyet(1); // 1 là nhom lanh dao duyet
    }

    this.sovanbanden = function () {
        loadVanBanDenSoList();
        $('#tbl-contentFileVanBanDen').html('');

        ClearFormAddEdit();
    }        

    this.loadVanBanDienTuCount = function (makv) {
        loadVanBanDienTuCout(makv);
    }

    this.loadVanBanDen = function (vanbandenId) {
        loadAddEditVanBanDen(vanbandenId);
    }

    function registerEvents() {        

        $('#txtNgayBanHanh, #txtNgayDen, #txtThoiHanGiaiQuyet ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

        formMainValidate();

        $('body').on('click', '.btnFileVanBan', function (e) {   
            e.preventDefault();           
            $('#txtFileSoTrang').val(0);
            $('#hidInsertFileVanBanDenId').val(1);
            $('#modal-add-edit-FileVanBanDen').modal('show');  
        });

        $("#btnThemMoiCoQuan").on('click', function (e) {
            e.preventDefault();
            $('#modal-add-edit-ThemCoQuan').modal('show');  
        });

        $('body').on('click', '.btnDenDienTu', function (e) {
            e.preventDefault();
            //tedu.notify("den dien tu", "success");
            loadTableVanBanDienTu();
            $('#modal-add-edit-DenDienTu').modal('show');  
        });

        $("#btnSaveVBDThem").on('click', function (e) {
            e.preventDefault();
            var insertvanbanden = $('#hidInsertVBDThemId').val();

            if (insertvanbanden === "1") {
                SaveVanBanDen();
            }
            else if (insertvanbanden === "2") {
                var ttxuly = $('#hidVanBanDenTTXuLy').val();

                if (ttxuly === "2") {
                    tedu.notify("Văn bản đã chuyển lãnh đạo. Xem lại.", "error");
                    UpdateVanBanDenSttHoSo();
                }
                else if (ttxuly === "1") {
                    UpdateVanBanDen();
                }                
            }
        });

        $("#btnVBDThemChuyen").on('click', function (e) {
            e.preventDefault();
            var insertvanbanden = $('#hidInsertVBDThemId').val();

            if (insertvanbanden === "1") {
                SaveVanBanDenInsertChuyen();
            }
            else if (insertvanbanden === "2") {
                var ttxuly = $('#hidVanBanDenTTXuLy').val();

                if (ttxuly === "2") {
                    tedu.notify("Văn bản đã chuyển lãnh đạo. Xem lại.", "error");
                    UpdateVanBanDenSttHoSo();
                }
                else if (ttxuly === "1") {
                    SaveVanBanDenChuyen();
                } 
            }            
        });

        $('body').on('click', '.btnDeleteFile', function (e) {
            e.preventDefault();
            var vanbandenfileId = $(this).data('id');
            $('#hidInsertFileVanBanDenId').val(3); // 3
            deleteVanBanDenFile(vanbandenfileId);
        });

        $("#ddlDanhMucHoSo").on('change', function () {
            var danhmuchosoId = $('#ddlDanhMucHoSo').val();

            if (danhmuchosoId === "%") {
                $('#txtSoThuTuTrongHoSo').val(1);
            }
            else {
                loadSttTrongHoSo(danhmuchosoId);
            }
        });

    }

    function loadAddEditData() {
        $('#ddlSoVanBanDen').prop("disabled", true);
        $('#txtSoVanBanDen').prop("disabled", true);

        var datenow = new Date();
        $('#txtThoiHanGiaiQuyet').val(tedu.getFormattedDate(datenow));

        var ngonngu = [{ value: "vi-VN", Name: "Tiếng Việt" }, { value: "en-US", Name: "Tiếng Anh" }];
        var render = "";
        for (var i = 0; i < ngonngu.length; i++) {
            render += "<option value='" + ngonngu[i].value + "'>" + ngonngu[i].Name + "</option>";
        }
        $('#ddlNgonNguVanBan').html(render);

        $('#txtSoThuTuTrongHoSo').val(1);
    }
    
    function loadVanBanKhanList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbkhan/VanBanKhanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCapDoKhan').html(render);
                $('#ddlCapDoKhan')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản khẩn.', 'error');
            }
        });
    }

    function loadVanBanMatList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbmat/VanBanMatGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCapDoMat').html(render);
                $('#ddlCapDoMat')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadVanBanLinhVucList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vblinhvuc/VanBanKhanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlLinhVuc').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadVanBanLoaiList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbloai/VanBanLoaiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlLoaiVanBan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadVanBanCoQuanList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbcoquan/VanBanCoQuanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCoQuanBanHanh').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadVanBanDenSoList() {
        var makv = $('#ddlKhuVuc').val();
        var datetimeNow = new Date();
        var namhientai = datetimeNow.getFullYear();

        $.ajax({
            type: 'GET',
            url: '/admin/vbddmso/VanBanCoQuanGetList',
            data: {
                corporationid: makv,
                nam: namhientai
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Nam + " - " + item.TenSo + "</option>";
                });
                $('#ddlSoVanBanDen').html(render);
                $('#ddlSoVanBanDen')[0].selectedIndex = 1;

                //$('#ddlVanBanDenSoMoi').html(render);
                //$('#ddlVanBanDenSoMoi')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });
    }

    function loadVanBanDenSoKV(makv) {
        //var makv = $('#ddlKhuVuc').val();
        var datetimeNow = new Date();
        var namhientai = datetimeNow.getFullYear();

        $.ajax({
            type: 'GET',
            url: '/admin/vbddmso/VanBanCoQuanGetListKV',
            data: {
                corporationid: makv               
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Nam + " - " + item.TenSo + "</option>";
                });
                $('#ddlSoVanBanDen').html(render);
                $('#ddlSoVanBanDen')[0].selectedIndex = 1;               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });
    }

    function loadNhomLanhDaoDuyet(nhomxulyId) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbnhom/NhomLanhDaoDuyetGetList', //// nhom lanh dao để duyệt
            data: {
                nhomid: nhomxulyId
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.HoSoNhanVienId + "'>" + item.TenNhanVien + "</option>";
                });
                $('#ddlLanhDaoDuyet').html(render);
                //$('#ddlLanhDaoDuyet')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có nhân viên nhóm lãnh đạo duyệt.', 'error');
            }
        });
    }

    function ClearFormAddEdit() {
        $('#hidVanBanDenId').val('');
        $('#hidInsertVBDThemId').val(0);
        $('#hidVanBanDenTTXuLy').val('');
        $('#hidVanBanDenMaKhuVucId').val('');
        $('#hidCodeFileGuidId').val('');

        $('#hidVanBanDenDienTuId').val('');
        $('#hidInsertVanBanDenDienTuId').val(0);
        $('#hidIsVanBanDenDienTuId').val(0);

        $('#txtTrichYeu').val('');
        $('#ddlLinhVuc')[0].selectedIndex = 0;
        $('#ddlLoaiVanBan')[0].selectedIndex = 0;
        $('#txtNgayBanHanh').val('');
        $('#txtNgayDen').val('');
        $('#ddlSoVanBanDen')[0].selectedIndex = 0;
        $('#txtSoVanBanDen').val('');
        $('#txtSoKyHieu').val('');
        $('#txtNguoiKyVanBan').val('');
        $('#ddlCoQuanBanHanh')[0].selectedIndex = 0;
        $('#txtNoiLuuBanChinh').val('');
        $('#ddlLanhDaoDuyet')[0].selectedIndex = 0;
        $('#ddlCapDoKhan')[0].selectedIndex = 1;
        $('#ddlCapDoMat')[0].selectedIndex = 1;

        var datenow = new Date();
        $('#txtThoiHanGiaiQuyet').val(tedu.getFormattedDate(datenow));
        $('#ddlDanhMucHoSo')[0].selectedIndex = 0;
        $('#txtGhiChu').val('');
    }

    function SaveVanBanDen() {  
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();

        //if (isvanbandientu === "false") {
        //    vanbandientuid = 0;
        //}
        //else {
        //    vanbandientuid = $('#hidVanBanDenDienTuId').val();
        //}
        
        var makhuvuc = $('#ddlKhuVuc').val();

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdId = $('#hidInsertVBDThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val());    
            var ngaydenvanban = tedu.getFormatDateYYMMDD($('#txtNgayDen').val()); 
            var sovanbandenso = $('#ddlSoVanBanDen').val();
            var sovanbanden = $('#txtSoVanBanDen').val();
            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbanden = $('#txtNguoiKyVanBan').val();
            var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var tenlanhdaoduyet = $('#ddlLanhDaoDuyet').val();
            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();          

            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var ngonnguid = $('#ddlNgonNguVanBan').val();
            var chucvunguoiky = $('#txtChucVuNguoiKy').val();
            var thoihangiaiquyet = tedu.getFormatDateYYMMDD($('#txtThoiHanGiaiQuyet').val());            
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();            

            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/AddUpdateVanBanDen",
                data: {
                    InsertVanBanDenId: insertvbdId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDenCuaVanBan: ngaydenvanban,
                    VanBanDenSoId: sovanbandenso,
                    SoVanBanDen: 1, // tu cho bang 1
                    SoVanBanDenStt: 1, // tu tang trong sql
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    NguoiKyCuaVanBan: nguoikyvanbanden,
                    VanBanCoQuanBanHanhId: coquanbanhanh,
                    NoiLuuBanChinh: noiluubanchinh,
                    HoSoNhanVienId: tenlanhdaoduyet,                 
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    QuanLyVanBanId: quanlyvanbanid,
                    LanguageId: ngonnguid,
                    ChucVuNguoiKy: chucvunguoiky,
                    ThoiHanGiaiQuyet: thoihangiaiquyet,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: isvanbandientu,
                    VanBanDienTuId: vanbandientuid

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
                        tedu.notify('Lưu văn bản đến.', 'success');
                        loadTableVanBanDen(true);
                        loadCountVanBanDen(makhuvuc);
                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDThem').modal('hide');
                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu văn bản đến.', 'error');
                    tedu.stopLoading();
                }
            });
        }
        
    }

    function UpdateVanBanDen() {
        var vanbandenId = $('#hidVanBanDenId').val();
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();
        if (isvanbandientu === "false") {
            vanbandientuid = 0;
        }
        else {
            vanbandientuid = $('#hidVanBanDenDienTuId').val();
        }
        var makhuvuc = $('#ddlKhuVuc').val();

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdId = $('#hidInsertVBDThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val());  
            var ngaydenvanban = tedu.getFormatDateYYMMDD($('#txtNgayDen').val());    
            var sovanbandenso = $('#ddlSoVanBanDen').val();
            var sovanbanden = $('#txtSoVanBanDen').val();
            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbanden = $('#txtNguoiKyVanBan').val();
            var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var tenlanhdaoduyet = $('#ddlLanhDaoDuyet').val();
            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();

            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var ngonnguid = $('#ddlNgonNguVanBan').val();
            var chucvunguoiky = $('#txtChucVuNguoiKy').val();
            var thoihangiaiquyet = tedu.getFormatDateYYMMDD($('#txtThoiHanGiaiQuyet').val());
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();            

            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/AddUpdateVanBanDen",
                data: {
                    Id: vanbandenId,
                    InsertVanBanDenId: insertvbdId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDenCuaVanBan: ngaydenvanban,
                    VanBanDenSoId: sovanbandenso,
                    SoVanBanDen: 1, // tu cho bang 1
                    SoVanBanDenStt: 1, // tu tang trong sql
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    NguoiKyCuaVanBan: nguoikyvanbanden,
                    VanBanCoQuanBanHanhId: coquanbanhanh,
                    NoiLuuBanChinh: noiluubanchinh,
                    HoSoNhanVienId: tenlanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    QuanLyVanBanId: quanlyvanbanid,
                    LanguageId: ngonnguid,
                    ChucVuNguoiKy: chucvunguoiky,
                    ThoiHanGiaiQuyet: thoihangiaiquyet,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: isvanbandientu,
                    VanBanDienTuId: vanbandientuid

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
                        tedu.notify('Lưu văn bản đến.', 'success');
                        loadTableVanBanDen(true);
                        loadCountVanBanDen(makhuvuc);
                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDThem').modal('hide');
                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu văn bản đến.', 'error');
                    tedu.stopLoading();
                }
            });
        }

    }

    function UpdateVanBanDenSttHoSo() {
        var vanbandenId = $('#hidVanBanDenId').val();
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();
        if (isvanbandientu === "false") {
            vanbandientuid = 0;
        }
        else {
            vanbandientuid = $('#hidVanBanDenDienTuId').val();
        }
        var makhuvuc = $('#ddlKhuVuc').val();

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdId = $('#hidInsertVBDThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val());
            var ngaydenvanban = tedu.getFormatDateYYMMDD($('#txtNgayDen').val());
            var sovanbandenso = $('#ddlSoVanBanDen').val();
            var sovanbanden = $('#txtSoVanBanDen').val();
            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbanden = $('#txtNguoiKyVanBan').val();
            var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var tenlanhdaoduyet = $('#ddlLanhDaoDuyet').val();
            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();

            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var ngonnguid = $('#ddlNgonNguVanBan').val();
            var chucvunguoiky = $('#txtChucVuNguoiKy').val();
            var thoihangiaiquyet = tedu.getFormatDateYYMMDD($('#txtThoiHanGiaiQuyet').val());
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();

            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/UpdateVBDSttHoSo",
                data: {
                    Id: vanbandenId,
                    InsertVanBanDenId: insertvbdId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDenCuaVanBan: ngaydenvanban,
                    VanBanDenSoId: sovanbandenso,
                    SoVanBanDen: 1, // tu cho bang 1
                    SoVanBanDenStt: 1, // tu tang trong sql
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    NguoiKyCuaVanBan: nguoikyvanbanden,
                    VanBanCoQuanBanHanhId: coquanbanhanh,
                    NoiLuuBanChinh: noiluubanchinh,
                    HoSoNhanVienId: tenlanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    QuanLyVanBanId: quanlyvanbanid,
                    LanguageId: ngonnguid,
                    ChucVuNguoiKy: chucvunguoiky,
                    ThoiHanGiaiQuyet: thoihangiaiquyet,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: isvanbandientu,
                    VanBanDienTuId: vanbandientuid

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
                        tedu.notify('Lưu văn bản đến.', 'success');
                        loadTableVanBanDen(true);
                        loadCountVanBanDen(makhuvuc);
                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDThem').modal('hide');
                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu văn bản đến.', 'error');
                    tedu.stopLoading();
                }
            });
        }

    }

    function isFormMainValidate() {
        if ($('#frmMainVBDThem').valid()) {
            return true;
        }
        else {
            return false;
        }
    }
    function formMainValidate() {
        jQuery.validator.addMethod("isDanhMuc", function (value, element) {
            if (value === "%")
                return false;
            else
                return true;
        },
            "Xin chọn danh mục.."
        );

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );

        //Init validation
        $('#frmMainVBDThem').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtTrichYeu: { required: true },
                ddlLinhVuc: {
                    required: true,
                    isDanhMuc: true
                },
                ddlLoaiVanBan: {
                    required: true,
                    isDanhMuc: true
                },
                txtNgayBanHanh: {
                    required: true,
                    isDateVietNam: true
                },
                txtNgayDen: {
                    required: true,
                    isDateVietNam: true
                },  
                ddlSoVanBanDen: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoVanBanDen: { required: true },
                txtSoKyHieu: { required: true },
                txtNguoiKyVanBan: { required: true },    
                ddlCoQuanBanHanh: {
                    required: true,
                    isDanhMuc: true
                },
                txtNoiLuuBanChinh: { required: true },    
                ddlLanhDaoDuyet: {
                    required: true,
                    isDanhMuc: true
                },
                ddlCapDoKhan: {
                    required: true,
                    isDanhMuc: true
                },
                ddlCapDoMat: {
                    required: true,
                    isDanhMuc: true
                },    
                txtGhiChu: { required: true }
            },
            messages: {
                txtTrichYeu: { required: "Nhập nội dung trích yếu của văn bản.." }                   
            }
        });
    }

    function loadTableVanBanDen(isPageChanged) {
        var template = $('#table-VBDThem').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var sovanbanden = $('#ddlVanBanDenSoMoi').val();
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDen',
            data: {
                corporationId: makhuvuc,
                sovanbanden: sovanbanden,
                keyword: timnoidung,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDen: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDen: item.SoVanBanDenStt + ' ' + item.SoKyHieuCuaVanBan,
                            TenCoQuanBanHanh: item.TenCoQuanBanHanh,
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDenCuaVanBan: tedu.getFormattedDate(item.NgayDenCuaVanBan),
                            TTXuLy: tedu.getVanBanDenTTXuLy(item.TTXuLy)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBDThemTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDThem').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDThem(response.Result.RowCount, function () {
                        loadTableVanBanDen();
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
    function wrapPagingVBDThem(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDThem a').length === 0 || changePageSize === true) {
            $('#paginationULVBDThem').empty();
            $('#paginationULVBDThem').removeData("twbs-pagination");
            $('#paginationULVBDThem').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDThem').twbsPagination({
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

    function loadThongBao() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/TinNhanVBDen',
            dataType: 'json',
            success: function (response) {

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });        

    }

    function loadCountVanBanDen(makv) { 
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDen',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) { },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDangXL',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) { },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });

        //$.ajax({
        //    type: 'GET',
        //    url: '/admin/vbdthem/GetCountVBDenChoDuyet',
        //    data: {
        //        corporationId: makv
        //    },
        //    dataType: 'json',
        //    success: function (response) { },
        //    error: function (status) {
        //        console.log(status);
        //        tedu.notify('Không thể lấy dữ liệu về.', 'error');
        //    }
        //});

        //$.ajax({
        //    type: 'GET',
        //    url: '/admin/vbdthem/GetCountVBDenChuaPhatHanh',
        //    data: {
        //        corporationId: makv
        //    },
        //    dataType: 'json',
        //    success: function (response) { },
        //    error: function (status) {
        //        console.log(status);
        //        tedu.notify('Không thể lấy dữ liệu về.', 'error');
        //    }
        //});

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDienTu',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) { },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }    

    function loadVanBanDienTuCout (makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetCountVBDiDienTuKV',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                var vbdientu = response;
                $('#spanDenVanBanDienTu').text(vbdientu);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    // new guid()
    function CreateGuid() {
        var d = new Date().getTime();
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    } 
    function loadAddEditVanBanDen(vanbandenid) {        

        $.ajax({
            type: "GET",
            url: "/Admin/vbdthem/GetVanBanDenId",
            data: { vanbandenId: vanbandenid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanden = response.Result[0];

                var isvanbandientu = vanbanden.IsVanBanDienTu.toString();
                //tedu.notify(isvanbandientu, "success");

                if (isvanbandientu === 'false') {
                    $('#hidIsVanBanDenDienTuId').val(vanbanden.IsVanBanDienTu); // 1 la co; 0 la ko      
                    $('#hidVanBanDenDienTuId').val('');
                }
                else {
                    $('#hidIsVanBanDenDienTuId').val(vanbanden.IsVanBanDienTu); // 1 la co; 0 la ko      
                    $('#hidVanBanDenDienTuId').val(vanbanden.VanBanDienTuId);
                }          

                $('#hidVanBanDenId').val(vanbanden.Id);
                $('#hidVanBanDenTTXuLy').val(vanbanden.TTXuLy);

                var guid = CreateGuid();
                $('#hidCodeFileGuidId').val(vanbanden.CodeFileGuidId === '00000000-0000-0000-0000-000000000000' ? guid : vanbanden.CodeFileGuidId  );

                $('#txtTrichYeu').val(vanbanden.TrichYeuCuaVanBan);
                $('#ddlLinhVuc').val(vanbanden.VanBanLinhVucId);
                $('#ddlLoaiVanBan').val(vanbanden.VanBanLoaiId);
                $('#txtNgayBanHanh').val(tedu.getFormattedDate(vanbanden.NgayBanHanhCuaVanBan));
                $('#txtNgayDen').val(tedu.getFormattedDate(vanbanden.NgayDenCuaVanBan));

                $('#hidVanBanDenMaKhuVucId').val(vanbanden.CorporationId);
                loadVanBanDenSoKV(vanbanden.CorporationId);
                $('#ddlSoVanBanDen').val(vanbanden.VanBanDenSoId);
                $('#txtSoVanBanDen').val(vanbanden.SoVanBanDenStt);
                $('#txtSoKyHieu').val(vanbanden.SoKyHieuCuaVanBan);
                $('#txtNguoiKyVanBan').val(vanbanden.NguoiKyCuaVanBan);
                $('#ddlCoQuanBanHanh').val(vanbanden.VanBanCoQuanBanHanhId);
                $('#txtNoiLuuBanChinh').val(vanbanden.NoiLuuBanChinh);
                $('#ddlLanhDaoDuyet').val(vanbanden.HoSoNhanVienId);
                $('#ddlCapDoKhan').val(vanbanden.VanBanKhanId);
                $('#ddlCapDoMat').val(vanbanden.VanBanMatId);
                $('#txtGhiChu').val(vanbanden.GhiChu);   

                $('#ddlDanhMucHoSo').val(vanbanden.QuanLyVanBanId);
                $('#ddlNgonNguVanBan').val(vanbanden.LanguageId);
                $('#txtChucVuNguoiKy').val(vanbanden.ChucVuNguoiKy);
                $('#txtThoiHanGiaiQuyet').val(tedu.getFormattedDate(vanbanden.ThoiHanGiaiQuyet));
                $('#txtSoThuTuTrongHoSo').val(vanbanden.SoThuTuTrongHoSo);   
                
                //$('#txtNgayHetHan').val(tedu.getFormattedDate(khenthuong.NgayKetThuc));

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }
    

    function deleteVanBanDenFile(vanbandenfileid) {
        var inservanbandenfile = $('#hidInsertFileVanBanDenId').val(); // 3
        var vanbandenId = $('#hidVanBanDenId').val(); 

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/DeleteVanBanFile",
                data: {
                    Id: vanbandenfileid,
                    InsertVanBanDenFileId: inservanbandenfile // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success'); 

                    fielvanbanden.vanbandenfileid(vanbandenId);

                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa file văn bản đến lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function SaveVanBanDenChuyen() {       
        var vanbandenId = $('#hidVanBanDenId').val();      
        var insertvbdId = $('#hidInsertVBDThemId').val();        
        var makhuvuc = $('#hidVanBanDenMaKhuVucId').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdthem/InsertVanBanDenDuyet",
            data: {
                VanBanDenId: vanbandenId,
                InsertVanBanDenDuyetId: insertvbdId
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
                    tedu.notify('Lưu văn bản đến chuyển lãnh đạo.', 'success');

                    UpdateVanBanDenSttHoSo();

                    loadTableVanBanDen(true);
                    loadCountVanBanDen(makhuvuc);

                    ClearFormAddEdit();
                    $('#modal-add-edit-VBDThem').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu văn bản đến chuyển lãnh đạo.', 'error');
                tedu.stopLoading();
            }
        }); 
    }

    function SaveVanBanDenInsertChuyen() {
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();
        var makhuvuc = $('#ddlKhuVuc').val();

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdId = $('#hidInsertVBDThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val()); 
            var ngaydenvanban = tedu.getFormatDateYYMMDD($('#txtNgayDen').val()); 
            var sovanbandenso = $('#ddlSoVanBanDen').val();
            var sovanbanden = $('#txtSoVanBanDen').val();
            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbanden = $('#txtNguoiKyVanBan').val();
            var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var tenlanhdaoduyet = $('#ddlLanhDaoDuyet').val();
            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();

            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var ngonnguid = $('#ddlNgonNguVanBan').val();
            var chucvunguoiky = $('#txtChucVuNguoiKy').val();
            var thoihangiaiquyet = tedu.getFormatDateYYMMDD($('#txtThoiHanGiaiQuyet').val());
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();        

            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/AddVanBanDenChuyen",
                data: {
                    InsertVanBanDenId: insertvbdId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDenCuaVanBan: ngaydenvanban,
                    VanBanDenSoId: sovanbandenso,
                    SoVanBanDen: 1, // tu cho bang 1
                    SoVanBanDenStt: 1, // tu tang trong sql
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    NguoiKyCuaVanBan: nguoikyvanbanden,
                    VanBanCoQuanBanHanhId: coquanbanhanh,
                    NoiLuuBanChinh: noiluubanchinh,
                    HoSoNhanVienId: tenlanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    QuanLyVanBanId: quanlyvanbanid,
                    LanguageId: ngonnguid,
                    ChucVuNguoiKy: chucvunguoiky,
                    ThoiHanGiaiQuyet: thoihangiaiquyet,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: isvanbandientu,
                    VanBanDienTuId: vanbandientuid

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
                        tedu.notify('Lưu văn bản đến.', 'success');
                        loadTableVanBanDen(true);
                        loadCountVanBanDen(makhuvuc);
                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDThem').modal('hide');
                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu văn bản đến.', 'error');
                    tedu.stopLoading();
                }
            });
        }
    }

    function loadDanhMucHoSo(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/quanlyvanban/QLVBDenGetList',
            data: {
                corporationid: makv
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.SoVaKyHieu + "</option>";
                });
                $('#ddlDanhMucHoSo').html(render);
                //$('#ddlDanhMucHoSo')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản khẩn.', 'error');
            }
        });
    }

    function loadSttTrongHoSo(danhmuchosoId) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetSttHoSoVBDenKV',
            data: {
                quanlyvanbanid: danhmuchosoId
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var qlhs = response.Result[0];
                $('#txtSoThuTuTrongHoSo').val(qlhs.SoThuTuTrongHoSo);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản khẩn.', 'error');
            }
        });
    }   

    function loadTableVanBanDienTu() {

    }

}