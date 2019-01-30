var chuaxulyController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {

        $('#btnTimChuaXuLy').on('click', function () {
            tedu.notify("chua xu ly", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageChuaXuLy").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}