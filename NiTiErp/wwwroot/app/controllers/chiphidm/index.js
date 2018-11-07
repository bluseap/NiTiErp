var chiphidmController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditchiphidm = new addeditchiphidmController();

    this.initialize = function () {
        loadData();

        registerEvents();

        addeditchiphidm.initialize();
    }

    function registerEvents() {

        $("#btn-create").on('click', function () {
            resetFormAddEditChiPhiDM();
            $('#hidInsertChiPhiDMId').val(1); // insert
            $('#modal-add-edit-ChiPhiDM').modal('show');
        });

        $('#btnTimCongTy').on('click', function () {
            tedu.notify("button tim cong", "success");

        });

        $('#txtTimCongTy').on('keypress', function (e) {
            if (e.which === 13) {
                tedu.notify(" tim cong tu", "success");

            }
        });

        $("#btnXuatExcel").on('click', function () {            
            tedu.notify("Xuất excel", "success");

        });
    }

    function resetFormAddEditChiPhiDM() {
        $('#hidChiPhiDMId').val('');
        $('#hidInsertChiPhiDMId').val(''); 
        
    }

    function loadData() {
        loadTableChiPhiDM();

    }

    function loadTableChiPhiDM() {

    }

}