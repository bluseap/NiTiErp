var hesoluongController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditHeSoLuong = new addedithesoluongController();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditChucVuNV.initialize();
    }

    function registerEvents() {

    }

    function loadKhuVuc() {

    }

}