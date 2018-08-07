var sidebarController = new function () {
    var userCorporationId = $("#hidUserCorporationId").val();   


    this.initialize = function () {

        registerEvents();

    }

    function registerEvents() {
        $('body').on('click', '.btnfunctionId', function (e) {
            e.preventDefault();

            tedu.notify("sider bar", "success");

        });
    }


}