var qdkhenthuongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditKhenThuong = new addeditkhenthuongController();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc(); 
        registerEvents();
        //loadDieuKienTim();
        addeditKhenThuong.initialize(); 
    }

    function registerEvents() {

        $('body').on('click', '.btn-deleteQDKT', function (e) {
            e.preventDefault();

            $('#hidInsertQDKTIdId').val(3); // delete          

            var khenthuongId = $(this).data('id');
            loadDeleteQDKhenThuong(khenthuongId);

        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('body').on('click', '.btnQDKhenThuong', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $("#btn-create").on('click', function () {
          
            resetFormAddEditQDKT();

            $('#hidInsertQDKTIdId').val(1); // insert

            $('#modal-add-edit-QDKT').modal('show');
            
            $('#row-AddEditQDKT').show();    
            $('#tblHoSoNhanVienQDKT').show();  
            $('#row-AddEditQDKT-infoHoSoQDKT').show();    
            
        });

        $('#btnSaveQDKT').on('click', function (e) {
            var insertQDKT = $('#hidInsertQDKTIdId').val(); // update

            if (insertQDKT === "2") {
                UpdateQDKT(e);
            }
            else {
                SaveQDKT(e);
            }
            
        });

        $("#ddl-show-pageQDKT").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableKhenThuong(true);
        });

        $('body').on('click', '.btn-editQDKT', function (e) {
            e.preventDefault();

            $('#hidInsertQDKTIdId').val(2); // update

            var khenthuongId = $(this).data('id');

            $('#hidQDKTId').val(khenthuongId);

            loadKhenThuong(khenthuongId);

            $('#modal-add-edit-QDKT').modal('show');

            $('#row-AddEditQDKT').hide();
            $('#tblHoSoNhanVienQDKT').hide();
            $('#row-AddEditQDKT-infoHoSoQDKT').hide(); 

        });  

        $('#btnTimNhanVien').on('click', function () {
            loadTableKhenThuong();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableKhenThuong();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelQDKT();
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

                loadTableKhenThuong();
               
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
       
    function resetFormAddEditQDKT() {
        $('#hidQDKTId').val('0');
        $('#hidHoSoKhenThuongId').val('0');
        $('#hidInsertQDKTIdId').val('0');

        $('#txtAddEditHoTen').val('');
        $('#txtAddEditPhongTo').val('');
        $('#txtLyDoQuyetDinh').val('');
        $('#ddlLoaiHinhThucKhenThuong')[0].selectedIndex = 0;
        $('#txtTienKhenThuong').val('0');
        $('#txtGhiChuQuyetDinh').val('');
        $('#txtSoQuyetDinh').val('');
        $('#txtNgaKyQuyetDinh').val('');
        $('#txtTenNguoiKyQuyetDinh').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');
        
    }

    function SaveQDKT(e) {
        e.preventDefault();   
        
        var khenthuongId = $('#hidQDKTId').val();
        var hosoId = $('#hidHoSoKhenThuongId').val();
        var insertqdktId = $('#hidInsertQDKTIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuong').val();
        var tienkhenthuong = $('#txtTienKhenThuong').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val()); 
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val()); 
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());        

        $.ajax({
            type: "POST",
            url: "/Admin/qdkhenthuong/AddUpdateQDKhenThuong",
            data: {
                Id: khenthuongId,
                HoSoNhanVienId: hosoId,
                InsertqdktId: insertqdktId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                TienKhenThuong: tienkhenthuong,
                HinhThucKhenThuongId: loaihinhthuckt,
                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan
                
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
                    tedu.notify('Tạo quyết định nhân viên.', 'success');

                    loadTableKhenThuong(true);

                    $('#modal-add-edit-QDKT').modal('hide');                   

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định khen thưởng', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableKhenThuong(isPageChanged) {
        var template = $('#table-QDKT').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
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
            url: '/admin/qdkhenthuong/GetListKhenThuong',
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
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            LyDoQuyetDinh: item.LyDoQuyetDinh,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblQDKTTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentQDKT').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingQDKT(response.Result.RowCount, function () {
                        loadTableKhenThuong();
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
    function wrapPagingQDKT(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULQDKT a').length === 0 || changePageSize === true) {
            $('#paginationULQDKT').empty();
            $('#paginationULQDKT').removeData("twbs-pagination");
            $('#paginationULQDKT').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULQDKT').twbsPagination({
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

    function loadKhenThuong(khenthuongid) {
        $.ajax({
            type: "GET",
            url: "/Admin/qdkhenthuong/GetKhenThuongId",
            data: { khenthuongId: khenthuongid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var khenthuong = response.Result.Results[0];

                $('#hidQDKTId').val(khenthuong.Id);
                $('#hidHoSoKhenThuongId').val(khenthuong.HoSoNhanVienId);

                $('#txtAddEditHoTen').val(khenthuong.Ten);
                $('#txtAddEditPhongTo').val(khenthuong.TenPhong);

                $('#ddlLoaiQuyetDinh').val(khenthuong.LoaiQuyetDinhId);
                $('#txtLyDoQuyetDinh').val(khenthuong.LyDoQuyetDinh);
                $('#ddlLoaiHinhThucKhenThuong').val(khenthuong.HinhThucKhenThuongId);
                $('#txtTienKhenThuong').val(khenthuong.TienKhenThuong);                
                $('#txtGhiChuQuyetDinh').val(khenthuong.GhiChuQuyetDinh);
                $('#txtSoQuyetDinh').val(khenthuong.SoQuyetDinh);
                $('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(khenthuong.NgayKyQuyetDinh));
                $('#txtTenNguoiKyQuyetDinh').val(khenthuong.TenNguoiKyQuyetDinh);
                $('#txtNgayHieuLuc').val(tedu.getFormattedDate(khenthuong.NgayHieuLuc));
                $('#txtNgayHetHan').val(tedu.getFormattedDate(khenthuong.NgayKetThuc)); 

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateQDKT(e) {
        e.preventDefault();

        var khenthuongId = $('#hidQDKTId').val();
        var hosoId = $('#hidHoSoKhenThuongId').val();
        var insertqdktId = $('#hidInsertQDKTIdId').val();

        var loaiquyetdinh = $('#ddlLoaiQuyetDinh').val();
        var lydoqd = $('#txtLyDoQuyetDinh').val();
        var loaihinhthuckt = $('#ddlLoaiHinhThucKhenThuong').val();
        var tienkhenthuong = $('#txtTienKhenThuong').val();
        var ghichuqd = $('#txtGhiChuQuyetDinh').val();
        var soquyetdinh = $('#txtSoQuyetDinh').val();
        var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());
        var tennguoikyquyetdinh = $('#txtTenNguoiKyQuyetDinh').val();
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

        $.ajax({
            type: "POST",
            url: "/Admin/qdkhenthuong/AddUpdateQDKhenThuong",
            data: {
                Id: khenthuongId,
                HoSoNhanVienId: hosoId,
                InsertqdktId: insertqdktId,

                LoaiQuyetDinhId: loaiquyetdinh,
                LyDoQuyetDinh: lydoqd,
                TienKhenThuong: tienkhenthuong,
                HinhThucKhenThuongId: loaihinhthuckt,
                GhiChuQuyetDinh: ghichuqd,
                SoQuyetDinh: soquyetdinh,
                NgayKyQuyetDinh: ngaykyquyetdinh,
                TenNguoiKyQuyetDinh: tennguoikyquyetdinh,
                NgayHieuLuc: ngayhieuluc,
                NgayKetThuc: ngayhethan

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
                    tedu.notify('Tạo quyết định nhân viên.', 'success');

                    loadTableKhenThuong(true);

                    $('#modal-add-edit-QDKT').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quyết định khen thưởng', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelQDKT() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        var that = $('#hidId').val();
        $.ajax({
            type: "POST",
            url: "/Admin/qdkhenthuong/ExportExcel",
            data: {               
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien
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

    function loadDeleteQDKhenThuong(khenthuongid) {
        
        var inserkhenthuong = $('#hidInsertQDKTIdId').val(); // 3
        //tedu.notify(inserkhenthuong);

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/qdkhenthuong/DeleteKhenThuong",
                data: {
                    Id: khenthuongid,
                    InsertqdktId: inserkhenthuong // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();                    

                    $('#hidInsertQDKTIdId').val(0);     

                    loadTableKhenThuong(true);
                },
                error: function (status) {
                    tedu.notify('Xóa Quyết định Khen thưởng lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });

    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/DieuKienGetList',
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
                $('#ddlDieuKienKhac')[0].selectedIndex = 1;           

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });
    }  


}