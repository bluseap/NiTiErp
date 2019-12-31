var _dangxulyController = function () {

    var fileUpload1 = [];

    var daxuly = new daxulyController();
    var xulyroi = new xulyroiController();

    this.initialize = function () {

        registerEvents();

        load_DangXuLyData();
    }

    this.loadTableVBDXuLyFile = function (vanbandenduyetid) {
        loadTableVanBanDenXuLyFileListId(vanbandenduyetid);
    }   

    function registerEvents() {

        $("#btnSaveFileVanBanDen").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDenXuLyFile();
        });

        UploadVanBanDenFile();

        $('body').on('click', '.btnDeleteFile', function (e) {
            e.preventDefault();
            var vanbandenxulyfileid = $(this).data('id');
            deleteVanBanDenXuLyFile(vanbandenxulyfileid);
        });

        $("#btnSaveDangXuLyCLD").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDenXuLy();
        });

    }

    function SaveVanBanDenXuLy() {
        
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        var ghichuxuly = $('#txtGhiChuXuLyDXL').val();
        var ngaychuaxuly = tedu.getFormatDateYYMMDD($('#txtNgayChuaXuLyXuLyDXL').val());

        //var datetimeNow = new Date();
        //var ngayhientai = datetimeNow.getFullYear().toString() + '/' + (datetimeNow.getMonth() + 1).toString() + '/' + datetimeNow.getDay().toString();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/UpdateVanBanDenXuLyCLD",
            data: {
                Id: vanbandenduyetId,
                VanBanDenDuyetId: vanbandenduyetId,
                InsertVBDXuLyLId: 2,
                NgayBatDauXuLy: ngaychuaxuly,
                GhiChuXuLy: ghichuxuly
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
                    tedu.notify('Văn bản xử lý.', 'success');

                    var makv = $('#ddlKhuVuc').val();                    
                    loadCountVBDDangXuLy(makv);
                    loadCountVBDDaXuLyCLD(makv);

                    xulyroi.loadCountVanBanDenXuLyRoi(makv);

                    $('#hidVanBanDenDuyetId').val('');
                    $('#txtGhiChuXuLyDXL').val('');

                    $('#tblContentDangXuLy').html('');

                    $('#modal-add-edit-DangXuLyCLD').modal('hide');

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Văn bản xử lý', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCountVBDDaXuLyCLD(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDaXuLyCLDUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDaXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVBDDangXuLy(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetDangXuLyUser',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDangXuLy').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function deleteVanBanDenXuLyFile(vanbandenxulyfileid) {  
       
        var vanbandenduyetId = $('#hidVanBanDenDuyetId').val();

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/vbdxem/DeleteVanBanDenXuLyFile",
                data: {
                    Id: vanbandenxulyfileid,
                    InsertVBDXuLyFileId: 3 
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');   
                    
                    loadTableVanBanDenXuLyFileListId(vanbandenduyetId);

                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa file văn bản đến lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });

    }

    function UploadVanBanDenFile() {
        $("#fileFileVanBanDen").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            //tedu.notify(files[0].name, "success");//ten file 
            $('#hidTenFileVanBanDenId').val(files[0].name);

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadVanBanDenFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    clearFileInput($("#fileFileVanBanDen"));
                    fileUpload1.push(path);
                    //$('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    //tedu.notify(fileUpload1, "success"); // duong dan file 
                    tedu.notify('Đã tải file lên thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });
    }
    function clearFileInput(ctrl) {
        try {
            fileUpload1 = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) {
            tedu.notify(ex, 'error');
        }
    }

    function load_DangXuLyData() {

        var nowDate = tedu.getFormattedDate(new Date());
        $('#txtNgayChuaXuLyXuLyDXL').val(nowDate);

    }

    function SaveVanBanDenXuLyFile() {
        //tedu.notify("save file van ban xu ly", "success");

        var vanbandenduyetid = $('#hidVanBanDenDuyetId').val();
        var tenfile = $('#hidTenFileVanBanDenId').val();        

        $.ajax({
            type: "POST",
            url: "/Admin/vbdxem/AddUpdateVanBanDenXuLyFile",
            data: {
                Id: 1,
                InsertVBDXuLyFileId: 1,
                VanBanDenXuLyId: vanbandenduyetid,
                TenFile: tenfile,
                DuongDan: fileUpload1
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
                    tedu.notify('Upload file.', 'success');
                    $('#hidInsertFileVanBanDenId').val(0);
                    $('#hidTenFileVanBanDenId').val('');

                    loadTableVanBanDenXuLyFileListId(vanbandenduyetid);
                    $('#modal-add-edit-FileVanBanDenXuLy').modal('hide');
                   
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể upload file văn bản đến.', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadTableVanBanDenXuLyFileListId(vanbandenduyetId) {
        var template = $('#table-FileVanBanDen').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                vanbandenduyetid: vanbandenduyetId
            },
            url: '/admin/vbdxem/GetListVBDXuLyFileListIdPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,                          
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenFile: item.TenFile
                            //CreateDate: tedu.getFormattedDate(item.CreateDate),
                            //Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });                  
                }
                //$('#lblThongBaoTotalRecords').text(response.Result.RowCount);
                if (render !== '') {
                    $('#tbl-contentFileVanBanDen').html(render);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

}