var addeditvbloaiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    this.loadAddEditVanBanLoai = function (vanbanloaiid) {
        loadAddEditVanBanLoai(vanbanloaiid);
    }
    this.loadTableVanBanLoai = function () {
        loadTableVanBanLoai();
    }
    this.clearDataAddEdit = function () {
        ClearData();
    }

    this.initialize = function () {
        registerEvents();
        ClearData();
    }

    function registerEvents() {

        $('#btnSaveVanBanLoai').on('click', function () {
            var insertvanbanloai = $('#hidInsertVanBanLoaiId').val();

            if (insertvanbanloai === 1) {
                SaveVanBanLoai();
            }
            else {
                UpdateVanBanLoai();
            }
        });

    }

    function ClearData() {
        $('#hidVanBanLoaiId').val("");
        $('#hidInsertVanBanLoaiId').val(0);

        $('#txtVanBanLoaiTen').val("");
        $('#txtVanBanLoaiCode').val("");
        $('#txtThoiGianBaoQuan').val(120);
        $('#txtVanBanLoaiSoThuTu').val(1);
    }

    function loadTableVanBanLoai(isPageChanged) {
        var template = $('#table-VanBanLoai').html();
        var render = "";

        //var makhuvuc = $('#ddlKhuVuc').val();
        var timnhanvien = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            data: {
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/vbloai/GetListVanBanLoai',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            ThoiGianBaoQuan: item.ThoiGianBaoQuan,
                            Stt: item.Stt,
                            CreateDate: item.CreateDate !== null ? tedu.getFormattedDate(item.CreateDate) : "",
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVanBanLoaiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVanBanLoai').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVanBanLoai(response.Result.RowCount, function () {
                        loadTableVanBanLoai();
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
    function wrapPagingVanBanLoai(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVanBanLoai a').length === 0 || changePageSize === true) {
            $('#paginationULVanBanLoai').empty();
            $('#paginationULVanBanLoai').removeData("twbs-pagination");
            $('#paginationULVanBanLoai').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVanBanLoai').twbsPagination({
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

    function SaveVanBanLoai() {
        //tedu.notify("nut them co quan", "success");
        var vanbanloaiId = $('#hidVanBanLoaiId').val();
        var tenvbl = $('#txtVanBanLoaiTen').val();
        var codevbl = $('#txtVanBanLoaiCode').val();
        var thoigianbaoquanvbl = $('#txtThoiGianBaoQuan').val();
        var stt = $('#txtVanBanLoaiSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbloai/AddUpdateVanBanLoai",
            data: {
                Id: vanbanloaiId,
                InsertVanBanLoaiId: 1,
                Ten: tenvbl,
                Code: codevbl,
                ThoiGianBaoQuan: thoigianbaoquanvbl,
                Stt: stt
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
                    loadTableVanBanLoai();
                    tedu.notify('Thêm mới danh mục loại văn bản thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VanBanLoai').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục loại văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateVanBanLoai() {
        var insertvblId = $('#hidInsertVanBanLoaiId').val();

        var vanbanloaiId = $('#hidVanBanLoaiId').val();
        var tenvbl = $('#txtVanBanLoaiTen').val();
        var codevbl = $('#txtVanBanLoaiCode').val();
        var thoigianbaoquanvbl = $('#txtThoiGianBaoQuan').val();
        var stt = $('#txtVanBanLoaiSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbloai/AddUpdateVanBanLoai",
            data: {
                Id: vanbanloaiId,
                InsertVanBanLoaiId: insertvblId,
                Ten: tenvbl,
                Code: codevbl,
                ThoiGianBaoQuan: thoigianbaoquanvbl,
                Stt: stt
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
                    loadTableVanBanLoai();
                    tedu.notify('Cập nhật danh mục loại văn bản thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VanBanLoai').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục loại văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadAddEditVanBanLoai(vanbanloaiid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbloai/GetVanBanLoaiId",
            data: { vanbanloaiId: vanbanloaiid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanloai = response.Result.Results[0];

                $('#hidVanBanLoaiId').val(vanbanloai.Id);
                $('#hidInsertVanBanLoaiId').val(2);

                $('#txtVanBanLoaiTen').val(vanbanloai.Ten);
                $('#txtVanBanLoaiCode').val(vanbanloai.Code);
                $('#txtThoiGianBaoQuan').val(vanbanloai.ThoiGianBaoQuan);
                $('#txtVanBanLoaiSoThuTu').val(vanbanloai.Stt);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}