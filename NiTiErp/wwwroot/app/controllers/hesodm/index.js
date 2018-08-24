var hesoluongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditHeSoLuong = new addedithesoluongController();

    //var images = [];
    var datatablehesoluongmoi = [];    

    this.initialize = function () {       

        loadKhuVuc();

        registerEvents();

        loadData();

        addeditHeSoLuong.initialize();        

        //clickDataGrid();
        
    }

    this.loadDataData = function () {       
        
        //this.dataa = loadDataDataMoi();
        //var dataa = [];
        //this.dataa = [{ "ChucVuNhanVienId": "dd", "productname": "Koi", "unitcost": "10" }, { "ChucVuNhanVienId": "dd", "productname": "Koi", "unitcost": "10" }];
        //tedu.notify(data, "success");               

        this.datatablehesoluongmoi = loadTableHeSoLuongReturn(function (d) {            
            //clickDataGrid();
        });        
    }    

    this.clickDataGrid = function () {              

        //var lastIndex;
        //$('#dg').datagrid({
        //    onDblClickRow: function (rowIndex) {
        //        if (lastIndex !== rowIndex) {
        //            $(this).datagrid('endEdit', lastIndex);
        //            $(this).datagrid('beginEdit', rowIndex);
        //        }
        //        lastIndex = rowIndex;
        //    },
        //    onBeginEdit: function (rowIndex) {
        //        var luongtoithieu = $('#txtAddEditMucLuongToiThieuVung').val();

        //        var editors = $('#dg').datagrid('getEditors', rowIndex);
        //        var n1 = $(editors[0].target);
        //        var n2 = $(editors[1].target);
        //        var n3 = $(editors[2].target);

        //        n1.numberbox({
        //            onChange: function () {
        //                var cost = n1.numberbox('getValue') * luongtoithieu;
        //                n2.numberbox('setValue', cost);
        //                //alert(n1.numberbox('getValue'));
        //                //alert(n2.numberbox('getValue'));

        //                //$('#dg').datagrid('acceptChanges');
        //            }
        //        })

        //        var row = $('#dg').datagrid('getSelected');
        //        if (row) {
        //            //alert('Item ID:' + row.Id + "\nPrice:" + row.TenBacLuong);
        //            var hesoluongId = row.Id;
                    
        //            //$('#hidHeSoLuongId').val(hesoluongId);
        //            //$('#hidInsertHeSoLuongId').val('2'); // update

        //            //loadEditHeSoLuong(hesoluongId);
        //            //$('#modal-add-edit-HeSoLuong').modal('show');
        //        } 
        //    },
        //    onEndEdit(index, row) {
        //        var ed = $(this).datagrid('getEditor', {
        //            index: index,
        //            field: 'Id'
        //        });           
        //        alert('Item ID:');
        //    }  

        //});
    }

    function registerEvents() {        

        $('body').on('click', '.btnDMHeSoLuong', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        formMainValidate();

        $("#btn-create").on('click', function () {    
            resetMain();

            $('#hidInsertHeSoLuongId').val('1'); // insert            

            $('#modal-add-edit-HeSoLuong').modal('show');
        });

        $("#btnUpLuongToiThieu").on('click', function () {   
            loadMucLuongToiThieuVung();
            $('#modal-add-edit-MucLuongToiThieuVung').modal('show');
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadChucVu(corporationId);
        });

        $('#lbAddEditKhuVuc').on('change', function () {
            var corporationId = $('#lbAddEditKhuVuc').val();
            loadAddEditChucVu(corporationId);
        });

        $('#txtAddEditHeSo').on('change', function () {
            var heso = $('#txtAddEditHeSo').val();
            var luongtoithieu = $('#txtAddEditMucLuongToiThieuVung').val();

            var mucluong = Math.round(parseFloat(heso) * parseFloat(luongtoithieu));

            $('#txtAddEditMucLuong').val(mucluong);
        });

        $("#btnSaveHeSoLuong").on('click', function () {
            //tedu.notify("dasd", "error");
            var inserthesoluong = $('#hidInsertHeSoLuongId').val();

            if (inserthesoluong === "1") { // insert
                saveHeSoLuong();
            }
            else { // update
                updateHeSoLuong();
            }
        });
       

    }   

    function loadData() {

        loadMucLuongToiThieuVungDoanhNghiep();

        disabledData(true);

        $('#txtAddEditSoThuTu').val('1');
    }    

    function disabledData(para) {
        $('#txtMucLuongToiThieuVungMain').prop('disabled', para);
        $('#txtAddEditMucLuong').prop('disabled', para);
        
    }

    function loadMucLuongToiThieuVungDoanhNghiep() {
        $('#hidMucLuongToiThieuId').val('1');

        var mucluongid = $('#hidMucLuongToiThieuId').val();        

        $.ajax({
            type: "GET",
            url: "/Admin/hesoluong/GetAllMucLuongId",
            data: { mucluongId: mucluongid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetMain();
                }
                else {
                    var mucluongtt = response.Result.Results[0];

                    var mucluongtoithieuvung = mucluongtt.MucLuong;

                    $('#txtMucLuongToiThieuVungMain').val(tedu.formatNumber(mucluongtoithieuvung));                                       
                    $('#txtAddEditMucLuongToiThieuVung').val(mucluongtoithieuvung);

                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });        
    }

    function resetMain() {
        $('#hidHeSoLuongId').val('0');
        $('#hidInsertHeSoLuongId').val('0');

        $('#ddlAddEditKhuVuc')[0].selectedIndex = 1;
        //$('#txtAddEditMucLuongToiThieuVung').val('');
        $('#ddlAddEditChucVu')[0].selectedIndex = 0;
        $('#ddlAddEditBacLuong')[0].selectedIndex = 0;
        $('#txtAddEditHeSo').val('');
        $('#txtAddEditMucLuong').val('');
        $('#txtAddEditSoThuTu').val('1');

        disabledData(true);

        //$('#hidMucLuongToiThieuId').val('0');
        //$('#txtMucLuongToiThieuVungMain').val('');
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlAddEditKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlAddEditKhuVuc').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlAddEditKhuVuc")[0].selectedIndex = 1;

                var makv = $('#ddlKhuVuc').val();

                loadTableHeSoLuong(makv, "");
                loadChucVu(makv);
                loadAddEditChucVu(makv);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadChucVu(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/qdbonhiem/ChucVuKhuVucGetList',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVu').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
            }
        });
    }

    function loadAddEditChucVu(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/qdbonhiem/ChucVuKhuVucGetList',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlAddEditChucVu').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Chức vụ.', 'error');
            }
        });
    }

    function loadTableHeSoLuong(makhuvuc, machucvu) {
        var template = $('#table-DMHeSoLuong').html();
        var render = "";

        //var makhuvuc = $('#ddlKhuVuc').val();        
        //var chucvuid = $('#ddlChucVu').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        $.ajax({
            type: 'GET',
            url: '/admin/hesoluong/HeSoLuongKhuVuc',
            data: {
                corporationId: makhuvuc,
                phongId: "",
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: "",
                chucVuId: machucvu
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    //$.each(response.Result, function (i, item) {
                    //    //render += Mustache.render(template, {
                    //    //    Id: item.Id,
                    //    //    //ChucVuNhanVienId: item.ChucVuNhanVienId,
                    //    //    //TenChucVu: item.TenChucVu,
                    //    //    //MaKhuVuc: item.MaKhuVuc,
                    //    //    //TenKhuVuc: item.TenKhuVuc,
                    //    //    //HeSo: item.HeSo,
                    //    //    //MucLuong: item.MucLuong,
                    //    //    //BacLuongId: item.BacLuongId,
                    //    //    //TenBacLuong: item.TenBacLuong,
                    //    //    //MucLuongToiThieuId: item.MucLuongToiThieuId,
                    //    //    //MucLuongToiThieu: item.MucLuongToiThieu,
                    //    //    //TenMucLuongToiThieu: item.TenMucLuongToiThieu,

                    //    //    //CreateDate: tedu.getFormattedDate(item.CreateDate),
                    //    //    //Status: tedu.getHoSoNhanVienStatus(item.Status)
                    //    //    //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',                         
                    //    //    // Price: tedu.formatNumber(item.Price, 0),
                    //    //});
                    //});

                    render = response.Result;

                    //this.datatablehesoluongmoi = response.Result;
                }
                //$('#ddl-show-pageHopDong').show();
                //$('#item-per-pageHopDong').show();
                //$('#lbl-total-recordsHopDong').text(response.Result.RowCount);


                if (render !== '') {
                    $('#tblContentDMHeSoLuong').html(render);
                }


                //if (response.Result.RowCount !== 0) {
                //    wrapPaging(response.Result.RowCount, function () {
                //        LoadTableHopDong();
                //    },
                //        isPageChanged);
                //}
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }

            
        });
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

        //Init validation
        $('#frmMainHeSoLuong').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                ddlAddEditChucVu: {
                    required: true,
                    isDanhMuc: true
                },
                ddlAddEditBacLuong: {
                    required: true,
                    isDanhMuc: true
                },
                txtAddEditHeSo: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtAddEditHeSo: {
                    required: "Nhập hệ số..",
                    number: "Chỉ nhập số.."
                }
            }
        });
    }
   
    function loadTableHeSoLuongReturn(callback) {
        //var moi = makhuvuc;
        //return moi;   

        var moi ;
        $.ajax({            
            type: 'POST',
            url: '/admin/hesoluong/PostHeSoLuongKhuVuc',
            data: {
                corporationId: userCorporationId,
                phongId: "",
                keyword: "",
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: "",
                chucVuId: ""
            },
            async: false,
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {  
                moi = response.Result; 
                callback(moi);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });      
        return moi;
    }   

    function isFormMainValidate() {
        if ($('#frmMainHeSoLuong').valid()) {
            return true;
        }
        else {
            return false;
        }
    }

    function saveHeSoLuong() {
        var isMainValidate = isFormMainValidate();       

        if (isMainValidate === true) {
            var hesoluongId = $('#hidHeSoLuongId').val();
            //var hosoId = $('#hidHoSoBoNhiemId').val();
            var inserthesoluongId = $('#hidInsertHeSoLuongId').val();

            var makhuvuc = $('#ddlAddEditKhuVuc').val();
            //var luongtoithieu = $('#txtAddEditMucLuongToiThieuVung').val();            
            var chucvu = $('#ddlAddEditChucVu').val();
            var bacluong = $('#ddlAddEditBacLuong').val();
            var heso = $('#txtAddEditHeSo').val();
            var mucluong = $('#txtAddEditMucLuong').val();
            var luongtoithoiid = $('#hidMucLuongToiThieuId').val();
            var sothutu = $('#txtAddEditSoThuTu').val();                

            //var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());            

            $.ajax({
                type: "POST",
                url: "/Admin/hesoluong/AddUpdateHeSoLuong",
                data: {
                    Id: hesoluongId,                   
                    inserthesoluongId: inserthesoluongId,

                    ChucVuNhanVienId: chucvu,
                    BacLuongId: bacluong,
                    HeSo: heso,
                    MucLuong: mucluong,
                    MucLuongToiThieuId: luongtoithoiid,
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
                        tedu.notify('Tạo hệ số lương.', 'success');                        

                        $('#modal-add-edit-HeSoLuong').modal('hide');

                        tedu.stopLoading();

                        var url = window.location.href; 
                        window.location.href = url;
                       
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Quyết định bổ nhiệm', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
           
    }
    
    function updateHeSoLuong() {
        var isMainValidate = isFormMainValidate();

        if (isMainValidate === true) {
            var hesoluongId = $('#hidHeSoLuongId').val();
            //var hosoId = $('#hidHoSoBoNhiemId').val();
            var inserthesoluongId = $('#hidInsertHeSoLuongId').val();

            var makhuvuc = $('#ddlAddEditKhuVuc').val();
            //var luongtoithieu = $('#txtAddEditMucLuongToiThieuVung').val();            
            var chucvu = $('#ddlAddEditChucVu').val();
            var bacluong = $('#ddlAddEditBacLuong').val();
            var heso = $('#txtAddEditHeSo').val();
            var mucluong = $('#txtAddEditMucLuong').val();
            var sothutu = $('#txtAddEditSoThuTu').val();

            //var ngaykyquyetdinh = tedu.getFormatDateYYMMDD($('#txtNgaKyQuyetDinh').val());            

            $.ajax({
                type: "POST",
                url: "/Admin/hesoluong/AddUpdateHeSoLuong",
                data: {
                    Id: hesoluongId,
                    inserthesoluongId: inserthesoluongId,

                    ChucVuNhanVienId: chucvu,
                    BacLuongId: bacluong,
                    HeSo: heso,
                    MucLuong: mucluong,
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
                        tedu.notify('Tạo hệ số lương.', 'success');

                        

                        $('#modal-add-edit-HeSoLuong').modal('hide');

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Quyết định bổ nhiệm', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function loadEditHeSoLuong(hesoluongid) {

    }

    function loadMucLuongToiThieuVung() {

    }

}