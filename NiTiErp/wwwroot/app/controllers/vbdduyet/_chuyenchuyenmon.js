﻿var _chuyenchuyenmonController = function () {



    this.initialize = function () {
        loadCCMKhuVuc();

        registerEvents();

        loadCCMData();

    }

    this.loadNhanVienXuLyVanBanDen = function (vanbandenduyetid) {
        loadNhanVienXLVanBan(vanbandenduyetid);       
    }

    function registerEvents() {

        $('#txtNgayChuyenChuyenMon').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  
        
        $('#ddlCCMKhuVuc').on('change', function () {
            var corporationId = $('#ddlCCMKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#btnCCMTimNhanVien').on('click', function () {
            LoadTableHoSo();
        });

        $('#txtCCMTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSo();
            }
        });

        $("#ddl-show-pageCCMHoSoNhanVien").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $('body').on('click', '.btn-editCCMHoSoNhanVien', function (e) {
            e.preventDefault();
            var hosoId = $(this).data('id');
            $('#hidHoSoNhanVienId').val(hosoId);                 
            
            addNhanVienToCCM(hosoId);
        });

        $('body').on('click', '.btn-deleteNhanVienXuLy', function (e) {
            e.preventDefault();
            var vbnvxlid = $(this).data('Id');
            tedu.notify(vbnvxlid, "success");
        });

    }

    function addNhanVienToCCM(hosoid) {
        
        //var insertvbdnvxl = $('#hidInsertVBDDNVXLId').val("1");
        var vanbandenduyetid = $('#hidVanBanDenDuyetId').val();    
        //var vanbandenduyetid = $('#txtButPheLanhDao').val();    
        var ngaychuyenchuyenmon = tedu.getFormatDateYYMMDD($('#txtNgayChuyenChuyenMon').val()); 
        
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/InsertUpdateVBDDNVXL",
            data: {
                InsertVanBanDenDuyetNVXLId: 1,
                VanBanDenDuyetId: vanbandenduyetid,
                HoSoNhanVienId: hosoid,
                NgayNhanVBXL: ngaychuyenchuyenmon,
                VBPhoiHopXuLyId: 3
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var query = response.Result[0];
                if (query.KETQUA === "SAI") {
                    tedu.notify('Nhân viên đăng ký rồi! Kiểm tra lại.', 'error');
                }
                else {
                    loadNhanVienXLVanBan(vanbandenduyetid);
                }
                $('#hidHoSoNhanVienId').val(''); 
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Nhân viên đã đăng ký rồi! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });    
    }

    function loadNhanVienXLVanBan(vanbandenduyetid) {      
        $.ajax({
            type: "GET",
            url: "/Admin/vbdduyet/GetListVBDDNVXL",
            data: { vanbandenduyetid: vanbandenduyetid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbddnvxl = response.Result;

                var template = $('#template-table-NhanVienXuLy').html();
                var render = '';

                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(vbddnvxl, function (i, item) {
                        render += Mustache.render(template, {
                            TenNhanVien: item.TenNhanVien,
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            Id: item.Id
                        });
                    });                  
                    //tedu.notify('Nhân viên đăng ký.', 'success');                    
                }

                if (render !== '') {
                    $('#table-contentNhanVienXuLy').html(render);
                }
             
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCCMKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCCMKhuVuc').html(render);
                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlCCMKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlCCMKhuVuc').prop('disabled', false);
                }
                $("#ddlCCMKhuVuc")[0].selectedIndex = 1;
                loadPhongKhuVuc($("#ddlCCMKhuVuc").val());
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
                $('#ddlCCMPhong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadCCMData() {
        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayChuyenChuyenMon').val(nowDate);

    }

    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-CCMHoSoNhanVien').html();
        var render = "";

        var makhuvuc = $('#ddlCCMKhuVuc').val();
        var phongId = $('#ddlCCMPhong').val();
        var timnhanvien = $('#txtCCMTimNhanVien').val();              

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

                $('#lblCCMHoSoNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentCCMHoSoNhanVien').html(render);
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
        if ($('#paginationULCCMHoSoNhanVien a').length === 0 || changePageSize === true) {
            $('#paginationULCCMHoSoNhanVien').empty();
            $('#paginationULCCMHoSoNhanVien').removeData("twbs-pagination");
            $('#paginationULCCMHoSoNhanVien').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULCCMHoSoNhanVien').twbsPagination({
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