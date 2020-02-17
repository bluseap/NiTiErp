var vbdchophathanhController = function () {

    //var userCorporationId = $("#hidUserCorporationId").val();
    

    this.initialize = function () {

        registerEvents();    

        loadData();

        loadVanBanCoQuanBanHanhList();
    }     

    function registerEvents() {     
        
        $('#btnTimChuaPhatHanh').on('click', function () {
            //tedu.notify("Tim chua phat hanh", "success");
            loadTableVBDChuaPhatHanh();
        });

        $("#ddl-show-pageChuaPhatHanh").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDChuaPhatHanh(true);
        });

    }

    function loadData() {
        $('#hidVanBanDenId').val(0);             
    }

    function loadTableVBDChuaPhatHanh(isPageChanged) {
        var template = $('#table-ChuaPhatHanh').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDChuaPhatHanh',
            data: {
                corporationId: makhuvuc,
                keyword: "%",

                NamVanBan: namvanban,
                SoVanBan: sovanban,
                KyHieuVanBan: kyhieuvanban,
                TrichYeu: trichyeu,
                CoQuanBanHanh: coquanbanhanh,

                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDen: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDen: item.SoVanBanDenStt + ' ' + item.SoKyHieuCuaVanBan,
                            TenCoQuanBanHanh: item.TenCoQuanBanHanh,
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDenCuaVanBan: tedu.getFormattedDate(item.NgayDenCuaVanBan),
                            TTXuLy: tedu.getVanBanDenTTXuLy(item.TTXuLy),
                            VanBanDenId: item.VanBanDenId
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblChuaPhatHanhTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChuaPhatHanh').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDChuaPhatHanh(response.Result.RowCount, function () {
                        loadTableVBDChuaPhatHanh();
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
    function wrapPagingVBDChuaPhatHanh(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULChuaPhatHanh a').length === 0 || changePageSize === true) {
            $('#paginationULChuaPhatHanh').empty();
            $('#paginationULChuaPhatHanh').removeData("twbs-pagination");
            $('#paginationULChuaPhatHanh').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChuaPhatHanh').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function loadVanBanCoQuanBanHanhList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbcoquan/VanBanCoQuanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCoQuanBanHanh').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản cơ quan ban hành.', 'error');
            }
        });
    }

}