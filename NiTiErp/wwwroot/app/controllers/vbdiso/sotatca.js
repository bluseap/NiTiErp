var sotatcaController = function () {

    var _vbdithemqtxl = new _vbdiqtxlController();

    var bientimClick = 0;

    this.initialize = function () {
        registerEvents();

        loadDataSoTatCa();

        $('#ddlShareCoQuanBanHanhDi').prop("disabled", true);
    }    

    this.loadCountSoTatCa = function (makv) {
        loadCountSoTatCa(makv);
    }    

    this.loadTableVBDiSoTatCa = function () {
        loadTableVBDiSoTatCa();
        $('#btnTimSoTatCaVBDi').hide();
    }

    function registerEvents() {

        $('#txtSoTuNgay, #txtSoDenNgay  ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        $('#btnSoDSExcel').on('click', function () {
            var dieukienExcel = $('#ddlSoDieuKien').val();
            if (dieukienExcel === "SODKVBDI") { // so van ban di
                ExcelVBDi();
            }
            else if (dieukienExcel === "BCGQVBDI") { // tinh hinh giai quyet van ban di
                ExcelBCVBDi();
            }
        });

        $('body').on('click', '.btnVBDiSoTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimSoTatCaVBDi').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimSoTatCaVBDi').hide();
                bientimClick = 0;
            }
        });

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

    function loadDataSoTatCa() {
        var datenow = new Date();
        $('#txtSoTuNgay').val(tedu.getFormattedDate(datenow));
        $('#txtSoDenNgay').val(tedu.getFormattedDate(datenow));

        var dieukienExcel = [{ value: "SODKVBDI", Name: "Sổ đăng ký VB Đi" }, { value: "BCGQVBDI", Name: "BC Tình hình Văn bản Đi" }];
        var render = "";
        for (var i = 0; i < dieukienExcel.length; i++) {
            render += "<option value='" + dieukienExcel[i].value + "'>" + dieukienExcel[i].Name + "</option>";
        }
        $('#ddlSoDieuKien').html(render);
    }

    function loadCountSoTatCa(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetCountVBDiSoTatCa',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanSoTatCaVBDi').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
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

    function ExcelVBDi() {
        //tedu.notify("Xuất excel van ban denndam,snd", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var tungay2 = tedu.getFormatDateYYMMDD($('#txtSoTuNgay').val());
        var dengay2 = tedu.getFormatDateYYMMDD($('#txtSoDenNgay').val());

        $.ajax({
            type: 'POST',
            url: '/admin/vbdiso/ExcelVBDenSo',
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