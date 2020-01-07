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
            var codenoibosentfileGuid = $("#hidCodeEmailNoiBoNhanSentFileGuid").val();

            if (codenoiboGuid !== "0") {
                $("#hidInsCodeEmailNoiBoNhanId").val("1");                   
            }
            else {
                $("#hidInsCodeEmailNoiBoNhanId").val("0");
                var newGuid = newGuid2();
                $("#hidCodeEmailNoiBoNhanGuid").val(newGuid); 
            }

            if (codenoibosentfileGuid !== "0") {
                $("#hidInsCodeEmailNoiBoNhanSentFileId").val("1");
            }
            else {
                $("#hidInsCodeEmailNoiBoNhanSentFileId").val("0");
            }
        });

    }    

    function newGuid2() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadKhuVuc() {
        
    }

    function loadData() {

    }

}