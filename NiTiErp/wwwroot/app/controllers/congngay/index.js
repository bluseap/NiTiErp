var congngayController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    

    this.initialize = function () {      

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

}