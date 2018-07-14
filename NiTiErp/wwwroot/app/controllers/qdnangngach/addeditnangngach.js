var addeditnangngachController = function () {

    this.initialize = function () {
        loadKhuVucAddEdit();

        loadDataAddEdit();

        disabledAddEdit(true);

        registerEvents();
    }

    function registerEvents() {
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

        $("#ddl-show-pageHoSoQDNN").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $('body').on('click', '.btn-editHoSoQDNN', function (e) {
            e.preventDefault();

            $('#hidInsertQDNNIdId').val(1); // = 1 : insert quyet dinh nang ngach

            var hosoId = $(this).data('id');

            $('#hidQDNNId').val('0');
            $('#hidHoSoNangNgachId').val(hosoId);

            loadHoSoNangNgach(hosoId);

        });

        $("#ddlChucVuMoi").on('change', function () {
            ddlChucVuMoiChange();    
        });

        $("#ddlBacLuongMoi").on('change', function () {
            ddlChucVuMoiChange();
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
        $('#frmMainQDNN').validate({
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
                    required: "Nhập số quyết định nâng ngạch..."
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

        $('#ddlLoaiQuyetDinh').prop('disabled', para);
        $('#ddlChucVuCu').prop('disabled', para);

        $('#ddlBacLuongCu').prop('disabled', para);
        $('#txtHeSoCu').prop('disabled', para);
        $('#txtMucLuongCu').prop('disabled', para);
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

                $('#ddlLoaiQuyetDinh').val("NN05"); //Quyet dinh nang ngach
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Loại quyết định.', 'error');
            }
        });
    }

    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-HoSoQDNN').html();
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

                $('#lblHoSoQDNNTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoQDNN').html(render);
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
        if ($('#paginationULHoSoQDNN a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoQDNN').empty();
            $('#paginationULHoSoQDNN').removeData("twbs-pagination");
            $('#paginationULHoSoQDNN').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoQDNN').twbsPagination({
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

    function loadHoSoNangNgach(hosoid) {       
        $.ajax({
            type: "GET",
            url: "/Admin/qdnangngach/GetHeSoNVChucVuBac",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hesonhanvien = response.Result[0];

                $('#txtAddEditHoTen').val(hesonhanvien.Ten);
                $('#txtAddEditPhongTo').val(hesonhanvien.TenPhong);

                $('#hidHeSoLuongDanhMucCuId').val(hesonhanvien.HeSoLuongDanhMucId);
                $('#ddlChucVuCu').val(hesonhanvien.ChucVuNhanVienId); 
                $('#ddlBacLuongCu').val(hesonhanvien.BacLuongId); 
                $('#txtHeSoCu').val(hesonhanvien.HeSo); 
                $('#txtMucLuongCu').val(hesonhanvien.MucLuong);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function ddlChucVuMoiChange() {        
        var makhuvuc = $('#ddlKhuVuc').val();
        var chucvu = $("#ddlChucVuMoi").val();
        var bacluong = $("#ddlBacLuongMoi").val();

        $.ajax({
            type: 'GET',
            url: '/admin/qdnangngach/GetChucVuBac',
            data: {
                corporationId: makhuvuc,
                chucvuId: chucvu,
                bacluongId: bacluong
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.length === 0) {
                    $('#hidHeSoLuongDanhMucId').val(0);
                    $('#txtHeSoMoi').val(0);
                    $('#txtMucLuongMoi').val(0);
                }
                else {
                    var hesoluongdanhmuc = response.Result[0];

                    $('#hidHeSoLuongDanhMucId').val(hesoluongdanhmuc.Id);
                    $('#txtHeSoMoi').val(hesoluongdanhmuc.HeSo);
                    $('#txtMucLuongMoi').val(hesoluongdanhmuc.MucLuong);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có hệ số lương phù hợp.', 'error');
            }
        });
    }


}