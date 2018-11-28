var addeditchiphiController = function () {


    this.initialize = function () {

        registerEvents();

        loadAddEditData();

        resetFormAddEditChiPhiKhoiTao();
    }

    function registerEvents() {   
        
        $('#btnSaveChiPhi').on('click', function (e) {  
            e.preventDefault();            

            var makhuvuc = $("#ddlAddEditKhuVuc").val();
            var thang = $("#ddlAddEditThang").val();
            var nam = $("#txtAddEditNam").val();
            var loaichiphi = $("#ddlAddEditLoaiChiPhi").val();
            var dotin = $("#ddlAddEditDotIn").val();

            if (loaichiphi === "%" || dotin === "%") {
                tedu.notify("Chọn loại chi phí cho đúng. Kiểm tra lại!","error");
            }
            else {
                $.ajax({
                    type: 'GET',
                    url: '/admin/khoaso/GetLockLuongKyId',
                    data: {
                        makhuvuc: makhuvuc,
                        thang: thang,
                        nam: nam,
                        dotinluongid: dotin
                    },
                    dataType: "json",
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function (response) {
                        lockluong = response.Result[0];

                        if (lockluong.IsLockLuongDotInKy === "False") {
                            SaveKhoiTaoChiPhi();
                        }
                        if (lockluong.IsLockLuongDotInKy === "True") {
                            tedu.notify('Lương tháng đã khóa sổ. Kiểm tra lại.', 'error');
                        }
                        
                    },
                    error: function (status) {
                        console.log(status);
                        tedu.notify('Khóa sổ lương tháng đợ in.', 'error');
                    }
                });                
            }
        });

        $("#ddl-show-pageKhoiTaoChiPhi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChiPhiKhoiTao(true);
        });

        $('#btnTimChiPhi').on('click', function (e) {
            e.preventDefault();
            loadTableChiPhiKhoiTao(true);           
        });

        $('body').on('click', '.btn-editKhoiTaoChiPhi', function (e) {
            e.preventDefault();
            tedu.notify('Sửa Chi phí khởi tạo lại.', 'success');

            $('#hidInsertChiPhiKhoiTaoId').val(2); // update         

            var khoitaochiphi = $(this).data('id');

            $('#hidChiPhiKhoiTaoId').val(khoitaochiphi);

            loadChiPhiKhoiTao(khoitaochiphi);
        });  

        $('body').on('click', '.btn-deleteKhoiTaoChiPhi', function (e) {
            e.preventDefault();
            tedu.notify('Xóa khởi tạo lại.', 'success');
            
        }); 

    }

    function loadAddEditData() {
        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;
        $('#ckAddEditChuyenKySau').prop('checked', false);

        loadTableChiPhiKhoiTao();
    }

    function SaveKhoiTaoChiPhi() {        
        var insertchiphikhoitaoidmoi = $('#hidInsertChiPhiKhoiTaoId').val();

        var chiphikhoitaoid = $('#hidChiPhiKhoiTaoId').val();
        var makhuvuc = $("#ddlAddEditKhuVuc").val();
        var thang = $("#ddlAddEditThang").val();
        var nam = $("#txtAddEditNam").val();
        var kykhoitao = tedu.getFormatDateYYMMDD("01/" + thang + "/" + nam); 
        //var dotin = $("#ddlAddEditDotIn").val();
        var loaichiphi = $("#ddlAddEditLoaiChiPhi").val();
        var chuyenkysau = $('#ckAddEditChuyenKySau').prop('checked') === true ? "True" : "False";             
       
        $.ajax({
            type: "GET",
            url: "/Admin/chiphi/ChiPhiKhoiTaKy",
            data: {
                chiphiId: loaichiphi,
                nam: nam,
                thang: thang,
                corporationId: makhuvuc,
                keyword: "%",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                //var chiphikhoitao = response.Result.Results[0];

                if (response.Result.Results.length === 0) {
                    $.ajax({
                        type: "POST",
                        url: "/Admin/chiphi/AddUpdateChiPhi",
                        data: {
                            Id: chiphikhoitaoid,
                            InsertChiPhiKhoiTaoId: insertchiphikhoitaoidmoi,
                            CorporationId: makhuvuc,
                            KyKhoiTao: nam + "/" + thang + "/01",
                            ChiPhiId: loaichiphi,
                            IsChuyenKy: chuyenkysau
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
                                tedu.stopLoading();
                                $('#modal-add-edit-ChiPhi').modal('hide');
                                resetFormAddEditChiPhiKhoiTao();
                                tedu.notify('Khởi tạo chi phí thành công.', 'success');
                            }
                        },
                        error: function () {
                            tedu.notify('Lỗi khởi tạo chi phí.', 'error');
                            tedu.stopLoading();
                        }
                    });
                }
                else {
                    tedu.notify("Chi phí này đã khởi tạo. Kiểm tra lại.", "error");
                }

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });


        

    }

    function loadTableChiPhiKhoiTao(isPageChanged) {
        var template = $('#table-KhoiTaoChiPhi').html();
        var render = "";

        var nammoi = $('#txtAddEditNam').val();
        var thangmoi = $('#ddlAddEditThang').val();
        var makv = $('#ddlAddEditKhuVuc').val();     

        $.ajax({
            type: 'GET',
            data: {
                nam: nammoi,
                thang: thangmoi,
                corporationId: makv,              
                keyword: "%",                
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/chiphi/ChiPhiKhoiTaGetList',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            KyKhoiTao: tedu.getFormattedDateYYYYMM(item.KyKhoiTao),
                            TenChiPhi: item.TenChiPhi,
                            IsChuyenKy: item.IsChuyenKy === true ? 'Có' : 'Không'    
                            //CreateDate: tedu.getFormattedDate(item.CreateDate),
                            //Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lbl-totalKhoiTaoChiPhi-records').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentKhoiTaoChiPhi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingKhoiTaoChiPhi(response.Result.RowCount, function () {
                        loadTableChiPhiKhoiTao();
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
    function wrapPagingKhoiTaoChiPhi(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        if ($('#paginationULKhoiTaoChiPhi a').length === 0 || changePageSize === true) {
            $('#paginationULKhoiTaoChiPhi').empty();
            $('#paginationULKhoiTaoChiPhi').removeData("twbs-pagination");
            $('#paginationULKhoiTaoChiPhi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULKhoiTaoChiPhi').twbsPagination({
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

    function resetFormAddEditChiPhiKhoiTao() {
        $('#hidChiPhiKhoiTaoId').val('0');
        $('#hidInsertChiPhiKhoiTaoId').val('');
        $('#hidKhoaSoLuongThangDotIn').val('');

        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;
        $('#ckAddEditChuyenKySau').prop('checked', false);

    }

    function khoasoLuongThangDotIn(makhuvucLock, thangLock, namLock, dotinluongidLock) {
        $.ajax({
            type: 'GET',
            url: '/admin/khoaso/GetLockLuongKyId',
            data: {
                makhuvuc: makhuvucLock,
                thang: thangLock,
                nam: namLock,
                dotinluongid: dotinluongidLock
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                lockluong = response.Result[0];

                if (lockluong !== null) {
                    $('#hidKhoaSoLuongThangDotIn').val(lockluong.IsLockLuongDotInKy);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Khóa sổ lương tháng đợt in.', 'error');
            }
        });
    }

    function loadChiPhiKhoiTao(khoitaochiphi) {
        var nammoi = $('#txtAddEditNam').val();
        var thangmoi = $('#ddlAddEditThang').val();
        var makv = $('#ddlAddEditKhuVuc').val();     

        $.ajax({
            type: "GET",
            url: "/Admin/chiphi/ChiPhiKhoiTaKyId",
            data: {
                chiphikhoitaoId: khoitaochiphi,
                nam: nammoi,
                thang: thangmoi,
                corporationId: makv,
                keyword: "%",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var chiphikhoitao = response.Result.Results[0];

                if (response.Result.Results.length === 0) {
                    tedu.notify("Lỗi! Chi phí khởi tạo. Kiểm tra lại.", "error");
                }
                else {
                    $('#ddlAddEditKhuVuc').val(chiphikhoitao.CorporationId);
                    $('#ddlAddEditThang').val(chiphikhoitao.Thang);
                    $('#txtAddEditNam').val(chiphikhoitao.Nam);
                    //ddlAddEditLoaiChiPhi
                    $('#ddlAddEditLoaiChiPhi').val(chiphikhoitao.ChiPhiId); 
                    $('#ckAddEditChuyenKySau').prop('checked', chiphikhoitao.IsChuyenKy);                  
                }                            
                               
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}