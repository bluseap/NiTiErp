var emailthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var emailsent = new emailsentController();
    var sentfile = new sentfileController(); 
    var viewemail = new viewemailController();

    this.initialize = function () {

        loadKhuVuc();

        registerEvents();

        emailsent.initialize();
        sentfile.initialize();
        viewemail.initialize();

        loadData();

        loadTableEmailThem();
    }

    function registerEvents() {

        $("#btn-SoanEmailNoiBo").on('click', function (e) {
            e.preventDefault();    
            $('#modal-add-edit-ViewEmail').modal('show');
        });
        
        //$('body').on('click', '.compose', function (e) {   
        $('#compose').on('click', function (e) {
            e.preventDefault();
            //$('.compose').slideToggle();
            
            var codenoiboGuid = $("#hidCodeEmailNoiBoNhanGuid").val();
            var codenoibosentfileGuid = $("#hidCodeEmailNoiBoNhanSentFileGuid").val();

            if (codenoiboGuid !== "0") {
                $("#hidInsCodeEmailNoiBoNhanId").val("1");                   
            }
            else {
                $("#hidInsCodeEmailNoiBoNhanId").val("0");
                var newGuid = newGuid2();
                $("#hidCodeEmailNoiBoNhanGuid").val(newGuid); 
            }

            if (codenoibosentfileGuid !== "0") {
                $("#hidInsCodeEmailNoiBoNhanSentFileId").val("1");
            }
            else {
                $("#hidInsCodeEmailNoiBoNhanSentFileId").val("0");
            }
        });

        $('body').on('click', '.bntEmailNoiBoId', function (e) {
            e.preventDefault();
            var emailnoiboid = $(this).data('id');
            $('#tblContentViewEmail').html("");
            updateViewEmail(emailnoiboid);
            viewemail.loadViewEmailNoiBo(emailnoiboid);
            $('#modal-add-edit-ViewEmail').modal('show');
        });

        $("#ddl-show-pageEmailThem").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableEmailThem(true);
        });

    }    

    function newGuid2() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadTableEmailThem(isPageChanged) {
        var template = $('#table-EmailThem').html();
        var render = "";

        var nguoiNhan = userName;      
        //tedu.notify(userName, "success");

        $.ajax({
            type: 'GET',
            url: '/admin/emailthem/GetListEmailThem',
            data: {
                NguoiNhan: nguoiNhan,
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
                            NgayGui: tedu.getFormattedDateTimeN(item.NgayGui),
                            TieuDe: item.TieuDe,
                            EmailNoiBoNhanId: item.EmailNoiBoNhanId
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblEmailThemTotalRecords').text(response.RowCount);

                if (render !== '') {
                    $('#tblContentEmailThem').html(render);
                }

                if (response.RowCount !== 0) {
                    wrapPagingEmailThem(response.RowCount, function () {
                        loadTableEmailThem();
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
    function wrapPagingEmailThem(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULEmailThem a').length === 0 || changePageSize === true) {
            $('#paginationULEmailThem').empty();
            $('#paginationULEmailThem').removeData("twbs-pagination");
            $('#paginationULEmailThem').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULEmailThem').twbsPagination({
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

    function updateViewEmail(emailnoibonhanid) {         
        var nguoiNhan = userName;      
        $.ajax({
            type: "POST",
            url: "/Admin/emailthem/IsViewEmailNhan",
            data: {
                emailNoiBoNhanId: emailnoibonhanid,
                username: nguoiNhan
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
                    loadTableEmailThem(true);
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể Xem tin nhắn nội bộ.', 'error');
                tedu.stopLoading();
            }
        });
    }


    function loadKhuVuc() {
        
    }

    function loadData() {

    }

}