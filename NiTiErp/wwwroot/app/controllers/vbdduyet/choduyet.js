var choduyetController = function () {

   

    this.initialize = function () {

        registerEvents();

        loadChoDuyetData();

        $('#btnSaveChoDuyet').hide();
    }

    this.loadCountVBDChoDuyet = function (makv) {
        loadCountVBDChoDuyet(makv);
        loadCountVBDDaDuyet(makv);
    }

    function registerEvents() {

        $('#txtNgayPhatHanh').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        $('#btnTimChoDuyet').on('click', function () {
            //tedu.notify("cho duyet", "success");
            loadTableChoDuyet();
        });

        $("#ddl-show-pageChoDuyet").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChoDuyet(true);
        });

        $('body').on('click', '.btnChoDuyet', function (e) {
            e.preventDefault();
            var vanbandenduyetId = $(this).data('id');
            //tedu.notify(vanbandenduyetId, "success");

            $('#hidVanBanDenDuyetId').val(vanbandenduyetId);          

            $('#modal-add-edit-ChoDuyet').modal('show');              
        });

        $('#btnSaveChoDuyet').on('click', function () {            
            SaveChoDuyetPhatHanh();
        });

        $('#btnSaveChoDuyetKetThuc').on('click', function () {
            SaveDuyetVBDXuLy();
        });

        $('body').on('click', '.btnChoDuyetPatchVBDFileXuLy', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFileVBDXuLy(vanbandenId);
        }); 

    }

    function loadPatchFileVBDXuLy(vanbandenid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdthem/GetVanBanDenXuLyId",
            data: { vanbandenId: vanbandenid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanden = response.Result[0];
                var win = window.open(vanbanden.VBDXuLyFilePatch, '_blank');
                win.focus();
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveDuyetVBDXuLy() {
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuphathanh = $('#txtGhiChuPhatHanh').val();
        var ngayphathanh = tedu.getFormatDateYYMMDD($('#txtNgayPhatHanh').val());

        var datetimeNow = new Date();
        var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdduyet/UpdateVBDDuyetXuLy",
            data: {
                Id: vanbandenduyetId,
                InsertVanBanDenDuyetId: 2,
                GhiChuPhatHanh: ghichuphathanh,
                NgayDuyetPhatHanh: ngayphathanh,

                NgayChuyenChuyenMon: ngayhientai,

                NgayNhanVanBan: ngayhientai,
                NgaySaiNhanVanBan: ngayhientai,
                NgayDuyet: ngayhientai,
                HanXuLy: ngayhientai,
                NgaySaiChuyenMon: ngayhientai
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success === false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.notify('Văn bản đến duyệt chuyển văn thư phát hành.', 'success');

                    $('#tblContentChoDuyet').html('');

                    var makv = $('#ddlKhuVuc').val();
                    loadCountVBDChoDuyet(makv);
                    loadCountVBDDaDuyet(makv);

                    $('#modal-add-edit-ChoDuyet').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản đến duyệt văn thư.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveChoDuyetPhatHanh() {
        //tedu.notify("save cho duyet", "success");
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuphathanh = $('#txtGhiChuPhatHanh').val();
        var ngayphathanh = tedu.getFormatDateYYMMDD($('#txtNgayPhatHanh').val());

        var datetimeNow = new Date();
        var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdduyet/UpdateVanBanDenDuyetVanThu",
            data: {
                Id: vanbandenduyetId,
                InsertVanBanDenDuyetId: 2,
                GhiChuPhatHanh: ghichuphathanh,
                NgayDuyetPhatHanh: ngayphathanh,

                NgayChuyenChuyenMon: ngayhientai,

                NgayNhanVanBan: ngayhientai,
                NgaySaiNhanVanBan: ngayhientai,
                NgayDuyet: ngayhientai,
                HanXuLy: ngayhientai,
                NgaySaiChuyenMon: ngayhientai
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success === false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.notify('Văn bản đến duyệt chuyển văn thư phát hành.', 'success');

                    $('#tblContentChoDuyet').html('');

                    var makv = $('#ddlKhuVuc').val();
                    loadCountVBDChoDuyet(makv);
                    loadCountVBDDaDuyet(makv);

                    $('#modal-add-edit-ChoDuyet').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản đến duyệt văn thư.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadChoDuyetData() {

        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayPhatHanh').val(nowDate);

    }

    function loadTableChoDuyet(isPageChanged) {
        var template = $('#table-ChoDuyet').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDChoDuyet',
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
                            VBDXuLyFilePatch: item.VBDXuLyFilePatch
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblChoDuyetTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChoDuyet').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingChoDuyet(response.Result.RowCount, function () {
                        loadTableChoDuyet();
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
    function wrapPagingChoDuyet(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULChoDuyet a').length === 0 || changePageSize === true) {
            $('#paginationULChoDuyet').empty();
            $('#paginationULChoDuyet').removeData("twbs-pagination");
            $('#paginationULChoDuyet').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChoDuyet').twbsPagination({
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

    function loadCountVBDChoDuyet(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDChoDuyet',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanChoDuyet').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVBDDaDuyet(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDDaDuyet',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDaDuyet').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

}