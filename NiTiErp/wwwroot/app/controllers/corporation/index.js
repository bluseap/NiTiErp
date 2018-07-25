var corporationController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditCorpotation = new addeditcorporationController();

    //var images = [];

    this.initialize = function () {       
        loadData();

        registerEvents();

        addeditCorpotation.initialize();
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {

            resetFormAddEditDMCT();

            $('#hidInsertDMCTId').val(1); // insert

            $('#modal-add-edit-DMCT').modal('show');            

        });

        $("#ddl-show-pageDMCT").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableDanhMucCongTy(true);
        });

        $('#btnSaveDMCT').on('click', function (e) {
            var insertDMCT = $('#hidInsertDMCTId').val(); // update

            if (insertDMCT === "2") {
                UpdateDMCT(e);
            }
            else {
                SaveDMCT(e);
            }
        });

    }

    function resetFormAddEditDMCT() {
        $('#hidDMCTId').val('');
        $('#hidInsertDMCTId').val('');

        $('#txtAddEditTenCongTy').val('');
        $('#txtAddEditSoDienThoai').val(''); 
        $('#txtAddEditDiaChi').val(''); 
        $('#txtAddEditMaSoThue').val(''); 
        $('#txtAddEditEmail').val('');
    }

    function loadData() {
        loadTableDanhMucCongTy();

    }

    function loadTableDanhMucCongTy(isPageChanged) {
        var template = $('#table-DMCT').html();
        var render = "";

        var makhuvuc = "PO";
        var phongId = "";
        var timcongty = $('#txtTimCongTy').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timcongty,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/corporation/GetAllCorPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Name: item.Name,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            
                            DateCreated: tedu.getFormattedDate(item.DateCreated),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblDMCTTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDMCT').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDMCT(response.Result.RowCount, function () {
                        loadTableDanhMucCongTy();
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
    function wrapPagingDMCT(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULDMCT a').length === 0 || changePageSize === true) {
            $('#paginationULDMCT').empty();
            $('#paginationULDMCT').removeData("twbs-pagination");
            $('#paginationULDMCT').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDMCT').twbsPagination({
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
    
    function SaveDMCT(e) {
        e.preventDefault();

    }

    function UpdateDMCT(e) {
        e.preventDefault();

    }

}