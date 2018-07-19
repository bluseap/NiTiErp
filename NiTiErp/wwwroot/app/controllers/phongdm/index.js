var qdkyluatController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditPhongDM = new addeditphongdmController();

    //var images = [];

    this.initialize = function () {
        loadKhuVuc();

        registerEvents();

        addeditPhongDM.initialize();
    }

    function registerEvents() {

    }

    function loadKhuVuc() {

    }

}