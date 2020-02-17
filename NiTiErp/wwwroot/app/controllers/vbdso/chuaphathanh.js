var chuaphathanhController = function () {

    var fileUpload1 = [];

    var _quatrinhxuly = new _quatrinhxulyController();

    this.initialize = function () {

        registerEvents();

        loadDataChuaPhatHanh();

    }

    this.loadCountVBChuaPhatHanh = function (makv) {
        loadCountVBChuaPhatHanh(makv);
    }    

    function registerEvents() {

        $('#txtNgayPhatHanh  ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  
        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayPhatHanh').val(nowDate);
        
        $('#btnTimChuaPhatHanh').on('click', function () {            
            loadTableVBDChuaPhatHanh();
        });

        $("#ddl-show-pageChuaPhatHanh").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDChuaPhatHanh(true);
        });

        $('body').on('click', '.btnChuaPhatHanhPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnChuaPhatHanhPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnChuaPhatHanh', function (e) {
            e.preventDefault();
            //var vanbandenduyetId = $(this).data('id');
            //loadTableVanBanDenXuLyFileListId(vanbandenduyetId);
            //$('#modal-add-edit-ChuaPhatHanh').modal('show');
        });

        $('body').on('click', '.btnCPTQuaTrinhXL', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            _quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        $("#btnSaveFileVanBanDenPhatHanh").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDenPhatHanhFile();
        });

        UploadVanBanDenFile();

        $('body').on('click', '.btnFileVanBanPhatHanh', function (e) {
            e.preventDefault();

            $('#hidInsertFileVanBanDenId').val(1);
            $('#modal-add-edit-FileVanBanDenPhatHanh').modal('show');
        });

        $("#checkChonNoiPhatHanh").on("click", checkChonNoiPhatHanh);

        $('#btnSaveChuaPhatHanh').on('click', function () {
            var isCheck = $("#checkChonNoiPhatHanh").is(':checked');
            if (isCheck === true) {
                SaveVBDPhatHanhDienTu();
            }
            else {
                SaveVBDPhatHanh();
            }   
        });
    }

    function SaveVBDPhatHanh() {
        var noiphathanh = $('#ddlVBDNoiPhatHanh').val();
        if (noiphathanh === "%") {
            tedu.notify("pat hanh van ban.", "success");
        }
        else {
            tedu.notify("Chọn nơi phát hành văn bản điện tử cho đúng.", "error");
        }
    }

    function SaveVBDPhatHanhDienTu() {
        var noiphathanh = $('#ddlVBDNoiPhatHanh').val();
        if (noiphathanh === "%") {
            tedu.ntify("Chọn nơi phát hành văn bản điện tử cho đúng.", "error");
        }
        else {
            tedu.ntify("pat hanh van ban ditn tu.", "success");
        }
    }

    function checkChonNoiPhatHanh() {
        var isCheck = $("#checkChonNoiPhatHanh").is(':checked');
        if (isCheck === true) {
            $('#ddlVBDNoiPhatHanh').prop('disabled', false);
        }
        else {
            $('#ddlVBDNoiPhatHanh').prop('disabled', true); 
        }       
    }

    function loadDataChuaPhatHanh() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlVBDNoiPhatHanh').html(render);
                $('#ddlVBDNoiPhatHanh').prop('disabled', true);    
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }   

    function SaveVanBanDenPhatHanhFile() {
        var vanbandenduyetid = $('#hidVanBanDenDuyetId').val();
        var tenfile = $('#hidTenFileVanBanDenId').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/AddUpdateVanBanDenXuLyFile",
            data: {
                Id: 1,
                InsertVBDXuLyFileId: 1,
                VanBanDenXuLyId: vanbandenduyetid,
                TenFile: tenfile,
                DuongDan: fileUpload1
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
                    $('#hidInsertFileVanBanDenId').val(0);
                    $('#hidTenFileVanBanDenId').val('');

                    loadTableVanBanDenXuLyFileListId(vanbandenduyetid);
                    $('#modal-add-edit-FileVanBanDenPhatHanh').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể upload file văn bản đến.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableVanBanDenXuLyFileListId(vanbandenduyetId) {
        var template = $('#table-FileVanBanDen').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                vanbandenduyetid: vanbandenduyetId
            },
            url: '/admin/vbdxem/GetListVBDXuLyFileListIdPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenFile: item.TenFile                                                
                        });
                    });
                }
                //$('#lblThongBaoTotalRecords').text(response.Result.RowCount);
                if (render !== '') {
                    $('#tbl-contentFileVanBanDen').html(render);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function UploadVanBanDenFile() {
        $("#fileFileVanBanDen").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            //tedu.notify(files[0].name, "success");//ten file 
            $('#hidTenFileVanBanDenId').val(files[0].name);

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
                    clearFileInput($("#fileFileVanBanDen"));
                    fileUpload1.push(path);                    
                    tedu.notify('Đã tải file lên thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
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

    function loadCountVBChuaPhatHanh(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDChuaPhatHanh',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanChuaPhatHanh').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }


}