
var vbcoquanController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditvbcoquan = new addeditvbcoquanController();

    this.initialize = function () {

        loadKhuVuc();

        registerEvents();

        addeditvbcoquan.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btn-create").on('click', function (e) {
            e.preventDefault();

            $('#hidThemCoQuanId').val(0);
            $('#hidInsertThemCoQuanId').val(1);  // insert            
            $('#txtSTTThemMoiCoQuanBanHanh').val(0);

            $('#modal-add-edit-ThemCoQuan').modal('show');
        });

        $('#btnTimNoiDung').on('click', function () {           
            loadTaleVBCoQuan();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                loadTaleVBCoQuan();
            }
        });

        $("#ddl-show-pageVBCoQuan").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTaleVBCoQuan(true);
        });

        $('body').on('click', '.btn-addeditVBCoQuan', function (e) {
            e.preventDefault();
            var vbcoquanid = $(this).data('id');
            $('#hidInsertThemCoQuanId').val(1);
            addeditvbcoquan.loadAddEditVBCoQuan(vbcoquanid);
            $('#modal-add-edit-ThemCoQuan').modal('show');
        });

    }

    function ClearData() {
        $('#hidThemCoQuanId').val("");
        $('#hidInsertThemCoQuanId').val(0);     

        $('#txtThemMoiCoQuanBanHanh').val("");     
        $('#txtSTTThemMoiCoQuanBanHanh').val(0);     

    }

    function loadData() {
        loadTaleVBCoQuan();
    }    

    function loadTaleVBCoQuan(isPageChanged) {
        var template = $('#table-VBDCoQuan').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();      
        var timnhanvien = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            data: {                
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/vbcoquan/GetListVBCoQuan',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                       
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBCoQuanTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBCoQuan').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBCoQuan(response.Result.RowCount, function () {
                        loadTaleVBCoQuan();
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
    function wrapPagingVBCoQuan(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULVBCoQuan a').length === 0 || changePageSize === true) {
            $('#paginationULVBCoQuan').empty();
            $('#paginationULVBCoQuan').removeData("twbs-pagination");
            $('#paginationULVBCoQuan').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULVBCoQuan').twbsPagination({
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




    function loadKhuVuc() {

    }

}

