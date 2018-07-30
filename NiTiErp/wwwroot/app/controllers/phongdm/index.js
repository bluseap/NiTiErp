var phongdmController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditPhongDM = new addeditphongdmController();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditPhongDM.initialize();
    }

    function registerEvents() {
        $("#btn-create").on('click', function () {
            resetFormAddEditDMPhong();

            $('#hidInsertDMPHONGId').val(1); // insert

            $('#modal-add-edit-DMPHONG').modal('show');
        });

        $("#ddl-show-pageDMPHONG").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;

            loadTableDanhMucPhong(true);
        });

        $('#btnSaveDMPHONG').on('click', function (e) {
            var insertDMPHONG = $('#hidInsertDMPHONGId').val(); // update

            if (insertDMPHONG === "2") {
                UpdateDMPHONG(e);
            }
            else {
                SaveDMPHONG(e);
            }
        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableDanhMucPhong();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableDanhMucPhong();
            }
        });

        $('body').on('click', '.btn-editDMPHONG', function (e) {
            e.preventDefault();

            $('#hidInsertDMPHONGId').val(2);

            var phongId = $(this).data('id');

            $('#hidDMPHONGId').val(phongId);

            loadAddEditDMPHONG(phongId);

            $('#modal-add-edit-DMPHONG').modal('show');
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

    function loadData() {
        loadTableDanhMucPhong();
    }

    function loadTableDanhMucPhong(isPageChanged) {
        var template = $('#table-DMPHONG').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = "";
        var timcongty = $('#txtTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timcongty,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/phongdm/GetAllPhongPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenPhong: item.TenPhong,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.TenKhuVuc,
                            SoDienThoai1: item.SoDienThoai1,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),
                        });
                    });
                }

                $('#lblDMPHONGTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDMPHONG').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDMPHONG(response.Result.RowCount, function () {
                        loadTableDanhMucPhong();
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
    function wrapPagingDMPHONG(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULDMPHONG a').length === 0 || changePageSize === true) {
            $('#paginationULDMPHONG').empty();
            $('#paginationULDMPHONG').removeData("twbs-pagination");
            $('#paginationULDMPHONG').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDMPHONG').twbsPagination({
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

    function resetFormAddEditDMPhong() {
        $('#hidDMPHONGId').val('0');
        $('#hidInsertDMPHONGId').val('0');

        $('#txtAddEditTenPhong').val('');
        $('#ddlAddEditKhuVuc')[0].selectedIndex = 1;
        $('#txtAddEditSoDienThoai').val('');
        $('#txtAddEditEmail').val('');
    }

    function SaveDMPHONG(e) {
        e.preventDefault();

        var phongid = $('#hidDMPHONGId').val(); //
        var insdmphongid = $('#hidInsertDMPHONGId').val(); // id = 1 ; para update insert

        var tenphong = $('#txtAddEditTenPhong').val();
        var makv = $('#ddlAddEditKhuVuc').val();
        var sodienthoai = $('#txtAddEditSoDienThoai').val(); 
        var email = $('#txtAddEditEmail').val();

        $.ajax({
            type: "POST",
            url: "/Admin/phongdm/AddUpdateDMPHONG",
            data: {
                Id: phongid,
                InsertphongdmId: insdmphongid,
                CorporationId: makv,

                TenPhong: tenphong,
                SoDienThoai1: sodienthoai,
                Email: email                
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
                    tedu.notify('Phòng danh mục.', 'success');

                    loadTableDanhMucPhong(true);

                    $('#modal-add-edit-DMPHONG').modal('hide');

                    resetFormAddEditDMPhong();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Phòng danh mục', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateDMPHONG(e) {
        e.preventDefault();

        var phongid = $('#hidDMPHONGId').val(); //
        var insdmphongid = $('#hidInsertDMPHONGId').val(); // id = 2 ; para update insert

        var tenphong = $('#txtAddEditTenPhong').val();
        var makv = $('#ddlAddEditKhuVuc').val();
        var sodienthoai = $('#txtAddEditSoDienThoai').val();
        var email = $('#txtAddEditEmail').val();

        $.ajax({
            type: "POST",
            url: "/Admin/phongdm/AddUpdateDMPHONG",
            data: {
                Id: phongid,
                InsertphongdmId: insdmphongid,
                CorporationId: makv,

                TenPhong: tenphong,
                SoDienThoai1: sodienthoai,
                Email: email
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
                    tedu.notify('Phòng danh mục.', 'success');

                    loadTableDanhMucPhong(true);

                    $('#modal-add-edit-DMPHONG').modal('hide');

                    resetFormAddEditDMPhong();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Phòng danh mục', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadAddEditDMPHONG(phongid) {
        $.ajax({
            type: "GET",
            url: "/Admin/phongdm/GetPhongdmId",
            data: { phongId: phongid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormAddEditDMPhong();
                }
                else {
                    var phongdm = response.Result.Results[0];

                    $('#txtAddEditTenPhong').val(phongdm.TenPhong);
                    $('#ddlAddEditKhuVuc').val(phongdm.CorporationId);
                    $('#txtAddEditSoDienThoai').val(phongdm.SoDienThoai1);
                    $('#txtAddEditEmail').val(phongdm.Email);
                   
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}