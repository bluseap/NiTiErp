var dathuchienController = function () {



    this.initialize = function () {

        registerEvents();

    }

    function registerEvents() {
        $('#btnTimDaThucHien').on('click', function () {
            tedu.notify("da thuc hien", "success");

        });
    }

}