﻿var hosoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    //var images = [];

    this.initialize = function () {               
        registerEvents();

        loadData();

        loadKhuVuc();
         
    }

    function registerEvents() {        

        $('#txtNgaySinh, #txtNgayKyHopDong').datepicker({            
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();        

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit-HoSo').modal('show');
        });

        $('#btnSave').on('click', function (e) {
            var isMainValidate = isFormMainValidate();
            if (isMainValidate === true) {

                tedu.notify("test ok nhe gdshdg", "success");
            }
        });
       
    }
    
    function isFormMainValidate()
    {        
        if ($('#frmMainLyLich').valid() && $('#frmMainHopDong').valid()) {
            return true;
        }        
        else 
        {
            return false;
        }       
    }

    function formMainValidate()
    {
        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
               return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
           },
           "Nhập theo định dạng ngày, tháng, năm."
        );

        //Init validation
        $('#frmMainLyLich').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                },
                txtNgaySinh: {
                    required: true,
                    isDateVietNam: true
                }
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên.." },
                txtHeSoLuongCoBan: {
                    required: "Nhập hệ số..",
                    number: "Chỉ nhập số.."
                },
                txtLuongCoBan: {
                    required: "Nhập lương cơ bản..",
                    number: "Chỉ nhập số.."
                },
                txtNgaySinh: { required: "Nhập ngày sinh cho đúng.." }
            }
        });

        $('#frmMainTrinhDo').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên!" },
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#frmMainHopDong').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {                
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {               
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#frmMainDangDoan').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên!" },
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#ddlKhuVuc').on('change', function () {    
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });


    }

    function resetFormMaintainance() {
        $('#hidLyLichId').val(0);

        $('#txtSoTheNhanVien').val('');
        $('#txtHoVaTen').val('');

       
        //$('#txtPriceM').val('0');
        //$('#txtImageM').val('');    
        //CKEDITOR.instances.txtContentM.setData('');
        //$('#ckStatusM').prop('checked', true);
        //$('#ckHotM').prop('checked', false);
        //$('#ckShowHomeM').prop('checked', false);
    }

    function loadData() {
        var gioitinh = [{ value:"1", ten:"Nam" }, { value:"0", ten:"Nữ" } ];        
        var render = "";
        for (var i = 0; i < gioitinh.length ; i++) {
            render += "<option value='" + gioitinh[i].value + "'>" + gioitinh[i].ten + "</option>";            
        }
        $('#ddlGioiTinh').html(render);
        
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {              
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else
                {
                    $('#ddlKhuVuc').prop('disabled', false);
                }
                //alert($("#ddlKhuVuc")[0].selectedIndex);
                $("#ddlKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                
                //var userCorporationId = $("#hidUserCorporationId").val();
                //alert(userCorporationId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVuc(makhuvuc) {
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
                $('#ddlPhongBan').html(render);

                $("#ddlPhongBan")[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }
  

}