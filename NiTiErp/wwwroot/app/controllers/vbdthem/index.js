var vbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditvbdthem = new addeditvbdthemController();
    var themcoquan = new themcoquanController();
    var fielvanbanden = new filevanbandenController();

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        themcoquan.initialize();
        fielvanbanden.initialize();
        addeditvbdthem.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btn-create").on('click', function (e) {            
            e.preventDefault();
            tedu.notify("them moi van ban den", "success");
            $('#hidInsertVBDThemId').val(1);  // insert
            
            CodeFileGuidId(); // CodeId

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

    }

    function loadData() {
        addeditvbdthem.vanbandanhmuc();

    }

}