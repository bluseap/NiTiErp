var sentfileController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

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
    }

    function loadDataSentFile() {

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

}