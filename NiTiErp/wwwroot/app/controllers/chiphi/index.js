var chiphiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditChiPhi = new addeditchiphiController();

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditChiPhi.initialize();
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {
            resetFormAddEditChiPhi();
            $('#hidInsertChiPhiKhoiTaoId').val(1); // insert
            $('#modal-add-edit-ChiPhi').modal('show');
        });    

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        }); 

        $('#btnTimNhanVien').on('click', function () {
            tedu.notify('Tìm nhan viedn.', 'success');
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            tedu.notify('enter nha vien', 'success');
        });

        $('#btnXuatExcelChiPhi').on('click', function () {
            tedu.notify('Xuất excel.', 'success');
        });              

    }

    function resetFormAddEditChiPhi() {      
        $('#hidChiPhiKhoiTaoId').val('');
        $('#hidInsertChiPhiKhoiTaoId').val('');
        $('#hidKhoaSoLuongThangDotIn').val('');

        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;        
        $('#ckAddEditChuyenKySau').prop('checked', false);

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
                $('#ddlAddEditKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlAddEditKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlAddEditKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());

                loadLuongDotInKy($("#ddlKhuVuc").val());

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

    function loadLuongDotInKy(corporationId) {
        $.ajax({
            type: 'GET',
            url: '/admin/congngay/LuongDotInGetList',
            data: { makv: corporationId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenDotIn + "</option>";
                });
                $('#ddlLuongDotIn').html(render);
                $('#ddlLuongDotIn')[0].selectedIndex = 1;

                $('#ddlAddEditDotIn').html(render);
                $('#ddlAddEditDotIn')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có đợt in lương.', 'error');
            }
        });
    }

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();
        var thangNow = newdate.getMonth();

        $('#txtNam').val(namNow);
        $('#txtAddEditNam').val(namNow);
        loadThang(thangNow);
        loadAddEditThang(thangNow);

        loadDieuKienTim();   

        loadChiPhiDanhMuc();

        //var ischiphitang = [{ value: "%", ten: "-- Chọn chi phí --" }, { value: "1", ten: "CP Tăng" }, { value: "2", ten: "CP Giảm" }];
        //var render = "";
        //for (var i = 0; i < ischiphitang.length; i++) {
        //    render += "<option value='" + ischiphitang[i].value + "'>" + ischiphitang[i].ten + "</option>";
        //}
        //$('#ddlIsChiPhiTang').html(render);        
    }

    function loadThang(thangnow) {
        var render;

        render += "<option value='1'>Tháng 01 </option>";
        render += "<option value='2'>Tháng 02 </option>";
        render += "<option value='3'>Tháng 03 </option>";
        render += "<option value='4'>Tháng 04 </option>";
        render += "<option value='5'>Tháng 05 </option>";
        render += "<option value='6'>Tháng 06 </option>";
        render += "<option value='7'>Tháng 07 </option>";
        render += "<option value='8'>Tháng 08 </option>";
        render += "<option value='9'>Tháng 09 </option>";
        render += "<option value='10'>Tháng 10 </option>";
        render += "<option value='11'>Tháng 11 </option>";
        render += "<option value='12'>Tháng 12 </option>";

        $('#ddlThang').html(render);
        $('#ddlThang').val(thangnow);        
    }

    function loadAddEditThang(thangnow) {
        var render;

        render += "<option value='1'>Tháng 01 </option>";
        render += "<option value='2'>Tháng 02 </option>";
        render += "<option value='3'>Tháng 03 </option>";
        render += "<option value='4'>Tháng 04 </option>";
        render += "<option value='5'>Tháng 05 </option>";
        render += "<option value='6'>Tháng 06 </option>";
        render += "<option value='7'>Tháng 07 </option>";
        render += "<option value='8'>Tháng 08 </option>";
        render += "<option value='9'>Tháng 09 </option>";
        render += "<option value='10'>Tháng 10 </option>";
        render += "<option value='11'>Tháng 11 </option>";
        render += "<option value='12'>Tháng 12 </option>";

        $('#ddlAddEditThang').html(render);
        $('#ddlAddEditThang').val(thangnow);
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphi/DieuKienGetList',
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
                tedu.notify('Không có danh chi phí lương.', 'error');
            }
        });
    }

    function loadChiPhiDanhMuc() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ListChiPhi',
            data: {
                corporationId: "%",
                keyword: "%",
                IsChiPhiTang: "True",
                page: 1,
                pageSize: 1000
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Tất cả ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChiPhi + "</option>";
                });
                $('#ddlChiPhiDanhMuc').html(render);
                $('#ddlAddEditLoaiChiPhi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh chi phí lương.', 'error');
            }
        });
    }
    

}