var dangxulyController = function () {

    var vanbandenduyetfile = new vbdduyetfileController();
    var _quatrinhxuly = new _quatrinhxulyController();

    var bientimClick = 0;

    this.initialize = function () {

        registerEvents();

    }

    this.loadCountDangXuLy = function (makv) {
        loadCountDangXuLy(makv);
    }

    this.loadTableVBDDangXuLy = function () {
        loadTableVBDDangXuLy();
        $('#btnTimDangXuLy').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDSoTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimDangXuLy').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimDangXuLy').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimDangXuLy').on('click', function () {
            loadTableVBDDangXuLy();
        });

        $("#ddl-show-pageDangXuLy").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDDangXuLy(true);
        });

        $('body').on('click', '.btnDangXuLyPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnDangXuLyPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnQTDangXuLy', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            _quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        $('body').on('click', '.btnDangXuLyButPheLD', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            vanbandenduyetfile.loadTableVBDDuyetFileVBDId(vanbandenId);
            $('#btnVBDDUyetFileId').hide();
            $('#modal-add-edit-VBDDuyetFile').modal('show');
        });
    }

    function loadPatchFile(vanbandenId) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdthem/GetVanBanDenId",
            data: { vanbandenId: vanbandenId },
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

    function loadTableVBDDangXuLy(isPageChanged) {
        var template = $('#table-DangXuLy').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDSoDangXuLy',
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
                            VanBanDenId: item.VanBanDenId,
                            ButPheLanhDao: item.ButPheLanhDao === "Invalid Date" ? "" : item.ButPheLanhDao
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblDangXuLyTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDangXuLy').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDSoDangXuLy(response.Result.RowCount, function () {
                        loadTableVBDDangXuLy();
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
    function wrapPagingVBDSoDangXuLy(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULDangXuLy a').length === 0 || changePageSize === true) {
            $('#paginationULDangXuLy').empty();
            $('#paginationULDangXuLy').removeData("twbs-pagination");
            $('#paginationULDangXuLy').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDangXuLy').twbsPagination({
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

    function loadCountDangXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDSoDangXuLy',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDangXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

}