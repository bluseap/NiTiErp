var addeidtvbddmsoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();


    this.initialize = function () {

        registerEvents();

    }

    this.loadTableVBDDMSo = function () {
        loadTableVBDDMSo();
    }

    this.loadVBDDMSo = function (vbddmsoid) {
        loadVBDDMSoId(vbddmsoid);
    }

    function registerEvents() {

        $("#btnLuuVBDDMSo").on('click', function (e) {
            e.preventDefault();
            LuuVBDDMSo();
        });

    }

    function loadVBDDMSoId(vbddmsoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/VBDDMSo/GetVBDDMSoId",
            data: { vbddmsoId: vbddmsoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbddmso = response.Result[0];

                $('#hidVBDSMSoId').val(vbddmso.Id);
                $('#hidInsertVBDSMSoId').val(2);

                $('#ddlVBDDMAddEditKhuVuc').val(vbddmso.CorporationId);
                $('#txtVBDDMSoAddEditNam').val(vbddmso.Nam);
                $('#txtVBDDMSoTen').val(vbddmso.TenSo);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LuuVBDDMSo() {
        //tedu.notify("luu vao vb di so", "success");

        var vbddmsoId = $('#hidVBDSMSoId').val();
        var insertVBDDMSoId = $('#hidInsertVBDSMSoId').val();

        var makhuvuc = $('#ddlVBDDMAddEditKhuVuc').val();
        var namSo = $('#txtVBDDMSoAddEditNam').val();
        var tenSo = $('#txtVBDDMSoTen').val();

        $.ajax({
            type: "POST",
            url: "/Admin/VBDDMSo/AddUpdateVanBanDenDMSo",
            data: {
                Id: vbddmsoId,
                InsertVanBanDenSoId: insertVBDDMSoId,
                CorporationId: makhuvuc,
                Nam: namSo,
                TenSo: tenSo
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
                    tedu.notify('Danh mục sổ văn bản đến.', 'success');
                    loadTableVBDDMSo(true);
                    clearAddEditData();
                    $('#modal-add-edit-VBDSMSo').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Danh mục sổ văn bản đến', 'error');
                tedu.stopLoading();
            }
        });
    }

    function clearAddEditData() {
        var namhientai = new Date().getFullYear();

        $('#hidVBDSMSoId').val(0);
        $('#hidInsertVBDSMSoId').val('');

        $('#ddlVBDDMAddEditKhuVuc')[0].selectIndex = 1;
        $('#txtVBDDMSoAddEditNam').val(namhientai);
        $('#txtVBDDMSoTen').val('');
    }

    function loadTableVBDDMSo(isPageChanged) {
        var template = $('#table-VBDDMSo').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namSo = $('#txtVBDDMSoNam').val();
        var timnhanvien = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            data: {
                nam: namSo,
                corporationId: makhuvuc,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/VBDDMSo/GetAllVBDDMSoPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDen: item.TenSo,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            Nam: item.Nam,
                            TenKhuVuc: item.TenKhuVuc,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBDDMSoTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDDMSo').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDDMSo(response.Result.RowCount, function () {
                        loadTableVBDDMSo();
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
    function wrapPagingVBDDMSo(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDDMSo a').length === 0 || changePageSize === true) {
            $('#paginationULVBDDMSo').empty();
            $('#paginationULVBDDMSo').removeData("twbs-pagination");
            $('#paginationULVBDDMSo').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDDMSo').twbsPagination({
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