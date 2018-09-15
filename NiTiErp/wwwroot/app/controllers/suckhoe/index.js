var suckhoeController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditSucKhoe = new addeditsuckhoeController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditSucKhoe.initialize();

        loadData();
    }

    function registerEvents() {

        $('body').on('click', '.btn-deleteSucKhoe', function (e) {
            e.preventDefault();

            $('#hidInsertSucKhoeId').val(3); // delete

            var suckhoeId = $(this).data('id');

            //$('#hidSucKhoeId').val(suckhoeId);

            loadDeleteSucKhoe(suckhoeId);            

        });

        $("#btnXuatExcelSucKhoe").on('click', function (e) {
            e.preventDefault();
            XuatExcelSucKhoe(e);
        });

        $("#btnSaveSucKhoe").on('click', function (e) {            
            btnSaveSucKhoe(e);
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditSucKhoe();

            //$('#hidInsertSucKhoeId').val(1); // insert

            $('#modal-add-edit-SucKhoe').modal('show');             

            $('#frmMainSucKhoe').hide();

            $('#table-responsiveHoSoSucKhoe').show();            

        });

        $('body').on('click', '.btn-editSucKhoe', function (e) {
            e.preventDefault();

            $('#hidInsertSucKhoeId').val(2); // update

            var suckhoeId = $(this).data('id');

            $('#hidSucKhoeId').val(suckhoeId);

            loadEditSucKhoe(suckhoeId);

            $('#modal-add-edit-SucKhoe').modal('show');

            $('#frmMainSucKhoe').show();

            $('#table-responsiveHoSoSucKhoe').hide();         

        });

        $('body').on('click', '.btn-editHoSoSucKhoe', function (e) {
            e.preventDefault();

            $('#hidInsertSucKhoeId').val(1); // insert

            var hosoId = $(this).data('id');

            $('#hidSucKhoeId').val('0');
            $('#hidHoSoNhanVienId').val(hosoId);

            loadHoSoSucKhoe(hosoId);

            $('#frmMainSucKhoe').show();

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableSucKhoe();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableSucKhoe();
            }
        });

        $("#ddl-show-pageSucKhoe").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableSucKhoe(true);
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlKhuVucAddEdit').on('change', function () {
            var corporationId = $('#ddlKhuVucAddEdit').val();
            loadPhongKhuVucAddEdit(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);              
                $('#ddlKhuVucAddEdit').html(render);   

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);   
                    $('#ddlKhuVucAddEdit').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);     
                    $('#ddlKhuVucAddEdit').prop('disabled', false);   
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;  
                $("#ddlKhuVucAddEdit")[0].selectedIndex = 1;  

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                loadPhongKhuVucAddEdit($("#ddlKhuVucAddEdit").val());

                loadTableSucKhoe();

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
                var render = "<option value='%' >-- Tất cả --</option>";
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

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();

        $('#txtNamKham').val(namNow);
        $('#txtAddEditNamKham').val(namNow);

        loadPhanLoaiSucKhoe();
        loadDieuKienTim();
    }

    function loadPhanLoaiSucKhoe() {
        $.ajax({
            type: 'GET',
            url: '/admin/suckhoe/PhanLoaiSucKhoe',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhanLoaiSucKhoe + "</option>";
                });
                $('#ddlPhanLoaiSucKhoe').html(render);                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có phân loại sức khỏe.', 'error');
            }
        });
    }

    function loadDieuKienTim() {
        $.ajax({
            type: 'GET',
            url: '/admin/suckhoe/DieuKienSucKhoe',
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

    function loadTableSucKhoe(isPageChanged) {
        var template = $('#table-SucKhoe').html();
        var render = "";

        var namkham = $('#txtNamKham').val();
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                namKham: namkham,
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/suckhoe/GetListSucKhoe',
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
                            NamKham: item.NamKham,
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,                            
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            GioiTinh: tedu.getGoiTinh(item.GioiTinh),
                            CanNang: item.CanNang,
                            ChieuCao: item.ChieuCao,
                            HuyetAp: item.HuyetAp,
                            Mat: item.Mat,
                            TaiMuiHong: item.TaiMuiHong,
                            RangHamMat: item.RangHamMat,
                            SieuAmVungBung: item.SieuAmVungBung,
                            XQTimPhoi: item.XQTimPhoi,
                            DoDienTim: item.DoDienTim,
                            PhuKhoa: item.PhuKhoa,
                            PhetTBAmDao: item.PhetTBAmDao,
                            CongThucMau: item.CongThucMau,
                            TPTNT: item.TPTNT,
                            GlucoDuong: item.GlucoDuong,
                            NhomMau: item.NhomMau,
                            PhanLoaiSucKhoe: item.PhanLoaiSucKhoe,
                            TenBenh: item.TenBenh,
                            HuongDieuTri: item.HuongDieuTri,
                            
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblSucKhoeTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentSucKhoe').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingSucKhoe(response.Result.RowCount, function () {
                        loadTableSucKhoe();
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
    function wrapPagingSucKhoe(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);        
        if ($('#paginationULSucKhoe a').length === 0 || changePageSize === true) {
            $('#paginationULSucKhoe').empty();
            $('#paginationULSucKhoe').removeData("twbs-pagination");
            $('#paginationULSucKhoe').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoSucKhoe').twbsPagination({
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

    function resetFormAddEditSucKhoe() {
        $('#hidSucKhoeId').val('0');
        $('#hidHoSoNhanVienId').val('0');
        $('#hidInsertSucKhoeId').val('0'); 

        //$('#txtAddEditNamKham').val('');
        $('#txtAddEditHoTen').val('');
        $('#txtAddEditPhongTo').val('');
        $('#txtAddEditCanNang').val('');
        $('#txtAddEditChieuCao').val('');
        $('#txtAddEditHuyetAp').val('');
        $('#txtAddEditMat').val('');
        $('#txtAddEditTaiMuiHong').val('');
        $('#txtAddEditRangHamMat').val('');
        $('#txtAddEditSieuAmVungBung').val('');
        $('#txtAddEditXQTimPhoi').val('');
        $('#txtAddEditDoDienTim').val('');
        $('#txtAddEditPhuKhoa').val('');
        $('#txtAddEditPhetTBAmDao').val('');
        $('#txtAddEditCongThucMau').val('');
        $('#txtAddEditTPTNT').val('');
        $('#txtAddEditGlucoDuong').val('');
        $('#txtAddEditNhomMau').val('');
        $('#ddlPhanLoaiSucKhoe')[0].selectedIndex = 0;
        $('#txtAddEditTenBenh').val('');
        $('#txtAddEditHuongDieuTri').val('');

    }

    function loadHoSoSucKhoe(hosoid) {
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

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }
    
    function btnSaveSucKhoe(e) {
        e.preventDefault();

        var suckhoeId = $('#hidSucKhoeId').val();
        var hosoId = $('#hidHoSoNhanVienId').val();
        var insertsuckhoeId = $('#hidInsertSucKhoeId').val();

        var namkham = $('#txtAddEditNamKham').val();

        var cannang = $('#txtAddEditCanNang').val();
        var chieucao = $('#txtAddEditChieuCao').val();
        var huyetap = $('#txtAddEditHuyetAp').val();
        var mat = $('#txtAddEditMat').val();
        var taimauihong = $('#txtAddEditTaiMuiHong').val();
        var ranghammat = $('#txtAddEditRangHamMat').val();
        var sieuamvungbung = $('#txtAddEditSieuAmVungBung').val();
        var xqtimphoi = $('#txtAddEditXQTimPhoi').val();
        var dodientim = $('#txtAddEditDoDienTim').val();
        var phukhoa = $('#txtAddEditPhuKhoa').val();
        var phetamdao = $('#txtAddEditPhetTBAmDao').val();
        var congthucmau = $('#txtAddEditCongThucMau').val();
        var tptnt = $('#txtAddEditTPTNT').val();
        var glucoduong = $('#txtAddEditGlucoDuong').val();
        var nhommau = $('#txtAddEditNhomMau').val();
        var phanloaisuckhoeid = $('#ddlPhanLoaiSucKhoe').val();
        var tenbenh = $('#txtAddEditTenBenh').val();
        var huongdieutri = $('#txtAddEditHuongDieuTri').val();      
        //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());        

        $.ajax({
            type: "POST",
            url: "/Admin/suckhoe/AddUpdateSucKhoe",
            data: {
                Id: suckhoeId,
                HoSoNhanVienId: hosoId,
                InsertUpdateSucKhoeId: insertsuckhoeId,
                NamKham: namkham,             
                CanNang: cannang,
                ChieuCao: chieucao,
                HuyetAp: huyetap,
                Mat: mat,
                TaiMuiHong: taimauihong,
                RangHamMat: ranghammat,
                SieuAmVungBung: sieuamvungbung,
                XQTimPhoi: xqtimphoi,
                DoDienTim: dodientim,
                PhuKhoa: phukhoa,
                PhetTBAmDao: phetamdao,
                CongThucMau: congthucmau,
                TPTNT: tptnt,
                GlucoDuong: glucoduong,
                NhomMau: nhommau,
                PhanLoaiSucKhoeId: phanloaisuckhoeid,
                TenBenh: tenbenh,
                HuongDieuTri: huongdieutri
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
                    tedu.notify('Tạo hồ sơ sức khỏe nhân viên.', 'success');

                    loadTableSucKhoe(true);

                    $('#modal-add-edit-SucKhoe').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu hồ sơ sức khỏe nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadEditSucKhoe(suckhoeid) {
        $.ajax({
            type: "GET",
            url: "/Admin/suckhoe/GetSucKhoeId",
            data: { suckhoeId: suckhoeid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var suckhoe = response.Result.Results[0];

                $('#hidSucKhoeId').val(suckhoe.Id);
                $('#hidHoSoNhanVienId').val(suckhoe.HoSoNhanVienId);

                loadHoSoSucKhoe(suckhoe.HoSoNhanVienId);

                $('#txtAddEditCanNang').val(suckhoe.CanNang);
                $('#txtAddEditChieuCao').val(suckhoe.ChieuCao);
                $('#txtAddEditHuyetAp').val(suckhoe.HuyetAp);
                $('#txtAddEditMat').val(suckhoe.Mat);
                $('#txtAddEditTaiMuiHong').val(suckhoe.TaiMuiHong);
                $('#txtAddEditRangHamMat').val(suckhoe.RangHamMat);
                $('#txtAddEditSieuAmVungBung').val(suckhoe.SieuAmVungBung);
                $('#txtAddEditXQTimPhoi').val(suckhoe.XQTimPhoi);
                $('#txtAddEditDoDienTim').val(suckhoe.DoDienTim);
                $('#txtAddEditPhuKhoa').val(suckhoe.PhuKhoa);
                $('#txtAddEditPhetTBAmDao').val(suckhoe.PhetTBAmDao);
                $('#txtAddEditCongThucMau').val(suckhoe.CongThucMau);
                $('#txtAddEditTPTNT').val(suckhoe.TPTNT);
                $('#txtAddEditGlucoDuong').val(suckhoe.GlucoDuong);
                $('#txtAddEditNhomMau').val(suckhoe.NhomMau);
                $('#ddlPhanLoaiSucKhoe').val(suckhoe.PhanLoaiSucKhoeId);
                $('#txtAddEditTenBenh').val(suckhoe.TenBenh);
                $('#txtAddEditHuongDieuTri').val(suckhoe.HuongDieuTri);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadDeleteSucKhoe (suckhoeid) {
        var insersuckhoe = $('#hidInsertSucKhoeId').val(); // 3
        //tedu.notify(inserkhenthuong);

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/suckhoe/DeleteSucKhoe",
                data: {
                    Id: suckhoeid,
                    InsertUpdateSucKhoeId: insersuckhoe // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();

                    $('#hidInsertSucKhoeId').val(0);

                    loadTableSucKhoe(true);
                },
                error: function (status) {
                    tedu.notify('Xóa Sức khỏe lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function XuatExcelSucKhoe(e) {
        var nam = $('#txtNamKham').val();
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();
        var dieukien = $('#ddlDieuKienKhac').val();    

        $.ajax({
            type: 'POST',
            url: '/admin/suckhoe/ExportExcelSucKhoe',
            data: {
                namkham: nam,
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                dieukienkhac: dieukien
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

    //loadDeleteSucKhoe(suckhoeid){
    //    var insertsuckhoeid = $('#hidInsertSucKhoeId').val(); // delete

    //    tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
    //        $.ajax({
    //            type: "POST",
    //            url: "/Admin/suckhoe/DeleteSucKhoe",
    //            data: {
    //                Id: suckhoeid,
    //                InsertUpdateSucKhoeId: insertsuckhoeid // 3
    //            },
    //            dataType: "json",
    //            beforeSend: function () {
    //                tedu.startLoading();
    //            },
    //            success: function (response) {
    //                tedu.notify('Xóa thành công', 'success');
    //                tedu.stopLoading();

    //                $('#hidInsertSucKhoeId').val(0);

    //                loadTableSucKhoe(true);
    //            },
    //            error: function (status) {
    //                tedu.notify('Xóa Sức khỏe nhân viên lỗi! Kiểm tra lại.', 'error');
    //                tedu.stopLoading();
    //            }
    //        });
    //    });

    //}



}