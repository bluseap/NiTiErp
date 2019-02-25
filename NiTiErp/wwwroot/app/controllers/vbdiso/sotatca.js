var sotatcaController = function () {

    var _vbdithemqtxl = new _vbdiqtxlController();

    this.initialize = function () {

        registerEvents();

        $('#ddlShareCoQuanBanHanhDi').prop("disabled", true);
    }    

    function registerEvents() {

        $('#btnTimSoTatCaVBDi').on('click', function () {
            loadTableVBDiSoTatCa();
        });

        $("#ddl-show-pageSoTatCaVBDi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDiSoTatCa(true);
        });

        $('body').on('click', '.btnSoTatCaVBDiPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandiId = $(this).data('id');
            loadPatchFile(vanbandiId);
        });

        $('body').on('click', '.btnSoTatCaVBDiPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandiId = $(this).data('id');
            loadPatchFile(vanbandiId);
        });

        $('body').on('click', '.btnVBDiSoTatCaQTXL', function (e) {
            e.preventDefault();
            var vanbandiId = $(this).data('id');
            _vbdithemqtxl.loadVBDiQuaTrinhXuLy(vanbandiId);
            $('#modal-add-edit-VBDiQuaTrinhXuLy').modal('show');
        });

    }    

    function loadPatchFile(vanbandiid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdithem/GetVanBanDiId",
            data: { vanbandiId: vanbandiid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanden = response.Result[0];
                var win = window.open(vanbanden.DuongDanFile, '_blank');
                win.focus();
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableVBDiSoTatCa(isPageChanged) {
        //tedu.notify("van ban di so tat ca", "success");
        var template = $('#table-SoTatCaVBDi').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();

        var namvanban = $('#txtShareNamVanBanDi').val();
        var sovanban = $('#txtShareSoVanBanDi').val();
        var kyhieuvanban = $('#txtShareKyHieuVanBanDi').val();
        var vanbandiso = $('#ddlShareVanBanDiSo').val();
        var trichyeu = $('#txtShareTrichYeuDi').val();

        var noidenvbdi = $('#ddlShareCVBDiNoiDen').val();
        var coquanbanhanh = $('#ddlShareCoQuanBanHanhDi').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetListVBDiSo',
            data: {
                corporationId: makhuvuc,
                keyword: noidenvbdi,

                NamVanBan: namvanban,
                SoVanBan: sovanban,
                KyHieuVanBan: kyhieuvanban,
                VanBanDiSoId: vanbandiso,
                TrichYeu: trichyeu,
                CoQuanBanHanh: coquanbanhanh,

                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDi: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDi: item.SoVanBanDiStt + ' ' + item.SoKyHieuCuaVanBan,
                            TenCoQuanBanHanh: item.TenCoQuanBanHanh,
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDiCuaVanBan: tedu.getFormattedDate(item.NgayDiCuaVanBan),
                            TTChuaPhatHanh: tedu.getVanBanDiTTChuaPhatHanh(item.TTChuaPhatHanh)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblSoTatCaVBDiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentSoTatCaVBDi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDiSoTatCa(response.Result.RowCount, function () {
                        loadTableVBDiSoTatCa();
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
    function wrapPagingVBDiSoTatCa(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULSoTatCaVBDi a').length === 0 || changePageSize === true) {
            $('#paginationULSoTatCaVBDi').empty();
            $('#paginationULSoTatCaVBDi').removeData("twbs-pagination");
            $('#paginationULSoTatCaVBDi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULSoTatCaVBDi').twbsPagination({
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