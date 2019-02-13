var addeditvbdithemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var userName = $("#hidUserName").val();    

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
        
        loadNhomLanhDaoDuyet(1); // 1 là nhom lanh dao duyet
    }

    this.sovanbandi = function () {
        loadVanBanDiSoList();
        $('#tbl-contentFileVanBanDi').html('');
        ClearFormAddEdit();
    }

    //this.loadVanBanDienTuCount = function (makv) {
    //    loadVanBanDienTuCout(makv);
    //}

    //this.loadVanBanDen = function (vanbandenId) {
    //    loadAddEditVanBanDen(vanbandenId);
    //}

    function registerEvents() {

        $('#txtNgayBanHanh, #txtNgayDi ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();

        $('body').on('click', '.btnFileVanBan', function (e) {
            e.preventDefault();

            $('#hidInsertFileVanBanDiId').val(1);
            $('#modal-add-edit-FileVanBanDi').modal('show');
        });

        $('body').on('click', '.btnDeleteFile', function (e) {
            e.preventDefault();
            var vanbandifileId = $(this).data('id');
            $('#hidInsertFileVanBanDiId').val(3); // 3
            deleteVanBanDiFile(vanbandifileId);
        });

    }

    function loadAddEditData() {
        nhomXuLy();

        //$('#ddlSoVanBanDen').prop("disabled", true);
        //$('#txtSoVanBanDen').prop("disabled", true);
    }

    function nhomXuLy() {
        
        $.ajax({
            type: 'GET',
            url: '/admin/AppUserLogin/GetNhomXuLyHoSoNhanVien', //nhom xu ly van ban
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
                    $('#btnVBDiPhatHanh').hide();
                }
                else {
                    $('#btnVBDiChuyenLD').hide();
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
        $('#hidVanBanDiId').val('');
        $('#hidInsertVBDiThemId').val(0);
        $('#hidVanBanDiTTXuLy').val('');
        $('#hidVanBanDiMaKhuVucId').val('');
        $('#hidCodeFileGuidId').val('');

        $('#hidVanBanDiDienTuId').val('');
        $('#hidInsertVanBanDiDienTuId').val(0);
        $('#hidIsVanBanDiDienTuId').val(0);

        $('#txtTrichYeu').val('');
        $('#ddlLinhVuc')[0].selectedIndex = 0;
        $('#ddlLoaiVanBan')[0].selectedIndex = 0;
        $('#txtNgayBanHanh').val('');
        $('#txtNgayDi').val('');
        $('#ddlSoVanBanDi')[0].selectedIndex = 0;
        $('#txtSoVanBanDi').val('');
        $('#txtSoKyHieu').val('');
        $('#ddlNguoiKyVanBan')[0].selectedIndex = 0;
        $('#ddlCoQuanBanHanh')[0].selectedIndex = 1;
        $('#ddlDonViNhanVanBan')[0].selectedIndex = 1;
        $('#txtNoiLuuBanChinh').val('');
        $('#ddlLanhDaoDuyet')[0].selectedIndex = 1;
        $('#ddlCapDoKhan')[0].selectedIndex = 1;
        $('#ddlCapDoMat')[0].selectedIndex = 1;
        $('#txtGhiChu').val('');
    }

    function loadVanBanDiSoList() {
        var makv = $('#ddlKhuVuc').val();
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
                ddlCoQuanBanHanh: {
                    required: true,
                    isDanhMuc: true
                },
                ddlDonViNhanVanBan: {
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

}