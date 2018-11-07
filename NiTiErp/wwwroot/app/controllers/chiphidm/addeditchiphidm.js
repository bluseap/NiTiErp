var addeditchiphidmController = function () {


    this.initialize = function () {

        loadaddeditData();

        registerEvents();

        
    }

    function registerEvents() {       
        

        $("#btnSaveChiPhiDM").on('click', function () {
            var insertchiphidm = $('#hidInsertChiPhiDMId').val(); // update
           

            if (insertchiphidm === "2") {
                //UpdateDaoTaoLopGiaoVien();
            }
            else {
                tedu.notify("button save 1111", "success");
                SaveChiPhidm();
            }             
        });

        formMainValidate();
    }

    function SaveChiPhidm() {

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {

            return false;
        }
       
    }

    function loadaddeditData() {

        var ischiphitang = [{ value: "%", ten: "-- Chọn chi phí --" },{ value: "1", ten: "CP Tăng" }, { value: "2", ten: "CP Giảm" }];
        var render = "";
        for (var i = 0; i < ischiphitang.length; i++) {
            render += "<option value='" + ischiphitang[i].value + "'>" + ischiphitang[i].ten + "</option>";
        }
        $('#ddlAddEditIsChiPhiTang').html(render);

        loadChiPhiLoai();
        loadChiPhiBang();
    }

    function loadChiPhiLoai() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ChiPhiLoaiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoai + "</option>";
                });
                $('#ddlAddEditTenLoaiChiPhi').html(render);                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có tên loại chi phí.', 'error');
            }
        });
    }

    function loadChiPhiBang() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ChiPhiBangGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChiPhiBang + "</option>";
                });
                $('#ddlAddEditTenChiPhiBang').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có tên bảng chi phí.', 'error');
            }
        });
    }

    function isFormMainValidate() {
        if ($('#frmMainChiPhiDM').valid() ) {
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

        $('#frmMainChiPhiDM').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlAddEditIsChiPhiTang: {
                    required: true, isDanhMuc: true
                },
                ddlAddEditTenLoaiChiPhi: {
                    required: true, isDanhMuc: true
                },
                txtAddEditTenChiPhi: {
                    required: true
                },
                ddlAddEditTenChiPhiBang: {
                    required: true, isDanhMuc: true
                },
                txtAddEditSoTienHeSo: {
                    required: true, number: true
                }
            },
            messages: {
                ddlAddEditIsChiPhiTang: {
                    required: "Chọn chi phí tăng hoặc giảm!"
                },
                ddlAddEditTenLoaiChiPhi: {
                    required: "Chọn loại chi phí nào!"
                },
                ddlAddEditTenChiPhiBang: {
                    required: "Chọn tên bảng chi phí!", number: "Chỉ nhập số.."
                }
            }
        });

    }


}