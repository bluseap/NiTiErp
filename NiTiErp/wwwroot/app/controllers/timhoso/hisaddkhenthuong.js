var hisaddkhenthuongController = function () {

    this.initialize = function () {     

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {        

        $('#txtNgaKyQuyetDinhQDKT, #txtNgayHieuLucQDKT, #txtNgayHetHanQDKT').datepicker({
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
        $('#frmMainQDKT').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinhQDKT: {
                    required: true,
                    isDanhMuc: true
                },
                ddlLoaiHinhThucKhenThuongQDKT: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinhQDKT: {
                    required: true
                },
                txtTienKhenThuongQDKT: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtSoQuyetDinhQDKT: {
                    required: "Nhập số quyết định khen thưởng..."
                },
                txtTienKhenThuongQDKT: {
                    required: "Nhập tiền khen thưởng..",
                    number: "Chỉ nhập số.."
                }
            }
        });

    }   

    function disabledAddEdit(para) {
        $('#txtAddEditHoTenQDKT').prop('disabled', para);
        $('#txtAddEditPhongToQDKT').prop('disabled', para);
        $('#ddlLoaiQuyetDinhQDKT').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();
        loadHinhThucKhenThuong();
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
                $('#ddlLoaiQuyetDinhQDKT').html(render);

                $('#ddlLoaiQuyetDinhQDKT').val("KT04"); //Quyet dinh khen thuong
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }

    function loadHinhThucKhenThuong() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdkhenthuong/HinhThucKhenThuong',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenHinhThucKhenThuong + "</option>";
                });
                $('#ddlLoaiHinhThucKhenThuongQDKT').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có hình thức khen thưởng.', 'error');
            }
        });
    }  
   

}