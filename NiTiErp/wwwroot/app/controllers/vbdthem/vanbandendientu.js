var vanbandendientuController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
   

    this.initialize = function () {

        registerEvents();


    }

    function registerEvents() {

        $('body').on('click', '.editVanBanDienTu', function (e) {
            e.preventDefault();
           
            $('#hidInsertVBDThemId').val(1);  // insert van ban den

            var vanbandientuId = $(this).data('id');
            $('#hidVanBanDenDienTuId').val(vanbandientuId);  

            loadVBDTVanBanDen(vanbandientuId);    

            $('#modal-add-edit-DenDienTu').modal('hide');  
        });

    }

    function loadVBDTVanBanDen(vanbandientuId) {

        var insertVBDThem = $('#hidInsertVBDThemId').val();  // insert
        var isVanBanDienTu = $('#hidIsVanBanDenDienTuId').val("True"); // True la co; False la ko


    }


}