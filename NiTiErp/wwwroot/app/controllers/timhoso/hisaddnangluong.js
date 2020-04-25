var hisaddnangluongController = function () {

    this.initialize = function () {        

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {        

        $('#txtNgaKyQuyetDinhQDNN, #txtNgayHieuLucQDNN, #txtNgayHetHanQDNN').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        forAddEditValidate();      

        $("#ddlChucVuMoiQDNN").on('change', function () {
            ddlChucVuMoiChange();
        });

        $("#ddlBacLuongMoiQDNN").on('change', function () {
            ddlChucVuMoiChange();
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
        $('#frmMainQDNN').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDNN: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDNN: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinhQDNN: {
                    required: "Nhập số quyết định nâng ngạch..."
                }
            }
        });

    }

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDNN').prop('disabled', para);
        $('#txtAddEditPhongToQDNN').prop('disabled', para);
        $('#ddlLoaiQuyetDinhQDNN').prop('disabled', para);
        $('#ddlChucVuCuQDNN').prop('disabled', para);
        $('#ddlBacLuongCuQDNN').prop('disabled', para);
        $('#txtHeSoCuQDNN').prop('disabled', para);
        $('#txtMucLuongCuQDNN').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();
        loadDataAddEditChucVu();
        loadDataAddEditBac();
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
                $('#ddlLoaiQuyetDinhQDNN').html(render);

                $('#ddlLoaiQuyetDinhQDNN').val("NN05"); //Quyet dinh nang ngach
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }    

    function ddlChucVuMoiChange() {
        //var userCorporationId = $("#hidUserCorporationId").val();
        var makhuvuc = $("#hidUserCorporationId").val();
        var chucvu = $("#ddlChucVuMoiQDNN").val();
        var bacluong = $("#ddlBacLuongMoiQDNN").val();

        $.ajax({
            type: 'GET',
            url: '/admin/qdnangngach/GetChucVuBac',
            data: {
                corporationId: makhuvuc,
                chucvuId: chucvu,
                bacluongId: bacluong
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.length === 0) {
                    $('#hidHeSoLuongDanhMucId').val(0);
                    $('#txtHeSoMoiQDNN').val(0);
                    $('#txtMucLuongMoiQDNN').val(0);
                }
                else {
                    var hesoluongdanhmuc = response.Result[0];

                    $('#hidHeSoLuongDanhMucId').val(hesoluongdanhmuc.Id);
                    $('#txtHeSoMoiQDNN').val(hesoluongdanhmuc.HeSo);
                    $('#txtMucLuongMoiQDNN').val(hesoluongdanhmuc.MucLuong);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có hệ số lương phù hợp.', 'error');
            }
        });
    }

    function loadDataAddEditChucVu() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuNhanVienGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuCuQDNN').html(render);
                $('#ddlChucVuMoiQDNN').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
    } 

    function loadDataAddEditBac() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdnangngach/BacLuongGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenBacLuong + "</option>";
                });
                $('#ddlBacLuongCuQDNN').html(render);
                $('#ddlBacLuongMoiQDNN').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Bậc lương nhân viên.', 'error');
            }
        });
    }

}