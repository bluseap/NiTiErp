var congngayController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    

    this.initialize = function () {  
        
        loadKhuVuc();

        loadData();

        registerEvents();       
      
    }

    this.loadDataData = function () {

        this.datatablecongngay = loadTableCongNgayReturn(function (d) {
            //clickDataGrid();
        });

    } 
    function loadTableCongNgayReturn(callback) {

        var thang1 = $('#ddlThang').val();
        var nam1 = $('#txtNam').val();        
        var makhuvuc = $('#ddlKhuVuc').val();
        var maphong = $('#ddlPhongBan').val();
        var keyword2 = $('#txtTimNhanVien').val();

        var moi;

        $.ajax({
            type: 'POST',
            url: '/admin/congngay/LuongBaoHiemGetList',
            data: {
                nam: '2018',
                thang: '10',
                corporationId: 'PO',
                phongId: '%',
                chucvuId: "%",
                keyword: '%',
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize                
            },
            async: false,
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                moi = response.Result;
                callback(moi);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
        return moi;
    } 
     
    function registerEvents() {

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

    }

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();
        var thangNow = newdate.getMonth();

        $('#txtNam').val(namNow);
        loadThang(thangNow);
        
        loadDieuKienTim();
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

        tedu.notify(thangnow,"success");
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/congngay/DieuKienGetList',
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


}