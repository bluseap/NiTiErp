var sotatcaController = function () {

    var vanbandenduyetfile = new vbdduyetfileController();
    var _quatrinhxuly = new _quatrinhxulyController();

    var bientimClick = 0;

    this.initialize = function () {
        registerEvents();

        loadDataSoTatCa();
    }

    this.loadCountSoTatCa = function (makv) {
        loadCountSoTatCa(makv);
    }

    this.loadTableVBDSoTatCa = function () {
        loadTableVBDSoTatCa();
        $('#btnTimSoTatCa').hide();
    }

    function registerEvents() {

        $('#txtSoTuNgay, #txtSoDenNgay  ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        $('#btnSoDSExcel').on('click', function () {
            var dieukienExcel = $('#ddlSoDieuKien').val();
            if (dieukienExcel === "SODKVBD") { // so van ban den
                ExcelVBDen();
            }
            else if (dieukienExcel === "BCGQVBD") { // tinh hinh giai quyet van ban den
                ExcelBCVBDen();
            }            
        });

        $('body').on('click', '.btnVBDSoTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimSoTatCa').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimSoTatCa').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimSoTatCa').on('click', function () {            
            loadTableVBDSoTatCa();
        });

        $("#ddl-show-pageSoTatCa").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDSoTatCa(true);
        });

        $('body').on('click', '.btnSoTatCaPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnSoTatCaPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnQTSoTatCa', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            _quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        $('body').on('click', '.btnSoTatCaButPheLD', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            vanbandenduyetfile.loadTableVBDDuyetFileVBDId(vanbandenId);
            $('#btnVBDDUyetFileId').hide();
            $('#modal-add-edit-VBDDuyetFile').modal('show');
        });

    }

    function loadDataSoTatCa() {
        var datenow = new Date();
        $('#txtSoTuNgay').val(tedu.getFormattedDate(datenow));
        $('#txtSoDenNgay').val(tedu.getFormattedDate(datenow));

        var dieukienExcel = [{ value: "SODKVBD", Name: "Sổ đăng ký VB Đến" }, { value: "BCGQVBD", Name: "BC Tình hình giải quyết VB Đến" }];
        var render = "";
        for (var i = 0; i < dieukienExcel.length; i++) {
            render += "<option value='" + dieukienExcel[i].value + "'>" + dieukienExcel[i].Name + "</option>";
        }
        $('#ddlSoDieuKien').html(render);
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

    function loadTableVBDSoTatCa(isPageChanged) {
        var template = $('#table-SoTatCa').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDSoTatCa',
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

                $('#lblSoTatCaTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentSoTatCa').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDSoTatCa(response.Result.RowCount, function () {
                        loadTableVBDSoTatCa();
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
    function wrapPagingVBDSoTatCa(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULSoTatCa a').length === 0 || changePageSize === true) {
            $('#paginationULSoTatCa').empty();
            $('#paginationULSoTatCa').removeData("twbs-pagination");
            $('#paginationULSoTatCa').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULSoTatCa').twbsPagination({
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

    function loadCountSoTatCa(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDSoTatCa',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanSoTatCa').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function ExcelVBDen() {
        //tedu.notify("Xuất excel van ban denndam,snd", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var tungay2 = tedu.getFormatDateYYMMDD($('#txtSoTuNgay').val());
        var dengay2 = tedu.getFormatDateYYMMDD($('#txtSoDenNgay').val());

        $.ajax({
            type: 'POST',
            url: '/admin/vbdso/ExcelVBDenSo',
            data: {
                corporationId: makhuvuc,               
                tungay: tungay2,
                dengay: dengay2
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });

    }


}