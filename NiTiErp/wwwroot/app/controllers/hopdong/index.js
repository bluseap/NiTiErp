var hopdongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditHopDong = new AddEditHopDong();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditHopDong.initialize(); 

        //loadBtnDanhSachHetHanHopDong();
        //loadBtnGanDanhSachHetHanHopDong();
    }

    function registerEvents() {    

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#txtTuNgayHieuLuc, #txtDenNgayHieuLuc').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        disabledHopDong(true);
   
        //formMainValidate();

        $('body').on('click', '.btnNhapHopDongNhanVien', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

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
            TimHopDong();           
        });

        $('body').on('click', '.btn-editHopDong', function (e) {
            e.preventDefault();           
           
            $('#hidHopDongId').val(1);
            $('#hidInsertHopDongId').val(0);
            $('#hidHeSoLuongDanhMucId').val(0);

            var hopdongId = $(this).data('id');

            //tedu.notify(hopdongId, "success");

            LoadAddEditHopDong(hopdongId);                  

            $('#modal-add-edit-HopDong').modal('show');  
        });

        $('body').on('click', '.btn-editHoSo', function (e) {
            e.preventDefault();         

            $('#hidHopDongId').val(1); // para update inserst
            $('#hidInsertHopDongId').val(0);

            var hosoId = $(this).data('id');

            $('#hidHoSoId').val(hosoId);

            //tedu.notify(hosoId, "success");

            LoadAddEditHoSoNoHopDong(hosoId);      

            $('#modal-add-edit-HopDong').modal('show');
        });

        $("#ddlLoaiHopDong").on('change', function () {

            $("#ddlDieuKienKhac")[0].selectedIndex = 0;
        });

        $("#ddlDieuKienKhac").on('change', function () {

            $("#ddlLoaiHopDong")[0].selectedIndex = 0;
        });

        $('#btnSaveHopDong').on('click', function (e) {
            SaveHopDongNhanVien(e);
        });

        $('body').on('click', '.btn-editHopDongChiTiet', function (e) {
            e.preventDefault();

            $('#hidHopDongId').val(1);
            $('#hidInsertHopDongId').val(1);

            var hopdongId = $(this).data('id');        

            LoadHopDongChiTietMoi(hopdongId);
        });

        $('body').on('click', '.btn-DSHetHanHopDong', function (e) {
            e.preventDefault();  
            loadTableDanhSachHetHanHopDong(true);
        });

        $('body').on('click', '.btn-DSGanHetHanHopDong', function (e) {
            e.preventDefault();           
            loadTableGanDanhSachHetHanHopDong(true);
        });

        $('#btnXuatExcelHopDong').on('click', function (e) {            
            XuatExcel();
        });

        $('#btnInHopDong').on('click', function (e) {
            tedu.notify("in hop dong","success");
        });        

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
        $('#btnInHopDong').hide();
        $('#btnInHopDongChiTiet').hide();

        var date = new Date();
        $('#txtTuNgayHieuLuc').val(tedu.getFormattedDate(date));
        $('#txtDenNgayHieuLuc').val(tedu.getFormattedDate(date));

        loadLoaiHopDong();
        loadDieuKienTim();
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/congngay/DieuKienGetList',
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
                tedu.notify('Không có Loại hợp đồng.', 'error');
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

                loadBtnDanhSachHetHanHopDong();
                loadBtnGanDanhSachHetHanHopDong();
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
                            NgayHieuLuc: tedu.getFormattedDate(item.NgayHieuLuc),
                            NgayHetHan: tedu.getFormattedDate(item.NgayHetHan),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)                           
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',                         
                            // Price: tedu.formatNumber(item.Price, 0),
                            
                        });
                    });
                }

                $('#ddl-show-pageHopDong').show();
                $('#item-per-pageHopDong').show();

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentHopDong').html(render);
                }

                $('#hidExcelHopDong').val('');
                $('#hidExcelHopDong').val('TimTableHopDong');

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

                $('#ddl-show-pageHopDong').hide();
                $('#item-per-pageHopDong').hide();

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

        var template = $('#table-HopDongChiTiet').html();
        var render = "";        
        render = "<tr><th><a>Không có dữ liệu hợp đồng</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
        $('#tbl-contentHopDongChiTiet').html(render);
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

                    loadChucVuChiTietKhuVuc(hopdong.CorporationId);

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
        $('#txtHoTenChiTiet').val('');
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
        $('#ddlChucVuKyHopDongChiTietMoi')[0].selectedIndex = 0;
        $('#txtTenKyHopDongMoi').val('');
        $('#txtHeSoLuongCoBanMoi').val('');
        $('#txtLuongCoBanMoi').val('');
    }

    function resetHopDongChiTietMoi() {
        $('#txtSoHopDongMoi').val('');
        $('#ddlLoaiHopDongChiTietMoi')[0].selectedIndex = 1;
        $('#txtNgayKyHopDongMoi').val('');
        $('#txtNgayHopDongMoi').val('');
        $('#txtNgayHieuLucMoi').val('');
        $('#txtNgayHetHanMoi').val('');
        $('#ddlChucVuKyHopDongChiTietMoi')[0].selectedIndex = 0;
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

    function SaveHopDongNhanVien(e) {
        e.preventDefault();
        tedu.notify("vao hop dong", "success");

        var hopdongnhanvienidcu = $('#hidHopDongNhanVienCuId').val();
        var hosoid = $('#hidHoSoId').val();
        var hesoluongcu = $('#hidHeSoLuongDanhMucCuId').val();

        var hopdongid = $('#hidHopDongId').val(); //  id = 1 ; para update insert
        var inshopdongid = $('#hidInsertHopDongId').val(); // Id = 0
        var hesoluongid = $('#hidHeSoLuongDanhMucId').val(); // id = 0

        var corporationid = $('#ddlKhuVuc').val();
        var chucvuid = $('#ddlChucVuKyHopDongChiTietMoi').val();

        var sohopdong = $('#txtSoHopDongMoi').val();
        var loaihopdong = $('#ddlLoaiHopDongChiTietMoi').val();
        var ngaykyhopdong = tedu.getFormatDateYYMMDD($('#txtNgayKyHopDongMoi').val());
        var ngayhopdong = tedu.getFormatDateYYMMDD($('#txtNgayHopDongMoi').val());
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucMoi').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanMoi').val());

        var tenkyhopdong = $('#txtTenKyHopDongMoi').val();
        var hesoluongcoban = $('#txtHeSoLuongCoBanMoi').val();
        var luongcoban = $('#txtLuongCoBanMoi').val();

        $.ajax({
            type: "POST",
            url: "/Admin/hopdong/AddUpdateHopDong",
            data: {
                Id: hopdongnhanvienidcu,
                HopDongNhanVienCuId: hopdongnhanvienidcu,

                HoSoNhanVienId: hosoid,
                InsertUpdateId: hopdongid, // = 0
                InsertUpdateHopDongId: inshopdongid, // = 0
                HeSoLuongDanhMucId: hesoluongid,

                CorporationId: corporationid,
                ChucVuNhanVienId: chucvuid,

                SoHopDong: sohopdong,
                HopDongDanhMucId: loaihopdong,
                NgayKyHopDong: ngaykyhopdong,
                NgayHopDong: ngayhopdong,
                NgayHieuLuc: ngayhieuluc,
                NgayHetHan: ngayhethan,
                TenNguoiKyHopDong: tenkyhopdong,
                HeSoLuong: hesoluongcoban,
                LuongCoBan: luongcoban
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success == false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.notify('Hợp đồng nhân viên.', 'success');
                    LoadTableHopDongChiTiet(hosoid);
                    LoadTableHopDong(true);
                    $('#modal-add-edit-HopDong').modal('hide');
                    resetHopDongChiTiet2();
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Hợp đồng nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetHopDongChiTiet2() {
        $('#hidHopDongId').val(0);
        $('#hidInsertHopDongId').val(0);
        $('#hidHeSoLuongDanhMucId').val(0);

        $('#hidHopDongNhanVienCuId').val(0);
        $('#hidHopDongNhanVienMoiId').val(0);
        $('#hidHeSoLuongDanhMucCuId').val(0);
    }

    function LoadHopDongChiTietMoi(hopdongid) {

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
                    resetHopDongChiTietMoi();
                }
                else {
                    var hopdong = response.Result.Results[0];

                    //$('#txtHoTenChiTiet').val(hopdong.Ten);
                    //$('#txtTenPhongChiTiet').val(hopdong.TenPhong);

                    $('#txtSoHopDongMoi').val(hopdong.SoHopDong);
                    $('#ddlLoaiHopDongChiTietMoi').val(hopdong.HopDongDanhMucId);
                    $('#txtNgayKyHopDongMoi').val(tedu.getFormattedDate(hopdong.NgayKyHopDong));
                    $('#txtNgayHopDongMoi').val(tedu.getFormattedDate(hopdong.NgayHopDong));
                    $('#txtNgayHieuLucMoi').val(tedu.getFormattedDate(hopdong.NgayHieuLuc));
                    $('#txtNgayHetHanMoi').val(tedu.getFormattedDate(hopdong.NgayHetHan));
                    $('#ddlChucVuKyHopDongChiTietMoi').val(hopdong.ChucVuNhanVienId); // chuc vu nhan vien lay he so luong can ban bac 1

                    $('#txtTenKyHopDongMoi').val(hopdong.TenNguoiKyHopDong);

                    $('#hidHeSoLuongDanhMucId').val(hopdong.HeSoLuongDanhMucId);
                    $('#txtHeSoLuongCoBanMoi').val(hopdong.HeSoLuong);
                    $('#txtLuongCoBanMoi').val(hopdong.LuongCoBan);

                    //$('#txtSoHopDong').val(hopdong.SoHopDong); 
                    //$('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong)); 

                    var hosoId = hopdong.HoSoNhanVienId;
                    LoadTableHopDongChiTiet(hosoId);

                    $('#hidHopDongNhanVienCuId').val(hopdong.Id);
                    $('#hidHoSoId').val(hosoId);

                    $('#hidHopDongId').val(1);
                    $('#hidInsertHopDongId').val(1);
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

    function loadBtnDanhSachHetHanHopDong() {       
        var date = new Date();

        var makhuvuc = $('#ddlKhuVuc').val();

        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                tungay: tungayId,
                denngay: denngayId                
            },
            url: '/admin/hopdong/GetAllHopDongDate',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    $('#lbl-total-HetHanHopDong').text("0");
                }
                else {
                    var coutHopDong = response.Result.RowCount;

                    $('#lbl-total-HetHanHopDong').text(coutHopDong);
                }               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });                
    }

    function loadTableDanhSachHetHanHopDong(isPageChanged) {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        //tedu.notify(timnhanvien, "success");

        var date = new Date();

        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'GET',
            data: {
                hosoId: hosoid,
                tungay: tungayId,
                denngay: denngayId,

                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hopdong/GetAllHopDongDate',
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

                $('#ddl-show-pageHopDong').hide();
                $('#item-per-pageHopDong').hide();

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                $('#hidExcelHopDong').val('');
                $('#hidExcelHopDong').val('TimTableHetHanHopDong');

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

    function loadBtnGanDanhSachHetHanHopDong() {
        var date = new Date();

        var makhuvuc = $('#ddlKhuVuc').val();
        var hosoid = userCorporationId;
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                tungay: tungayId,
                denngay: denngayId
            },
            url: '/admin/hopdong/GetAllHopDongGanDate',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    $('#lbl-total-GanHetHanHopDong').text("0");
                }
                else {
                    var coutHopDong = response.Result.RowCount;

                    $('#lbl-total-GanHetHanHopDong').text(coutHopDong);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
        //$('#lbl-total-GanHetHanHopDong').text("88");
    }

    function loadTableGanDanhSachHetHanHopDong(isPageChanged) {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        //tedu.notify(timnhanvien, "success");

        var date = new Date();

        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'GET',
            data: {
                hosoId: hosoid,
                tungay: tungayId,
                denngay: denngayId,

                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hopdong/GetAllHopDongGanDate',
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

                $('#ddl-show-pageHopDong').hide();
                $('#item-per-pageHopDong').hide();

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                $('#hidExcelHopDong').val('');
                $('#hidExcelHopDong').val('TimTableGanHetHanHopDong');                

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

    function LoadTableHopDongDieuKien(dieukien) {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        //tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: dieukien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hopdong/GetListHopDongDieuKien',
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

                $('#ddl-show-pageHopDong').hide();
                $('#item-per-pageHopDong').hide();

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                $('#hidExcelHopDong').val('');
                $('#hidExcelHopDong').val('TimTableHopDongDieuKien');

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

    function TimHopDong() {

        //$('#ckCheckAllEdit').prop('checked', true);
        var ischecedFalse = $("#checkTuNgayDenNgay").is(":checked");

        var dieukien = $("#ddlDieuKienKhac").val(); // load tu table DieuKienTim
        var loaihopdong = $("#ddlLoaiHopDong").val(); // Loai hop dong

        var tungayid = $('#txtTuNgayHieuLuc').val();
        var denngayid = $('#txtDenNgayHieuLuc').val();
        
        if (ischecedFalse === false) {  // hiden
            tedu.notify("check false", "success");            
            //tedu.notify(dieukien, "success");

            if (dieukien === "3") { // Chua nhap hop dong
                LoadTableHoSo();
            }
            else if (dieukien === "2") { // Nghi huu status=3
                LoadTableHopDongDieuKien("3");
            }
            else if (dieukien === "1") { // Thoi viec status=2
                LoadTableHopDongDieuKien("2");
            }
            else if (loaihopdong != "%") { // Tim theo loai hop dong
                LoadTableHopDongDieuKienDate(loaihopdong, "0", tungayid, denngayid);
            }
        }
        else { // show
            tedu.notify("check true", "success");           

            if (dieukien === "4") { // Het han hop dong thao ngay
                LoadTableHopDongDieuKienDate("0", "4", tungayid, denngayid);
            }

        }        
    }

    function LoadTableHopDongDieuKienDate(loaihopdongid, dieukienid, tungayid, denngayid) {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        var date = new Date();
        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tungayid);
        var denngayId = tedu.getFormatDateYYMMDD(denngayid);

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: hosoid,              
                
                tungay: tungayId,
                denngay: denngayId,      
                dieukien: dieukienid,
                hopdongId: loaihopdongid
            },
            url: '/admin/hopdong/GetListHopDongDieuKienDate',
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

                $('#ddl-show-pageHopDong').hide();
                $('#item-per-pageHopDong').hide();

                $('#lbl-total-recordsHopDong').text(response.Result.RowCount);

                $('#hidExcelHopDong').val('');
                $('#hidExcelHopDong').val('TimTableHopDongDieuKienDate');

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

    function XuatExcel() {
        //$('#hidExcelHopDong').val('TimTableHopDong');
        var excelHopDong = $('#hidExcelHopDong').val();

        if (excelHopDong === "TimTableHopDong") {
            ExcelHopDongTim();
        }
        else if (excelHopDong === "TimTableHetHanHopDong") {
            ExcelHetHanHopDongTim();
        }   
        else if (excelHopDong === "TimTableGanHetHanHopDong") {
            ExcelGanHetHanHopDongTim();
        } 
        else if (excelHopDong === "TimTableHopDongDieuKien") {
            ExcelHopDongTimDieuKien();
        } 
        else if (excelHopDong === "TimTableHopDongDieuKienDate") {
            ExcelHopDongTimDieuKienDate();
        } 
        
    }

    function ExcelHopDongTimDieuKienDate() {
        var loaihopdong = $("#ddlLoaiHopDong").val(); // Loai hop dong
        var tungayid = $('#txtTuNgayHieuLuc').val();
        var denngayid = $('#txtDenNgayHieuLuc').val();

        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        var date = new Date();
        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tungayid);
        var denngayId = tedu.getFormatDateYYMMDD(denngayid);  

        $.ajax({
            type: 'POST',
            url: '/admin/hopdong/ExportExcelHopDongDieuKienDate',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: hosoid,

                tungay: tungayId,
                denngay: denngayId,
                dieukien: "1",
                hopdongId: loaihopdong
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }

    function ExcelHopDongTimDieuKien() {
        var dieukien = $("#ddlDieuKienKhac").val(); // load tu table DieuKienTim
        var loaihopdong = $("#ddlLoaiHopDong").val(); // Loai hop dong        

        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();       

        $.ajax({
            type: 'POST',
            url: '/admin/hopdong/ExportExcelHopDongDieuKien',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: dieukien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }

    function ExcelGanHetHanHopDongTim() {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();    

        var date = new Date();

        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'POST',
            url: '/admin/hopdong/ExportExcelGanHetHanHopDong',
            data: {
                hosoId: hosoid,
                tungay: tungayId,
                denngay: denngayId,

                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }

    function ExcelHetHanHopDongTim() {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        var date = new Date();

        var hosoid = "1";
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        $.ajax({
            type: 'POST',
            url: '/admin/hopdong/ExportExcelHetHanHopDong',
            data: {
                hosoId: hosoid,
                tungay: tungayId,
                denngay: denngayId,

                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });          
    }

    function ExcelHopDongTim() {
        var template = $('#table-HopDong').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();        

        $.ajax({
            type: 'POST',
            url: '/admin/hopdong/ExportExcelHopDong',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }

    function loadChucVuChiTietKhuVuc(makvmoi) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuNhanVienKhuVuc',
            data: { makv: makvmoi },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuKyHopDongChiTietMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
    }

    function LoadTableInHopDong() {

    }



}