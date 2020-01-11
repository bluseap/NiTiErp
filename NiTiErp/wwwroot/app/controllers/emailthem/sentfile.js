var sentfileController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    this.newGuid = function () {
        newGuid();
    }

    this.initialize = function () {

        registerEvents();

        loadDataSentFile();

    }

    function registerEvents() {
        $("#fileFileSentFile").on('dragenter', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();            
        });
        $("#fileFileSentFile").on('dragover', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        });
        $("#fileFileSentFile").on('drop', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        });

        UploadSentFile();

        $('body').on('click', '.deleteSentFile', function (e) {
            e.preventDefault();
            var emailSentFileId = $(this).data('id');            
           
            deleteSentFile(emailSentFileId);
        });
        
    }
    
    function UploadSentFile() {
        $("#fileFileSentFile").on('drop', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            //var fileUpload = $(this).get(0);
            //var files = fileUpload.files;
            var files = evt.originalEvent.dataTransfer.files;

            //tedu.notify(files[0].name, "success");//ten file 
            //$('#hidTenFileVanBanDenId').val(files[0].name);
            //$("#fileFileSentFile").html();

            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadEmailSentFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    //fileUpload1.push(path);
                    clearFileInput($("#fileFileSentFile"));
                    //$('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    //filePathVanBanDen = path;
                    tedu.notify('Đã tải file lên thành công!', 'success');
                    //SaveVanBanDenFile();
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });

        $("#fileFileSentFile2").on('change', function () {           

            var fileUpload = $(this).get(0);
            var files = fileUpload.files;
            //var files = evt.originalEvent.dataTransfer.files;
            //tedu.notify(files[0].name, "success");//ten file 
            //$('#hidTenFileVanBanDenId').val(files[0].name);
            //$("#fileFileSentFile").html();            

            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadEmailSentFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (newguid) {
                    $("#hidCodeEmailNoiBoNhanSentFileGuid").val(newguid);   
                    loadEmailSentFileGuid(newguid);
    
                    clearFileInput($("#fileFileSentFile2"));
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
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) {
            tedu.notify(ex, 'error');
        }
    }

    function newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadEmailSentFileGuid(newguid) {
        $.ajax({
            type: 'GET',
            url: '/admin/emailthem/GetPagingByCodeNhanFile',
            data: {
                CodeEmailNoiBoNhanFile: newguid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var dataFile = response.Results;
                if (dataFile.length === 0) {
                    $('#listEmailSentFile').append('<div class="col-md-3 image-upload"> Không có dữ liệu <br/><a href="#" class="fa fa-file-word-o" data-id=" gg" > x</a></div>');
                }
                else {
                    for (var i = 0; i < dataFile.length; i++) {    
                        var fileName = dataFile[i].TenFile.trim();
                        var fileNameLength = fileName.length;
                        var fileNameDocXls = fileName.substr(fileNameLength - 3, fileNameLength);
                        var fileNameDocXlsx = fileName.substr(fileNameLength - 4, fileNameLength);

                        if (fileNameDocXls === "doc" || fileNameDocXlsx === "docx") {
                            $('#listEmailSentFile').append('<div class="col-md-3 image-upload" id="sentfile' + dataFile[i].Id + '" >' + dataFile[i].TenFile +
                                '<br/><a href="#" class="fa fa-file-word-o deleteSentFile" data-id="' + dataFile[i].Id + '" > x</a></div>');
                        }
                        else if (fileNameDocXls === "xls" || fileNameDocXlsx === "xlsx") {
                            $('#listEmailSentFile').append('<div class="col-md-3 image-upload" id="sentfile' + dataFile[i].Id + '" >' + dataFile[i].TenFile +
                                '<br/><a href="#" class="fa fa-file-excel-o deleteSentFile" data-id="' + dataFile[i].Id + '" > x</a></div>');
                        }
                        else if (fileNameDocXls === "jpg" || fileNameDocXls === "png") {
                            $('#listEmailSentFile').append('<div class="col-md-3 image-upload" id="sentfile' + dataFile[i].Id + '" >' + dataFile[i].TenFile +
                                '<br/><a href="#" class="img deleteSentFile" data-id="' + dataFile[i].Id + '" src=" "> x </a></div>');
                        }
                        else {
                            $('#listEmailSentFile').append('<div class="col-md-3 image-upload" id="sentfile' + dataFile[i].Id + '" >' + dataFile[i].TenFile +
                                '<br/><a href="#" class="fa fa-clipboard deleteSentFile" data-id="' + dataFile[i].Id + '" > x</a></div>');
                        }                        
                    }
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Email file.', 'error');
            }
        });
    }

    function deleteSentFile(emailsentfileid) {
        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/emailthem/DeleteSentFile",
                data: {
                    Id: emailsentfileid,
                    username: userName
                },
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {                    
                    $('#sentfile' + emailsentfileid.toString()).remove();

                    tedu.notify('Xóa thành công', 'success'); 
                    tedu.stopLoading();
                },
                error: function (status) {
                    tedu.notify('Xóa file văn bản đến lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadDataSentFile() {

    }


}