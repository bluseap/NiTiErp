var vbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditvbdthem = new addeditvbdthemController();
    var themcoquan = new themcoquanController();
    var fielvanbanden = new filevanbandenController();
    var vanbandendientu = new vanbandendientuController();

    this.initialize = function () {
        //tedu.isVanBanDen('VANBANDENTHEM');

        loadKhuVuc();

        registerEvents();

        themcoquan.initialize();
        fielvanbanden.initialize();
        addeditvbdthem.initialize();
        vanbandendientu.initialize();

        loadData();        
    }    

    function registerEvents() {

        $('#btnTimNoiDung').on('click', function () {
            //tedu.notify("tim noi dung nút", "success");
            loadTableVanBanDen();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                //tedu.notify("txt tim noi dung nút", "success");
                loadTableVanBanDen();
            }
        });

        $("#btn-create").on('click', function (e) {            
            e.preventDefault();
            $('#divbtnDenDienTu').show();

            var makv = $('#ddlKhuVuc').val();
            addeditvbdthem.loadVanBanDienTuCount(makv);
            addeditvbdthem.sovanbanden();

            $('#hidInsertVBDThemId').val(1);  // insert
            $('#hidIsVanBanDenDienTuId').val("False"); // 1 la co; 0 la ko
            $('#hidVanBanDenDienTuId').val(0);  
            CodeFileGuidId(); // CodeId

            $('#divbtnFileVanBan').show();

            $('#modal-add-edit-VBDThem').modal('show');  
        });

        $('body').on('click', '.btn-addeditVBDThem', function (e) {        
            e.preventDefault();           
            $('#divbtnDenDienTu').hide();

            $('#hidInsertVBDThemId').val(2);  // update 
            
            $('#hidIsVanBanDenDienTuId').val("False"); // 1 la co; 0 la ko
            $('#hidVanBanDenDienTuId').val(0);  

            var vanbandenId = $(this).data('id');
            fielvanbanden.vanbandenfileid(vanbandenId);
            addeditvbdthem.loadVanBanDen(vanbandenId);            

            $('#modal-add-edit-VBDThem').modal('show');  
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadVanBanDenSoGetList(corporationId);
        });

        $("#ddl-show-pageVBDThem").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVanBanDen(true);
        });

        $('body').on('click', '.btnPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
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

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                var makv = $('#ddlKhuVuc').val();
                loadVanBanDenSoGetList(makv);

                loadTableVanBanDen();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });       
    }

    function loadVanBanDenSoGetList(makv) {
        //var makv = $('#ddlKhuVuc').val();
        //var datetimeNow = new Date();
        //var namhientai = datetimeNow.getFullYear();
        $.ajax({
            type: 'GET',
            url: '/admin/vbddmso/VanBanCoQuanGetListKV',
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
                $('#ddlVanBanDenSoMoi').html(render);
                $('#ddlVanBanDenSoMoi')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });
    }

    function loadData() {
        addeditvbdthem.vanbandanhmuc();
       
    }    

    function loadTableVanBanDen(isPageChanged) {
        var template = $('#table-VBDThem').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();        
        var sovanbanden = $('#ddlVanBanDenSoMoi').val();        
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDen',
            data: {
                corporationId: makhuvuc,
                sovanbanden: sovanbanden,
                keyword: timnoidung,
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
                            TTXuLy: tedu.getVanBanDenTTXuLy(item.TTXuLy)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBDThemTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDThem').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDThem(response.Result.RowCount, function () {
                        loadTableVanBanDen();
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
    function wrapPagingVBDThem(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDThem a').length === 0 || changePageSize === true) {
            $('#paginationULVBDThem').empty();
            $('#paginationULVBDThem').removeData("twbs-pagination");
            $('#paginationULVBDThem').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDThem').twbsPagination({
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