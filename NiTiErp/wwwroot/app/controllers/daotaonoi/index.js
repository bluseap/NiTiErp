var daotaonoiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditDaoTaoNoi = new addeditdaotaonoiController();

    this.initialize = function () {
        //loadKhuVuc();

        registerEvents();

        addeditDaoTaoNoi.initialize();

        loadData();
    }

    function registerEvents() {
        $('body').on('click', '.btn-deleteDaoTaoNoi', function (e) {
            e.preventDefault();

            $('#hidInsertDaoTaoNoiId').val(3); // delete

            var daotaonoiId = $(this).data('id');

            loadDeleteDaoTaoNoi(daotaonoiId);

        });

        //$("#btnXuatExcelDaoTaoNoi").on('click', function (e) {
        //    e.preventDefault();
        //    XuatExcelDaoTaoNoie);
        //});

        $("#btnSaveDaoTaoNoi").on('click', function (e) {
            SaveDaoTaoNoi(e);
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditDaoTaoNoi();

            $('#hidInsertDaoTaoNoiId').val(1); // insert

            $('#modal-add-edit-DaoTaoNoi').modal('show');

        });

        $('body').on('click', '.btn-editDaoTaoNoi', function (e) {
            e.preventDefault();

            $('#hidInsertDaoTaoNoiId').val(2); // update

            var daotaonoiId = $(this).data('id');

            $('#hidDaoTaoNoiId').val(daotaonoiId);

            loadEditDaoTaoNoi(daotaonoiId);

            $('#modal-add-edit-DaoTaoNoi').modal('show');

        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableDaoTaoNoi();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableDaoTaoNoi();
            }
        });

        $("#ddl-show-pageDaoTaoNoi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableDaoTaoNoi(true);
        });

    }

    function loadTableDaoTaoNoi(isPageChanged) {
        var template = $('#table-DaoTaoNoi').html();
        var render = "";

        var timnhanvien = $('#txtTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/daotaonoi/GetListDaoTaoNoi',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenTruong: item.TenTruong,
                            DiaChi: item.DiaChi,
                            SoDienThoai: item.SoDienThoai,
                            Email: item.Email,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lblDaoTaoNoiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDaoTaoNoi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDaoTaoNoi(response.Result.RowCount, function () {
                        loadTableDaoTaoNoi();
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
    function wrapPagingDaoTaoNoi(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        if ($('#paginationULDaoTaoNoi a').length === 0 || changePageSize === true) {
            $('#paginationULDaoTaoNoi').empty();
            $('#paginationULDaoTaoNoi').removeData("twbs-pagination");
            $('#paginationULDaoTaoNoi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDaoTaoNoi').twbsPagination({
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

    function loadEditDaoTaoNoi(daotaonoiid) {
        $.ajax({
            type: "GET",
            url: "/Admin/daotaonoi/GetDaoTaoNoiId",
            data: { daotaonoiId: daotaonoiid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var daotaonoi = response.Result.Results[0];

                $('#hidDaoTaoNoiId').val(daotaonoi.Id);

                $('#txtAddEditTenTruong').val(daotaonoi.TenTruong);
                $('#txtAddEditDiaChi').val(daotaonoi.DiaChi);
                $('#txtAddEditSoDienThoai').val(daotaonoi.SoDienThoai);
                $('#txtAddEditEmail').val(daotaonoi.Email);
              
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetFormAddEditDaoTaoNoi() {
        $('#hidDaoTaoNoiId').val('0');
        $('#hidInsertDaoTaoNoiId').val('0');

        $('#txtAddEditTenTruong').val('');
        $('#txtAddEditDiaChi').val('');
        $('#txtAddEditSoDienThoai').val('');
        $('#txtAddEditEmail').val('');       
    }

    function SaveDaoTaoNoi(e) {
        e.preventDefault();

        var daotaonoiId = $('#hidDaoTaoNoiId').val();
        var insertdaotaonoiId = $('#hidInsertDaoTaoNoiId').val();

        var tendaotaonoi = $('#txtAddEditTenTruong').val();
        var diachidaotaonoi = $('#txtAddEditDiaChi').val();
        var sodienthoai = $('#txtAddEditSoDienThoai').val();
        var email = $('#txtAddEditEmail').val();        

        //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());       
        $.ajax({
            type: "POST",
            url: "/Admin/daotaonoi/AddUpdateDaoTaoNoi",
            data: {
                Id: daotaonoiId,
                InsertDaoTaoNoiId: insertdaotaonoiId,

                TenTruong: tendaotaonoi,
                DiaChi: diachidaotaonoi,
                SoDienThoai: sodienthoai,
                Email: email               
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
                    tedu.notify('Tạo trường đào tạo nhân viên.', 'success');

                    resetFormAddEditDaoTaoNoi();

                    loadTableDaoTaoNoi(true);

                    $('#modal-add-edit-DaoTaoNoi').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu bơi khám sức khỏe nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcelSucKhoeNoiKham(e) {
        //var nam = $('#txtNamKham').val();
        //var makhuvuc = $('#ddlKhuVuc').val();
        //var phongId = $('#ddlPhongBan').val();
        //var timnhanvien = $('#txtTimNhanVien').val();
        //var dieukien = $('#ddlDieuKienKhac').val();

        //$.ajax({
        //    type: 'POST',
        //    url: '/admin/suckhoe/ExportExcelSucKhoe',
        //    data: {
        //        namkham: nam,
        //        corporationId: makhuvuc,
        //        phongId: phongId,
        //        keyword: timnhanvien,
        //        page: tedu.configs.pageIndex,
        //        pageSize: tedu.configs.pageSize,
        //        dieukienkhac: dieukien
        //    },
        //    beforeSend: function () {
        //        tedu.startLoading();
        //    },
        //    success: function (response) {
        //        window.location.href = response;
        //        tedu.stopLoading();
        //    }
        //});
    }

    function loadDeleteDaoTaoNoi(daotaonoiid) {
        var inserdaotaonoi = $('#hidInsertDaoTaoNoiId').val(); // 3       

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/daotaonoi/DeleteDaoTaoNoi",
                data: {
                    Id: daotaonoiid,
                    InsertDaoTaoNoiId: inserdaotaonoi // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();

                    $('#hidInsertDaoTaoNoiId').val(0);

                    loadTableDaoTaoNoi(true);
                },
                error: function (status) {
                    tedu.notify('Xóa đào tạo lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadData() {
        loadTableDaoTaoNoi();
    }




}