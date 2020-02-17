var vblinhvucController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditvblinhvuc = new addeditvblinhvucController();

    this.initialize = function () {

        registerEvents();

        addeditvblinhvuc.initialize();

        loadData();
    }

    function registerEvents() {
        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            addeditvblinhvuc.clearDataAddEdit();

            $('#hidVanBanLinhVucId').val(0);
            $('#hidInsertVanBanLinhVucId').val(1);  // insert  

            $('#modal-add-edit-VanBanLinhVuc').modal('show');
        });

        $('#btnTimNoiDung').on('click', function () {
            addeditvblinhvuc.loadTableVanBanLinhVuc();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                addeditvblinhvuc.loadTableVanBanLinhVuc();
            }
        });

        $("#ddl-show-pageVanBanLinhVuc").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            addeditvblinhvuc.loadTableVanBanLinhVuc(true);
        });

        $('body').on('click', '.btn-addeditVanBanLinhVuc', function (e) {
            e.preventDefault();
            var vanbanlinhvucid = $(this).data('id');

            $('#hidInsertVanBanLoaiId').val(2); // update

            addeditvblinhvuc.loadAddEditVanBanLinhVuc(vanbanlinhvucid);
            $('#modal-add-edit-VanBanLinhVuc').modal('show');
        });
    }

    function loadData() {
        addeditvblinhvuc.loadTableVanBanLinhVuc();
    }

}