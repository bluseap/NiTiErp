var filevanbandenController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var fileUpload1 = [];
    var filePathVanBanDen = "";

    this.initialize = function () {

        registerEvents();

        loadData();

    }

    this.vanbandenfileid = function (vanbandenid) {
        loadTableVanBanDenFileListId(vanbandenid);
    }

    function registerEvents() {

        $("#btnSaveFileVanBanDen").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDenFile();
        });

        UploadVanBanDenFile();

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
                    filePathVanBanDen = path;
                    $('#hidDuongDanFile').val(path);

                    fileUpload1.push(path);
                    
                    clearFileInput($("#fileFileVanBanDen"));                    
                    //$('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    
                    tedu.notify('Đã tải file lên thành công!', 'success');
                    //SaveVanBanDenFile();
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });
    }
    function clearFileInput(ctrl) {        
        try {            
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) {
            tedu.notify(ex, 'error');
        }   
    }

    function SaveVanBanDenFile() {
        tedu.notify("save van ban den file", "success");

        var insertvanbandenfile = $('#hidInsertFileVanBanDenId').val();
        var tenfile = $('#hidTenFileVanBanDenId').val();
        var codeid = $('#hidCodeFileGuidId').val();

        var duongdanfile = $('#hidDuongDanFile').val();

        var sotrang = $("#txtFileSoTrang").val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdthem/AddUpdateVanBanDenFile",
            data: {
                Id: 1,
                InsertVanBanDenFileId: insertvanbandenfile,
                CodeId: codeid,
                TenFile: tenfile,
                DuongDan: duongdanfile, //fileUpload1,
                SoTrang: sotrang
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
                    $('#hidDuongDanFile').val('');

                    fileUpload1 = [];
                    filePathVanBanDen = "";

                    $('#modal-add-edit-FileVanBanDen').modal('hide');  
                    loadTableVanBanDenFile(codeid);
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể upload file văn bản đến.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTableVanBanDenFile(codeid) {
      
        var template = $('#table-FileVanBanDen').html();
        var render = "";
       
        $.ajax({
            type: 'GET',
            data: {
                CodeId: codeid
            },
            url: '/admin/vbdthem/GetListVanBanDenFilePaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            CodeId: item.CodeId,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenFile: item.TenFile,
                            SoTrang: item.SoTrang
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

    function loadTableVanBanDenFileListId(vanbandenid) {
        var template = $('#table-FileVanBanDen').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                vanbandenId: vanbandenid
            },
            url: '/admin/vbdthem/GetListVBDListIdPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            CodeId: item.CodeId,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenFile: item.TenFile,
                            SoTrang: item.SoTrang
                            //CreateDate: tedu.getFormattedDate(item.CreateDate),
                            //Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                    $('#hidCodeFileGuidId').val(response.Result.Results[0].CodeId);
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

    function loadData() {


    }



}