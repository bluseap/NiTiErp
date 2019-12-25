var xulyroiController = function () {

    var vanbandenduyetfile = new vbdduyetfileController();

    var _chuaxuly = new _chuaxulyController();

    var bientimClick = 0;

    this.initialize = function () {

        registerEvents();

    }

    this.loadCountVanBanDenXuLyRoi = function (makv) {
        loadCountVBDXuLyRoi(makv);
    }

    this.loadTableVBDXuLyRoi = function () {
        loadTableVBDXuLyRoi();
        $('#btnTimXuLyRoi').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimXuLyRoi').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimXuLyRoi').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimXuLyRoi').on('click', function () {
            loadTableVBDXuLyRoi();
        });

        $("#ddl-show-pageXuLyRoi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDXuLyRoi(true);
        });

        //$('body').on('click', '.btnVBDXuLyRoiXemFileXuLy', function (e) {
        //    e.preventDefault();
        //    var vanbandenId = $(this).data('id');
        //    loadXemPatchFileVBDXuLyRoi(vanbandenId);
        //    //loadPatchFileVBDXuLy(vanbandenId);
        //    $('#modal-add-edit-VBDXemFileXuLy').modal('show');
        //});

        $('body').on('click', '.btnXuLyRoiButPheLD', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            vanbandenduyetfile.loadTableVBDDuyetFileVBDId(vanbandenId);
            $('#btnVBDDUyetFileId').hide();
            $('#modal-add-edit-VBDDuyetFile').modal('show');
        });

        $('body').on('click', '.btnXuLyRoiPatchFileXuLy', function (e) {
            e.preventDefault();
            var duongdan = $(this).data('id');
            loadPatchFileVBDXuLyFile(duongdan);
        });

        $('body').on('click', '.btnXuLyLai', function (e) {
            e.preventDefault();
            //var vanbandenduyetId = $(this).data('id');
            //$('#hidVanBanDenDuyetId').val(vanbandenduyetId);
            //_chuaxuly.loadNhanVienXuLyVanBanDen(vanbandenduyetId);
            //$('#modal-add-edit-ChuaXuLyXuLy').modal('show');
            //$('#frmMainDivChuaXuLyXuLy').hide();

        });
    }

    function loadTableVBDXuLyRoi(isPageChanged) {
        var template = $('#table-XuLyRoi').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDXuLyRoiXuLy',
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
                            TenFile: item.TenFile,
                            VBDXuLyFilePatch: item.VBDXuLyFilePatch,
                            ButPheLanhDao: item.ButPheLanhDao === "Invalid Date" ? "" : item.ButPheLanhDao,
                            GhiChu: item.GhiChu
                            // Price: tedu.formatNumber(item.Price, 0),
                        });
                    });
                }

                $('#lblXuLyRoiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentXuLyRoi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDXuLyRoi(response.Result.RowCount, function () {
                        loadTableVBDXuLyRoi();
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
    function wrapPagingVBDXuLyRoi(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULXuLyRoi a').length === 0 || changePageSize === true) {
            $('#paginationULXuLyRoi').empty();
            $('#paginationULXuLyRoi').removeData("twbs-pagination");
            $('#paginationULXuLyRoi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULXuLyRoi').twbsPagination({
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

    function loadCountVBDXuLyRoi(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenXuLyRoiXuLyUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanXuLyRoi').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadXemPatchFileVBDXuLyRoi(vanbandenid) {
        //tedu.notify(vanbandenid, "success");
        var template = $('#table-VBDXemFileXuLy').html();
        var render = "";
        $.ajax({
            type: "GET",
            url: "/Admin/vbdxem/GetListVBDXemFileXuLyPaging",
            data: { vanbandenId: vanbandenid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenFile: item.TenFile,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            DuongDan: item.DuongDan
                            //NgayDenCuaVanBan: tedu.getFormattedDate(item.NgayDenCuaVanBan),
                            //TTXuLy: tedu.getVanBanDenTTXuLy(item.TTXuLy),                            
                            // Price: tedu.formatNumber(item.Price, 0),
                        });
                    });
                }
                if (render !== '') {
                    $('#tbl-contentVBDXemFileXuLy').html(render);
                }
            },
            error: function (status) {
                //console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });

    }

    function loadPatchFileVBDXuLyFile(duongdan) {
        var win = window.open(duongdan, '_blank');
        win.focus();
        tedu.stopLoading();

       
    }

}