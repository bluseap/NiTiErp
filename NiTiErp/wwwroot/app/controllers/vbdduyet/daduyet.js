var daduyetController = function () {

  

    this.initialize = function () {

        registerEvents();

    }

    function registerEvents() {
        $('#btnTimDaDuyet').on('click', function () {
            tedu.notify("da duyet", "success");

        });
    }

}