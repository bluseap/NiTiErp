var cartController = function () {

    //var userCorporationId = $("#hidUserCorporationId").val();
    //var userName = $("#hidUserName").val();   

    var cachedObj = {
        colors: [],
        sizes: []
    }

    this.initialize = function () {
        $.when(loadColors(),
            loadSizes())
            .then(function () {
                loadData();
            });

        registerEvents();
    }

    function registerEvents() {
       
    }

    function loadData() {
        loadCart();

    }

    function loadColors() {
        return $.ajax({
            type: "GET",
            url: "/clientshop/product/GetListAttribute",
            data: {
                attributeId: 1, // Colors
                language: "vi-VN"
            },
            dataType: "json",
            success: function (response) {
                cachedObj.colors = response;
            },
            error: function () {
                tedu.notify('Has an error in progress', 'error');
            }
        });
    }

    function loadSizes() {
        return $.ajax({
            type: "GET",
            url: "/clientshop/product/GetListAttributeAll",
            dataType: "json",
            success: function (response) {
                cachedObj.sizes = response;
            },
            error: function () {
                tedu.notify('Has an error in progress', 'error');
            }
        });
    }

    function getColorOptions(selectedId) {
        var colors = "<select class='form-control ddlColorId'>";
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
        var sizes = "<select class='form-control ddlSizeId'>";
        $.each(cachedObj.sizes, function (i, size) {
            if (selectedId === size.Id)
                sizes += '<option value="' + size.Id + '" selected="select">' + size.Value + '</option>';
            else
                sizes += '<option value="' + size.Id + '">' + size.Value + '</option>';
        });
        sizes += "</select>";
        return sizes;
    }

    function loadCart() {
        $.ajax({
            url: '/clientshop/Cart/GetCart',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                var template = $('#template-cart').html();
                var render = "";
                var totalAmount = 0;
                $.each(response, function (i, item) {
                    render += Mustache.render(template,
                        {
                            ProductId: item.Product.Id,
                            ProductName: item.Product.Name,
                            Image: item.Product.Image,
                            Price: niti.formatNumber(item.Price, 0),
                            Quantity: item.Quantity,
                            Colors: getColorOptions(item.Color === null ? 0 : item.Color.Id),
                            Sizes: getSizeOptions(item.Size === null ? "" : item.Size.Id),
                            Amount: niti.formatNumber(item.Price * item.Quantity, 0),
                            Url: '/' + item.Product.SeoAlias + "-p." + item.Product.Id + ".html"
                        });
                    totalAmount += item.Price * item.Quantity;
                });
                $('#lblTotalAmount').text(niti.formatNumber(totalAmount, 0));
                if (render !== "")
                    $('#table-cart-content').html(render);
                else
                    $('#table-cart-content').html('You have no product in cart');
            }
        });
        return false;
    }

    

}