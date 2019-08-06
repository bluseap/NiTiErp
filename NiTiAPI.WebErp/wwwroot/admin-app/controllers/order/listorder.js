
var listOrderController = function () {

    var userName = $("#hidUserName").val();
    var cachedObj = {
        colors: [],
        sizes: []
    };

    this.loadTableListOrder = function (orderId) {
        loadTableListOrder(orderId);
    }
    
    this.initialize = function () {     
        loadAttributeSize();
        loadColors();  
        loadAllSizes();
        registerEvents();
        quantitiesClearData();
    }

    function registerEvents() {
        $("#btnSaveListOrder").on('click', function () {
            var insertListOrderQuantites = $('#hidInsertListOrderQuantities').val();

            if (insertListOrderQuantites === "1") // insert
            {
                saveListOrderQuantity();
            }
            else if (insertListOrderQuantites === "2") // update
            {
                updateListOrderQuantity();
            }
            else {
                niti.notify(resources["CreateTableError"], "error");
            }
        });

        $('#btn-add-quantityListOrder').on('click', function () {
            var attributeSize = $("#ddlAttributeSize").val();

            if (attributeSize !== "0") {
                var template = $('#template-table-quantity').html();
                var render = Mustache.render(template, {
                    Id: 0,
                    Colors: getColorOptions(null),
                    Sizes: getSizeOptions(null),
                    Quantity: 0
                });
                $('#table-quantity-contentListOrder').append(render);
            }
            else {
                niti.notify(resources["BeforeAdd"], "error");
            }
        });

        $('body').on('click', '.btn-delete-quantityListOrder', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });

        $("#ddlAttributeSize").on('change', function () {
            var attributeId = $("#ddlAttributeSize").val();
            //loadSizes(attributeId);
        });       
       
    }   

    function quantitiesClearData() {
        $('#hidInsertListOrderQuantities').val(0);
    }

    function getColorOptions(selectedId) {
        var colors = "<select class='form-control ddlColorId' >";
        $.each(cachedObj.colors, function (i, color) {
            if (selectedId === color.Id)
                colors += '<option value="' + color.Id + '" selected="select">' + color.Value + '</option>';
            else
                colors += '<option value="' + color.Id + '">' + color.Value + '</option>';
        });
        colors += "</select>";
        return colors;
    }

    function getSizeOptions(selectedId) {
        var sizes = "<select class='form-control ddlSizeId' id='ddlSelectSizeId'>";
        $.each(cachedObj.sizes, function (i, size) {
            if (selectedId === size.Id)
                sizes += '<option value="' + size.Id + '" selected="select">' + size.Value + '</option>';
            else
                sizes += '<option value="' + size.Id + '">' + size.Value + '</option>';
        });
        sizes += "</select>";
        return sizes;
    }

    function loadAttributeSize() {
        return $.ajax({
            type: 'GET',
            url: '/admin/product/GetAttributeSize',
            data: {
                codeSize: "kich-co",
                languageId: "vi-VN"
            },
            dataType: 'json',
            success: function (response) {
                var choosen = resources["Choose"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlAttributeSize').html(render);
                $("#ddlAttributeSize")[0].selectedIndex = 0;

            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadColors() {
        return $.ajax({
            type: "GET",
            url: "/Admin/AttributeOptionValue/GetListAttribute",
            data: {
                attributeId: 1, // Colors
                language: "vi-VN"
            },
            dataType: "json",
            success: function (response) {
                cachedObj.colors = response;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadSizes(attributeId) {
        return $.ajax({
            type: "GET",
            url: "/Admin/AttributeOptionValue/GetListAttribute",
            data: {
                attributeId: attributeId, // Sizes
                language: "vi-VN"
            },
            dataType: "json",
            success: function (response) {
                cachedObj.sizes = response;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }    

    function loadAllSizes() {
        return $.ajax({
            type: "GET",
            url: "/admin/order/GetListAttriSizes",
            data: {
                codeSize: 'kich-co',
                language: 'vi-VN'
            },
            dataType: "json",
            success: function (response) {
                cachedObj.sizes = response;
            },
            error: function () {
                niti.notify('Has an error in progress', 'error');
            }
        });
    }

    function loadTableListOrder(orderid) {
        $.ajax({
            url: '/admin/order/GetListOrderDetail',
            data: {
                orderId: orderid,
                languageId: "vi-VN"
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.length === 0) {
                    $('#hidInsertListOrderQuantities').val(1); // insert
                }
                else {
                    $('#hidInsertListOrderQuantities').val(2); // update                   
                }

                var render = '';
                var template = $('#template-table-orderDetails').html();
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Id: item.Id,
                        ProductName: item.ProductName,
                        Colors: getColorOptions(item.AttributeOptionValueIdColor),
                        Sizes: getSizeOptions(item.AttributeOptionValueIdSize),
                        Quantity: item.Quantity
                    });
                });
                $('#table-quantity-orderDetails').html(render);
            }
        });
    }

    function saveListOrderQuantity() {

    }

    function updateListOrderQuantity() {

    }

}