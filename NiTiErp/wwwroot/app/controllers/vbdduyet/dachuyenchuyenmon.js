var dachuyenchuyenmonController = function () {

   

    this.initialize = function () {

        registerEvents();

    }

    function registerEvents() {
        $('#btnTimDaChuyenChuyenMon').on('click', function () {
            tedu.notify("da chuyen chuyen mon", "success");

        });

    }

}