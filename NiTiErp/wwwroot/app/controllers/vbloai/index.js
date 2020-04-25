var vbloaiController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditvbloai = new addeditvbloaiController();

    this.initialize = function () {

        registerEvents();

        addeditvbloai.initialize();

        loadData();
    }

    function registerEvents() {
        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            addeditvbloai.clearDataAddEdit();

            $('#hidVanBanLoaiId').val(0);
            $('#hidInsertVanBanLoaiId').val(1);  // insert  

            $('#modal-add-edit-VanBanLoai').modal('show');
        });

        $('#btnTimNoiDung').on('click', function () {
            addeditvbloai.loadTableVanBanLoai();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                addeditvbloai.loadTableVanBanLoai();
            }
        });

        $("#ddl-show-pageVanBanLoai").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            addeditvbloai.loadTableVanBanLoai(true);
        });

        $('body').on('click', '.btn-addeditVanBanLoai', function (e) {
            e.preventDefault();
            var vanbanloaiid = $(this).data('id');
          
            $('#hidInsertVanBanLoaiId').val(2); // update

            addeditvbloai.loadAddEditVanBanLoai(vanbanloaiid);
            $('#modal-add-edit-VanBanLoai').modal('show');
        });
    }

    function loadData() {
        addeditvbloai.loadTableVanBanLoai();
    }

}