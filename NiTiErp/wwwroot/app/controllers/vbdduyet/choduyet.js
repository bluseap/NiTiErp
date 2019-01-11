var choduyetController = function () {

   

    this.initialize = function () {

        registerEvents();

    }

    function registerEvents() {

        $('#btnTimChoDuyet').on('click', function () {
            tedu.notify("cho duyet", "success");

        });

    }

}