var chiphiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditChiPhi = new addeditchiphiController();

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();

        addeditChiPhi.initialize();
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {
            //resetFormAddEditChiPhi();
            $('#hidInsertChiPhiKhoiTaoId').val(1); // insert
            $('#modal-add-edit-ChiPhi').modal('show');
        });    

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        }); 

        $('#btnTimNhanVien').on('click', function () {          
            loadTableChiPhiLuongTangGiam();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {            
            loadTableChiPhiLuongTangGiam();
        });

        $("#ddl-show-pageChiPhi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChiPhiLuongTangGiam(true);
        });

        $('body').on('click', '.btn-editChiPhi', function (e) {
            e.preventDefault();           

            $('#hidInsertChiPhiTangGiamId').val(2); // update         

            var chiphitanggiamid = $(this).data('id');

            $('#hidChiPhiTangGiamId').val(chiphitanggiamid);

            loadChiPhiTangGiam(chiphitanggiamid);
            
        });

        $('#btnSaveChiPhiSoTien').on('click', function () {  
            SaveChiPhiSoTien();
        });

        $('#btnXuatExcelChiPhi').on('click', function () {            
            ExportExcel();
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
                $('#ddlChiPhiDanhSachTrucKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlAddEditKhuVuc').prop('disabled', true);
                    $('#ddlChiPhiDanhSachTrucKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlAddEditKhuVuc').prop('disabled', false);
                    $('#ddlChiPhiDanhSachTrucKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlAddEditKhuVuc")[0].selectedIndex = 1;
                $("#ddlChiPhiDanhSachTrucKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());

                loadLuongDotInKy($("#ddlKhuVuc").val());

                loadPhongKhuVucChiPhiDanhSach($("#ddlChiPhiDanhSachTrucKhuVuc").val());

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVucChiPhiDanhSach(makhuvuc) {
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
                $('#ddlChiPhiDanhSachTrucPhongBan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
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

    function loadLuongDotInKy(corporationId) {
        $.ajax({
            type: 'GET',
            url: '/admin/congngay/LuongDotInGetList',
            data: { makv: corporationId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenDotIn + "</option>";
                });
                $('#ddlLuongDotIn').html(render);
                $('#ddlLuongDotIn')[0].selectedIndex = 1;

                $('#ddlAddEditDotIn').html(render);
                $('#ddlAddEditDotIn')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có đợt in lương.', 'error');
            }
        });
    }

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();
        var thangNow = newdate.getMonth() + 1;

        $('#txtNam').val(namNow);
        $('#txtAddEditNam').val(namNow);
        loadThang(thangNow);
        loadAddEditThang(thangNow);

        loadDieuKienTim();   

        loadChiPhiDanhMuc();

        //var ischiphitang = [{ value: "%", ten: "-- Chọn chi phí --" }, { value: "1", ten: "CP Tăng" }, { value: "2", ten: "CP Giảm" }];
        //var render = "";
        //for (var i = 0; i < ischiphitang.length; i++) {
        //    render += "<option value='" + ischiphitang[i].value + "'>" + ischiphitang[i].ten + "</option>";
        //}
        //$('#ddlIsChiPhiTang').html(render);        
    }

    function loadThang(thangnow) {
        var render;

        render += "<option value='1'>Tháng 01 </option>";
        render += "<option value='2'>Tháng 02 </option>";
        render += "<option value='3'>Tháng 03 </option>";
        render += "<option value='4'>Tháng 04 </option>";
        render += "<option value='5'>Tháng 05 </option>";
        render += "<option value='6'>Tháng 06 </option>";
        render += "<option value='7'>Tháng 07 </option>";
        render += "<option value='8'>Tháng 08 </option>";
        render += "<option value='9'>Tháng 09 </option>";
        render += "<option value='10'>Tháng 10 </option>";
        render += "<option value='11'>Tháng 11 </option>";
        render += "<option value='12'>Tháng 12 </option>";

        $('#ddlThang').html(render);
        $('#ddlThang').val(thangnow);        
    }

    function loadAddEditThang(thangnow) {
        var render;

        render += "<option value='1'>Tháng 01 </option>";
        render += "<option value='2'>Tháng 02 </option>";
        render += "<option value='3'>Tháng 03 </option>";
        render += "<option value='4'>Tháng 04 </option>";
        render += "<option value='5'>Tháng 05 </option>";
        render += "<option value='6'>Tháng 06 </option>";
        render += "<option value='7'>Tháng 07 </option>";
        render += "<option value='8'>Tháng 08 </option>";
        render += "<option value='9'>Tháng 09 </option>";
        render += "<option value='10'>Tháng 10 </option>";
        render += "<option value='11'>Tháng 11 </option>";
        render += "<option value='12'>Tháng 12 </option>";

        $('#ddlAddEditThang').html(render);
        $('#ddlAddEditThang').val(thangnow);
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphi/DieuKienGetList',
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
                tedu.notify('Không có danh chi phí lương.', 'error');
            }
        });
    }

    function loadChiPhiDanhMuc() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ListChiPhi',
            data: {
                corporationId: "%",
                keyword: "%",
                IsChiPhiTang: "True",
                page: 1,
                pageSize: 1000
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Tất cả ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChiPhi + "</option>";
                });
                $('#ddlChiPhiDanhMuc').html(render);
                $('#ddlAddEditLoaiChiPhi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh chi phí lương.', 'error');
            }
        });
    }

    function loadTableChiPhiLuongTangGiam(isPageChanged) {
        var template = $('#table-ChiPhi').html();
        var render = "";

        var nammoi = $('#txtNam').val();
        var thangmoi = $('#ddlThang').val();   
        var makv = $('#ddlKhuVuc').val();  
        var maphong = $('#ddlPhongBan').val();  
        var chiphiidmoi = $('#ddlChiPhiDanhMuc').val();  
        var dotin = $('#ddlLuongDotIn').val();  

        $.ajax({
            type: 'GET',
            data: {
                nam: nammoi,
                thang: thangmoi,
                corporationId: makv,
                phongdanhmucId: maphong,
                keyword: "%",
                chiphiid: chiphiidmoi,
                IsChiPhiTang: "True",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/chiphi/ChiPhiLuongGetList',
            dataType: 'json',
            success: function (response) {                
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $('#hidFormThang').val(thangmoi);
                    $('#hidFormNam').val(nammoi);
                    $('#hidChiPhiId').val(chiphiidmoi);
                    $('#hidMaKhuVucId').val(makv);
                    $('#hidDotInId').val(dotin);

                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            HoSoNhanVienId: item.HoSoNhanVienId,
                            KyChiPhi: item.KyChiPhi,
                            TenNhanVien: item.TenNhanVien,
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChiPhi: item.TenChiPhi,
                            TongTienChiPhi: tedu.formatNumberKhongLe(item.TongTienChiPhitangGiam)
                            //IsChiPhiTang: item.IsChiPhiTang === true ? 'Tăng' : 'Giảm',                            
                            //CreateDate: tedu.getFormattedDate(item.CreateDate),
                            //Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lblChiPhiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChiPhi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingChiPhi(response.Result.RowCount, function () {
                        loadTableChiPhiLuongTangGiam();
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
    function wrapPagingChiPhi(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        if ($('#paginationULChiPhi a').length === 0 || changePageSize === true) {
            $('#paginationULChiPhi').empty();
            $('#paginationULChiPhi').removeData("twbs-pagination");
            $('#paginationULChiPhi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChiPhi').twbsPagination({
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

    function loadChiPhiTangGiam(chiphitanggiamid) {
        var thangform = $('#hidFormThang').val();
        var namform = $('#hidFormNam').val();
        var chiphiform = $('#hidChiPhiId').val();        

        $.ajax({
            type: 'GET',
            data: {
                Id: chiphitanggiamid,
                nam: namform,
                thang: thangform,
                corporationId: '%',
                phongdanhmucId: '%',
                keyword: "%",
                chiphiid: chiphiform,
                IsChiPhiTang: "True",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/chiphi/ChiPhiLuongId',
            dataType: 'json',
            success: function (response) {
                var chiphitanggiam = response.Result.Results[0];

                $('#txtChiPhiSoTienSoTien').val('');

                if (response.Result.Results.length === 0) {
                    tedu.notify("Không có dữ liệu.", "error");
                }
                else {
                    //tedu.notify("ok ok","success");
                    $.ajax({
                        type: "GET",
                        url: "/Admin/chiphidm/GetChiPhiId",
                        data: { chiphiId: chiphiform },
                        dataType: "json",
                        beforeSend: function () {
                            tedu.startLoading();
                        },
                        success: function (response) {
                            var chiphi = response.Result.Results[0];

                            if (chiphi.ChiPhiBangDanhMucId === 1) {
                                //tedu.notify("ok ok222", "success");
                                $('#hidInsertChiPhiTangGiamId').val(2); // update chi phi luong tang giam

                                $('#hidFormHoSoId').val(chiphitanggiam.HoSoNhanVienId);
                                $('#hidChiPhiTangGiamId').val(chiphitanggiam.Id);

                                $('#txtChiPhiSoTienHoTen').val(chiphitanggiam.TenNhanVien);
                                $('#txtChiPhiSoTienSoTien').val(chiphitanggiam.TongTienChiPhitangGiam);                                

                                $('#modal-add-edit-ChiPhiSoTien').modal('show');
                            }
                            else {
                                tedu.notify("Chi phí không được sửa. Kiểm tra lại.", "error");
                            }

                            tedu.stopLoading();
                        },
                        error: function (status) {
                            tedu.notify('Có lỗi xảy ra', 'error');
                            tedu.stopLoading();
                        }
                    });
                }                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function SaveChiPhiSoTien() {       

        var insertchiphitanggiam = $('#hidInsertChiPhiTangGiamId').val(); 

        var thangform = $('#hidFormThang').val();
        var namform = $('#hidFormNam').val();
        var chiphiform = $('#hidChiPhiId').val();

        var chiphitanggiamid = $('#hidChiPhiTangGiamId').val();
        var hosoid = $('#hidFormHoSoId').val();
        var sotienchiphi = $('#txtChiPhiSoTienSoTien').val(); 

        var makhuvuc = $('#hidMaKhuVucId').val();
        var dotin = $('#hidDotInId').val();

        $.ajax({
            type: 'GET',
            url: '/admin/khoaso/GetLockLuongKyId',
            data: {
                makhuvuc: makhuvuc,
                thang: thangform,
                nam: namform,
                dotinluongid: dotin
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                lockluong = response.Result[0];

                if (response.Result.length === 0) {
                    tedu.notify("Kỳ này chưa khởi tạo. Kiểm tra lại.", "error");
                }
                else {
                    if (lockluong.IsLockLuongDotInKy === "False") {
                        //tedu.notify("ookokokokok.", "success");
                        $.ajax({
                            type: "POST",
                            url: "/Admin/chiphi/AddUpdateChiPhiTangGiam",
                            data: {
                                Id: chiphitanggiamid,
                                InsertChiPhiTangGiamId: insertchiphitanggiam,
                                Nam: namform,
                                Thang: thangform,
                                HoSoNhanVienId: hosoid,
                                ChiPhiId: chiphiform,
                                TongTienChiPhitangGiam: sotienchiphi
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
                                    loadTableChiPhiLuongTangGiam();
                                    tedu.notify('Khởi tạo chi phí thành công.', 'success');    
                                    $('#modal-add-edit-ChiPhiSoTien').modal('hide');  
                                    tedu.stopLoading();
                                }
                            },
                            error: function () {
                                tedu.notify('Lỗi khởi tạo chi phí.', 'error');
                                tedu.stopLoading();
                            }
                        });
                    }
                    else if (lockluong.IsLockLuongDotInKy === "True") {
                        tedu.notify('Lương tháng đã khóa sổ. Kiểm tra lại.', 'error');
                    }
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Khóa sổ lương tháng đợt in.', 'error');
            }
        });

    }

    function ExportExcel() {
        var nammoi = $('#txtNam').val();
        var thangmoi = $('#ddlThang').val();
        var makv = $('#ddlKhuVuc').val();
        var maphong = $('#ddlPhongBan').val();
        var chiphiidmoi = $('#ddlChiPhiDanhMuc').val();
        var dotin = $('#ddlLuongDotIn').val();  

        var dieukien = $('#ddlDieuKienKhac').val();

        if (chiphiidmoi === '5') { // chi phi hieu qua kinh doanh
            $.ajax({
                type: 'POST',
                url: '/admin/chiphi/ExportExcelChiPhi',
                data: {
                    CorporationId: makv,
                    Nam: nammoi,
                    Thang: thangmoi,
                    PhongDanhMucId: maphong,
                    ChiPhiId: chiphiidmoi,
                    DotInId: dotin,
                    DieuKienId: dieukien
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

        if (chiphiidmoi === '4') { // chi phi tien an giua ca
            $.ajax({
                type: 'POST',
                url: '/admin/chiphi/ExportExcelChiPhiAn',
                data: {
                    CorporationId: makv,
                    Nam: nammoi,
                    Thang: thangmoi,
                    PhongDanhMucId: maphong,
                    ChiPhiId: chiphiidmoi,
                    DotInId: dotin,
                    DieuKienId: dieukien
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

               
    }

}