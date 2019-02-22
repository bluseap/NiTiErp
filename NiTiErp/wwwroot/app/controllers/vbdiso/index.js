
var vbdisoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var sotatca = new sotatcaController();
    //var chuaphathanh = new chuaphathanhController();
    //var chuaduyet = new chuaduyetController();
    //var chuaxuly = new chuaxulyController();
    //var chuachuyen = new chuachuyenController();
    //var luutam = new luutamController();
    //var _quatrinhxuly = new _quatrinhxulyController();

    this.initialize = function () {        

        loadKhuVuc();

        registerEvents();

        sotatca.initialize();

        //chuaduyet.initialize();
        //chuaxuly.initialize();
        //chuachuyen.initialize();
        //luutam.initialize();
        //chuaphathanh.initialize();
        //_quatrinhxuly.initialize();

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
                //chuaphathanh.loadCountVBChuaPhatHanh(makv);
                //loadCountVanBanDen(makv);
                loadVanBanDiSoList(makv);
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
                $('#ddlShareCoQuanBanHanhDi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản cơ quan ban hành.', 'error');
            }
        });
    }

    function loadVanBanDiSoList(makv) {
        //var makv = $('#ddlKhuVuc').val();
        var datetimeNow = new Date();
        var namhientai = datetimeNow.getFullYear();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdidmso/VanBanCoQuanGetList',
            data: {
                corporationid: makv,
                nam: namhientai
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Nam + " - " + item.TenSo + "</option>";
                });
                $('#ddlShareVanBanDiSo').html(render);
                $('#ddlShareVanBanDiSo')[0].selectedIndex = 0;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đến.', 'error');
            }
        });
    }

}