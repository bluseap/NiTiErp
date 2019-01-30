var chuaphathanhController = function () {


    this.initialize = function () {

        registerEvents();

    }



    function registerEvents() {

        $('#btnTimChuaPhatHanh').on('click', function () {
            tedu.notify("chua phat hanh", "success");
            //loadTableVBDDaXuLy();
        });

        $("#ddl-show-pageChuaPhatHanh").on('change', function () {
            //tedu.configs.pageSize = $(this).val();
            //tedu.configs.pageIndex = 1;
            //loadTableVBDDaXuLy(true);
        });

    }


}