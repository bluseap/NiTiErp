var ProductDetailController = function () {

    //var userCorporationId = $("#hidUserCorporationId").val();
    //var userName = $("#hidUserName").val();    
    var colorId = "";
    var sizeId = "";

    this.initialize = function () {
        registerEvents();
        loadData();
    }

    function registerEvents() {

        $('body').on('click', '.btnSearchHeader', function (e) {
            e.preventDefault();
            var cateId = $('#ddlCategoryId').val();
            var search = $('#txtSearchHeader').val();
            searchProduct(cateId, search);
            //alert(cateId + '.' + search + '.' + corname);                 
        });

        $('#txtSearchHeader').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                var cateId = $('#ddlCategoryId').val();
                var search = $('#txtSearchHeader').val();
                searchProduct(cateId, search);
            }
        });

        $('#btnAddToCart').on('click', function (e) {
            e.preventDefault();
            var id = parseInt($(this).data('id'));
            var quantity = parseInt($('#txtQuantity').val());
            

            alert(id + ',' + quantity + ',' + colorId + ',' + sizeId);

            //var colorId = parseInt($('#ddlColorId').val());
            //var sizeId = parseInt($('#ddlSizeId').val());
            //$.ajax({
            //    url: '/Cart/AddToCart',
            //    type: 'post',
            //    dataType: 'json',
            //    data: {
            //        productId: id,
            //        quantity: parseInt($('#txtQuantity').val()),
            //        color: colorId,
            //        size: sizeId
            //    },
            //    success: function () {
            //        tedu.notify('Product was added successful', 'success');
            //        loadHeaderCart();
            //    }
            //});
        });

        $('body').on('click', '.colorBack', function (e) {
            e.preventDefault();
            //alert('den');              
            colorId = 14;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorBack' value=14 ></a></li></ul>";
            $("#ulliColor").html(html);
        });
        $('body').on('click', '.colorRed', function (e) {
            e.preventDefault();
            colorId = 1;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorRed' value=1 ></a></li></ul>";
            $("#ulliColor").html(html);
        });
        $('body').on('click', '.colorOrange', function (e) {
            e.preventDefault();
            colorId = 15;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorOrgane' value=15 ></a></li></ul>";
            $("#ulliColor").html(html);
        });
        $('body').on('click', '.colorGreen', function (e) {
            e.preventDefault();
            colorId = 16;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorGreen' value=16 ></a></li></ul>";
            $("#ulliColor").html(html);
        });
        $('body').on('click', '.colorBlue', function (e) {
            e.preventDefault();
            colorId = 17;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorBlue' value=17 ></a></li></ul>";
            $("#ulliColor").html(html);
        });
        $('body').on('click', '.colorWhite', function (e) {
            e.preventDefault();
            colorId = 7;
            var html = "<h2 class='saider-bar-title'>" + resources['Color']
                + "</h2><ul><li><a class='colorWhile' value=7 ></a></li></ul>";
            $("#ulliColor").html(html);
        });

        $('body').on('click', '.sizeS', function (e) {
            e.preventDefault();    
            sizeId = 18;
            var html = "<h2 class='saider-bar-title'>" + resources['Size']
                + "</h2><ul><li><a class='sizeProduct'>S</a></li></ul>";
            $("#ulliSize").html(html);
        });
        $('body').on('click', '.sizeL', function (e) {
            e.preventDefault();
            sizeId = 19;
            var html = "<h2 class='saider-bar-title'>" + resources['Size']
                + "</h2><ul><li><a class='sizeProduct'>L</a></li></ul>";
            $("#ulliSize").html(html);
        });
        $('body').on('click', '.sizeM', function (e) {
            e.preventDefault();
            sizeId = 20;
            var html = "<h2 class='saider-bar-title'>" + resources['Size']
                + "</h2><ul><li><a class='sizeProduct'>M</a></li></ul>";
            $("#ulliSize").html(html);
        });
        $('body').on('click', '.sizeXL', function (e) {
            e.preventDefault();
            sizeId = 3;
            var html = "<h2 class='saider-bar-title'>" + resources['Size']
                + "</h2><ul><li><a class='sizeProduct'>XL</a></li></ul>";
            $("#ulliSize").html(html);
        });
        $('body').on('click', '.sizeXXL', function (e) {
            e.preventDefault();
            sizeId = 21;
            var html = "<h2 class='saider-bar-title'>" + resources['Size']
                + "</h2><ul><li><a class='sizeProduct'>XXL</a></li></ul>";
            $("#ulliSize").html(html);
        });
       

    }

    function searchProduct(cateId, search) {
        //clientshop/product/search/nitiapp?catelogyId=0&keyword=0&sortBy=lastest&pageSize=24
        var href = "/clientshop/product/search/nitiapp?catelogyId=" + cateId + "&keyword=" + search +
            "&sortBy=lastest&pageSize=12";
        window.open(href, '_parent');
        return false;
    }

    function loadHeaderCart() {
        $("#headerCart").load("/AjaxContent/HeaderCart");
    }

    function loadData() {
        loadCategoty();
        loadSizes();
    }

    function loadCategoty() {
        return $.ajax({
            type: 'GET',
            url: '/clientshop/product/GetListCategory',            
            dataType: 'json',
            success: function (response) {
                var choosen = resources["All"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCategoryId').html(render);
                $("#ddlCategoryId")[0].selectedIndex = 0;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadSizes() {
        return $.ajax({
            type: 'GET',          
            url: "/clientshop/product/GetListAttribute",
            data: {
                attributeId: 2, // Sizes coast
                language: "vi-VN"
            },
            dataType: 'json',
            success: function (response) {
                var choosen = resources["All"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Value + "</option>";
                });
                $('#ddlSelectSize').html(render);
                $("#ddlSelectSize")[0].selectedIndex = 0;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

}