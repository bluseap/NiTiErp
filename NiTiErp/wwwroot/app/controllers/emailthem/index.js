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
            $('#modal-add-edit-ViewEmail').modal('show');
        });
        
        //$('body').on('click', '.compose', function (e) {   
        $('#compose').on('click', function (e) {
            e.preventDefault();
            //$('.compose').slideToggle();
            
            var codenoiboGuid = $("#hidCodeEmailNoiBoNhanGuid").val();
            if (codenoiboGuid !== "0") {
                $("#hidInsCodeEmailNoiBoNhanId").val("1");
            }
            else {
                $("#hidInsCodeEmailNoiBoNhanId").val("0");
            }
        });

    }    

    function loadKhuVuc() {
        
    }

    function loadData() {

    }

}