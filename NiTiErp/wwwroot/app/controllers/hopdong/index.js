var hopdongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditHopDong = new AddEditHopDong();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditHopDong.initialize();
    }

    function registerEvents() {    
        $('#txtTuNgayHieuLuc, #txtDenNgayHieuLuc').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        disabledHopDong(true);

        //formMainValidate();

        $("#checkTuNgayDenNgay").change(function () {
            var $input = $(this);  
            //var ischecedTrue = $input.prop("checked"); 
            var ischecedFalse = $input.is(":checked"); 

            if (ischecedFalse === false) {               
                disabledHopDong(true); // hidden
            }
            else {               
                disabledHopDong(false); // show
            }   
        }).change();

        $('#btnTimNhanVien').on('click', function () {
            LoadTableHopDong();
            LoadTableInHopDong();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHopDong();
                LoadTableInHopDong();
            }
        });

        $("#btn-create").on('click', function () {
            resetFormHopDong();

            $('#modal-add-edit-HopDong').modal('show');            
        });

    }

    function resetFormHopDong() {
        resetHopDong();       
    }

    function resetHopDong() {        
        var tungay = tedu.getFormattedDate(new Date());
        $('#txtTuNgayHieuLuc').val(tungay);

        var denngay = tedu.getFormattedDate(new Date());
        $('#txtDenNgayHieuLuc').val(denngay);

        $('#ddlLoaiHopDong')[0].selectedIndex = 0;
        $('#ddlDieuKienKhac')[0].selectedIndex = 0;
       
    }   

    function disabledHopDong(para) {
        $('#txtTuNgayHieuLuc').prop('disabled', para);
        $('#txtDenNgayHieuLuc').prop('disabled', para);
    }

    function formMainvalidate() {
        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );  
    }

    function loadData() {
        loadLoaiHopDong();
        loadDieuKienTim();
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/hopdong/DieuKienGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenDieuKien + "</option>";
                });
                $('#ddlDieuKienKhac').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });
    }    

    function loadLoaiHopDong() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/LoaiHopDongGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiHopDong + "</option>";
                });
                $('#ddlLoaiHopDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });
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
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;         

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                       
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
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function LoadTableHopDong() {

    }

    function LoadTableInHopDong() {

    }



}