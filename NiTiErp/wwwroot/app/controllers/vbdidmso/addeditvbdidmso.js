var addeidtvbdidmsoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
   

    this.initialize = function () {  

        registerEvents();
       
    }

    this.loadTableVBDiDMSo = function () {
        loadTableVBDiDMSo();
    }

    this.loadVBDiDMSo = function (vbdidmsoid) {
        loadVBDiDMSoId(vbdidmsoid);
    }

    function registerEvents() {

        $("#btnLuuVBDiDMSo").on('click', function (e) {
            e.preventDefault();
            LuuVBDiDMSo();
        });

    }

    function loadVBDiDMSoId(vbdidmsoid){
        $.ajax({
            type: "GET",
            url: "/Admin/VBDiDMSo/GetVBDiDMSoId",
            data: { vbdidmsoId: vbdidmsoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbdidmso = response.Result[0];               

                $('#hidVBDiSMSoId').val(vbdidmso.Id);
                $('#hidInsertVBDiSMSoId').val(2);

                $('#ddlVBDiDMAddEditKhuVuc').val(vbdidmso.CorporationId);
                $('#txtVBDiDMSoAddEditNam').val(vbdidmso.Nam);
                $('#txtVBDiDMSoTen').val(vbdidmso.TenSo);
              
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LuuVBDiDMSo() {
        //tedu.notify("luu vao vb di so", "success");

        var vbdidmsoId = $('#hidVBDiSMSoId').val();
        var insertVBDiDMSoId = $('#hidInsertVBDiSMSoId').val();

        var makhuvuc = $('#ddlVBDiDMAddEditKhuVuc').val();
        var namSo = $('#txtVBDiDMSoAddEditNam').val();
        var tenSo = $('#txtVBDiDMSoTen').val();

        $.ajax({
            type: "POST",
            url: "/Admin/VBDiDMSo/AddUpdateVanBanDiDMSo",
            data: {
                Id: vbdidmsoId,
                InsertVanBanDiSoId: insertVBDiDMSoId,
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
                    tedu.notify('Danh mục sổ văn bản đi.', 'success');
                    loadTableVBDiDMSo(true);
                    clearAddEditData();
                    $('#modal-add-edit-VBDiSMSo').modal('hide');         
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Danh mục sổ văn bản đi', 'error');
                tedu.stopLoading();
            }
        });

    }

    function clearAddEditData() {
        var namhientai = new Date().getFullYear();

        $('#hidVBDiSMSoId').val(0);
        $('#hidInsertVBDiSMSoId').val('');

        $('#ddlVBDiDMAddEditKhuVuc')[0].selectIndex = 1;
        $('#txtVBDiDMSoAddEditNam').val(namhientai);
        $('#txtVBDiDMSoTen').val('');
    }

    function loadTableVBDiDMSo(isPageChanged) {
        var template = $('#table-VBDiDMSo').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namSo = $('#txtVBDiDMSoNam').val();
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
            url: '/admin/VBDiDMSo/GetAllVBDiDMSoPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDi: item.TenSo,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            Nam: item.Nam,
                            TenKhuVuc: item.TenKhuVuc,                   
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBDiDMSoTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBDiDMSo').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDiDMSo(response.Result.RowCount, function () {
                        loadTableVBDiDMSo();
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
    function wrapPagingVBDiDMSo(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBDiDMSo a').length === 0 || changePageSize === true) {
            $('#paginationULVBDiDMSo').empty();
            $('#paginationULVBDiDMSo').removeData("twbs-pagination");
            $('#paginationULVBDiDMSo').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBDiDMSo').twbsPagination({
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