var chiphidmController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditchiphidm = new addeditchiphidmController();

    this.initialize = function () {
        loadData();
        registerEvents();
        addeditchiphidm.initialize();
    }

    function registerEvents() {

        formMainValidate();

        $("#btnSaveChiPhiDM").on('click', function () {
            var insertchiphidm = $('#hidInsertChiPhiDMId').val(); // update

            if (insertchiphidm === "2") {
                UpdateChiPhidm();
            }
            else {
                SaveChiPhidm();
            }
        });

        $('body').on('click', '.btn-editChiPhiDM', function (e) {
            e.preventDefault();

            $('#hidInsertChiPhiDMId').val(2); // update
            var chiphiId = $(this).data('id');

            $('#hidChiPhiDMId').val(chiphiId);

            loadChiPhi(chiphiId);

            $('#modal-add-edit-ChiPhiDM').modal('show');      
        });  

        $('body').on('click', '.btn-deleteChiPhiDM', function (e) {
            e.preventDefault();

            $('#hidInsertChiPhiDMId').val(3); // delete
            var chiphiId = $(this).data('id');

            $('#hidChiPhiDMId').val(chiphiId);

            deleteChiPhi(chiphiId);            
        });  

        $("#btn-create").on('click', function () {
            resetFormAddEditChiPhiDM();
            $('#hidInsertChiPhiDMId').val(1); // insert
            $('#modal-add-edit-ChiPhiDM').modal('show');
        });        

        $("#ddl-show-pageChiPhiDM").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableChiPhiDM(true);
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

    }

    function resetFormAddEditChiPhiDM() {
        $('#hidChiPhiDMId').val('');
        $('#hidInsertChiPhiDMId').val(''); 

        $('#ddlAddEditIsChiPhiTang')[0].selectedIndex = 0;
        $('#ddlAddEditTenLoaiChiPhi')[0].selectedIndex = 0;
        $('#txtAddEditTenChiPhi').val('');
        $('#ddlAddEditTenChiPhiBang')[0].selectedIndex = 0;
        $('#txtAddEditSoTienHeSo').val(''); 
        $('#txtAddEditSoThuTu').val('1'); 

        $('#txtAddEditSoTienHeSo').val('0'); 
        $('#txtAddEditSoNgayGio').val('0'); 
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
                            TenChiPhi: item.TenChiPhi,
                            IsChiPhiTang: item.IsChiPhiTang === true ? 'Tăng' : 'Giảm',
                            TenLoaiChiPhi: item.TenLoaiChiPhi,                           
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
    
    function isFormMainValidate() {
        if ($('#frmMainChiPhiDM').valid()) {
            return true;
        }
        else {
            return false;
        }
    }

    function formMainValidate() {
        jQuery.validator.addMethod("isDanhMuc", function (value, element) {
            if (value === "%")
                return false;
            else
                return true;
        },
            "Xin chọn danh mục.."
        );

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );

        $('#frmMainChiPhiDM').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlAddEditIsChiPhiTang: {
                    required: true, isDanhMuc: true
                },
                ddlAddEditTenLoaiChiPhi: {
                    required: true, isDanhMuc: true
                },
                txtAddEditTenChiPhi: {
                    required: true
                },
                ddlAddEditTenChiPhiBang: {
                    required: true, isDanhMuc: true
                },
                txtAddEditSoTienHeSo: {
                    required: true, number: true
                },
                txtAddEditSoThuTu: {
                    required: true, number: true
                }
            },
            messages: {
                ddlAddEditIsChiPhiTang: {
                    required: "Chọn chi phí tăng hoặc giảm!"
                },
                ddlAddEditTenLoaiChiPhi: {
                    required: "Chọn loại chi phí nào!"
                },
                ddlAddEditTenChiPhiBang: {
                    required: "Chọn tên bảng chi phí!"
                }
            }
        });

    }

    function SaveChiPhidm() {
        var chiphiid = $('#hidChiPhiDMId').val();
        var insertchiphiid = $('#hidInsertChiPhiDMId').val();

        var ischiphitang = $('#ddlAddEditIsChiPhiTang').val() === "1" ? true : false;
        var tenloaichiphi = $('#ddlAddEditTenLoaiChiPhi').val();
        var tenchiphi = $('#txtAddEditTenChiPhi').val();
        var tenchiphibangid = $('#ddlAddEditTenChiPhiBang').val();
        var songaysogio = $('#txtAddEditSoNgayGio').val();
        var sotienheso = $('#txtAddEditSoTienHeSo').val();
        var sothutu = $('#txtAddEditSoThuTu').val();

        //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());       

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {

            $.ajax({
                type: "POST",
                url: "/Admin/chiphidm/AddUpdateChiPhi",
                data: {
                    Id: 1,
                    InsertChiPhiId: insertchiphiid,

                    IsChiPhiTang: ischiphitang,
                    ChiPhiLoaiId: tenloaichiphi,
                    TenChiPhi: tenchiphi,
                    ChiPhiBangDanhMucId: tenchiphibangid,
                    SoNgayCongXMucLuongNgay: songaysogio,
                    ChiPhiKhac: sotienheso,
                    Stt: sothutu
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
                        tedu.notify('Tạo danh mục chi phí lương.', 'success');

                        loadTableChiPhiDM(true);

                        $('#modal-add-edit-ChiPhiDM').modal('hide');

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu danh mục chi phí lương', 'error');
                    tedu.stopLoading();
                }
            });
            return false;
        }
    }


    function UpdateChiPhidm() {
        var chiphiid = $('#hidChiPhiDMId').val();
        var insertchiphiid = $('#hidInsertChiPhiDMId').val();

        var ischiphitang = $('#ddlAddEditIsChiPhiTang').val() === "1" ? true : false;
        var tenloaichiphi = $('#ddlAddEditTenLoaiChiPhi').val();
        var tenchiphi = $('#txtAddEditTenChiPhi').val();
        var tenchiphibangid = $('#ddlAddEditTenChiPhiBang').val();

        var songaysogio = $('#txtAddEditSoNgayGio').val();

        var sotienheso = $('#txtAddEditSoTienHeSo').val();
        var sothutu = $('#txtAddEditSoThuTu').val();

        //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());       

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {

            $.ajax({
                type: "POST",
                url: "/Admin/chiphidm/AddUpdateChiPhi",
                data: {
                    Id: chiphiid,
                    InsertChiPhiId: insertchiphiid,

                    IsChiPhiTang: ischiphitang,
                    ChiPhiLoaiId: tenloaichiphi,
                    TenChiPhi: tenchiphi,
                    ChiPhiBangDanhMucId: tenchiphibangid,
                    SoNgayCongXMucLuongNgay: songaysogio,
                    ChiPhiKhac: sotienheso,
                    Stt: sothutu
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
                        tedu.notify('Tạo danh mục chi phí lương.', 'success');

                        loadTableChiPhiDM(true);

                        $('#modal-add-edit-ChiPhiDM').modal('hide');

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu danh mục chi phí lương', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function loadChiPhi(chiphiid) {
        $.ajax({
            type: "GET",
            url: "/Admin/chiphidm/GetKhenThuongId",
            data: { chiphiId: chiphiid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var chiphi = response.Result.Results[0];

                $('#ddlAddEditIsChiPhiTang').val(chiphi.IsChiPhiTang === true ? "1" : "2");
                $('#ddlAddEditTenLoaiChiPhi').val(chiphi.ChiPhiLoaiId);
                $('#txtAddEditTenChiPhi').val(chiphi.TenChiPhi);
                $('#ddlAddEditTenChiPhiBang').val(chiphi.ChiPhiBangDanhMucId);
                $('#txtAddEditSoTienHeSo').val(chiphi.ChiPhiKhac);
                $('#txtAddEditSoNgayGio').val(chiphi.SoNgayCongXMucLuongNgay);
                $('#txtAddEditSoThuTu').val(chiphi.Stt);             
               
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function deleteChiPhi(chiphiid) {
        var insertchiphiid = $('#hidInsertChiPhiDMId').val();

        tedu.confirm('Bạn có chắc chắn xóa Chi phí lương này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/chiphidm/DeleteChiPhi",
                data: {
                    Id: chiphiid,
                    InsertChiPhiId: insertchiphiid
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                    $('#hidInsertChiPhiDMId').val(0);
                    loadTableChiPhiDM(true);
                },
                error: function (status) {
                    tedu.notify('Xóa Chi phí lương này lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

}