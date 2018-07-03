var hopdongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditHopDong = new AddEditHopDong();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditHopDong.initialize();
    }

    function registerEvents() {    
        $('#txtTuNgayHieuLuc, #txtDenNgayHieuLuc').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        disabledHopDong(true);
   
        //formMainValidate();

        $("#checkTuNgayDenNgay").change(function () {
            var $input = $(this);  
            //var ischecedTrue = $input.prop("checked"); 
            var ischecedFalse = $input.is(":checked"); 

            if (ischecedFalse === false) {               
                disabledHopDong(true); // hidden
            }
            else {               
                disabledHopDong(false); // show
            }   
        }).change();

        $("#ddl-show-pageHopDong").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHopDong(true);
        });

        $('#btnTimNhanVien').on('click', function () {
            LoadTableHopDong();
            LoadTableInHopDong();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHopDong();
                LoadTableInHopDong();
            }
        });

        $("#btnTimHopDong").on('click', function () {
            var dieukien = $("#ddlDieuKienKhac").val();

            tedu.notify(dieukien, "success");

            if (dieukien === "3") { // Chua nhap hop dong
                LoadTableHoSo();
            } 
            else if(dieukien === "%") { // Chua nhap hop dong
                LoadTableHopDong(true);
            }
            
        });

        $('body').on('click', '.btn-editHopDong', function (e) {
            e.preventDefault();           
           
            $('#hidHopDongId').val(1);
            $('#hidInsertHopDongId').val(0);
            $('#hidHeSoLuongDanhMucId').val(0);

            var hopdongId = $(this).data('id');

            tedu.notify(hopdongId, "success");

            LoadAddEditHopDong(hopdongId);                  

            $('#modal-add-edit-HopDong').modal('show');  
        });

        $('body').on('click', '.btn-editHoSo', function (e) {
            e.preventDefault();         

            $('#hidHopDongId').val(1); // para update inserst
            $('#hidInsertHopDongId').val(0);

            var hosoId = $(this).data('id');

            $('#hidHoSoId').val(hosoId);

            tedu.notify(hosoId, "success");

            LoadAddEditHoSoNoHopDong(hosoId);      

            $('#modal-add-edit-HopDong').modal('show');
        });

        //$("#btn-create").on('click', function () {
        //    resetFormHopDong();

        //    $('#modal-add-edit-HopDong').modal('show');            
        //});

    }

    function resetFormHopDong() {
        resetHopDong();       
    }

    function resetHopDong() {        
        var tungay = tedu.getFormattedDate(new Date());
        $('#txtTuNgayHieuLuc').val(tungay);

        var denngay = tedu.getFormattedDate(new Date());
        $('#txtDenNgayHieuLuc').val(denngay);

        $('#ddlLoaiHopDong')[0].selectedIndex = 0;
        $('#ddlDieuKienKhac')[0].selectedIndex = 0;
       
    }   

    function disabledHopDong(para) {
        $('#txtTuNgayHieuLuc').prop('disabled', para);
        $('#txtDenNgayHieuLuc').prop('disabled', para);
    }

    function formMainvalidate() {
        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );  
    }

    function loadData() {
        loadLoaiHopDong();
        loadDieuKienTim();
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/hopdong/DieuKienGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenDieuKien + "</option>";
                });
                $('#ddlDieuKienKhac').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });
    }    

    function loadLoaiHopDong() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/LoaiHopDongGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiHopDong + "</option>";
                });
                $('#ddlLoaiHopDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
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

    function LoadTableHopDong(isPageChanged) {
        var template = $('#table-HopDong').html();
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
            url: '/admin/hopdong/GetListHopDong',
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
                            TenPhong: item.TenPhong,        
                            TenChucVu: item.TenChucVu,

                            SoHopDong: item.SoHopDong,
                            TenLoaiHopDong: item.TenLoaiHopDong,
                            HeSoLuong: item.HeSoLuong,
                            LuongCoBan: item.LuongCoBan,
                            NgayHieuLuc: tedu.getFormattedDate(item.LuongCoBan),
                            NgayHetHan: tedu.getFormattedDate(item.NgayHetHan),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)                           
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',                         
                            // Price: tedu.formatNumber(item.Price, 0),
                            
                        });
                    });
                }

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentHopDong').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPaging(response.Result.RowCount, function () {
                        LoadTableHopDong();
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
    function wrapPaging(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHopDong a').length === 0 || changePageSize === true) {
            $('#paginationULHopDong').empty();
            $('#paginationULHopDong').removeData("twbs-pagination");
            $('#paginationULHopDong').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHopDong').twbsPagination({
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

    function LoadTableHoSo() {
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
                page: 1,
                pageSize: 1000
            },
            url: '/admin/hoso/GetHoSoNoHopDong',
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
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,

                            //SoHopDong: item.SoHopDong,
                            //TenLoaiHopDong: item.TenLoaiHopDong,
                            //HeSoLuong: item.HeSoLuong,
                            //LuongCoBan: item.LuongCoBan,
                            //NgayHieuLuc: tedu.getFormattedDate(item.LuongCoBan),
                            //NgayHetHan: tedu.getFormattedDate(item.NgayHetHan),

                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            
                        });
                    });
                }

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentHopDong').html(render);
                }
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function LoadAddEditHopDong(hopdongid) {
        resetHopDongChiTiet();

        LoadHopDongCu(hopdongid);        
    }

    function LoadAddEditHoSoNoHopDong(hosoid) {
        resetHopDongChiTiet();
    }

    function LoadHopDongCu(hopdongid) {
        $.ajax({
            type: "GET",
            url: "/Admin/hopdong/GetAllHopDongId",
            data: { hopdongId: hopdongid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetHopDongChiTiet();
                }
                else {
                    var hopdong = response.Result.Results[0];                    

                    $('#txtHoTenChiTiet').val(hopdong.Ten);
                    $('#txtTenPhongChiTiet').val(hopdong.TenPhong);

                    $('#txtSoHopDong').val(hopdong.SoHopDong);
                    $('#ddlLoaiHopDongChiTietCu').val(hopdong.HopDongDanhMucId);
                    $('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong));
                    $('#txtNgayHopDong').val(tedu.getFormattedDate(hopdong.NgayHopDong));
                    $('#txtNgayHieuLuc').val(tedu.getFormattedDate(hopdong.NgayHieuLuc));
                    $('#txtNgayHetHan').val(tedu.getFormattedDate(hopdong.NgayHetHan));
                    $('#ddlChucVuKyHopDongChiTietCu').val(hopdong.ChucVuNhanVienId); // chuc vu nhan vien lay he so luong can ban bac 1

                    $('#txtTenKyHopDongCu').val(hopdong.TenNguoiKyHopDong);

                    $('#hidHeSoLuongDanhMucCuId').val(hopdong.HeSoLuongDanhMucId);
                    $('#txtHeSoLuongCoBan').val(hopdong.HeSoLuong);
                    $('#txtLuongCoBan').val(hopdong.LuongCoBan);

                    //$('#txtSoHopDong').val(hopdong.SoHopDong); 
                    //$('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong)); 

                    var hosoId = hopdong.HoSoNhanVienId;
                    LoadTableHopDongChiTiet(hosoId);

                    $('#hidHopDongNhanVienCuId').val(hopdong.Id);
                    $('#hidHoSoId').val(hosoId);
                } 

                //$('#ckStatusM').prop('checked', data.Status === 1);     
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
        
    }

    function resetHopDongChiTiet() {
        $('#txtSoHopDong').val('');
        $('#ddlLoaiHopDongChiTietCu')[0].selectedIndex = 1;
        $('#txtNgayKyHopDong').val('');
        $('#txtNgayHopDong').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');
        $('#ddlChucVuKyHopDongChiTietCu')[0].selectedIndex = 1;
        $('#txtTenKyHopDongCu').val('');
        $('#txtHeSoLuongCoBan').val('');
        $('#txtLuongCoBan').val('');

        $('#txtSoHopDongMoi').val('');
        $('#ddlLoaiHopDongChiTietMoi')[0].selectedIndex = 1;
        $('#txtNgayKyHopDongMoi').val('');
        $('#txtNgayHopDongMoi').val('');
        $('#txtNgayHieuLucMoi').val('');
        $('#txtNgayHetHanMoi').val('');
        $('#ddlChucVuKyHopDongChiTietMoi')[0].selectedIndex = 1;
        $('#txtTenKyHopDongMoi').val('');
        $('#txtHeSoLuongCoBanMoi').val('');
        $('#txtLuongCoBanMoi').val('');
    }

    function LoadTableHopDongChiTiet(hosoid) {
        var template = $('#table-HopDongChiTiet').html();
        var render = "";   

        $.ajax({
            type: 'GET',
            data: {
                hosoId: hosoid
            },
            url: '/admin/hopdong/GetAllHoSoHopDongId',
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
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,

                            SoHopDong: item.SoHopDong,
                            TenLoaiHopDong: item.TenLoaiHopDong,
                            HeSoLuong: item.HeSoLuong,
                            LuongCoBan: item.LuongCoBan,
                            NgayHieuLuc: tedu.getFormattedDate(item.LuongCoBan),
                            NgayHetHan: tedu.getFormattedDate(item.NgayHetHan),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)    
                        });
                    });
                }

                $('#lbl-total-recordsHopDongChiTiet').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentHopDongChiTiet').html(render);
                }

                //if (response.Result.RowCount !== 0) {
                //    wrapPaging(response.Result.RowCount, function () {
                //        LoadTableHopDongChiTiet();
                //    },
                //        isPageChanged);
                //}
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    } 

    function LoadTableInHopDong() {

    }



}