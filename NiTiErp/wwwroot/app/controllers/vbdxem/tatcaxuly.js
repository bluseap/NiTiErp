var tatcaxulyController = function () {

    var vanbandenduyetfile = new vbdduyetfileController();

    var _chuaxuly = new _chuaxulyController();

    var bientimClick = 0;

    var fileUpload1 = [];

    this.initialize = function () {

        registerEvents();

    }

    this.loadCountVanBanDenTatCaXuLy = function (makv) {
        loadCountVBDTatCaXuLy(makv);
    }

    this.loadTableVBDTatCaXuLy = function () {
        loadTableVBDTatCaXuLy();
        $('#btnTimTatCa').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimTatCa').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimTatCa').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimTatCa').on('click', function () {
            loadTableVBDTatCaXuLy();
        });

        $("#ddl-show-pageTatCaXuLy").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDTatCaXuLy(true);
        });

        $('body').on('click', '.btnTatCaPatchFileXuLy', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            $('#hidXemFileXuLyVanBanDenId').val(vanbandenId);
            loadXemPatchFileVBDXuLy(vanbandenId);
            //loadPatchFileVBDXuLy(vanbandenId);
            $('#modal-add-edit-VBDXemFileXuLy').modal('show');
        }); 

        $('body').on('click', '.btnTatCaXLButPheLD', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            vanbandenduyetfile.loadTableVBDDuyetFileVBDId(vanbandenId);
            $('#btnVBDDUyetFileId').hide();
            $('#modal-add-edit-VBDDuyetFile').modal('show');
        });

        $('body').on('click', '.btnVBDXemFileXuLyTenFile', function (e) {
            e.preventDefault();
            var duongdan = $(this).data('id');
            loadPatchFileVBDXuLyFile(duongdan);   
        });

        $('body').on('click', '.btnDeleteVBDXemFileXuLyXoaFile', function (e) {
            e.preventDefault();
            var vanbandenxulyfileId = $(this).data('id');
            deleteVanBanDenXuLyFile(vanbandenxulyfileId);
        });

        $('body').on('click', '.btnTatCaChuaXuLyXuLy', function (e) {
            e.preventDefault();
            var vanbandenduyetId = $(this).data('id');
            $('#hidVanBanDenDuyetId').val(vanbandenduyetId);
            _chuaxuly.loadNhanVienXuLyVanBanDen(vanbandenduyetId);
            $('#modal-add-edit-ChuaXuLyXuLy').modal('show');

            $('#frmMainDivChuaXuLyXuLy').show();
            $('#txtNgayChuaXuLyXuLy').hide();
            $('#lbNgayChuaXuLyXuLy').hide();

            $('#hidChuaXuLyXuLyLai').val("2");
        });

        $("#fileXemFileXuLyFileVanBanDen").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            //tedu.notify(files[0].name, "success");//ten file 
            $('#hidXemFileXuLyTenFileXuLyId').val(files[0].name);

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadVanBanDenFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    $("#hidXemFileXuLyTenFileDuongDan").val(path);
                    clearFileInput($("#fileXemFileXuLyFileVanBanDen"));
                    fileUpload1.push(path);
                    
                    AddVanBanDenXuLyFile();

                    tedu.notify('Đã tải file lên thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
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

    function loadTableVBDTatCaXuLy(isPageChanged) {
        var template = $('#table-TatCaXuLy').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDTatCaXuLy',
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

                $('#lblTatCaXuLyTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentTatCaXuLy').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDTatCaXuLy(response.Result.RowCount, function () {
                        loadTableVBDTatCaXuLy();
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
    function wrapPagingVBDTatCaXuLy(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULTatCaXuLy a').length === 0 || changePageSize === true) {
            $('#paginationULTatCaXuLy').empty();
            $('#paginationULTatCaXuLy').removeData("twbs-pagination");
            $('#paginationULTatCaXuLy').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULTatCaXuLy').twbsPagination({
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

    function loadCountVBDTatCaXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenTatCaXuLyUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanTatCa').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadXemPatchFileVBDXuLy(vanbandenid) {
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

    function deleteVanBanDenXuLyFile(vanbandenxulyfileId) {       
        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/vbdxem/DeleteVanBanDenXuLyFile",
                data: {
                    Id: vanbandenxulyfileId,
                    InsertVBDXuLyFileId: 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    var vanbandenid = $('#hidXemFileXuLyVanBanDenId').val();
                    loadXemPatchFileVBDXuLy(vanbandenid);
                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa file văn bản đến lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function clearFileInput(ctrl) {
        try {
            fileUpload1 = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) {
            tedu.notify(ex, 'error');
        }
    }

    function AddVanBanDenXuLyFile() {
        var vanbandenId = $('#hidXemFileXuLyVanBanDenId').val();
       
        var tenfile = $('#hidXemFileXuLyTenFileXuLyId').val();
        var duongdan = $("#hidXemFileXuLyTenFileDuongDan").val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/AddVanBanDenXuLyFile",
            data: {
                Id: vanbandenId,
                TenFile: tenfile,
                DuongDan: duongdan
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
                    tedu.notify('Upload file.', 'success');   
                    loadXemPatchFileVBDXuLy(vanbandenId);
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể add row file văn bản đến.', 'error');
                tedu.stopLoading();
            }
        });
    }

}