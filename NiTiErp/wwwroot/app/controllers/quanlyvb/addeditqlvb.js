var addeditqlvbController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    
    var datenow = new Date();

    this.initialize = function () {   
        registerEvents();

        loadAddEditData();
 
    }

    this.loadTableQuanLyVanBan = function () {
        loadTableQuanLyVanBan();
    }

    this.loadQuanLyVanBan = function (quanlyvanbanid) {
        loadQuanLyVanBanId(quanlyvanbanid);
    }

    this.clearAddEditData = function () {
        clearAddEditData();
    }

    function registerEvents() {

        $("#btnSaveQuanLyVanBan").on('click', function (e) {
            e.preventDefault();
            var insertquanlyvanban = $('#hidInsertQuanLyVanBanId').val();

            if (insertquanlyvanban ===  "1") {
                SaveQuanLyVanBan();
            }
            else if (insertquanlyvanban === "2") {                
                UpdateQuanLyVanBan();
            }
        });

        $("#ddl-show-pageQuanLyVanBan").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableQuanLyVanBan(true);
        });

    }

    function loadAddEditData() {        
        $('#txtNamHinhThanh').val(datenow.getFullYear().toString());
        $('#txtThoiHanBaoQuan').val("10");

    }

    function clearAddEditData() {
        //$('#hidQuanLyVanBanId').val(0);
        //$('#hidInsertQuanLyVanBanId').val(0);

        $("#ddlKhuVucQLVB")[0].selectedIndex = 1;   
        $('#txtNamHinhThanh').val(datenow.getFullYear().toString());
        $('#txtSoVaKyHieu').val("");
        $('#txtTieuDe').val("");
        $('#txtThoiHanBaoQuan').val("10");
    }

    function SaveQuanLyVanBan() {
        var quanlyvanbanid = $('#hidQuanLyVanBanId').val();
        var insertquanlyvanbanId = $('#hidInsertQuanLyVanBanId').val();

        var makhuvuc = $('#ddlKhuVucQLVB').val();

        var namhinhthanh = $('#txtNamHinhThanh').val();
        var sovakyhieu = $('#txtSoVaKyHieu').val();
        var tieude = $('#txtTieuDe').val();
        var thoihanbaoquan = $('#txtThoiHanBaoQuan').val();

        $.ajax({
            type: "POST",
            url: "/Admin/quanlyvb/AddUpdateQuanLyVB",
            data: {
                Id: quanlyvanbanid,
                InsertQuanLyVanBanId: insertquanlyvanbanId,
                Corporation: makhuvuc,
                NamHinhThanh: namhinhthanh,
                SoVaKyHieu: sovakyhieu,
                TieuDe: tieude,
                ThoiHanBaoQuan: thoihanbaoquan
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
                    tedu.notify('Quản lý danh mục văn bản.', 'success');
                    loadTableQuanLyVanBan(true);
                    clearAddEditData();
                    $('#modal-add-edit-QuanLyVanBan').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Quản lý danh mục văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }    

    function UpdateQuanLyVanBan() {
        var quanlyvanbanid = $('#hidQuanLyVanBanId').val();
        var insertquanlyvanbanId = $('#hidInsertQuanLyVanBanId').val();

        var makhuvuc = $('#ddlKhuVucQLVB').val();

        var namhinhthanh = $('#txtNamHinhThanh').val();
        var sovakyhieu = $('#txtSoVaKyHieu').val();
        var tieude = $('#txtTieuDe').val();
        var thoihanbaoquan = $('#txtThoiHanBaoQuan').val();

        $.ajax({
            type: "POST",
            url: "/Admin/quanlyvb/AddUpdateQuanLyVB",
            data: {
                Id: quanlyvanbanid,
                InsertQuanLyVanBanId: insertquanlyvanbanId,
                Corporation: makhuvuc,
                NamHinhThanh: namhinhthanh,
                SoVaKyHieu: sovakyhieu,
                TieuDe: tieude,
                ThoiHanBaoQuan: thoihanbaoquan
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
                    tedu.notify('Quản lý danh mục văn bản.', 'success');
                    loadTableQuanLyVanBan(true);
                    clearAddEditData();
                    $('#modal-add-edit-QuanLyVanBan').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Quản lý danh mục văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadQuanLyVanBanId(quanlyvanbanid) {
        $.ajax({
            type: "GET",
            url: "/Admin/quanlyvb/GetQuanLyVBId",
            data: { quanlyvanbanId: quanlyvanbanid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbdidmso = response.Result[0];

                $('#hidQuanLyVanBanId').val(vbdidmso.Id);
                $('#hidInsertQuanLyVanBanId').val(2);

                $('#ddlKhuVucQLVB').val(vbdidmso.Corporation);
                $('#txtNamHinhThanh').val(vbdidmso.NamHinhThanh);
                $('#txtSoVaKyHieu').val(vbdidmso.SoVaKyHieu);
                $('#txtTieuDe').val(vbdidmso.TieuDe);
                $('#txtThoiHanBaoQuan').val(vbdidmso.ThoiHanBaoQuan);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableQuanLyVanBan(isPageChanged) {
        var template = $('#table-QuanLyVanBan').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();       
        var timnhanvien = $('#txtTenDanhMucHoSo').val();

        $.ajax({
            type: 'GET',
            data: {               
                corporationId: makhuvuc,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/quanlyvb/GetListQuanLyVBKV',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenKhuVuc: item.TenKhuVuc,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            NamHinhThanh: item.NamHinhThanh,
                            SoVaKyHieu: item.SoVaKyHieu,
                            TieuDe: item.TieuDe,
                            ThoiHanBaoQuan: item.ThoiHanBaoQuan,
                            TongSoVBTrongHoSo: item.TongSoVBTrongHoSo,
                            TongSoTrangTrongHoSo: item.TongSoTrangTrongHoSo,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblQuanLyVanBanTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQuanLyVanBan').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQuanLyVB(response.Result.RowCount, function () {
                        loadTableQuanLyVanBan();
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
    function wrapPagingQuanLyVB(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQuanLyVanBan a').length === 0 || changePageSize === true) {
            $('#paginationULQuanLyVanBan').empty();
            $('#paginationULQuanLyVanBan').removeData("twbs-pagination");
            $('#paginationULQuanLyVanBan').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQuanLyVanBan').twbsPagination({
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