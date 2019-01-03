var addeditvbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
  

    this.initialize = function () {
        
        registerEvents();

        loadAddEditData();

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
    }       

    function registerEvents() {
        
        $('#txtNgayBanHanh, #txtNgayDen ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

        formMainValidate();

        $('body').on('click', '.btnFileVanBan', function (e) {   
            e.preventDefault();
            $('#hidInsertFileVanBanDenId').val(1);
            $('#modal-add-edit-FileVanBanDen').modal('show');  
        });

        $("#btnThemMoiCoQuan").on('click', function (e) {
            e.preventDefault();
            $('#modal-add-edit-ThemCoQuan').modal('show');  
        });

        $('body').on('click', '.btnDenDienTu', function (e) {
            e.preventDefault();
            tedu.notify("den dien tu", "success");
            $('#modal-add-edit-DenDienTu').modal('show');  
        });

        $("#btnSaveVBDThem").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDen();
        });

    }

    function loadAddEditData() {
        $('#ddlSoVanBanDen').prop("disabled", true);
        $('#txtSoVanBanDen').prop("disabled", true);

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
        $('#hidCodeFileGuidId').val('');

        $('#hidVanBanDenDienTuId').val('');
        $('#hidInsertVanBanDenDienTuId').val(0);

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
        $('#ddlCapDoKhan')[0].selectedIndex = 0;
        $('#ddlCapDoMat')[0].selectedIndex = 0;
        $('#txtGhiChu').val('');
    }

    function SaveVanBanDen() {
        tedu.notify("save van ban den", "success");

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            var insertvbdId = $('#hidInsertVBDThemId').val();
            var codefileguid = $('#hidCodeFileGuidId').val();

            var trichyeunoidung = $('#txtTrichYeu').val();
            var linhvucid = $('#ddlLinhVuc').val();
            var loaivanbanid = $('#ddlLoaiVanBan').val();
            var ngaybanhanh = $('#txtNgayBanHanh').val();
            var ngaydenvanban = $('#txtNgayDen').val();
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

            $.ajax({
                type: "POST",
                url: "/Admin/vbdthem/AddUpdateVanBanDen",
                data: {
                    InsertVanBanDenId: insertvbdId,
                    CodeFileGuidId: codefileguid, // update danh sách file van ban lien quan
                    TrichYeuCuaVanBan: trichyeunoidung,
                    VanBanLinhVucId: linhvucid,
                    VanBanLoaiId: loaivanbanid,
                    NgayBanHanhCuaVanBan: ngaybanhanh,
                    NgayDenCuaVanBan: ngaydenvanban,
                    VanBanDenSoId: sovanbandenso,
                    SoVanBanDen: 1, // tu cho bang 1
                    SoVanBanDenStt: sovanbanden,
                    SoKyHieuCuaVanBan: sokyhieuvanban,
                    NguoiKyCuaVanBan: nguoikyvanbanden,
                    VanBanCoQuanBanHanhId: coquanbanhanh,
                    NoiLuuBanChinh: noiluubanchinh,
                    TenLanhDaoDuyet: tenlanhdaoduyet,
                    VanBanKhanId: capdokhanvanban,
                    VanBanMatId: capdomatvanban,
                    GhiChu: ghichuvanban

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

                //txtLuongCoBan: {
                //    required: true,
                //    number: true
                //}
            },
            messages: {
                txtTrichYeu: { required: "Nhập họ và tên.." }      
               
                //txtLuongCoBan: {
                //    required: "Nhập lương cơ bản..",
                //    number: "Chỉ nhập số.."
                //}
            }
        });
    }


}