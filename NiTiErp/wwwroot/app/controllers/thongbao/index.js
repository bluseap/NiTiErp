var thongbaoController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();  

    var fileUpload1 = [];

    this.initialize = function () {
        loadKhuVuc();

        loadData();

        registerEvents();       
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {

            resetFormAddEditThongBao();

            $('#hidInsertThongbaoId').val(1); // insert

            $('#modal-add-edit-ThongBao').modal('show');

        });

        $('#btnSaveThongBao').on('click', function (e) {
            var insertThongBao = $('#hidInsertThongbaoId').val(); // update

            if (insertThongBao === "2") {
                UpdateThongBao(e);
            }
            else {
                SaveThongBao(e);
            }
        });

        $("#ddl-show-pageThongBao").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableThongBao(true);
        });

        $('body').on('click', '.btn-editThongBao', function (e) {
            e.preventDefault();

            $('#hidInsertThongbaoId').val(2); // update

            var thongbaoId = $(this).data('id');

            $('#hidThongBaoId').val(thongbaoId);

            loadThongBao(thongbaoId);

            $('#modal-add-edit-ThongBao').modal('show');

        });

        $('body').on('click', '.btn-XemFileThongBao1', function (e) {
            e.preventDefault();            

            var thongbaoId = $(this).data('id');            

            loadOpenFileUploadFile1(thongbaoId);            
            
        });

        $('#btnTimNhanVien').on('click', function () {
            loadTableThongBao();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadTableThongBao();
            }
        });

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcelThongBao();
        });

        UploadFile1();

    }

    function UploadFile1() {
        $("#fileInputUploadFile1").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadImageNhanVien",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    clearFileBang1Input($("#fileInputUploadFile1"));
                    fileUpload1.push(path);
                    //$('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    tedu.notify('Đã tải ảnh lên thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });
    }
    function clearFileBang1Input(ctrl) {
        try {
            fileUpload1 = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) {
            tedu.notify(ex, 'error');
        }
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

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadData() {
        loadTableThongBao();
    }

    function loadTableThongBao(isPageChanged) {
        var template = $('#table-ThongBao').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = ""; //$('#ddlPhongBan').val();
        var timnhanvien = $('#btnTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/thongbao/GetListThongBaoPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TieuDe: item.TieuDe,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            NoiDung: item.NoiDung,
                            TenKhuVuc: item.TenKhuVuc,
                            UploadFile1: item.UploadFile1,
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }
                $('#lblThongBaoTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentThongBao').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingThongBao(response.Result.RowCount, function () {
                        loadTableThongBao();
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
    function wrapPagingThongBao(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULThongBao a').length === 0 || changePageSize === true) {
            $('#paginationULThongBao').empty();
            $('#paginationULThongBao').removeData("twbs-pagination");
            $('#paginationULThongBao').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULThongBao').twbsPagination({
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

    function resetFormAddEditThongBao() {
        $('#hidThongBaoId').val('0');
        $('#hidInsertThongbaoId').val('0');

        $('#ddlKhuVuc')[0].selectIndex = 1;
        $('#ddlAddEditKhuVuc')[0].selectIndex = 1;
       
        $('#txtAddEditTieuDe').val('');
        $('#fileInputUploadFile1').val('');
        $('#txtAddEditNoiDung').val('');
    }

    function SaveThongBao(e) {
        e.preventDefault();

        var thongbaoid = $('#hidThongBaoId').val(); //
        var insthongbaoid = $('#hidInsertThongbaoId').val(); // id = 1 ; para update insert

        var makv = $('#ddlAddEditKhuVuc').val();                

        var tieude = $('#txtAddEditTieuDe').val();
        //fileUpload1
        var noidung = $('#txtAddEditNoiDung').val();

        $.ajax({
            type: "POST",
            url: "/Admin/thongbao/AddUpdateThongBao",
            data: {
                Id: thongbaoid,
                InsertThongbaoId: insthongbaoid,
                CorporationId: makv,

                TieuDe: tieude,
                UploadFile1: fileUpload1,
                NoiDung: noidung
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

                    loadTableThongBao(true);

                    $('#modal-add-edit-ThongBao').modal('hide');

                    ThongBaoSent(tieude, noidung, fileUpload1);

                    resetFormAddEditThongBao();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Thông báo', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateThongBao(e) {
        e.preventDefault();

        var thongbaoid = $('#hidThongBaoId').val(); //
        var insthongbaoid = $('#hidInsertThongbaoId').val(); // id = 1 ; para update insert

        var makv = $('#ddlAddEditKhuVuc').val();

        var tieude = $('#txtAddEditTieuDe').val();
        //fileUpload1
        var noidung = $('#txtAddEditNoiDung').val();

        $.ajax({
            type: "POST",
            url: "/Admin/thongbao/AddUpdateThongBao",
            data: {
                Id: thongbaoid,
                InsertThongbaoId: insthongbaoid,
                CorporationId: makv,

                TieuDe: tieude,
                UploadFile1: fileUpload1,
                NoiDung: noidung
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

                    loadTableThongBao(true);

                    $('#modal-add-edit-ThongBao').modal('hide');

                    ThongBaoSent(tieude, noidung, fileUpload1);

                    resetFormAddEditThongBao();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Thông báo', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadThongBao(thongbaoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/thongbao/GetThongBaoId",
            data: { thongbaoId: thongbaoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormAddEditThongBao();
                }
                else {
                    var thongbao = response.Result.Results[0];

                    $('#ddlAddEditKhuVuc').val(thongbao.CorporationId);
                    $('#txtAddEditTieuDe').val(thongbao.TieuDe);
                    fileUpload1.push(thongbao.UploadFile1);
                    $('#txtAddEditNoiDung').val(thongbao.NoiDung);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });

    }

    function loadOpenFileUploadFile1(thongbaoId) {
        $.ajax({
            type: "GET",
            url: "/Admin/thongbao/GetThongBaoId",
            data: { thongbaoId: thongbaoId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormAddEditThongBao();
                }
                else {
                    var thongbao = response.Result.Results[0];

                    //var href = window.location.hostname;
                    //tedu.notify(href, "success");
                    //tedu.notify(window.location.pathname, "success");
                    //tedu.notify(window.location.protocol, "success");
                    //tedu.notify(window.location.assign, "success");
                    //fileUpload1.push(thongbao.UploadFile1);

                    var win = window.open( thongbao.UploadFile1, '_blank');
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

    function ThongBaoSent(tieude, noidung, fileupload) {        
        //var notify;
        //notify = new Notification(
        //    'Bạn có một thông báo mới từ POWACO', // Tiêu đề thông báo
        //    {
        //        //body: 'qqqqFreetuts vừa đăng một bài viết mới.', // Nội dung thông báo
        //        body: tieude,
        //        icon: 'http://powaco.com.vn/content/images/powacmo.png', // Hình ảnh
        //        tag: 'http://powaco.com.vn/' // Đường dẫn 
        //    }
        //);
        //// Thực hiện khi nhấp vào thông báo
        //notify.onclick = function () {
        //    window.location.href = this.tag; // Di chuyển đến trang cho url = tag
        //}

        // Start the connection.
        var connection = new signalR.HubConnectionBuilder()
            .withUrl('/chat')
            .build();

        var name = "name1";
        var message = "message1";
        // Create a function that the hub can call to broadcast messages.
        connection.on('broadcastMessage', function (name, message) {            
            var notify;
            notify = new Notification(
                'Bạn có một thông báo mới từ POWACO', // Tiêu đề thông báo
                {
                    //body: 'qqqqFreetuts vừa đăng một bài viết mới.', // Nội dung thông báo
                    body: tieude,
                    icon: 'http://powaco.com.vn/content/images/powacmo.png', // Hình ảnh
                    tag: 'http://powaco.com.vn/' // Đường dẫn 
                }
            );
            // Thực hiện khi nhấp vào thông báo
            notify.onclick = function () {
                window.location.href = this.tag; // Di chuyển đến trang cho url = tag
            }
        });

        // Transport fallback functionality is now built into start.
        connection.start().then(function () {
            console.log('connection started');       
            connection.invoke('send', name, tieude);
        }).catch(error => {
                console.error(error.message);
        });

    }

    function XuatExcelThongBao() {

    }


}