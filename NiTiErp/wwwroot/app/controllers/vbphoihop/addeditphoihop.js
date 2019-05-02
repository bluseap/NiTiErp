var addeditphoihopController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    this.loadAddEditPhoiHop = function (vbphoihopid) {
        loadAddEditPhoiHop(vbphoihopid);
    }
    this.loadTablePhoiHop = function () {
        loadTablePhoiHop();
    }
    this.clearDataAddEdit = function () {
        ClearData();
    }

    this.initialize = function () {        
        registerEvents();
        ClearData();
    }    

    function registerEvents() {

        $('#btnSaveVBPhoiHop').on('click', function () {
            var insertvbphoihop = $('#hidInsertVBPhoiHopId').val();

            if (insertvbphoihop === 1) {
                SaveVBPhoiHop();
            }
            else {
                UpdateVBPhoiHop();
            }
        });

    }

    function ClearData() {
        $('#hidVBPhoiHopId').val("");
        $('#hidInsertVBPhoiHopId').val(0);

        $('#txtVBPhoiHopTen').val("");
        $('#txtVBPhoiHopCode').val("");
        $('#txtVBPhoiHopSoThuTu').val(1);
    }   

    function loadTablePhoiHop(isPageChanged) {
        var template = $('#table-VBPhoiHop').html();
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
            url: '/admin/vbphoihop/GetListVBPhoiHop',
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

                $('#lblVBPhoiHopTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBPhoiHop').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBPhoiHop(response.Result.RowCount, function () {
                        loadTablePhoiHop();
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
    function wrapPagingVBPhoiHop(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBPhoiHop a').length === 0 || changePageSize === true) {
            $('#paginationULVBPhoiHop').empty();
            $('#paginationULVBPhoiHop').removeData("twbs-pagination");
            $('#paginationULVBPhoiHop').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBPhoiHop').twbsPagination({
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

    function SaveVBPhoiHop() {
        //tedu.notify("nut them co quan", "success");
        var vbphoihopId = $('#hidVBPhoiHopId').val();
        var tenvbph = $('#txtVBPhoiHopTen').val();
        var codevbph = $('#txtVBPhoiHopCode').val();
        var stt = $('#txtVBPhoiHopSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbphoihop/AddUpdateVBPhoiHop",
            data: {
                Id: vbphoihopId,
                InsertVBPHXLId: 1,
                Ten: tenvbph,
                Code: codevbph,
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
                    loadTablePhoiHop();
                    tedu.notify('Thêm mới danh mục phối hợp thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VBPhoiHop').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục phối hợp.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateVBPhoiHop() {
        var insertPhoiHopId = $('#hidInsertVBPhoiHopId').val();

        var vbphoihopId = $('#hidVBPhoiHopId').val();
        var tenvbph = $('#txtVBPhoiHopTen').val();
        var codevbph = $('#txtVBPhoiHopCode').val();
        var stt = $('#txtVBPhoiHopSoThuTu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbphoihop/AddUpdateVBPhoiHop",
            data: {
                Id: vbphoihopId,
                InsertVBPHXLId: insertPhoiHopId,
                Ten: tenvbph,
                Code: codevbph,
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
                    loadTablePhoiHop();
                    tedu.notify('Thêm mới danh mục phối hợp thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-VBPhoiHop').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi thêm mới danh mục phối hợp.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadAddEditPhoiHop(vbphoihopid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbphoihop/GetVBPhoiHopId",
            data: { vanbanphoihopId: vbphoihopid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbphoihop = response.Result.Results[0];

                $('#hidVBPhoiHopId').val(vbphoihop.Id);
                $('#hidInsertVBPhoiHopId').val(2);

                $('#txtVBPhoiHopTen').val(vbphoihop.Ten);
                $('#txtVBPhoiHopCode').val(vbphoihop.Code);
                $('#txtVBPhoiHopSoThuTu').val(vbphoihop.Stt);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}