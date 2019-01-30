var sotatcaController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {

        $('#btnTimSoTatCa').on('click', function () {
            tedu.notify("So tat ca", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageSoTatCa").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}