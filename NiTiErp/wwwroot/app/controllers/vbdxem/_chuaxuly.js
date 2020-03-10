var _chuaxulyController = function () {   
   

    this.initialize = function () {
        loadCCMKhuVuc();

        registerEvents();

        loadDataChuaChuaXuLy();
    }
   
    this.loadNhanVienXuLyVanBanDen = function (vanbandenduyetid) {        
        loadVanBanDenDuyetId(vanbandenduyetid);        
        loadNhanVienXLVanBan(vanbandenduyetid);        
    }

    this.loadCountVBDDangXuLy = function (makv) {
        loadCountVBDDangXuLy(makv);
    }

    function registerEvents() {

        $('#txtNgayChuaXuLyXuLy').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

        $('#btnSaveChuaXuLyXuLy').on('click', function () {
            var chuaxualylai = $('#hidChuaXuLyXuLyLai').val();
            if (chuaxualylai === "1") {
                SaveVBDChuaXuLy();
            }
            else if (chuaxualylai === "2") {
                SaveVBDChuaXuLyLai();
            }            
        });

        $('#ddlCCMKhuVuc').on('change', function () {
            var corporationId = $('#ddlCCMKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#btnCCMTimNhanVien').on('click', function () {
            LoadTableHoSo();
        });

        $('#txtCCMTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSo();
            }
        });

        $("#ddl-show-pageCCMHoSoNhanVien").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $('body').on('click', '.btn-editCCMHoSoNhanVien', function (e) {
            e.preventDefault();
            var hosoId = $(this).data('id');
            $('#hidHoSoNhanVienId').val(hosoId);

            addNhanVienToCCM(hosoId);
        });

        $('body').on('click', '.btn-deleteNhanVienXuLy', function (e) {
            e.preventDefault();
            var vbnvxlid = $(this).data('id');
            deleteNhanVienXuLy(vbnvxlid);
        });

    }

    function addNhanVienToCCM(hosoid) {

        //var insertvbdnvxl = $('#hidInsertVBDDNVXLId').val("1");
        var vanbandenduyetid = $('#hidVanBanDenDuyetId').val();
        //var vanbandenduyetid = $('#txtButPheLanhDao').val();    
        var ngaychuyenchuyenmon = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLy').val());

        $.ajax({
            type: "GET",
            //url: "/Admin/vbdduyet/InsertUpdateVBDDNVXL",
            url: "/Admin/vbdduyet/InsertUpdateVBDDNVXL2",
            data: {
                InsertVanBanDenDuyetNVXLId: 1,
                VanBanDenDuyetId: vanbandenduyetid,
                HoSoNhanVienId: hosoid,
                NgayNhanVBXL: ngaychuyenchuyenmon,
                VBPhoiHopXuLyId: 5 // Chuyên môn xử lý
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var query = response.Result[0];
                if (query.KETQUA === "SAI") {
                    tedu.notify('Nhân viên đăng ký rồi! Kiểm tra lại.', 'error');
                }
                else {
                    loadNhanVienXLVanBan(vanbandenduyetid);
                }
                $('#hidHoSoNhanVienId').val('');
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Nhân viên đã đăng ký rồi! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveVBDChuaXuLy() {
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuxuly = $('#txtGhiChuXuLy').val();
        var ngaychuaxuly = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLy').val());

        var datetimeNow = new Date();
        var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/UpdateVanBanDenXuLy",
            data: {
                Id: vanbandenduyetId,
                VanBanDenDuyetId: vanbandenduyetId,
                InsertVBDXuLyLId: 2,                
                NgayBatDauXuLy: ngaychuaxuly,
                GhiChuXuLy: ghichuxuly
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
                    tedu.notify('Văn bản xử lý.', 'success');

                    var makv = $('#ddlKhuVuc').val();
                    loadCountVBDChuaXuLy(makv);
                    loadCountVBDDangXuLy(makv);

                    $('#hidVanBanDenDuyetId').val('');
                    $('#txtGhiChuXuLy').val('');

                    $('#tblContentChuaXuLy').html('');

                    $('#modal-add-edit-ChuaXuLyXuLy').modal('hide');

                    $('#hidChuaXuLyXuLyLai').val("0");

                    sendNotificationToAppUser(vanbandenduyetId);

                    loadTableVBDChuaXuLy2(true);
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản xử lý', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveVBDChuaXuLyLai() {
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuxuly = $('#txtGhiChuXuLy').val();
        var ngaychuaxuly = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLy').val());

        var datetimeNow = new Date();
        var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/UpdateVanBanDenXuLyLai",
            data: {
                Id: vanbandenduyetId,
                VanBanDenDuyetId: vanbandenduyetId,
                InsertVBDXuLyLId: 2,
                NgayBatDauXuLy: ngaychuaxuly,
                GhiChuXuLy: ghichuxuly
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
                    tedu.notify('Văn bản xử lý.', 'success');

                    var makv = $('#ddlKhuVuc').val();
                    loadCountVBDChuaXuLy(makv);
                    loadCountVBDDangXuLy(makv);

                    $('#hidVanBanDenDuyetId').val('');
                    $('#txtGhiChuXuLy').val('');

                    $('#tblContentChuaXuLy').html('');

                    $('#modal-add-edit-ChuaXuLyXuLy').modal('hide');

                    $('#hidChuaXuLyXuLyLai').val("0");

                    sendNotificationToAppUser(vanbandenduyetId);

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản xử lý', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCountVBDDangXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetDangXuLyUser',
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

    function loadDataChuaChuaXuLy() {        

        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayChuaXuLyXuLy').val(nowDate);

    }    

    function loadNhanVienXLVanBan(vanbandenduyetid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/GetListVBDDNVXL",
            data: { vanbandenduyetid: vanbandenduyetid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbddnvxl = response.Result;

                var template = $('#template-table-NhanVienXuLy').html();
                var render = '';

                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(vbddnvxl, function (i, item) {
                        render += Mustache.render(template, {
                            TenNhanVien: item.TenNhanVien,
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            TenPhoiHopXuLy: item.TenPhoiHopXuLy,
                            VBDDNVXLId: item.Id
                        });
                    });
                    //tedu.notify('Nhân viên đăng ký.', 'success');                    
                }

                if (render !== '') {
                    $('#table-contentNhanVienXuLy').html(render);
                }

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadVanBanDenDuyetId(vanbandenduyetid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/GetVanBanDenXuLyId",
            data: { vanbandenduyetid: vanbandenduyetid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbandenduyet = response.Result[0];
                var ghichuxuly = vanbandenduyet.GhiChuXuLy;
                $("#txtGhiChuXuLy").val(ghichuxuly);
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCCMKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCCMKhuVuc').html(render);
                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlCCMKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlCCMKhuVuc').prop('disabled', false);
                }
                $("#ddlCCMKhuVuc")[0].selectedIndex = 1;
                loadPhongKhuVuc($("#ddlCCMKhuVuc").val());
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlCCMPhong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-CCMHoSoNhanVien').html();
        var render = "";

        var makhuvuc = $('#ddlCCMKhuVuc').val();
        var phongId = $('#ddlCCMPhong').val();
        var timnhanvien = $('#txtCCMTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hoso/GetAllPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            HoSoId: item.Id,
                            Ten: item.Ten,
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblCCMHoSoNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentCCMHoSoNhanVien').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSo(response.Result.RowCount, function () {
                        LoadTableHoSo();
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
    function wrapPagingHoSo(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULCCMHoSoNhanVien a').length === 0 || changePageSize === true) {
            $('#paginationULCCMHoSoNhanVien').empty();
            $('#paginationULCCMHoSoNhanVien').removeData("twbs-pagination");
            $('#paginationULCCMHoSoNhanVien').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULCCMHoSoNhanVien').twbsPagination({
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

    function deleteNhanVienXuLy(vbnvxlid) {
        //tedu.notify(vbnvxlid, "success");
        var ngaychuyenchuyenmon = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLy').val());
        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/vbdduyet/DeleteVBDDNVXLCCMXL",
                data: {
                    Id: vbnvxlid,
                    InsertVanBanDenDuyetNVXLId: 3,
                    NgayNhanVBXL: ngaychuyenchuyenmon
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    var vbddnvxlccm = response.Result[0];

                    if (vbddnvxlccm.KETQUA === "SAI") {
                        tedu.notify('Nhân viên này không được xóa. Kiểm tra lại.', 'error');
                    }
                    else {
                        tedu.notify('Xóa thành công', 'success');
                        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();
                        loadNhanVienXLVanBan(vanbandenduyetId);
                    }                    
                    tedu.stopLoading();                    
                },
                error: function (status) {
                    tedu.notify('Xóa Nhân viên phối hợp xử lý lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadTableVBDChuaXuLy2(isPageChanged) {
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
                    wrapPagingVBDChuaXuLy2(response.Result.RowCount, function () {
                        loadTableVBDChuaXuLy2();
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
    function wrapPagingVBDChuaXuLy2(recordCount, callBack, changePageSize) {
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

    function sendNotificationToAppUser(vanbandenduyetid) {
        $.ajax({
            type: "GET",
            url: "/Admin/RegisterDoc/GetByVBDDuyetId",
            data: {
                vanbandenduyetId: vanbandenduyetid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var registerdoc = response.Result;

                $.each(registerdoc, function (i, item) {
                    SendNotifiToAndroid(item.Body, item.Title, item.FirebaseNotifiId, vanbandenduyetid);
                });

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Gửi thông báo lỗi! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SendNotifiToAndroid(Body, Title, FirebasenotifiId, vanbandenduyetid) {
        $.ajax({
            type: "GET",
            url: "/Admin/SendNotification/SendNotifiToAndroid",
            data: {
                body: Body,
                title: Title,
                firebasenotifiid: FirebasenotifiId
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                registerDocSendAdd(vanbandenduyetid, FirebasenotifiId);
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Nhân viên đã đăng ký rồi! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function registerDocSendAdd(vanbandenduyetid, firebasenotifiid) {
        $.ajax({
            type: "POST",
            url: "/Admin/RegisterDocSend/CreateSend",
            data: {
                vanbandenduyetId: vanbandenduyetid,
                firebasenotifiId: firebasenotifiid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function () {

                tedu.stopLoading();
            },
            error: function () {
                tedu.stopLoading();
            }
        });
    }

}