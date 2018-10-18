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

    }

    function loadData() {
        $('#btnInHopDong').hide();
        $('#btnInHopDongChiTiet').hide();

        var date = new Date();
        $('#txtTuNgayHieuLuc').val(tedu.getFormattedDate(date));
        $('#txtDenNgayHieuLuc').val(tedu.getFormattedDate(date));
        
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