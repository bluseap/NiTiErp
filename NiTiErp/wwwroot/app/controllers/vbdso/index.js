
var vbdsoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var sotatca = new sotatcaController();
    var chuaphathanh = new chuaphathanhController();
    var chuaduyet = new chuaduyetController();    
    var chuaxuly = new chuaxulyController();
    var dangxuly = new dangxulyController();
    var chuachuyen = new chuachuyenController();
    var luutam = new luutamController();
    var _quatrinhxuly = new _quatrinhxulyController();

    this.initialize = function () {
        //tedu.isVanBanDen('VANBANDENSO');

        loadKhuVuc();

        registerEvents();

        sotatca.initialize();
        
        chuaduyet.initialize();
        chuaxuly.initialize();
        dangxuly.initialize();
        chuachuyen.initialize();
        luutam.initialize();

        chuaphathanh.initialize();

        _quatrinhxuly.initialize();

        loadData();
    }

    function registerEvents() {
        $('#boxContentVBDSoTim').slideToggle(200, function () {
            $('#boxPanelVBDSoTim').removeAttr('style');
        });
    }

    function loadCountVanBanDen(makv) {
        luutam.loadCountLuuTam(makv);
        chuachuyen.loadCountChuaChuyen(makv);
        chuaxuly.loadCountChuaXuLy(makv);
        dangxuly.loadCountDangXuLy(makv);
        chuaduyet.loadCountChuaDuyet(makv);
        sotatca.loadCountSoTatCa(makv);
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
                chuaphathanh.loadCountVBChuaPhatHanh(makv);

                loadCountVanBanDen(makv);

                luutam.loadTableVBDSoLuuTam();
                chuachuyen.loadTableVBDSoChuaChuyen();
                //chuaduyet.loadTableVBDChuaDuyet();
                chuaxuly.loadTableVBDChuaXuLy();
                dangxuly.loadTableVBDDangXuLy();
                sotatca.loadTableVBDSoTatCa();
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