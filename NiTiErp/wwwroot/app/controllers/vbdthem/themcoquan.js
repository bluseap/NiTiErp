var themcoquanController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();


    this.initialize = function () {

        registerEvents();

        loadData();

    }

    function registerEvents() {

        $('#btnSaveThemCoQuan').on('click', function () {            
            SaveCoQuanBanHanh();
        });
       

    }

    function SaveCoQuanBanHanh() {
        //tedu.notify("nut them co quan", "success");
        var tencoquan = $('#txtThemMoiCoQuanBanHanh').val();
        $.ajax({
            type: "POST",
            url: "/Admin/vbcoquan/AddUpdateVBCoQuan",
            data: {
                Id: 1,
                InsertVanBanCoQuanId: 1,
                Ten: tencoquan
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
                    loadVanBanCoQuanList();
                    tedu.notify('Thêm mới cơ quan ban hành thành công.', 'success');
                    $('#txtThemMoiCoQuanBanHanh').val('');
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

    function loadVanBanCoQuanList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbcoquan/VanBanCoQuanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCoQuanBanHanh').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function loadData() {
       

    }

   

}