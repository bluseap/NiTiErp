var chucvunvController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
   

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();       
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {

            resetFormAddEditDMCV();

            $('#hidInsertDMCVId').val(1); // insert

            $('#modal-add-edit-DMCV').modal('show');            

        });

        $('#btnSaveDMCV').on('click', function (e) {
            var insertDMCV = $('#hidInsertDMCVId').val(); // update

            if (insertDMCV === "2") {
                UpdateDMCV(e);
            }
            else {
                SaveDMCV(e);
            }
        });

        $("#ddl-show-pageDMCV").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChucVu(true);
        });

        $('body').on('click', '.btn-editDMCV', function (e) {
            e.preventDefault();

            $('#hidInsertDMCVId').val(2); // update

            var chucvuId = $(this).data('id');

            $('#hidDMCVId').val(chucvuId);

            loadChucVu(chucvuId);

            $('#modal-add-edit-DMCV').modal('show');            

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableChucVu();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableChucVu();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelDMCV();
        });

    }

    function loadData() {
        loadChucDanh();

        //loadTableChucVu();
    }

    function loadChucDanh() {
        $.ajax({
            type: 'GET',
            url: '/admin/chucvunv/ChucDanhGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucDanh + "</option>";
                });
                $('#ddlAddEditChucDanh').html(render);                

                $('#ddlAddEditChucDanh')[0].selectedIndex = 2;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại hợp đồng.', 'error');
            }
        });
    }

    function loadTableChucVu(isPageChanged) {
        var template = $('#table-DMCV').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = ""; //$('#ddlPhongBan').val();
        var timnhanvien = $('#btnTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/chucvunv/GetListChucVuPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenChucVu: item.TenChucVu,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenChucDanh: item.TenChucDanh,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblDMCVTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDMCV').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDMCV(response.Result.RowCount, function () {
                        loadTableChucVu();
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
    function wrapPagingDMCV(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULDMCV a').length === 0 || changePageSize === true) {
            $('#paginationULDMCV').empty();
            $('#paginationULDMCV').removeData("twbs-pagination");
            $('#paginationULDMCV').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDMCV').twbsPagination({
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

    function resetFormAddEditDMCV() {
        $('#hidDMCVId').val('0');        
        $('#hidInsertDMCVId').val('0');              

        $('#ddlKhuVuc')[0].selectIndex = 1;
        $('#ddlAddEditKhuVuc')[0].selectIndex = 1; 

        $('#ddlAddEditChucDanh')[0].selectIndex = 2;
        $('#txtAddEditTenChucVu').val('');
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
                $('#ddlAddEditKhuVuc').html(render);               

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlAddEditKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlAddEditKhuVuc")[0].selectedIndex = 1;                       

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function SaveDMCV(e) {
        e.preventDefault();

        var chucvuid = $('#hidDMCVId').val(); //
        var inschucvunvid = $('#hidInsertDMCVId').val(); // id = 1 ; para update insert
        
        var makv = $('#ddlAddEditKhuVuc').val();
        var machucdanh = $('#ddlAddEditChucDanh').val();
        var tenchucvu = $('#txtAddEditTenChucVu').val();        

        $.ajax({
            type: "POST",
            url: "/Admin/chucvunv/AddUpdateDMChucVu",
            data: {
                Id: chucvuid,
                InsertchucvunvId: inschucvunvid,
                CorporationId: makv,

                ChucDanhDanhMucId: machucdanh,
                TenChucVu: tenchucvu
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
                    tedu.notify('Chức vụ danh mục.', 'success');

                    loadTableChucVu(true);

                    $('#modal-add-edit-DMCV').modal('hide');

                    resetFormAddEditDMCV();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Chức vụ danh mục', 'error');
                tedu.stopLoading();
            }
        });

    }

    function UpdateDMCV(e) {
        e.preventDefault();

        var chucvuid = $('#hidDMCVId').val(); //
        var inschucvunvid = $('#hidInsertDMCVId').val(); // id = 1 ; para update insert

        var makv = $('#ddlAddEditKhuVuc').val();
        var machucdanh = $('#ddlAddEditChucDanh').val();
        var tenchucvu = $('#txtAddEditTenChucVu').val();

        $.ajax({
            type: "POST",
            url: "/Admin/chucvunv/AddUpdateDMChucVu",
            data: {
                Id: chucvuid,
                InsertchucvunvId: inschucvunvid,
                CorporationId: makv,

                ChucDanhDanhMucId: machucdanh,
                TenChucVu: tenchucvu
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
                    tedu.notify('Chức vụ danh mục.', 'success');

                    loadTableChucVu(true);

                    $('#modal-add-edit-DMCV').modal('hide');

                    resetFormAddEditDMCV();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Chức vụ danh mục', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadChucVu(chucvuid) {
        $.ajax({
            type: "GET",
            url: "/Admin/chucvunv/GetChucVudmId",
            data: { chucvuId: chucvuid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormAddEditDMCV();
                }
                else {
                    var chucvu = response.Result.Results[0];

                    $('#ddlAddEditKhuVuc').val(chucvu.CorporationId);
                    $('#ddlAddEditChucDanh').val(chucvu.ChucDanhDanhMucId);
                    $('#txtAddEditTenChucVu').val(chucvu.TenChucVu);  
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelDMCV() {

    }

}