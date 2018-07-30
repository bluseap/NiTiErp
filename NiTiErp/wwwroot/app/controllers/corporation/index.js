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

        //formMainValidate();

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

        $('#btnTimCongTy').on('click', function () {
            loadTableDanhMucCongTy();            
        });

        $('#txtTimCongTy').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableDanhMucCongTy();                
            }
        });

        $('body').on('click', '.btn-editDMCT', function (e) {
            e.preventDefault();            
            
            $('#hidInsertDMCTId').val(2);

            var corpoId = $(this).data('id');

            $('#hidDMCTId').val(corpoId);

            loadAddEditDMCT(corpoId);

            $('#modal-add-edit-DMCT').modal('show');
        });

    }

    function resetFormAddEditDMCT() {
        $('#hidDMCTId').val('0');
        $('#hidInsertDMCTId').val('0');

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
        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            e.preventDefault();

            var corpoid = $('#hidDMCTId').val(); //  
            var inscorpoid = $('#hidInsertDMCTId').val(); // id = 1 ; para update insert        

            var tencor = $('#txtAddEditTenCongTy').val();
            var sodienthoai = $('#txtAddEditSoDienThoai').val();
            var diachi = $('#txtAddEditDiaChi').val();
            var masothue = $('#txtAddEditMaSoThue').val();
            var email = $('#txtAddEditEmail').val();

            $.ajax({
                type: "POST",
                url: "/Admin/corporation/AddUpdateDMCT",
                data: {
                    Id: corpoid,
                    InsertdmctId: inscorpoid,

                    Name: tencor,
                    PhoneNumber1: sodienthoai,
                    Address: diachi,
                    TaxNumber: masothue,
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
                        tedu.notify('Công ty, xí nghiệp.', 'success');

                        loadTableDanhMucCongTy(true);

                        $('#modal-add-edit-DMCT').modal('hide');

                        resetFormAddEditDMCT();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Công ty, xí nghiệp', 'error');
                    tedu.stopLoading();
                }
            });
        }
    }

    function UpdateDMCT(e) {
        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            e.preventDefault();

            var corpoid = $('#hidDMCTId').val(); //  
            var inscorpoid = $('#hidInsertDMCTId').val(); // id = 1 ; para update insert        

            var tencor = $('#txtAddEditTenCongTy').val();
            var sodienthoai = $('#txtAddEditSoDienThoai').val();
            var diachi = $('#txtAddEditDiaChi').val();
            var masothue = $('#txtAddEditMaSoThue').val();
            var email = $('#txtAddEditEmail').val();

            $.ajax({
                type: "POST",
                url: "/Admin/corporation/AddUpdateDMCT",
                data: {
                    Id: corpoid,
                    InsertdmctId: inscorpoid,

                    Name: tencor,
                    PhoneNumber1: sodienthoai,
                    Address: diachi,
                    TaxNumber: masothue,
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
                        tedu.notify('Công ty, xí nghiệp.', 'success');

                        loadTableDanhMucCongTy(true);

                        $('#modal-add-edit-DMCT').modal('hide');

                        resetFormAddEditDMCT();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Công ty, xí nghiệp', 'error');
                    tedu.stopLoading();
                }
            });
        }
    }

    function loadAddEditDMCT(corpoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/corporation/GetAllCorpoId",
            data: { corpoId: corpoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormAddEditDMCT();
                }
                else {
                    var corpo = response.Result.Results[0];

                    $('#txtAddEditTenCongTy').val(corpo.Name);
                    $('#txtAddEditSoDienThoai').val(corpo.PhoneNumber1);
                    $('#txtAddEditDiaChi').val(corpo.Address);
                    $('#txtAddEditMaSoThue').val(corpo.TaxNumber);
                    $('#txtAddEditEmail').val(corpo.Email);

                    //$('#ddlLoaiHopDongChiTietCu').val(hopdong.HopDongDanhMucId);
                    //$('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong));                        
                }               
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function isFormMainValidate() {
        if ($('#frmMainDMCT').valid()) {
            return true;
        }
        else {
            return false;
        }
    }

    function formMainValidate() {        
        $('#frmMainDMCT').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtAddEditEmail: {
                    required: true,
                    email: true
                }
            }
        });
    }

}