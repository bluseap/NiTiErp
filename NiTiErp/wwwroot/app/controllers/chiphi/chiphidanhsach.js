var chiphidanhsachController = function () {
    var tableHoSo = [];
    var tableChiPhiDanhSachTruc = [];

    this.initialize = function () {

        loadchiphidanhsachData();

        registerEvents();      
        
    }

    function registerEvents() {

        $('#btnChiPhiDanhSachTrucTimNhanVien').on('click', function () {
            LoadTableHoSoChiPhiDanhSachTruc();
        });

        $('#txtChiPhiDanhSachTrucTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSoChiPhiDanhSachTruc();
            }
        });

        $("#ddl-show-pageHoSoChiPhiDanhSachTruc").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSoChiPhiDanhSachTruc(true);
        });

        $('#ddlChiPhiDanhSachTrucKhuVuc').on('change', function () {
            var corporationId = $('#ddlChiPhiDanhSachTrucKhuVuc').val();
            loadPhongKhuVucChiPhiDanhSach(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        }); 

        $('body').on('click', '.btn-editHoSoChiPhiDanhSachTruc', function (e) {
            e.preventDefault();

            var chiphoikhoitaoid = $('#hidChiPhiKhoiTaoId').val();

            tedu.notify(chiphoikhoitaoid, "success");


            //var hosoId = $(this).data('id');
            //addChiPhiDanhSachTruc(hosoId);
        });

        $('#btnExcelChiPhiDanhSachTruc').on('click', function () {
            tedu.notify("excel chi phi truc","success");
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

    function LoadTableHoSoChiPhiDanhSachTruc(isPageChanged) {
        var template = $('#table-HoSoChiPhiDanhSachTruc').html();
        var render = "";

        var makhuvuc = $('#ddlChiPhiDanhSachTrucKhuVuc').val();
        var phongId = $('#ddlChiPhiDanhSachTrucPhongBan').val();
        var timnhanvien = $('#txtChiPhiDanhSachTrucTimNhanVien').val();

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

                $('#lblHoSoChiPhiDanhSachTrucTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoChiPhiDanhSachTruc').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSoDanhSachTruc(response.Result.RowCount, function () {
                        LoadTableHoSoChiPhiDanhSachTruc();
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
    function wrapPagingHoSoDanhSachTruc(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHoSoChiPhiDanhSachTruc a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoChiPhiDanhSachTruc').empty();
            $('#paginationULHoSoChiPhiDanhSachTruc').removeData("twbs-pagination");
            $('#paginationULHoSoChiPhiDanhSachTruc').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoChiPhiDanhSachTruc').twbsPagination({
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

    function addChiPhiDanhSachTruc(hosoid) {

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

                var template = $('#template-table-ChiPhiDanhSachTruc').html();

                var render = Mustache.render(template, {
                    Ten: hoso.Ten,
                    TenKhuVuc: hoso.CorporationName,
                    TenPhong: hoso.TenPhong,
                    TenChucVu: hoso.TenChucVu,
                    SoNgayTrucLe: "1",
                    hosoId: hoso.Id
                });
                //tedu.notify('Nhân viên đăng ký.', 'success');
                $('#table-contentChiPhiDanhSachTruc').append(render);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadchiphidanhsachData() {

    }



}