var chiphidmController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditchiphidm = new addeditchiphidmController();

    this.initialize = function () {
        loadData();

        registerEvents();

        addeditchiphidm.initialize();
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {
            resetFormAddEditChiPhiDM();
            $('#hidInsertChiPhiDMId').val(1); // insert
            $('#modal-add-edit-ChiPhiDM').modal('show');
        });

        $('#btnTimCongTy').on('click', function () {
            tedu.notify("button tim cong", "success");
        });

        $('#txtTimCongTy').on('keypress', function (e) {
            if (e.which === 13) {
                tedu.notify(" tim cong tu", "success");
            }
        });

        $("#btnXuatExcel").on('click', function () {            
            tedu.notify("Xuất excel", "success");

        });

        $("#ddl-show-pageChiPhiDM").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChiPhiDM(true);
        });
    }

    function resetFormAddEditChiPhiDM() {
        $('#hidChiPhiDMId').val('');
        $('#hidInsertChiPhiDMId').val(''); 

        $('#ddlAddEditIsChiPhiTang')[0].selectedIndex = 0;
        $('#ddlAddEditTenLoaiChiPhi')[0].selectedIndex = 0;
        $('#txtAddEditTenChiPhi').val('');
        $('#ddlAddEditTenChiPhiBang')[0].selectedIndex = 0;
        $('#txtAddEditSoTienHeSo').val(''); 
    }

    function loadData() {
        loadTableChiPhiDM();
        loadChiPhiLoai();
        loadChiPhiBang();
    }

    function loadChiPhiLoai() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ChiPhiLoaiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoai + "</option>";
                });
                $('#ddlAddEditTenLoaiChiPhi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có tên loại chi phí.', 'error');
            }
        });
    }

    function loadChiPhiBang() {
        $.ajax({
            type: 'GET',
            url: '/admin/chiphidm/ChiPhiBangGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChiPhiBang + "</option>";
                });
                $('#ddlAddEditTenChiPhiBang').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có tên bảng chi phí.', 'error');
            }
        });
    }

    function loadTableChiPhiDM(isPageChanged) {
        var template = $('#table-ChiPhiDM').html();
        var render = "";
        //var timnhanvien = $('#txtTimNhanVien').val();
        $.ajax({
            type: 'GET',
            data: {
                corporationId: "%",
                keyword: "%",
                IsChiPhiTang: "True",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/chiphidm/GetListChiPhi',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenChiPhi: item.TenLoaiHinhDaoTao,
                            IsChiPhiTang: item.TenLoaiBang,
                            TenLoaiChiPhi: item.ChuyenMon,                           
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lblChiPhiDMTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChiPhiDM').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingChiPhi(response.Result.RowCount, function () {
                        loadTableChiPhiDM();
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
        if ($('#paginationULChiPhiDM a').length === 0 || changePageSize === true) {
            $('#paginationULChiPhiDM').empty();
            $('#paginationULChiPhiDM').removeData("twbs-pagination");
            $('#paginationULChiPhiDM').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChiPhiDM').twbsPagination({
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