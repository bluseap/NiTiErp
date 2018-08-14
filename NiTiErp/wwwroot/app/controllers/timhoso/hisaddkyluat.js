var hisaddkyluatController = function () {

    this.initialize = function () {       

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {        

        $('#txtNgaKyQuyetDinhQDKL, #txtNgayHieuLucQDKL, #txtNgayHetHanQDKL').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        forAddEditValidate();           

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
        $('#frmMainQDKL').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDKL: {
                    required: true,
                    isDanhMuc: true
                },
                ddlLoaiHinhThucKyLuatQDKL: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDKL: {
                    required: true
                },
                txtTienKyLuatQDKL: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtSoQuyetDinhQDKL: {
                    required: "Nhập số quyết định kỷ luật..."
                },
                txtTienKyLuatQDKL: {
                    required: "Nhập tiền kỷ luật..",
                    number: "Chỉ nhập số.."
                }
            }
        });

    }    

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDKL').prop('disabled', para);
        $('#txtAddEditPhongToQDKL').prop('disabled', para);

        $('#ddlLoaiQuyetDinhQDKL').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();
        loadHinhThucKyLuat();
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
                $('#ddlLoaiQuyetDinhQDKL').html(render);

                $('#ddlLoaiQuyetDinhQDKL').val("KL03"); //Quyet dinh ky luat
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }

    function loadHinhThucKyLuat() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdkyluat/HinhThucKyLuat',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenHinhKyLuat + "</option>";
                });
                $('#ddlLoaiHinhThucKyLuatQDKL').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có hình thức kỷ luật.', 'error');
            }
        });
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

}