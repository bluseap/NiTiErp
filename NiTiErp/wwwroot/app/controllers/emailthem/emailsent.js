var emailsentController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var sentfile = new sentfileController();

    this.clearEmailSent = function () {
        clearEmailSent();
    }

    this.initialize = function () {

        registerEvents();

        loadEmailSentKhuVuc();

        loadDataEmailSent();     

        
    }

    function registerEvents() {   
        
        $("#btnTimNguoiGui").on('click', function (e) {
            e.preventDefault();
            $('#modal-add-edit-TimNguoiGui').modal('show');
        });

        $('#ddlTimNguoiGuiKhuVuc').on('change', function () {
            var corporationId = $('#ddlTimNguoiGuiKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#btnTimNguoiGuiTimNhanVien').on('click', function () {
            LoadTableHoSoNguoiDung();
        });

        $('#txtTimNguoiGuiTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSoNguoiDung();
            }
        });

        $("#ddl-show-pageTimNguoiGuiNguoiDung").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSoNguoiDung(true);
        });

        $('body').on('click', '.btn-editTimNguoiGuiNguoiDung', function (e) {
            e.preventDefault();
            var hosoId = $(this).data('id');
            $('#hidNhanVienNguoiNhanId').val(hosoId);

            addNhanVienNguoiNhan(hosoId);
        });

        $("#btnEmailSentGui").on('click', function (e) {
            e.preventDefault();
            tedu.notify("Bắt đầu gửi", "success");
        });
    }

    function loadEmailSentKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlTimNguoiGuiKhuVuc').html(render);
                //var userCorporationId = $("#hidUserCorporationId").val();
                //if (userCorporationId !== "PO") {
                //    $('#ddlTimNguoiGuiKhuVuc').prop('disabled', true);
                //}
                //else {
                //    $('#ddlTimNguoiGuiKhuVuc').prop('disabled', false);
                //}
                $('#ddlTimNguoiGuiKhuVuc').prop('disabled', true);
                $("#ddlTimNguoiGuiKhuVuc")[0].selectedIndex = 1;
                loadPhongKhuVuc($("#ddlTimNguoiGuiKhuVuc").val());
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
                $('#ddlTimNguoiGuiPhong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function LoadTableHoSoNguoiDung(isPageChanged) {
        var template = $('#table-TimNguoiGuiNguoiDung').html();
        var render = "";

        var makhuvuc = $('#ddlTimNguoiGuiKhuVuc').val();
        var phongId = $('#ddlTimNguoiGuiPhong').val();
        var timnhanvien = $('#txtTimNguoiGuiTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hoso/GetAllPagingHoSoNguoiDung',
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

                $('#lblTimNguoiGuiNguoiDungTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentTimNguoiGuiNguoiDung').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSoNguoiDung(response.Result.RowCount, function () {
                        LoadTableHoSoNguoiDung();
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
    function wrapPagingHoSoNguoiDung(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULTimNguoiGuiNguoiDung a').length === 0 || changePageSize === true) {
            $('#paginationULTimNguoiGuiNguoiDung').empty();
            $('#paginationULTimNguoiGuiNguoiDung').removeData("twbs-pagination");
            $('#paginationULTimNguoiGuiNguoiDung').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULTimNguoiGuiNguoiDung').twbsPagination({
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

    function clearEmailSent() {
        $("#hidEmailNoiBoId").val("");
        $("#hidEmailNoiBoNhanId").val("");
        $("#hidEmailNoiBoNhanFileId").val("");

        $("#hidNhanVienNguoiNhanId").val("");

        $("#hidInsCodeEmailNoiBoNhanId").val("0");
        $("#hidCodeEmailNoiBoNhanGuid").val("0");

    }

    function addNhanVienNguoiNhan(hosoId) {
        var newguid = sentfile.newGuid();
        $("#hidCodeEmailNoiBoNhanGuid").val(newguid); 

    }

    function loadDataEmailSent() {

    }

}