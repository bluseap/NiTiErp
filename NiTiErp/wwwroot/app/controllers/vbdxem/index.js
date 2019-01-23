
var vbdxemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var chuaxuly = new chuaxulyController();
    var dangxuly = new dangxulyController();
    var daxuly = new daxulyController();
    var tatcaxuly = new tatcaxulyController();
    var _chuaxuly = new _chuaxulyController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();
        
        chuaxuly.initialize();
        dangxuly.initialize();
        daxuly.initialize();
        tatcaxuly.initialize();
        _chuaxuly.initialize();

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
                $('#ddlKhuVuc').prop('disabled', true);

                var makv = $('#ddlKhuVuc').val();
                chuaxuly.loadCountVanBanDenChuaXuLy(makv);
                _chuaxuly.loadCountVBDDangXuLy(makv);

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