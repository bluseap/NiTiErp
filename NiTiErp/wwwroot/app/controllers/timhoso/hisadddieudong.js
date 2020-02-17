var hisadddieudongController = function () {

    this.initialize = function () {       

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {        

        $('#txtNgaKyQuyetDinhQDDieuDong, #txtNgayHieuLucQDDieuDong, #txtNgayHetHanQDDieuDong').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        forAddEditValidate();       

        $('#ddlXiNghiepMoiQDDieuDong').on('change', function () {
            var corporationId = $('#ddlXiNghiepMoiQDDieuDong').val();

            loadAddEditPhongKhuVuc(corporationId);

            loadAddEditChucVuKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

    }

    function forAddEditValidate() {
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
        $('#frmMainQDDD').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDDieuDong: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDDieuDong: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinhQDDieuDong: {
                    required: "Nhập số quyết định điều động..."
                }
            }
        });

    }    

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDDieuDong').prop('disabled', para);
        $('#txtAddEditPhongToQDDieuDong').prop('disabled', para);

        $('#ddlXiNghiepCuQDDieuDong').prop('disabled', para);
        $('#ddlPhongToCuQDDieuDong').prop('disabled', para);
        $('#ddlChucVuCuQDDieuDong').prop('disabled', para);

        $('#ddlLoaiQuyetDinhQDDieuDong').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();        

        loadChucVuCu();

        loadPhongToQDDieuDong();

        loadKhuVucQDDieuDong();
    }

    function loadKhuVucQDDieuDong() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });               

                $('#ddlXiNghiepCuQDDieuDong').html(render);
                $('#ddlXiNghiepMoiQDDieuDong').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {                   
                    $('#ddlXiNghiepMoiQDDieuDong').prop('disabled', true);
                }
                else {                  
                    $('#ddlXiNghiepMoiQDDieuDong').prop('disabled', false);
                }
               
                $("#ddlXiNghiepMoiQDDieuDong")[0].selectedIndex = 0;
             
                loadAddEditChucVuKhuVuc(userCorporationId);

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
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
                $('#ddlChucVuMoiQDDieuDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
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
                $('#ddlPhongToMoiQDDieuDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadChucVuCu() {
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
                $('#ddlChucVuCuQDDieuDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
            }
        });
    }

    function loadPhongToQDDieuDong() {
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
                $('#ddlPhongToCuQDDieuDong').html(render);
                $('#ddlPhongToMoiQDDieuDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadLoaiQuyetDinh() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdkhenthuong/LoaiQuyetDinh',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiQuyetDinh + "</option>";
                });
                $('#ddlLoaiQuyetDinhQDDieuDong').html(render);

                $('#ddlLoaiQuyetDinhQDDieuDong').val("DD02"); //Quyet dinh dieu dong
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }    

    function loadQDDieuDong(hosoid) {
        //tedu.notify(hosoid, "success");
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

}