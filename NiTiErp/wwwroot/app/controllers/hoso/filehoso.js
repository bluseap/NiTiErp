var filehosoController = function () {
   
    var fileUploadHoSoNhanVien = [];

    this.initialize = function () {       

        registerEvents();
    }

    this.loadSaveFileHoSo = function (hosoid) {
        $('#hidHoSoFileHoSoNhanVienId').val(hosoid);
        loadTableFileHoSo(hosoid);
    }

    function registerEvents() {

        $('#btnSaveFileHoSo').on('click', function () { 
            SaveFileHoSo();
        });

        UploadFileHoSo();

        $("#ddl-show-pageFileHoSo").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableFileHoSo(true);
        });

        $('body').on('click', '.btn-XemFileHoSo', function (e) {
            e.preventDefault();
            var hosofileid = $(this).data('id');
            XemFileHoSo(hosofileid);
        });        

        $('body').on('click', '.btn-XoaFileHoSo', function (e) {
            e.preventDefault();
            var hosofileid = $(this).data('id');
            XoaFileHoSo(hosofileid);
        });  

    }

    function XoaFileHoSo(hosofileid) {
        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/hoso/DeleteHoSoFile",
                data: {
                    Id: hosofileid,
                    InsertHoSoFileId: 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                    loadTableFileHoSo(true);
                },
                error: function (status) {
                    tedu.notify('Xóa file hồ sơ lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function XemFileHoSo(hosofileid) {
        $.ajax({
            type: "GET",
            url: "/Admin/hoso/GetHoSoFileId",
            data: { hosofileId: hosofileid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    tedu.notify("Lỗi file hồ sơ.","error");
                }
                else {
                    var hosofile = response.Result.Results[0];
                    var win = window.open(hosofile.UploadFile1, '_blank');
                    win.focus();
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });   
    }

    function UploadFileHoSo() {
        
        $("#fileFileHoSo").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadFileHoSoNhanVien",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    clearFileHoSoInput($("#fileFileHoSo"));
                    fileUploadHoSoNhanVien.push(path);
                    //$('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    tedu.notify('Đã tải file hồ sơ thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });
    }
    function clearFileHoSoInput(ctrl) {
        try {
            fileUploadHoSoNhanVien = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch  {  }
    }

    function loadTableFileHoSo(isPageChanged) {
        //tedu.notify(hosoid, "success");
        var template = $('#table-FileHoSo').html();
        var render = "";      

        var hosoid = $('#hidHoSoFileHoSoNhanVienId').val();

        $.ajax({
            type: 'GET',
            data: {
                hosonhanvienid: hosoid
            },
            url: '/admin/hoso/GetListHoSoFile',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            UploadFile1: item.UploadFile1,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                           // Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }
                $('#lbl-total-recordsFileHoSo').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentFileHoSo').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSoFile(response.Result.RowCount, function () {
                        loadTableFileHoSo();
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
    function wrapPagingHoSoFile(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULFileHoSo a').length === 0 || changePageSize === true) {
            $('#paginationULFileHoSo').empty();
            $('#paginationULFileHoSo').removeData("twbs-pagination");
            $('#paginationULFileHoSo').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULFileHoSo').twbsPagination({
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

    function SaveFileHoSo() {
        //tedu.notify("luu file ho so", "success");

        var hosofileid = $('#hidHoSoFileId').val(); //
        var inhosofileid = $('#hidInsertHoSoFileId').val("1"); // id = 1 ; para update insert       
        var hosoid = $('#hidHoSoFileHoSoNhanVienId').val();

        $.ajax({
            type: "POST",
            url: "/Admin/hoso/AddUpdateHoSoFile",
            data: {
                Id: 1,
                HoSoNhanVienId: hosoid,
                InsertHoSoFileId: 1,               
                UploadFile1: fileUploadHoSoNhanVien
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
                    tedu.notify('Thông báo.', 'success');

                    loadTableFileHoSo(true);                  

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu file hồ sơ', 'error');
                tedu.stopLoading();
            }
        });
    }

}