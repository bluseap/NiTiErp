var chuachuyenController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {

        $('#btnTimChuaChuyen').on('click', function () {
            tedu.notify("chua chuyen", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageChuaChuyen").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}