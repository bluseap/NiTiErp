var chuaduyetController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {

        $('#btnTimChuaDuyet').on('click', function () {
            tedu.notify("chua duyet", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageChuaDuyet").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}