﻿var timhosoController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();
    }

    function registerEvents() {

        $('body').on('click', '.btnTimHoSoNhanVien', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $('body').on('click', '.btnLuong', function (e) {       
            e.preventDefault();            

            var hosoId = $(this).data('id');

            $('#hidHisHoSoLuongId').val(hosoId);

            loadHisHoSoLuong(hosoId);

            $('#modal-His-Luong').modal('show');
        });

        $('body').on('click', '.btnQuyetDinh', function (e) {       
            e.preventDefault();          

            var hosoId = $(this).data('id');

            $('#hidHisHoSoQuyetDinhId').val(hosoId);

            loadHisHoSoQuyetDinh(hosoId);           

            $('#modal-His-QuyetDinh').modal('show');
        });

        $('body').on('click', '.btnSucKhoe', function (e) {        
            e.preventDefault();

            var hosoId = $(this).data('id');

            $('#hidHisHoSoSucKhoeId').val(hosoId);

            loadHisHoSoSucKhoe(hosoId);

            $('#modal-His-SucKhoe').modal('show');
        });

        $('body').on('click', '.btnXemThongTin', function (e) {        
            e.preventDefault();

            var hosoId = $(this).data('id');

            $('#hidHisHoSoXemThongTinId').val(hosoId);

            loadHisHoSoXemThongTin(hosoId);

            $('#modal-His-XemThongTin').modal('show');
        });

        $('body').on('click', '.btnDaoTao', function (e) {        
            e.preventDefault();

            var hosoId = $(this).data('id');

            $('#hidHisHoSoDaoTaoId').val(hosoId);

            loadHisHoSoDaoTao(hosoId);

            $('#modal-His-DaoTao').modal('show');
        });

        $("#ddl-show-pageHoSo").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableHoSo(true);
        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableHoSo();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableHoSo();
            }
        });

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit-HopDong').modal('show');
        });

    }

    function resetFormMaintainance() {
        
    }

    function loadData() { 

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

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());

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
                $('#ddlPhongBan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadTableHoSo(isPageChanged) {
        var template = $('#table-HoSo').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

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
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" class="img-circle img-responsive" />',
                            //HinhNhanVien: item.HinhNhanVien,
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            SoDienThoai: item.SoDienThoai,
                            TenBacLuong: item.TenBacLuong,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lbl-total-recordsHoSo').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSo').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSo(response.Result.RowCount, function () {
                        loadTableHoSo();
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
        if ($('#paginationULHoSo a').length === 0 || changePageSize === true) {
            $('#paginationULHoSo').empty();
            $('#paginationULHoSo').removeData("twbs-pagination");
            $('#paginationULHoSo').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSo').twbsPagination({
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

    function loadHisHoSoQuyetDinh(hosoid) {

        $.ajax({
            type: "GET",
            url: "/Admin/timhoso/GetHoSoId",
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