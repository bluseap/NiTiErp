﻿var chiphiController = function () {

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
            resetFormAddEditChiPhi();
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

        $('#btnXuatExcelChiPhi').on('click', function () {
            tedu.notify('Xuất excel.', 'success');
        });          

    }

    function resetFormAddEditChiPhi() {      
        $('#hidChiPhiKhoiTaoId').val('0');
        $('#hidInsertChiPhiKhoiTaoId').val('');
        $('#hidKhoaSoLuongThangDotIn').val('');

        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;        
        $('#ckAddEditChuyenKySau').prop('checked', false);

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

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlAddEditKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlAddEditKhuVuc")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());

                loadLuongDotInKy($("#ddlKhuVuc").val());

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
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
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

}