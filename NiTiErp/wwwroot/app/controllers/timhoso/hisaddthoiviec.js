var hisaddthoiviecController = function () {

    this.initialize = function () {
        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {     

        $('#txtNgaKyQuyetDinhQDTV, #txtNgayHieuLucQDTV, #txtNgayHetHanQDTV').datepicker({
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
        $('#frmMainQDTV').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDTV: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDTV: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinhQDTV: {
                    required: "Nhập số quyết định thôi việc..."
                }
            }
        });

    }

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDTV').prop('disabled', para);
        $('#txtAddEditPhongToQDTV').prop('disabled', para);
        $('#ddlLoaiQuyetDinhQDTV').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();
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
                $('#ddlLoaiQuyetDinhQDTV').html(render);

                $('#ddlLoaiQuyetDinhQDTV').val("TV07"); //Quyet dinh thôi việc
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }
   

}