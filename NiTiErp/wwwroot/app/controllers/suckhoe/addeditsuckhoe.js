var addeditsuckhoeController = function () {
    

    this.initialize = function () {
        
        registerEvents();       


    }

    function registerEvents() {

        $('#btnTimNhanVienAddEdit').on('click', function () {
            loadTableHoSoSucKhoe();
        });

        $('#txtTimNhanVienAddEdit').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableHoSoSucKhoe();
            }
        });

        $("#ddl-show-pageHoSoSucKhoe").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableHoSoSucKhoe(true);
        });

        //$('body').on('click', '.btn-editHoSoSucKhoe', function (e) {
        //    e.preventDefault();

        //    $('#hidInsertSucKhoeId').val(1); // insert

        //    var hosoId = $(this).data('id');

        //    $('#hidSucKhoeId').val('0');
        //    $('#hidHoSoNhanVienId').val(hosoId);

        //    loadHoSoSucKhoe(hosoId);

        //});

    }

    function loadTableHoSoSucKhoe(isPageChanged) {
        var template = $('#table-HoSoSucKhoe').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVucAddEdit').val();
        var phongId = $('#ddlPhongBanAddEdit').val();
        var timnhanvien = $('#txtTimNhanVienAddEdit').val();

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
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
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblHoSoSucKhoeTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoSucKhoe').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSoSucKhoe(response.Result.RowCount, function () {
                        loadTableHoSoSucKhoe();
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }
    function wrapPagingHoSoSucKhoe(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHoSoSucKhoe a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoSucKhoe').empty();
            $('#paginationULHoSoSucKhoe').removeData("twbs-pagination");
            $('#paginationULHoSoSucKhoe').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoSucKhoe').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                //tedu.configs.pageIndex = p;
                //setTimeout(callBack(), 200);
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }
    


}