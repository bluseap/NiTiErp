var addeditbonhiemController = function () {

    this.initialize = function () {
        loadKhuVucAddEdit();

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {
        $('#ddlKhuVucAddEdit').on('change', function () {
            var corporationId = $('#ddlKhuVucAddEdit').val();
            loadPhongKhuVucAddEdit(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#txtNgaKyQuyetDinh, #txtNgayHieuLuc, #txtNgayHetHan').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        forAddEditValidate();

        $('#btnTimNhanVienAddEdit').on('click', function () {
            LoadTableHoSo();
        });

        $('#txtTimNhanVienAddEdit').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSo();
            }
        });

        $("#ddl-show-pageHoSoQDBN").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $('body').on('click', '.btn-editHoSoQDBN', function (e) {
            e.preventDefault();

            $('#hidInsertQDBNIdId').val(1); // insert

            var hosoId = $(this).data('id');

            $('#hidQDBNId').val('0');
            $('#hidHoSoBoNhiemId').val(hosoId);

            loadQDBoNhiem(hosoId);

        });

    }

    function forAddEditValidate() {
        jQuery.validator.addMethod("isDanhMuc", function (value, element) {
            if (value === "%")
                return false;
            else
                return true;
        },
            "Xin chọn danh mục.."
        );

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );

        //Init validation
        $('#frmMainQDBN').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlLoaiQuyetDinh: {
                    required: true,
                    isDanhMuc: true
                },
                txtSoQuyetDinh: {
                    required: true
                }
            },
            messages: {
                txtSoQuyetDinh: {
                    required: "Nhập số quyết định bổ nhiệm..."
                }
            }
        });

    }

    function loadKhuVucAddEdit() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVucAddEdit').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVucAddEdit').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVucAddEdit').prop('disabled', false);
                }

                $("#ddlKhuVucAddEdit")[0].selectedIndex = 1;

                loadPhongKhuVucAddEdit($("#ddlKhuVucAddEdit").val());

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVucAddEdit(makhuvuc) {
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
                $('#ddlPhongBanAddEdit').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function disabledAddEdit(para) {
        $('#txtAddEditHoTen').prop('disabled', para);
        $('#txtAddEditPhongTo').prop('disabled', para);

        //$('#ddlXiNghiepCu').prop('disabled', para);
        //$('#ddlPhongToCu').prop('disabled', para);
        //$('#ddlChucVuCu').prop('disabled', para);       

        $('#ddlLoaiQuyetDinh').prop('disabled', para);
    }

    function loadDataAddEdit() {
        loadLoaiQuyetDinh();

    }

    function loadLoaiQuyetDinh() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdkhenthuong/LoaiQuyetDinh',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiQuyetDinh + "</option>";
                });
                $('#ddlLoaiQuyetDinh').html(render);

                $('#ddlLoaiQuyetDinh').val("BN01"); //Quyet dinh bo nhiem
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }

    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-HoSoQDBN').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVucAddEdit').val();
        var phongId = $('#ddlPhongBanAddEdit').val();
        var timnhanvien = $('#txtTimNhanVienAddEdit').val();

        tedu.notify(timnhanvien, "success");

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
                            Id: item.Id,
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

                $('#lblHoSoQDBNTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoQDBN').html(render);
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
        if ($('#paginationULHoSoQDBN a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoQDBN').empty();
            $('#paginationULHoSoQDBN').removeData("twbs-pagination");
            $('#paginationULHoSoQDBN').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoQDBN').twbsPagination({
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

    function loadQDBoNhiem(hosoid) {
        //tedu.notify(hosoid, "success");

        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetHoSoId",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hoso = response.Result.Results[0];
                $('#txtAddEditHoTen').val(hoso.Ten);
                $('#txtAddEditPhongTo').val(hoso.TenPhong);

                $('#ddlXiNghiepCu').val(hoso.CorporationId);
                $('#ddlPhongToCu').val(hoso.PhongBanDanhMucId);
                $('#ddlChucVuCu').val(hoso.ChucVuNhanVienId);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }



}