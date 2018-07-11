var timhosoController = function () {

    //var images = [];

    this.initialize = function () {

        loadData();

        registerEvents();
    }

    function registerEvents() {
        

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit-HopDong').modal('show');
        });

    }

    function resetFormMaintainance() {
        
    }

    function loadData() {       
        loadTableHoSo();

    }

    function loadTableHoSo() {
        var template = $('#table-HoSo').html();
        var render = "";

        //var makhuvuc = $('#ddlKhuVucAddEdit').val();
        //var phongId = $('#ddlPhongBanAddEdit').val();
        //var timnhanvien = $('#txtTimNhanVienAddEdit').val();

        //tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: "PO",
                phongId: "%",
                keyword: "%",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hoso/GetAllPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" class="img-circle img-responsive" />',
                            //HinhNhanVien: item.HinhNhanVien,
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            SoDienThoai: item.SoDienThoai,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                //$('#lblHoSoQDKTTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSo').html(render);
                }

                //if (response.Result.RowCount !== 0) {
                //    wrapPagingHoSo(response.Result.RowCount, function () {
                //        LoadTableHoSo();
                //    },
                //        isPageChanged);
                //}
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }
    



}