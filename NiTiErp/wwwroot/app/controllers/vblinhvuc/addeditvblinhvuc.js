var addeditvblinhvucController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    this.loadAddEditVanBanLinhVuc = function (vanbanlinhvucid) {
        loadAddEditVanBanLinhVuc(vanbanlinhvucid);
    }
    this.loadTableVanBanLinhVuc = function () {
        loadTableVanBanLinhVuc();
    }
    this.clearDataAddEdit = function () {
        ClearData();
    }

    this.initialize = function () {
        registerEvents();
        ClearData();
    }

    function registerEvents() {

        $('#btnSaveVanBanLinhVuc').on('click', function () {
            var insertvanbanlinhvuc = $('#hidInsertVanBanLinhVucId').val();

            if (insertvanbanlinhvuc === 1) {
                SaveVanBanLinhVuc();
            }
            else {
                UpdateVanBanLinhVuc();
            }
        });

    }

    function ClearData() {
        $('#hidVanBanLinhVucId').val("");
        $('#hidInsertVanBanLinhVucId').val(0);

        $('#txtVanBanLinhVucTen').val("");
        $('#txtVanBanLinhVucCode').val("");     
        $('#txtVanBanLinhVucSoThuTu').val(1);
    }

    function loadTableVanBanLinhVuc(isPageChanged) {
        var template = $('#table-VanBanLinhVuc').html();
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
            url: '/admin/vblinhvuc/GetListVanBanLinhVuc',
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
                            Stt: item.Stt,
                            CreateDate: item.CreateDate !== null ? tedu.getFormattedDate(item.CreateDate) : "",
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVanBanLinhVucTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVanBanLinhVuc').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVanBanLinhVuc(response.Result.RowCount, function () {
                        loadTableVanBanLinhVuc();
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
    function wrapPagingVanBanLinhVuc(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVanBanLinhVuc a').length === 0 || changePageSize === true) {
            $('#paginationULVanBanLinhVuc').empty();
            $('#paginationULVanBanLinhVuc').removeData("twbs-pagination");
            $('#paginationULVanBanLinhVuc').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVanBanLinhVuc').twbsPagination({
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

    function SaveVanBanLinhVuc() {
        //tedu.notify("nut them co quan", "success");
        var vanbanlinhvucId = $('#hidVanBanLinhVucId').val();
        var tenvblv = $('#txtVanBanLinhVucTen').val();
        var codevblv = $('#txtVanBanLinhVucCode').val();      
        var stt = $('#txtVanBanLinhVucSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vblinhvuc/AddUpdateVanBanLinhVuc",
            data: {
                Id: vanbanlinhvucId,
                InsertVanBanLinhVucId: 1,
                Ten: tenvblv,
                Code: codevblv,               
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
                    loadTableVanBanLinhVuc();
                    tedu.notify('Thêm mới danh mục lĩnh vực văn bản thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VanBanLinhVuc').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục lĩnh vực văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateVanBanLinhVuc() {
        var insertvblvId = $('#hidInsertVanBanLinhVucId').val();

        var vanbanlinhvucId = $('#hidVanBanLinhVucId').val();
        var tenvblv = $('#txtVanBanLinhVucTen').val();
        var codevblv = $('#txtVanBanLinhVucCode').val();
        var stt = $('#txtVanBanLinhVucSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vblinhvuc/AddUpdateVanBanLinhVuc",
            data: {
                Id: vanbanlinhvucId,
                InsertVanBanLinhVucId: insertvblvId,
                Ten: tenvblv,
                Code: codevblv,
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
                    loadTableVanBanLinhVuc();
                    tedu.notify('cập nhật danh mục lĩnh vực văn bản thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VanBanLinhVuc').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục lĩnh vực văn bản.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadAddEditVanBanLinhVuc(vanbanlinhvucid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vblinhvuc/GetVanBanLinhVucId",
            data: { vanbanlinhvucId: vanbanlinhvucid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanlinhvuc = response.Result.Results[0];

                $('#hidVanBanLinhVucId').val(vanbanlinhvuc.Id);
                $('#hidInsertVanBanLinhVucId').val(2);

                $('#txtVanBanLinhVucTen').val(vanbanlinhvuc.Ten);
                $('#txtVanBanLinhVucCode').val(vanbanlinhvuc.Code);             
                $('#txtVanBanLinhVucSoThuTu').val(vanbanlinhvuc.Stt);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}