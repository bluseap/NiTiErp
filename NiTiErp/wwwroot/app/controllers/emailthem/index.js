var emailthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var emailsent = new emailsentController();
    var sentfile = new sentfileController();

    this.initialize = function () {

        loadKhuVuc();

        registerEvents();

        emailsent.initialize();
        sentfile.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btn-SoanEmailNoiBo").on('click', function (e) {
            e.preventDefault();           

            $('#modal-add-edit-EmailSent').modal('show');
        });

    }

    function loadKhuVuc() {

    }

    function loadData() {

    }

}