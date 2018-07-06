var qdkhenthuongController = function () {

    //var images = [];

    this.initialize = function () {

        loadData();

        registerEvents();
    }

    function registerEvents() {
        $("#btn-create").on('click', function () {
            loadData();

            //resetFormAddEditQDKT();            

            $('#modal-add-edit-QDKT').modal('show');
        });
    }

    function loadData() {

    }

    function resetFormAddEditQDKT() {

    }


}