var daotaodangkyController = function () {

    var tableHoSo = [];
    var tableDaoTaoNhanVien = [];

    this.initialize = function () {
        loadKhuVucDangKy();

        loadDaoTaoDangKyData();

        registerEvents();
    }

    function registerEvents() {

        $('#btnSaveDangKyNhanVien').on('click', function () {
            tedu.notify("save dang ky nhanv ein", "success");
        });
       
        $('#btnExcelDangKyNhanVien').on('click', function () {
            //tedu.notify("xuat excel dang ky nhanv ein", "success");
            XuatExcelDaoTaoNhanVien();
        });

        $('body').on('click', '.btn-editHoSoDaoTaoDangKy', function (e) {
            e.preventDefault();         

            var hosoId = $(this).data('id');

            addDangKyNhanVien(hosoId);
        });

        $('body').on('click', '.btn-AddNhanVienDaoTao', function (e) {
            e.preventDefault();

            resetFormDaoTaoDangKy();

            $('#hidDangKyInserUpdate').val(1); // insert            

            var daotaolopId = $(this).data('id');

            $('#hidDangKyDaoTaoLopId').val(daotaolopId);                        

            loadDaoTaoDangKy(daotaolopId);

            //loadTableDaoTaoDangKy(true);                   

            $('#modal-add-edit-DaoTaoDangKy').modal('show');

        });

        $('#btnTimNhanVienAddEditDangKy').on('click', function () {
            LoadTableHoSo();
        });

        $('#txtTimNhanVienAddEditDangKy').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSo();
            }
        });

        $("#ddl-show-pageHoSoDaoTaoDangKy").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $('body').on('click', '.btn-deleteDangKyDaoTapNhanVien', function (e) {
            e.preventDefault();  

            var daotaonhanvienid = $(this).data("id");
            //tedu.notify(daotaonhanvienid, 'success');

            $.ajax({
                type: "POST",
                url: "/Admin/daotao/DeleteDaoTaoNhanVien",
                data: {
                    Id: daotaonhanvienid
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa Đào tạo Nhân viên lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });

            $(this).closest('tr').remove();    

        });

        $("#ddl-show-pageDangKyDaoTaoNhanVien").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableDaoTaoDangKy(true);
        });
    }

    function resetFormDaoTaoDangKy() {
        $('#hidDaoTaoDangKyId').val(""); 
        $('#hidDangKyDaoTaoNoiId').val(""); 
        $('#hidDangKyDaoTaoLopId').val(""); 
        $('#hidDangKyInserUpdate').val(""); 

        tableHoSo = [];
        tableDaoTaoNhanVien = [];
    }

    function loadKhuVucDangKy() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVucAddEditDangKy').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVucAddEditDangKy').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVucAddEditDangKy').prop('disabled', false);
                }

                $("#ddlKhuVucAddEditDangKy")[0].selectedIndex = 1;

                loadPhongKhuVucDangKy($("#ddlKhuVucAddEditDangKy").val());

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVucDangKy(makhuvuc) {
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
                $('#ddlPhongBanAddEditDangKy').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }
    
    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-HoSoDaoTaoDangKy').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVucAddEditDangKy').val();
        var phongId = $('#ddlPhongBanAddEditDangKy').val();
        var timnhanvien = $('#txtTimNhanVienAddEditDangKy').val();

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

                tableHoSo = response.Result.Results;

                $('#lblHoSoDaoTaoDangKyTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoDaoTaoDangKy').html(render);
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
        if ($('#paginationULHoSoDaoTaoDangKy a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoDaoTaoDangKy').empty();
            $('#paginationULHoSoDaoTaoDangKy').removeData("twbs-pagination");
            $('#paginationULHoSoDaoTaoDangKy').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoDaoTaoDangKy').twbsPagination({
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

    function loadDaoTaoDangKy(daotaolopid) {
        tedu.notify(daotaolopid, "success");
        $.ajax({
            type: "GET",
            url: "/Admin/daotao/GetDaoTaoId",
            data: { daotaolopId: daotaolopid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var daotao = response.Result.Results[0];

                $('#txtDangKyNoiDaoTao').val(daotao.TenTruong);
                $('#txtDangKyLoaiDaoTao').val(daotao.TenLoaiHinhDaoTao);
                $('#txtDangKyLoaiBang').val(daotao.TenLoaiBang);
                $('#txtDangKyChuyenMon').val(daotao.ChuyenMon);
                $('#txtDangKyNoiHoc').val(daotao.NoiHoc);              

                loadTableDaoTaoDangKy(true);

                //$('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(bonhiem.NgayKyQuyetDinh));  
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }
    
    function addDangKyNhanVien(hosoid) {   

        var daotaolopid = $('#hidDangKyDaoTaoLopId').val();

        $.ajax({
            type: "GET",
            url: "/Admin/daotao/SaveDaoTaoNhanVien",
            data: {
                InsertDaoTaoNhanVienId: 1,
                HoSoNhanVienId: hosoid,
                DaoTaoLopId: daotaolopid,
                Ten: ""               
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
                    loadHoSoId(hosoid);      
                }                
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Nhân viên đã đăng ký rồi! Kiểm tra lại.', 'error');
                tedu.stopLoading();
            }
        });        
    }

    function loadHoSoId(hosoid) {
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
               
                var template = $('#template-table-DangKyDaoTaoNhanVien').html();
                  
                var render = Mustache.render(template, {
                    Ten: hoso.Ten,
                    TenKhuVuc: hoso.CorporationName,
                    TenPhong: hoso.TenPhong,
                    TenChucVu: hoso.TenChucVu,
                    hosoId: hoso.Id
                });
                //tedu.notify('Nhân viên đăng ký.', 'success');
                $('#table-contentDangKyDaoTaoNhanVien').append(render);   

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableDaoTaoDangKy(isPageChanged) {
        var template = $('#template-table-DangKyDaoTaoNhanVien').html();
        var render = ""; 
        //daotaonhanvienId        //hosoId        // DaoTaoLopId          //CorporationId        //PhongBanDanhMucId       // daotaonhanvienId2
        var daotaolopId = $('#hidDangKyDaoTaoLopId').val();  
        //tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                daotaoId: daotaolopId,                
                keyword: "",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/daotao/GetDaoTaoNhanVienLopId',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {                   
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th></tr>";                    
                }
                else {
                    var query = response.Result.Results;
                    $.each(query, function (i, item) {
                        render += Mustache.render(template, {
                            Ten: item.TenNhanVien,
                            TenKhuVuc: item.TenKhuVuc,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            hosoId: item.Id
                            //Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                    
                }                

                $('#lblDangKyDaoTaoNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#table-contentDangKyDaoTaoNhanVien').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDaoTaoDangKy(response.Result.RowCount, function () {
                        loadTableDaoTaoDangKy();
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
    function wrapPagingDaoTaoDangKy(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULDangKyDaoTaoNhanVien a').length === 0 || changePageSize === true) {
            $('#paginationULDangKyDaoTaoNhanVien').empty();
            $('#paginationULDangKyDaoTaoNhanVien').removeData("twbs-pagination");
            $('#paginationULDangKyDaoTaoNhanVien').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDangKyDaoTaoNhanVien').twbsPagination({
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

    function XuatExcelDaoTaoNhanVien() {
        var daotaolopid = $('#hidDangKyDaoTaoLopId').val();

        $.ajax({
            type: 'POST',
            url: '/admin/daotao/ExportExcelDaoTaoNhanVien',
            data: {
                daotaolopId: daotaolopid,
                hosoId: daotaolopid,
                daotaonoiId: daotaolopid,
                corporationId: daotaolopid,
                phongId: "",
                chucvuId: "",
                keyword: "",
                dieukienkhac: "1"
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

    function loadDaoTaoDangKyData() {
           
    }


}