var noikhamController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditSucKhoeNoiKham = new addeditnoikhamController();

    this.initialize = function () {       

        registerEvents();

        addeditSucKhoeNoiKham.initialize();

        loadData();
    }

    function registerEvents() {

        $('body').on('click', '.btn-deleteSucKhoeNoiKham', function (e) {
            e.preventDefault();

            $('#hidInsertSucKhoeNoiKhamId').val(3); // delete

            var noikhamId = $(this).data('id');       

            loadDeleteNoiKham(noikhamId);

        });

        //$("#btnXuatExcelSucKhoe").on('click', function (e) {
        //    e.preventDefault();
        //    XuatExcelSucKhoeNoiKham(e);
        //});

        $("#btnSaveSucKhoeNoiKham").on('click', function (e) {
            SaveSucKhoeNoiKham(e);
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditSucKhoeNoiKham();

            $('#hidInsertSucKhoeNoiKhamId').val(1); // insert

            $('#modal-add-edit-SucKhoeNoiKham').modal('show');          

        });

        $('body').on('click', '.btn-editSucKhoeNoiKham', function (e) {
            e.preventDefault();

            $('#hidInsertSucKhoeNoiKhamId').val(2); // update

            var noikhamId = $(this).data('id');

            $('#hidSucKhoeNoiKhamId').val(noikhamId);

            loadEditSucKhoeNoiKham(noikhamId);

            $('#modal-add-edit-SucKhoeNoiKham').modal('show');                     

        });       

        $('#btnTimNhanVien').on('click', function () {
            loadTableSucKhoeNoiKham();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableSucKhoeNoiKham();
            }
        });

        $("#ddl-show-pageSucKhoeNoiKham").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableSucKhoeNoiKham(true);
        });

    }    

    function loadTableSucKhoeNoiKham(isPageChanged) {
        var template = $('#table-SucKhoeNoiKham').html();
        var render = "";
       
        var timnhanvien = $('#txtTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {               
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/suckhoenk/GetListSucKhoenk',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenNoiKham: item.TenNoiKham,
                            DiaChiNoiKham: item.DiaChiNoiKham,
                            SoDienThoai: item.SoDienThoai,
                            Email: item.Email,                                                      
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lblSucKhoeNoiKhamTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentSucKhoeNoiKham').html(render);
                }                

                if (response.Result.RowCount !== 0) {
                    wrapPagingSucKhoeNoiKham(response.Result.RowCount, function () {
                        loadTableSucKhoeNoiKham();
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
    function wrapPagingSucKhoeNoiKham(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        if ($('#paginationULSucKhoeNoiKham a').length === 0 || changePageSize === true) {
            $('#paginationULSucKhoeNoiKham').empty();
            $('#paginationULSucKhoeNoiKham').removeData("twbs-pagination");
            $('#paginationULSucKhoeNoiKham').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULSucKhoeNoiKham').twbsPagination({
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

    function loadEditSucKhoeNoiKham(noikhamid) {
        $.ajax({
            type: "GET",
            url: "/Admin/suckhoenk/GetSucKhoenkId",
            data: { noikhamId: noikhamid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var noikham = response.Result.Results[0];

                $('#hidSucKhoeNoiKhamId').val(noikham.Id);                              

                $('#txtAddEditTenNoiKham').val(noikham.TenNoiKham);
                $('#txtAddEditDiaChiKham').val(noikham.DiaChiNoiKham);
                $('#txtAddEditSoDienThoai').val(noikham.SoDienThoai);
                $('#txtAddEditEmail').val(noikham.Email);
                $('#txtAddEditMaSoThue').val(noikham.MaSoThue);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function resetFormAddEditSucKhoeNoiKham() {
        $('#hidSucKhoeNoiKhamId').val('0');        
        $('#hidInsertSucKhoeNoiKhamId').val('0');
     
        $('#txtAddEditTenNoiKham').val('');
        $('#txtAddEditDiaChiKham').val('');
        $('#txtAddEditSoDienThoai').val('');
        $('#txtAddEditEmail').val('');
        $('#txtAddEditMaSoThue').val('');        
    }

    function SaveSucKhoeNoiKham(e) {
        e.preventDefault();

        var noikhamId = $('#hidSucKhoeNoiKhamId').val();       
        var insertnoikhamId = $('#hidInsertSucKhoeNoiKhamId').val();       

        var tennoikham = $('#txtAddEditTenNoiKham').val();
        var diachikhkam = $('#txtAddEditDiaChiKham').val();
        var sodienthoai = $('#txtAddEditSoDienThoai').val();
        var email = $('#txtAddEditEmail').val();
        var masothue = $('#txtAddEditMaSoThue').val();
        
        //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());       
        $.ajax({
            type: "POST",
            url: "/Admin/suckhoenk/AddUpdateSucKhoenk",
            data: {
                Id: noikhamId,              
                InsertNoiKhamId: insertnoikhamId,

                TenNoiKham: tennoikham,
                DiaChiNoiKham: diachikhkam,
                SoDienThoai: sodienthoai,
                Email: email,
                MaSoThue: masothue
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
                    tedu.notify('Tạo nơi khám sức khỏe nhân viên.', 'success');

                    resetFormAddEditSucKhoeNoiKham();

                    loadTableSucKhoeNoiKham(true);

                    $('#modal-add-edit-SucKhoeNoiKham').modal('hide');

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

    function loadDeleteNoiKham(noikhamid) {
        var insernoikham = $('#hidInsertSucKhoeNoiKhamId').val(); // 3       

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/suckhoenk/DeleteSucKhoenk",
                data: {
                    Id: noikhamid,
                    InsertNoiKhamId: insernoikham // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();

                    $('#hidInsertSucKhoeNoiKhamId').val(0);

                    loadTableSucKhoeNoiKham(true);
                },
                error: function (status) {
                    tedu.notify('Xóa Nơi khám Sức khỏe lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadData() {
        loadTableSucKhoeNoiKham();
    }




}