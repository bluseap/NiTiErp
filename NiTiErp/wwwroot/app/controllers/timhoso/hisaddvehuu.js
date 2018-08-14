var hisaddvehuuController = function () {

    this.initialize = function () {        

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {       

        $('#txtNgaKyQuyetDinhQDVH, #txtNgayHieuLucQDVH, #txtNgayHetHanQDVH').datepicker({
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
        $('#frmMainQDVH').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDVH: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDVH: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinhQDVH: {
                    required: "Nhập số quyết định về hưu..."
                }
            }
        });

    }   

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDVH').prop('disabled', para);
        $('#txtAddEditPhongToQDVH').prop('disabled', para);
        $('#ddlLoaiQuyetDinhQDVH').prop('disabled', para);
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
                $('#ddlLoaiQuyetDinhQDVH').html(render);

                $('#ddlLoaiQuyetDinhQDVH').val("NH08"); //Quyet dinh nghĩ hưu
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }
    

}