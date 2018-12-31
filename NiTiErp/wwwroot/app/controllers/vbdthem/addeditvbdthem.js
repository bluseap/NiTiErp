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

        $('body').on('click', '.btnFileVanBan', function (e) {   
            $('#hidInsertFileVanBanDenId').val(1);
            $('#modal-add-edit-FileVanBanDen').modal('show');  
        });

        $("#btnThemMoiCoQuan").on('click', function (e) {
            e.preventDefault();
            $('#modal-add-edit-ThemCoQuan').modal('show');  
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

    }

}