var filevanbandiController = function () {

    //var userCorporationId = $("#hidUserCorporationId").val();

    var fileUpload1 = [];

    this.initialize = function () {

        registerEvents();

        loadData();

    }

    this.vanbandifileid = function (vanbandiid) {
        loadTableVanBanDiFileListId(vanbandiid);
    }

    function registerEvents() {

        $("#btnSaveFileVanBanDi").on('click', function (e) {
            e.preventDefault();
            SaveVanBanDiFile();
        });

        UploadVanBanDiFile();

    }

    function UploadVanBanDiFile() {
        $("#fileFileVanBanDi").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            //tedu.notify(files[0].name, "success");//ten file 
            $('#hidTenFileVanBanDiId').val(files[0].name);

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadVanBanDiFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    $("#hidDuongDanFile").val(path);

                    $("#btnSaveFileVanBanDi").show();
                    $("#btnCancelFileVanBanDi").show();

                    fileUpload1.push(path);
                    clearFileInput($("#fileFileVanBanDi"));                    
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

    function SaveVanBanDiFile() {
        //tedu.notify("save van band en file", "success");

        var insertvanbandifile = $('#hidInsertFileVanBanDiId').val();
        var tenfile = $('#hidTenFileVanBanDiId').val();
        var codeid = $('#hidCodeFileGuidId').val();

        var sotrang = $("#txtFileSoTrang").val();

        var duongdan = $("#hidDuongDanFile").val();

        $.ajax({
            type: "POST",
            url: "/Admin/vbdithem/AddUpdateVanBanDiFile",
            data: {
                Id: 1,
                InsertVanBanDiFileId: insertvanbandifile,
                CodeId: codeid,
                TenFile: tenfile,
                DuongDan: duongdan,
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
                    $('#hidInsertFileVanBanDiId').val(0);
                    $('#hidTenFileVanBanDiId').val('');
                    $("#hidDuongDanFile").val('');

                    $('#modal-add-edit-FileVanBanDi').modal('hide');
                    loadTableVanBanDiFile(codeid);
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể upload file văn bản đến.', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadTableVanBanDiFile(codeid) {

        var template = $('#table-FileVanBanDi').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                CodeId: codeid
            },
            url: '/admin/vbdithem/GetListVanBanDiFilePaging',
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
                        });
                    });
                }
                //$('#lblThongBaoTotalRecords').text(response.Result.RowCount);
                if (render !== '') {
                    $('#tbl-contentFileVanBanDi').html(render);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadTableVanBanDiFileListId(vanbandiid) {
        var template = $('#table-FileVanBanDi').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                vanbandiId: vanbandiid
            },
            url: '/admin/vbdithem/GetListVBDiListIdPaging',
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
                    $('#tbl-contentFileVanBanDi').html(render);
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