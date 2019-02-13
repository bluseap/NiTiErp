var vbdithemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditvbdithem = new addeditvbdithemController();
    //var themcoquan = new themcoquanController();
    var fielvanbandi = new filevanbandiController();
    //var vanbandendientu = new vanbandendientuController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        //themcoquan.initialize();
        fielvanbandi.initialize();
        addeditvbdithem.initialize();
        //vanbandendientu.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            //tedu.notify("them moi van ban den", "success");            

            var makv = $('#ddlKhuVuc').val();
            //addeditvbdthem.loadVanBanDienTuCount(makv);
            addeditvbdithem.sovanbandi();

            $('#hidInsertVBDiThemId').val(1);  // insert
            //$('#hidIsVanBanDenDienTuId').val("False"); // 1 la co; 0 la ko
            //$('#hidVanBanDenDienTuId').val(1);
            CodeFileGuidId(); // CodeId

            $('#modal-add-edit-VBDiThem').modal('show');
        });

    }

    function CodeFileGuidId() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetHoSoNhanVienId',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hosonhanvienId = response;
                $('#hidCodeFileGuidId').val(hosonhanvienId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Tạo hồ sơ Nhân viên.', 'error');
            }
        });
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
                $('#ddlCoQuanBanHanh').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlCoQuanBanHanh').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlCoQuanBanHanh').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                $("#ddlCoQuanBanHanh")[0].selectedIndex = 1;
                $('#ddlCoQuanBanHanh').prop('disabled', true);

                var makv = $('#ddlKhuVuc').val();
                loadVanBanDiSoGetList(makv);

                //loadTableVanBanDen();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadVanBanDiSoGetList(makv) {       
        $.ajax({
            type: 'GET',
            url: '/admin/vbdidmso/VanBanCoQuanGetListKV',
            data: {
                corporationid: makv
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Nam + "-" + item.TenSo + "</option>";
                });
                $('#ddlVanBanDiSoMoi').html(render);
                $('#ddlVanBanDiSoMoi')[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục sổ văn bản đi.', 'error');
            }
        });
    }

    function loadData() {
        addeditvbdithem.vanbandanhmuc();
    } 

}