var addeditvbdithemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var userName = $("#hidUserName").val();  
    
    var donvinhanArray = [];
    var cacdonvivndinhan = [];

    var fielvanbandi = new filevanbandiController();    

    this.initialize = function () {
        //loadThongBao();
        registerEvents();

        loadAddEditData();
       
    }

    this.vanbandanhmuc = function () {
        loadVanBanKhanList();
        loadVanBanMatList();
        loadVanBanLinhVucList();
        loadVanBanLoaiList();
        loadVanBanCoQuanList(); // don vi nhan van ban di
        loadNhomLanhDaoDuyet(1); // 1 là nhom lanh dao duyet
        
    }

    this.sovanbandi = function () {
        //loadVanBanDiSoList(makv);
        $('#tbl-contentFileVanBanDi').html('');
        ClearFormAddEdit();
    }

    this.sovanbandiEdit = function (makv) {
        loadVanBanDiSoList(makv);  
        loadDanhMucHoSo(makv);
    }
   
    this.loadLanhDaoKyVanBan = function (makv) {
        loadLanhDaoKyVanBan(makv);
    }

    this.loadCountVBDChoPhatHanh = function (makv) {
        CountVanBanDenChoPhatHanh(makv);
    }

    //this.loadVanBanDienTuCount = function (makv) {
    //    loadVanBanDienTuCout(makv);
    //}

    this.loadVanBanDi = function (vanbandiId) {
        ClearFormAddEdit();
        loadAddEditVanBanDi(vanbandiId);
    }

    function registerEvents() {

        $('#txtNgayBanHanh, #txtNgayDi, #txtHanTraLoiVanBan ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();

        $('body').on('click', '.btnFileVanBan', function (e) {
            e.preventDefault();
            $('#txtFileSoTrang').val(0);
            CodeFileGuidId();
            $('#hidInsertFileVanBanDiId').val(1);
            $('#modal-add-edit-FileVanBanDi').modal('show');
        });

        $('body').on('click', '.btnDeleteFile', function (e) {
            e.preventDefault();
            var vanbandifileId = $(this).data('id');
            $('#hidInsertFileVanBanDiId').val(3); // 3
            deleteVanBanDiFile(vanbandifileId);
        });

        $("#btnLaySoVBDi").on('click', function (e) {
            e.preventDefault();
            var makhuvuc = $('#ddlKhuVuc').val();
            var sovanbandiid = $('#ddlSoVanBanDi').val();

            if (sovanbandiid === "%") {
                tedu.notify("Chọn sổ văn bản đi.", "error");
            }
            else {
                LaySoVanBanDi(makhuvuc, sovanbandiid);
            }
        });

        $("#btnVBDiPhatHanh").on('click', function (e) {
            e.preventDefault();
            savePhatHanh();            
        });        

        $("#btnVBDiChuyenLD").on('click', function (e) {
            e.preventDefault();
            saveChuyenLanhDao();
        });

        $("#btnVBDiLDDPhatHanh").on('click', function (e) {
            e.preventDefault();
            tedu.notify("da duyet - phat hanh", "success");
        });

        $('body').on('click', '.btnVBDChoPhatHanh', function (e) {
            e.preventDefault();            
            $('#modal-add-edit-VBDChoPhatHanh').modal('show');
        });

        $('#txtCacDonViNhanVanBan').tagsInput({
            width: 'auto'
        });
             
        $("#ddlDonViNhanVanBan").on('change', function () {            
            var donvinhan = $("#ddlDonViNhanVanBan").find(":selected").text();                    
            $('#txtCacDonViNhanVanBan').addTag(donvinhan);   

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

    function CodeFileGuidId() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetHoSoNhanVienId',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hosonhanvienId = response;
                $('#hidCodeFileGuidId').val(hosonhanvienId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Tạo hồ sơ Nhân viên.', 'error');
            }
        });
    }

    function savePhatHanh() {
        //tedu.notify("phat hanh", "success");
        var vanbandenid = $('#hidVanBanDenId').val();

        if (vanbandenid === "0") {   // van ban den neu co = 0 thi phat hanh             
            var insertvbdiId = $('#hidInsertVBDiThemId').val();

            if (insertvbdiId === "1") {                
                PhatHanhVanBanDi();
            }
            else {               
                suaPhatHanhVanBanDi();
            }
        }
        else {            
            DuyetToPhatHanhVanBanDi();
        }
    }

    function saveChuyenLanhDao() {
        tedu.notify("chuyen lanh dao", "success");
    }

    function LaySoVanBanDi(corporationid, sovanbandiid) {
        //tedu.notify("lay so van ban di", "success");
        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetSoSttVBDiKV',
            data: {
                makv: corporationid,
                sovanbandiId: sovanbandiid
            },
            dataType: 'json',
            success: function (response) {
                var vanbandi = response.Result[0];
                $('#txtSoVanBanDi').val(vanbandi.KETQUA);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });       
    }

    function PhatHanhVanBanDi() {
        //tedu.notify("phat hanh", "success");
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();
          
        var makhuvuc = $('#ddlKhuVuc').val();

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdiId = $('#hidInsertVBDiThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu99').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val());
            var ngaydivanban = tedu.getFormatDateYYMMDD($('#txtNgayDi').val());
            var sovanbandiso = $('#ddlSoVanBanDi').val();
            var sovanbandi = $('#txtSoVanBanDi').val(); 
            //var sovanbanden = $('#txtSoVanBanDen').val();
            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbandi = $('#ddlNguoiKyVanBan').val();
            //var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var donvinhanvanban = $('#ddlDonViNhanVanBan').val();
            var cacdonvinhanvanban = $('#txtCacDonViNhanVanBan').val(); 
            var tennhanviensoanvanban = $('#txtTenNhanVienSoanVB').val(); 
            var ykiennhanviensoanvanban = $('#txtYKienNhanVienSoanVB').val(); 
            var lanhdaoduyet = $('#ddlLanhDaoDuyet').val();
            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();

            var sotrangvb = $('#txtFileSoTrang').val();

            var soluongphathanh = $('#txtSoLuongVanBanPhatHanh').val();
            var hantraloivb = tedu.getFormatDateYYMMDD($('#txtHanTraLoiVanBan').val()); 
            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();
            var ngonnguid = $('#ddlNgonNguVanBan').val();

            $.ajax({
                type: "POST",
                url: "/Admin/vbdithem/AddUpdateVanBanDi",
                data: {
                    InsertVanBanDiId: insertvbdiId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDiCuaVanBan: ngaydivanban,
                    VanBanDiSoId: sovanbandiso,
                    SoVanBanDi: 2, // tu cho bang 1
                    SoVanBanDiStt: sovanbandi, 
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    HoSoNhanVienIdKyVB: nguoikyvanbandi,                   
                    NoiLuuBanChinh: noiluubanchinh,
                    VanBanCoQuanBanHanhId: donvinhanvanban, // don vi nhan van ban di
                    CacDonViNhanVanBan: cacdonvinhanvanban,
                    TenNhanVienSoanVBDi: tennhanviensoanvanban,
                    YKienSoanVB: ykiennhanviensoanvanban,
                    LDDuyetHoSoNhanVienId: lanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    LanguageId: ngonnguid,
                    SoLuongPhatHanh: soluongphathanh,
                    HanTraLoiVanBan: hantraloivb,
                    QuanLyVanBanId: quanlyvanbanid,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: "False",
                    VanBanDienTuId: 0

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
                        tedu.notify('Lưu văn bản đi - phát hành.', 'success');

                        loadTableVanBanDi(true);
                        //loadCountVanBanDen(makhuvuc);

                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDiThem').modal('hide');
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

    function suaPhatHanhVanBanDi() {
        //tedu.notify("phat hanh", "success");
        var isvanbandientu = $('#hidIsVanBanDenDienTuId').val(); // 1 la co; 0 la ko  
        var vanbandientuid = $('#hidVanBanDenDienTuId').val();

        var makhuvuc = $('#ddlKhuVuc').val();
        var vanbandiid = $('#hidVanBanDiId').val(); 

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdiId = $('#hidInsertVBDiThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu99').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = tedu.getFormatDateYYMMDD($('#txtNgayBanHanh').val());
            var ngaydivanban = tedu.getFormatDateYYMMDD($('#txtNgayDi').val());
            var sovanbandiso = $('#ddlSoVanBanDi').val();
            var sovanbandi = $('#txtSoVanBanDi').val();
            //var sovanbanden = $('#txtSoVanBanDen').val();

            var sokyhieuvanban = $('#txtSoKyHieu').val();
            var nguoikyvanbandi = $('#ddlNguoiKyVanBan').val();
            //var coquanbanhanh = $('#ddlCoQuanBanHanh').val();
            var noiluubanchinh = $('#txtNoiLuuBanChinh').val();
            var donvinhanvanban = $('#ddlDonViNhanVanBan').val() === "%" ? 0 : $('#ddlDonViNhanVanBan').val();
            var cacdonvinhanvanban = $('#txtCacDonViNhanVanBan').val(); 

            var tennhanviensoanvanban = $('#txtTenNhanVienSoanVB').val();
            var ykiennhanviensoanvanban = $('#txtYKienNhanVienSoanVB').val();

            var lanhdaoduyet = $('#ddlLanhDaoDuyet').val();

            var capdokhanvanban = $('#ddlCapDoKhan').val();
            var capdomatvanban = $('#ddlCapDoMat').val();
            var ghichuvanban = $('#txtGhiChu').val();

            var soluongphathanh = $('#txtSoLuongVanBanPhatHanh').val();
            var hantraloivb = tedu.getFormatDateYYMMDD($('#txtHanTraLoiVanBan').val());
            var quanlyvanbanid = $('#ddlDanhMucHoSo').val() === "%" ? 0 : $('#ddlDanhMucHoSo').val();
            var stttronghoso = $('#txtSoThuTuTrongHoSo').val();
            //var ngonnguid = $('#ddlNgonNguVanBan').val();

            $.ajax({
                type: "POST",
                url: "/Admin/vbdithem/AddUpdateVanBanDi",
                data: {
                    Id: vanbandiid,
                    InsertVanBanDiId: insertvbdiId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    CorporationId: makhuvuc,
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDiCuaVanBan: ngaydivanban,
                    VanBanDiSoId: sovanbandiso,
                    SoVanBanDi: 2, // tu cho bang 1
                    SoVanBanDiStt: sovanbandi,

                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    HoSoNhanVienIdKyVB: nguoikyvanbandi,

                    NoiLuuBanChinh: noiluubanchinh,
                    VanBanCoQuanBanHanhId: donvinhanvanban, // don vi nhan van ban di
                    CacDonViNhanVanBan: cacdonvinhanvanban,

                    TenNhanVienSoanVBDi: tennhanviensoanvanban,
                    YKienSoanVB: ykiennhanviensoanvanban,

                    LDDuyetHoSoNhanVienId: lanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban,

                    SoLuongPhatHanh: soluongphathanh,
                    HanTraLoiVanBan: hantraloivb,
                    QuanLyVanBanId: quanlyvanbanid,
                    SoThuTuTrongHoSo: stttronghoso,

                    IsVanBanDienTu: "False",
                    VanBanDienTuId: 0

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
                        tedu.notify('Lưu văn bản đi - phát hành.', 'success');

                        loadTableVanBanDi(true);
                        //loadCountVanBanDen(makhuvuc);

                        ClearFormAddEdit();
                        $('#modal-add-edit-VBDiThem').modal('hide');
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

    function DuyetToPhatHanhVanBanDi() {
        tedu.notify("Phát hành VB đi sai (CLĐ). Kiểm tra lại!", "error");

    }

    function loadAddEditData() {
        nhomXuLy();

        $('#btnVBDiLDDPhatHanh').hide();     
        $('#txtSoVanBanDi').prop("disabled", true);     

        $('#btnVBDiChuyenLD').hide();

        var datenow = new Date();
        $('#txtHanTraLoiVanBan').val(tedu.getFormattedDate(datenow));

        var ngonngu = [{ value: "vi-VN", Name: "Tiếng Việt" }, { value: "en-US", Name: "Tiếng Anh" }];
        var render = "";
        for (var i = 0; i < ngonngu.length; i++) {
            render += "<option value='" + ngonngu[i].value + "'>" + ngonngu[i].Name + "</option>";
        }
        $('#ddlNgonNguVanBan').html(render);

        $('#txtSoThuTuTrongHoSo').val(1);
    }

    function nhomXuLy() {
        
        $.ajax({
            type: 'GET',
            url: '/admin/AppUserLogin/GetNhomVanThuHoSoNhanVien', //nhom xu ly van ban, nhan vien van thu
            data: {
                username: userName
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var appuserlogin = response.Result.Results;

                if (appuserlogin.length === 0) {
                    $('#btnVBDiChuyenLD').hide();                    
                }
                else {
                    $('#btnVBDiPhatHanh').hide();
                    $('#btnLaySoVBDi').hide();
                }                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });        

    }

    function deleteVanBanDiFile(vanbandifileId) {
        var inservanbandifile = $('#hidInsertFileVanBanDiId').val(); // 3
        var vanbandiId = $('#hidVanBanDiId').val();

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/vbdithem/DeleteVanBanFile",
                data: {
                    Id: vanbandifileId,
                    InsertVanBanDiFileId: inservanbandifile // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');

                    fielvanbandi.vanbandifileid(vanbandiId);

                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa file văn bản đi lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function ClearFormAddEdit() {
        donvinhanArray = [];

        $('#hidVanBanDiId').val('');
        $('#hidInsertVBDiThemId').val(0);
        $('#hidVanBanDiTTChuaPhatHanh').val('');
        $('#hidVanBanDiMaKhuVucId').val('');
        $('#hidCodeFileGuidId').val('');

        $('#hidVanBanDiDienTuId').val('');
        $('#hidInsertVanBanDiDienTuId').val(0);
        $('#hidIsVanBanDiDienTuId').val(0);

        $('#txtTrichYeu99').val('');
        $('#ddlLinhVuc')[0].selectedIndex = 0;
        $('#ddlLoaiVanBan')[0].selectedIndex = 0;
        $('#txtNgayBanHanh').val('');
        $('#txtNgayDi').val('');
        $('#ddlSoVanBanDi')[0].selectedIndex = 0;
        $('#txtSoVanBanDi').val('');
        $('#txtSoKyHieu').val('');
        $('#ddlNguoiKyVanBan')[0].selectedIndex = 0;
        $('#ddlCoQuanBanHanh99')[0].selectedIndex = 1;
        $('#ddlDonViNhanVanBan')[0].selectedIndex = 0;       

        $('#txtNoiLuuBanChinh').val('');
        $('#ddlLanhDaoDuyet')[0].selectedIndex = 1;
        $('#ddlCapDoKhan')[0].selectedIndex = 1;
        $('#ddlCapDoMat')[0].selectedIndex = 1;
        $('#txtGhiChu').val('');
    }

    function loadVanBanDiSoList(makv) {
        //var makv = $('#ddlKhuVuc').val();
        var datetimeNow = new Date();
        var namhientai = datetimeNow.getFullYear();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdidmso/VanBanCoQuanGetList',
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
                $('#ddlSoVanBanDi').html(render);
                $('#ddlSoVanBanDi')[0].selectedIndex = 0;             
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });
    }

    function isFormMainValidate() {
        if ($('#frmMainVBDiThem').valid()) {
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
        $('#frmMainVBDiThem').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtTrichYeu99: { required: true },
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
                txtNgayDi: {
                    required: true,
                    isDateVietNam: true
                },
                ddlSoVanBanDi: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoVanBanDi: { required: true },
                txtSoKyHieu: { required: true },
                ddlNguoiKyVanBan: {
                    required: true,
                    isDanhMuc: true
                },
                ddlCoQuanBanHanh99: {
                    required: true,
                    isDanhMuc: true
                },
                //ddlDonViNhanVanBan: {
                //    required: true,
                //    isDanhMuc: true
                //},
                txtCacDonViNhanVanBan: { required: true },
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
                txtHanTraLoiVanBan: {
                    required: true,
                    isDateVietNam: true
                },
                txtGhiChu: { required: true }               
            },
            messages: {
                txtTrichYeu99: { required: "Nhập nội dung trích yếu của văn bản.." }
            }
        });
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
   
    function loadNhomLanhDaoDuyet(nhomxulyId) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbnhom/NhomLanhDaoDuyetGetList', // nhom lanh dao để duyệt
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
                $('#ddlLanhDaoDuyet')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có nhân viên nhóm lãnh đạo duyệt.', 'error');
            }
        });
    }

    function loadLanhDaoKyVanBan(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbnhom/NhomLanhDaoKyGetList', // nhom lanh dao ký văn bản
            data: {
                corporationId: makv
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
                $('#ddlNguoiKyVanBan').html(render);
                //$('#ddlNguoiKyVanBan')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có nhân viên nhóm lãnh đạo duyệt.', 'error');
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
                $('#ddlDonViNhanVanBan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadTableVanBanDi(isPageChanged) {
        var template = $('#table-VBDiThem').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var sovanbandi = $('#ddlVanBanDiSoMoi').val();
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetListVBDi',
            data: {
                corporationId: makhuvuc,
                sovanbandi: sovanbandi,
                keyword: timnoidung,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDi: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDi: item.SoVanBanDiStt + ' ' + item.SoKyHieuCuaVanBan,
                            TenCoQuanBanHanh: item.TenCoQuanBanHanh,
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDiCuaVanBan: tedu.getFormattedDate(item.NgayDiCuaVanBan),
                            TTChuaPhatHanh: tedu.getVanBanDiTTChuaPhatHanh(item.TTChuaPhatHanh)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBDiThemTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDiThem').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDiThem(response.Result.RowCount, function () {
                        loadTableVanBanDi();
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
    function wrapPagingVBDiThem(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDiThem a').length === 0 || changePageSize === true) {
            $('#paginationULVBDiThem').empty();
            $('#paginationULVBDiThem').removeData("twbs-pagination");
            $('#paginationULVBDiThem').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDiThem').twbsPagination({
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

    function loadAddEditVanBanDi(vanbandiid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdithem/GetVanBanDiId",
            data: { vanbandiId: vanbandiid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbandi = response.Result[0];

                var isvanbandientu = vanbandi.IsVanBanDienTu.toString();
                //tedu.notify(isvanbandientu, "success");

                if (isvanbandientu === 'false') {
                    $('#hidIsVanBanDenDienTuId').val(vanbandi.IsVanBanDienTu); // 1 la co; 0 la ko      
                    $('#hidVanBanDenDienTuId').val('');
                }
                else {
                    $('#hidIsVanBanDenDienTuId').val(vanbandi.IsVanBanDienTu); // 1 la co; 0 la ko      
                    $('#hidVanBanDenDienTuId').val(vanbandi.VanBanDienTuId);
                }

                $('#hidVanBanDiId').val(vanbandi.Id);
                $('#hidVanBanDiTTChuaPhatHanh').val(vanbandi.TTXuLy);

                $('#hidCodeFileGuidId').val(vanbandi.CodeFileGuidId);

                $('#txtTrichYeu99').val(vanbandi.TrichYeuCuaVanBan);
                $('#ddlLinhVuc').val(vanbandi.VanBanLinhVucId);
                $('#ddlLoaiVanBan').val(vanbandi.VanBanLoaiId);
                $('#txtNgayBanHanh').val(tedu.getFormattedDate(vanbandi.NgayBanHanhCuaVanBan));
                $('#txtNgayDi').val(tedu.getFormattedDate(vanbandi.NgayDiCuaVanBan));

                $('#hidVanBanDiMaKhuVucId').val(vanbandi.CorporationId);               

                $('#ddlSoVanBanDi').val(vanbandi.VanBanDiSoId);
                $('#txtSoVanBanDi').val(vanbandi.SoVanBanDiStt);
                $('#txtSoKyHieu').val(vanbandi.SoKyHieuCuaVanBan);

                $('#ddlNguoiKyVanBan').val(vanbandi.HoSoNhanVienIdKyVB);

                $('#txtNoiLuuBanChinh').val(vanbandi.NoiLuuBanChinh);
                $('#ddlCoQuanBanHanh99').val(vanbandi.CorporationId);
                //$('#ddlDonViNhanVanBan').val(vanbandi.VanBanCoQuanBanHanhId);
                //$('#txtCacDonViNhanVanBan').val(vanbandi.CacDonViNhanVanBan);
                cacdonvivndinhan = vanbandi.CacDonViNhanVanBan;
                $('#txtCacDonViNhanVanBan').importTags(vanbandi.CacDonViNhanVanBan);   

                $('#txtTenNhanVienSoanVB').val(vanbandi.TenNhanVienSoanVBDi);
                $('#txtYKienNhanVienSoanVB').val(vanbandi.YKienSoanVB);
                
                $('#ddlLanhDaoDuyet').val(vanbandi.LDDuyetHoSoNhanVienId);
                $('#ddlCapDoKhan').val(vanbandi.VanBanKhanId);
                $('#ddlCapDoMat').val(vanbandi.VanBanMatId);
                $('#txtGhiChu').val(vanbandi.GhiChu);

                $('#txtSoLuongVanBanPhatHanh').val(vanbandi.SoLuongPhatHanh);
                $('#txtHanTraLoiVanBan').val(tedu.getFormattedDate(vanbandi.HanTraLoiVanBan));
                $('#ddlDanhMucHoSo').val(vanbandi.QuanLyVanBanId);
                $('#txtSoThuTuTrongHoSo').val(vanbandi.SoThuTuTrongHoSo);

                //$('#txtNgayHetHan').val(tedu.getFormattedDate(khenthuong.NgayKetThuc));

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function CountVanBanDenChoPhatHanh(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetCountVBDenDiChuaPhatHanh',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanVBDChoPhatHanh').text(response);
                //connection.on("VanBanDenChuaPhatHanh", (response) => {
                //    $('#spanDenChuaPhatHanh').text(response);
                //});
                //connection.invoke("SendVanBanDenChuaPhatHanh", response).catch(function (err) {
                //    $('#spanDenChuaPhatHanh').text(response);
                //});
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadDanhMucHoSo(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/quanlyvanban/QLVBDiGetList',
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
            url: '/admin/vbdithem/GetSttHoSoVBDiKV',
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

}