var productController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var userName = $("#hidUserName").val();

    var addeditproduct = new addeditproductController();
    var imageproduct = new imageproductController();
    var importexcel = new importexcelController();
    var quantityProduct = new quantityController();
    var wholeprice = new wholepriceController();

    this.initialize = function () {

        loadCorporation();
        loadData();
        registerEvents();

        addeditproduct.initialize();
        imageproduct.initialize();
        importexcel.initialize();
        quantityProduct.initialize();
        wholeprice.initialize();
    }

    function registerEvents() {

        $('#txtKeyword').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                addeditproduct.loadTableProduct();
            }
        });

        $("#btnSearch").on('click', function () {
            addeditproduct.loadTableProduct();
        });

        $("#ddl-show-pageProducts").on('change', function () {
            niti.configs.pageSize = $(this).val();
            niti.configs.pageIndex = 1;
            addeditproduct.loadTableProduct(true);
        });

        $("#btnCreate").on('click', function () {
            addeditproduct.AddEditClearData();
            // 1 - insert Product
            $('#hidInsertProduct').val(1);

            $('#modal-add-edit').modal('show');
        });   
        
    }

    function loadCorporation() {
        return $.ajax({
            type: 'GET',
            url: '/admin/Corporation/GetListCorporations',
            dataType: 'json',
            success: function (response) {
                var choosen = resources["Choose"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCorporation').html(render);
                $('#ddlAddEditCorporation').html(render);

                if (userCorporationId !== "1") {
                    $('#ddlCorporation').prop('disabled', true);
                    $('#ddlAddEditCorporation').prop('disabled', true);
                }
                else {
                    $('#ddlCorporation').prop('disabled', false);
                    $('#ddlAddEditCorporation').prop('disabled', false);
                }

                $("#ddlCorporation")[0].selectedIndex = 1;
                $("#ddlAddEditCorporation")[0].selectedIndex = 1;

                addeditproduct.loadTableProduct();               
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadData() {
        addeditproduct.AddEditClearData();
        loadCatalog();
    }

    function loadCatalog() {
        return $.ajax({
            type: 'GET',
            url: '/admin/Catalog/GetListCategory',            
            dataType: 'json',
            success: function (response) {
                var choosen = resources["Choose"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCategorySearch').html(render);
                $("#ddlCategorySearch")[0].selectedIndex = 0;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

}