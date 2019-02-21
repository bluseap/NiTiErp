var vanbandendientuController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
   

    this.initialize = function () {

        registerEvents();

        loadShareVanBanCoQuanList();
    }   

    function registerEvents() {

        $('body').on('click', '.editVanBanDienTu', function (e) {
            e.preventDefault();
           
            $('#hidInsertVBDThemId').val(1);  // insert van ban den

            var vanbandientuId = $(this).data('id');
            $('#hidVanBanDenDienTuId').val(vanbandientuId);  

            loadVBDTVanBanDen(vanbandientuId);    

            $('#modal-add-edit-DenDienTu').modal('hide');  
        });

        $("#btnTimVanBanDienTu").on('click', function (e) {
            e.preventDefault();
            loadTableVanBanDienTu();
        });

        $("#ddl-show-pageVanBanDienTu").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVanBanDienTu(true);
        });
    }
   
    function loadTableVanBanDienTu(isPageChanged) {
        var template = $('#table-VanBanDienTu').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtShareNamVanBan').val();
        var sovanban = $('#txtShareSoVanBan').val();
        var kyhieuvanban = $('#txtShareKyHieuVanBan').val();
        var trichyeu = $('#txtShareTrichYeu').val();
        var coquanbanhanh = $('#ddlShareCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetListVBDiDienTu',
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
                            TenSoVanBanDi: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDi: item.SoVanBanDiStt + ' ' + item.SoKyHieuCuaVanBan,                           
                            TenKhuVuc: item.TenKhuVuc,// noi coq aun ban hanh
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDiCuaVanBan: tedu.getFormattedDate(item.NgayDiCuaVanBan),
                            TTChuaPhatHanh: tedu.getVanBanDiTTChuaPhatHanh(item.TTChuaPhatHanh)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVanBanDienTuTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVanBanDienTu').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVanBanDienTu(response.Result.RowCount, function () {
                        loadTableVanBanDienTu();
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
    function wrapPagingVanBanDienTu(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVanBanDienTu a').length === 0 || changePageSize === true) {
            $('#paginationULVanBanDienTu').empty();
            $('#paginationULVanBanDienTu').removeData("twbs-pagination");
            $('#paginationULVanBanDienTu').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVanBanDienTu').twbsPagination({
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

    function loadShareVanBanCoQuanList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbcoquan/VanBanDienTuGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlShareCoQuanBanHanh').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản điện tử.', 'error');
            }
        });
    }

    function loadVBDTVanBanDen(vanbandientuId) {

        var insertVBDThem = $('#hidInsertVBDThemId').val();  // insert
        var isVanBanDienTu = $('#hidIsVanBanDenDienTuId').val("True"); // True la co; False la ko

    }


}