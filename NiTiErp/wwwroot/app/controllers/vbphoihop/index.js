var vbphoihopController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditphoihop = new addeditphoihopController();

    this.initialize = function () {       

        registerEvents();

        addeditphoihop.initialize();

        loadData();
    }

    function registerEvents() {
        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            addeditphoihop.clearDataAddEdit();

            $('#hidVBPhoiHopId').val(0);
            $('#hidInsertVBPhoiHopId').val(1);  // insert  

            $('#modal-add-edit-VBPhoiHop').modal('show');
        });

        $('#btnTimNoiDung').on('click', function () {
            addeditphoihop.loadTablePhoiHop();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                addeditphoihop.loadTablePhoiHop();
            }
        });       

        $("#ddl-show-pageVBPhoiHop").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            addeditphoihop.loadTablePhoiHop(true);
        });

        $('body').on('click', '.btn-addeditVBPhoiHop', function (e) {
            e.preventDefault();
            var vbphoihopid = $(this).data('id');

            //$('#hidVBPhoiHopId').val(vbphoihopid);
            $('#hidInsertVBPhoiHopId').val(2); // update

            addeditphoihop.loadAddEditPhoiHop(vbphoihopid);
            $('#modal-add-edit-VBPhoiHop').modal('show');
        });
    }

    function loadData() {
        addeditphoihop.loadTablePhoiHop();
       
    }

}