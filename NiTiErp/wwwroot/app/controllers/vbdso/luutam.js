var luutamController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {
        $('#btnTimLuuTam').on('click', function () {
            tedu.notify("luu tam", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageLuuTam").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}