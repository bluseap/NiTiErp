var vbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditvbdthem = new addeditvbdthemController();
    var themcoquan = new themcoquanController();
    var fielvanbanden = new filevanbandenController();
    var vanbandendientu = new vanbandendientuController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        themcoquan.initialize();
        fielvanbanden.initialize();
        addeditvbdthem.initialize();
        vanbandendientu.initialize();

        loadData();
    }

    function registerEvents() {

        $('#btnTimNoiDung').on('click', function () {
            tedu.notify("tim noi dung nút", "success");
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                tedu.notify("txt tim noi dung nút", "success");
            }
        });

        $("#btn-create").on('click', function (e) {            
            e.preventDefault();
            tedu.notify("them moi van ban den", "success");
            $('#hidInsertVBDThemId').val(1);  // insert
            
            CodeFileGuidId(); // CodeId

            addeditvbdthem.sovanbanden();

            $('#modal-add-edit-VBDThem').modal('show');  
        });

        ////$('body').on('click', '.btn-create', function (e) {           
        ////});

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

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });       
    }

    function loadData() {
        addeditvbdthem.vanbandanhmuc();

    }

}