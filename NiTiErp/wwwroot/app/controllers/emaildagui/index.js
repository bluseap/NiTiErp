
var emaildaguiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var detailEmailDaGui = new detailemaildaguiController();    

    this.initialize = function () {

        registerEvents();

        detailEmailDaGui.initialize();      

        loadTableEmailDaGui();
    }

    function registerEvents() {

        $("#ddl-show-pageEmailDaGui").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableEmailDaGui(true);
        });

        $('body').on('click', '.bntEmailNoiBoId', function (e) {
            e.preventDefault();

            var emailnoibonhanid = $(this).data('id');
            $('#tblContentDetailEmailDaGui').html("");
          
            detailEmailDaGui.loadDetailEmailDaGui(emailnoibonhanid);
            $('#modal-add-edit-DetailEmailDaGui').modal('show');
        });

    }

    function loadTableEmailDaGui(isPageChanged) {
        var template = $('#table-EmailDaGui').html();
        var render = "";

        var nguoiGui = userName;      
        //tedu.notify(userName, "success");

        $.ajax({
            type: 'GET',
            url: '/admin/emaildagui/GetListEmailDaGui',
            data: {
                NguoiGui: nguoiGui,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Results.length === 0) {
                    render = '<a href="#"><div class="" > Không có dữ liệu </div>  </a>';
                }
                else {
                    $.each(response.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            ClassEmailChuaXem: item.ClassEmailChuaXem,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            ClassAddFile: item.ClassAddFile ,
                            NguoiGui: item.NguoiGui,  
                            TenNguoiGui: item.TenNguoiGui,
                            TenNguoiNhan: item.TenNguoiNhan,
                            NgayGui: tedu.getFormattedDateTimeN(item.NgayGui),
                            TieuDe: item.TieuDe,
                            EmailNoiBoNhanId: item.EmailNoiBoNhanId
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblEmailDaGuiTotalRecords').text(response.RowCount);

                if (render !== '') {
                    $('#tblContentEmailDaGui').html(render);
                }

                if (response.RowCount !== 0) {
                    wrapPagingEmailDaGui(response.RowCount, function () {
                        loadTableEmailDaGui();
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
    function wrapPagingEmailDaGui(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULEmailDaGui a').length === 0 || changePageSize === true) {
            $('#paginationULEmailDaGui').empty();
            $('#paginationULEmailDaGui').removeData("twbs-pagination");
            $('#paginationULEmailDaGui').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULEmailDaGui').twbsPagination({
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