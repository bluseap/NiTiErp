var BaseController = function () {

    this.initialize = function () {
        registerEvents();
    }

    function registerEvents() {
        //$('body').on('click', '.add-to-cart', function (e) {
        //    e.preventDefault();
        //    var id = $(this).data('id');
        //    $.ajax({
        //        url: '/Cart/AddToCart',
        //        type: 'post',
        //        data: {
        //            productId: id,
        //            quantity: 1,
        //            color: 0,
        //            size: 0
        //        },
        //        success: function (response) {
        //            tedu.notify('The product was added to cart', 'success');
        //            loadHeaderCart();
        //        }
        //    });
        //});

        $('body').on('click', '.remove-cart', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $.ajax({
                url: '/clientshop/Cart/RemoveFromCart',
                type: 'post',
                data: {
                    productId: id
                },
                success: function () {
                    niti.notify(resources["RemoveCartOK"], 'success');
                    loadHeaderCart();
                }
            });        
            
        });
    }

    function loadHeaderCart() {
        $("#headerCart").load("/clientshop/AjaxContent/HeaderCart");
    }

}