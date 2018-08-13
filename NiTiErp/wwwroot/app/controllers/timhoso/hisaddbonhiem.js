var hisaddbonhiemController = function () {

    //var userCorporationId = $("#hidUserCorporationId").val();

    this.initialize = function () { 
        loadDataAddBoNhiem();

        registerEvents();
    }

    function registerEvents() {  
        $('#txtNgaKyQuyetDinh, #txtNgayHieuLuc, #txtNgayHetHan').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        forAddEditValidate();

        $('#ddlXiNghiepMoi').on('change', function () {
            var corporationId = $('#ddlXiNghiepMoi').val();

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
        $('#frmMainQDBN').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinh: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinh: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinh: {
                    required: "Nhập số quyết định bổ nhiệm..."
                }
            }
        });
    }

    function loadDataAddBoNhiem() {
        //loadKhuVucQDBoNhiem();

        loadLoaiQuyetDinhAddBoNhiem();
    }

    //function loadKhuVucQDBoNhiem() {
    //    return $.ajax({
    //        type: 'GET',
    //        url: '/admin/hoso/GetListCorNhanSu',
    //        dataType: 'json',
    //        success: function (response) {
    //            var render = "<option value='%' >-- Lựa chọn --</option>";
    //            $.each(response.Result, function (i, item) {
    //                render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
    //            });
    //            $('#ddlKhuVucAddEdit').html(render);

    //            $('#ddlXiNghiepCu').html(render);
    //            $('#ddlXiNghiepMoi').html(render);
    //            //$('#ddlXiNghiepMoi')[0].selectedIndex = 1;

    //            var userCorporationId = $("#hidUserCorporationId").val();
    //            if (userCorporationId !== "PO") {
    //                $('#ddlKhuVucAddEdit').prop('disabled', true);
    //            }
    //            else {
    //                $('#ddlKhuVucAddEdit').prop('disabled', false);
    //            }

    //            $("#ddlKhuVucAddEdit")[0].selectedIndex = 1;

    //            loadPhongKhuVucQDBoNhiem($("#ddlKhuVucAddEdit").val());

    //        },
    //        error: function (status) {
    //            console.log(status);
    //            tedu.notify('Không có danh mục Công Ty.', 'error');
    //        }
    //    });
    //}

    function loadPhongKhuVucQDBoNhiem(makhuvuc) {
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
                $('#ddlPhongBanAddEdit').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadLoaiQuyetDinhAddBoNhiem() {
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

                $('#ddlLoaiQuyetDinh').html(render);
                $('#ddlLoaiQuyetDinh').val("BN01"); //Quyet dinh bo nhiem
                disabledAddEdit(true);

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }

    function disabledAddEdit(para) {
        $('#txtAddEditHoTen').prop('disabled', para);
        $('#txtAddEditPhongTo').prop('disabled', para);

        $('#ddlXiNghiepCu').prop('disabled', para);
        $('#ddlPhongToCu').prop('disabled', para);
        $('#ddlChucVuCu').prop('disabled', para);

        $('#ddlLoaiQuyetDinh').prop('disabled', para);
    }    

    function loadAddEditChucVuKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/qdbonhiem/ChucVuKhuVucGetList',
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


}