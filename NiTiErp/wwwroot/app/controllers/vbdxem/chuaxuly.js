var chuaxulyController = function () {

    var quatrinhxuly = new _quatrinhxulyController();

    var dangxuly = new dangxulyController();
    var daxuly = new daxulyController();
    var tatcaxuly = new tatcaxulyController();
    var _chuaxuly = new _chuaxulyController();

    var vanbandenduyetfile = new vbdduyetfileController();

    var bientimClick = 0;

    this.initialize = function () {     
        registerEvents(); 
        
    }

    this.loadCountVanBanDenChuaXuLy = function (makv) {
        loadCountVBDChuaXuLy(makv);

        dangxuly.loadCountVanBanDenDangXuLy(makv);
        daxuly.loadCountVBDDaXuLyCLD(makv);
        tatcaxuly.loadCountVanBanDenTatCaXuLy(makv);
    }

    this.loadTableVBDChuaXuLy = function () {
        loadTableVBDChuaXuLy();
        $('#btnTimChuaXuLy').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimChuaXuLy').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimChuaXuLy').hide();
                bientimClick = 0;
            }            
        }); 

        $('#btnTimChuaXuLy').on('click', function () {
            loadTableVBDChuaXuLy();
        });

        $("#ddl-show-pageChuaXuLy").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDChuaXuLy(true);
        });

        $('body').on('click', '.btnChuaXuLyPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnChuaXuLyPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        }); 

        $('body').on('click', '.btnQTChuaXuLy', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        $('body').on('click', '.btnChuaXuLyXuLy', function (e) {
            e.preventDefault();
            var vanbandenduyetId = $(this).data('id');
            $('#hidVanBanDenDuyetId').val(vanbandenduyetId);
            _chuaxuly.loadNhanVienXuLyVanBanDen(vanbandenduyetId);
            $('#modal-add-edit-ChuaXuLyXuLy').modal('show');
            $('#frmMainDivChuaXuLyXuLy').show();
        });

        $('body').on('click', '.btnChuaXLButPheLD', function (e) {
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

    function loadCountVBDChuaXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetCCMUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanChuaXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadTableVBDChuaXuLy(isPageChanged) {
        var template = $('#table-ChuaXuLy').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDenChuaXuLy',
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

                $('#lblChuaXuLyTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChuaXuLy').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDChuaXuLy(response.Result.RowCount, function () {
                        loadTableVBDChuaXuLy();
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
    function wrapPagingVBDChuaXuLy(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULChuaXuLy a').length === 0 || changePageSize === true) {
            $('#paginationULChuaXuLy').empty();
            $('#paginationULChuaXuLy').removeData("twbs-pagination");
            $('#paginationULChuaXuLy').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChuaXuLy').twbsPagination({
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
   

}