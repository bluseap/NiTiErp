var vbdduyetController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var chochuyenchuyenmon = new chochuyenchuyenmonController();
    var dachuyenchuyenmon = new dachuyenchuyenmonController();
    var choduyet = new choduyetController();
    var daduyet = new daduyetController();
    var dathuchien = new dathuchienController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();           

        chochuyenchuyenmon.initialize();
        dachuyenchuyenmon.initialize();
        choduyet.initialize();
        daduyet.initialize();
        dathuchien.initialize(); 

        loadData();
    }

    function registerEvents() {
        

    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;

                var makv = $('#ddlKhuVuc').val();
                chochuyenchuyenmon.loadCountVanBanDen(makv);
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadData() {
        loadVanBanCoQuanBanHanhList();
    }

    function loadVanBanCoQuanBanHanhList() {
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
                tedu.notify('Không có văn bản cơ quan ban hành.', 'error');
            }
        });
    }

}