
var addeditvbcoquanController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    this.loadAddEditVBCoQuan = function (vbcaoquanid) {
        loadVBCoQuan(vbcaoquanid);
    }

    this.initialize = function () {
        registerEvents();
       
    }

    function registerEvents() {
        $('#btnSaveThemCoQuan').on('click', function () {
            var insertvbcoquan = $('#hidInsertThemCoQuanId').val();

            if (insertvbcoquan === 1) {
                SaveCoQuanBanHanh();
            }
            else {
                UpdateCoQuanBanHanh();
            }
            
        });

    }

    function SaveCoQuanBanHanh() {
        //tedu.notify("nut them co quan", "success");
        var coquanbanhanhId = $('#hidThemCoQuanId').val(); 
        var tencoquan = $('#txtThemMoiCoQuanBanHanh').val();
        var sttcoquan = $('#txtSTTThemMoiCoQuanBanHanh').val();
        $.ajax({
            type: "POST",
            url: "/Admin/vbcoquan/AddUpdateVBCoQuan",
            data: {
                Id: coquanbanhanhId,
                InsertVanBanCoQuanId: 1,
                Ten: tencoquan,
                Stt: sttcoquan
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
                    loadTaleVBCoQuan();
                    tedu.notify('Thêm mới cơ quan ban hành thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-ThemCoQuan').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi khởi tạo chi phí.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateCoQuanBanHanh() {
        var tencoquan = $('#txtThemMoiCoQuanBanHanh').val();
        var sttcoquan = $('#txtSTTThemMoiCoQuanBanHanh').val();
        $.ajax({
            type: "POST",
            url: "/Admin/vbcoquan/AddUpdateVBCoQuan",
            data: {
                Id: 1,
                InsertVanBanCoQuanId: 2,
                Ten: tencoquan,
                Stt: sttcoquan
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
                    loadTaleVBCoQuan();
                    tedu.notify('Cập nhật cơ quan ban hành thành công.', 'success');
                    ClearData();
                    $('#modal-add-edit-ThemCoQuan').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Lỗi khởi tạo chi phí.', 'error');
                tedu.stopLoading();
            }
        });
    }

    function ClearData() {
        $('#hidThemCoQuanId').val("");
        $('#hidInsertThemCoQuanId').val(0);

        $('#txtThemMoiCoQuanBanHanh').val("");
        $('#txtSTTThemMoiCoQuanBanHanh').val(0);
    }

    function loadTaleVBCoQuan() {
        var template = $('#table-VBDCoQuan').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var timnhanvien = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            data: {
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/vbcoquan/GetListVBCoQuan',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',

                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblVBCoQuanTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentVBCoQuan').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBCoQuan(response.Result.RowCount, function () {
                        loadTaleVBCoQuan();
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

    function loadVBCoQuan(vbcaoquanid) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbcoquan/GetVanBanCoQuanId",
            data: { vanbancoquanid: vbcaoquanid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vbcoquan = response.Result.Results[0];

                $('#hidThemCoQuanId').val(vbcoquan.Id);
                $('#hidInsertThemCoQuanId').val(2);

                $('#txtThemMoiCoQuanBanHanh').val(vbcoquan.Ten);
                $('#txtSTTThemMoiCoQuanBanHanh').val(vbcoquan.Stt);               

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

}
