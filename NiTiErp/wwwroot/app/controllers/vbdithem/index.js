var vbdithemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditvbdithem = new addeditvbdithemController();    
    var fielvanbandi = new filevanbandiController();
    var vbdchophathanh = new vbdchophathanhController();
    //var vanbandendientu = new vanbandendientuController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();
        
        fielvanbandi.initialize();
        addeditvbdithem.initialize();
        vbdchophathanh.initialize();
        //vanbandendientu.initialize();

        loadData();
    }

    function registerEvents() {

        $('#btnTimNoiDung').on('click', function () {            
            loadTableVanBanDi();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {                
                loadTableVanBanDi();
            }
        });

        $("#ddl-show-pageVBDiThem").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVanBanDi(true);
        });

        $('body').on('click', '.btnPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandiId = $(this).data('id');
            loadPatchFile(vanbandiId);
        });

        $('body').on('click', '.btnPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandiId = $(this).data('id');
            loadPatchFile(vanbandiId);
        });

        $('body').on('click', '.btn-addeditVBDiThem', function (e) {
            e.preventDefault();
            $('#hidInsertVBDiThemId').val(2);  // update           

            //var dithamid = $('#hidInsertVBDiThemId').val();  
            var vanbandiId = $(this).data('id');
            //$('#ddlSoVanBanDi').prop('disabled', true);
            
            addeditvbdithem.loadVanBanDi(vanbandiId);
            fielvanbandi.vanbandifileid(vanbandiId);
            
            $('#btnLaySoVBDi').hide();
            $('#modal-add-edit-VBDiThem').modal('show');
        });

        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            //tedu.notify("them moi van ban den", "success");            

            var makv = $('#ddlKhuVuc').val();
            //addeditvbdthem.loadVanBanDienTuCount(makv);
            addeditvbdithem.sovanbandi();
            //addeditvbdithem.loadLanhDaoKyVanBan(makv);

            $('#btnLaySoVBDi').show();
            $('#hidInsertVBDiThemId').val(1);  // insert
            //$('#hidIsVanBanDenDienTuId').val("False"); // 1 la co; 0 la ko
            //$('#hidVanBanDenDienTuId').val(1);
            CodeFileGuidId(); // CodeId
           
            $('#modal-add-edit-VBDiThem').modal('show');
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
                var vanbandi = response.Result[0];

                var win = window.open(vanbandi.DuongDanFile, '_blank');
                win.focus();

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function CodeFileGuidId() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetHoSoNhanVienId',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hosonhanvienId = response;
                $('#hidCodeFileGuidId').val(hosonhanvienId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Tạo hồ sơ Nhân viên.', 'error');
            }
        });
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlCoQuanBanHanh99').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlCoQuanBanHanh99').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlCoQuanBanHanh99').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                $("#ddlCoQuanBanHanh99")[0].selectedIndex = 1;
                $('#ddlCoQuanBanHanh99').prop('disabled', true);

                var makv = $('#ddlKhuVuc').val();
                loadVanBanDiSoGetList(makv);
                addeditvbdithem.sovanbandiEdit(makv);
                addeditvbdithem.loadLanhDaoKyVanBan(makv);
                addeditvbdithem.loadCountVBDChoPhatHanh(makv);

                loadTableVanBanDi();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadVanBanDiSoGetList(makv) {       
        $.ajax({
            type: 'GET',
            url: '/admin/vbdidmso/VanBanCoQuanGetListKV',
            data: {
                corporationid: makv
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Nam + "-" + item.TenSo + "</option>";
                });
                $('#ddlVanBanDiSoMoi').html(render);
                $('#ddlVanBanDiSoMoi')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đi.', 'error');
            }
        });
    }

    function loadData() {
        addeditvbdithem.vanbandanhmuc();
    } 

    function loadTableVanBanDi(isPageChanged) {
        var template = $('#table-VBDiThem').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var sovanbandi = $('#ddlVanBanDiSoMoi').val();
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdithem/GetListVBDi',
            data: {
                corporationId: makhuvuc,
                sovanbandi: sovanbandi,
                keyword: timnoidung,
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

                $('#lblVBDiThemTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDiThem').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDiThem(response.Result.RowCount, function () {
                        loadTableVanBanDi();
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
    function wrapPagingVBDiThem(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDiThem a').length === 0 || changePageSize === true) {
            $('#paginationULVBDiThem').empty();
            $('#paginationULVBDiThem').removeData("twbs-pagination");
            $('#paginationULVBDiThem').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDiThem').twbsPagination({
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