var postController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var userName = $("#hidUserName").val();

    var addeditPost = new addeditPostController();   

    this.initialize = function () {
        loadCorporation();
        loadData();
        registerEvents();

        addeditPost.initialize();      
    }

    function registerEvents() {
        $('#txtKeyword').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                addeditPost.loadTablePost();
            }
        });

        $("#btnSearch").on('click', function () {
            addeditPost.loadTablePost();
        });

        $("#ddl-show-pagePost").on('change', function () {
            niti.configs.pageSize = $(this).val();
            niti.configs.pageIndex = 1;
            addeditPost.loadTablePost(true);
        });

        $("#btnCreate").on('click', function () {
            addeditPost.AddEditClearData();
            // 1 - insert Post
            $('#hidInsertPost').val(1);

            $('#modal-add-edit').modal('show');
        });

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var postId = $(this).data('id');
            // 2 - Update Post
            $('#hidInsertPost').val(2);
            //loadEditProduct(productId);
        });

        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var postId = $(this).data('id');
            //deleteProduct(productId);
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

                var corpoId = $('#ddlCorporation').val();
                loadCategoryNews(corpoId);

                //addeditproduct.loadTableProduct();
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadCategoryNews(cororationsId) {
        return $.ajax({
            type: 'GET',
            url: '/admin/CategoryNews/GetCoporationId',
            data: {
                cororationId: cororationsId
            },
            dataType: 'json',
            success: function (response) {
                var choosen = resources["Choose"];
                var render = "<option value='0' >-- " + choosen + " --</option>";
                $.each(response.Items, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCategorySearch').html(render);
                $('#ddlAddEditCategoryNews').html(render);

                $("#ddlCategorySearch")[0].selectedIndex = 0;  
                $("#ddlAddEditCategoryNews")[0].selectedIndex = 0;
            },
            error: function () {
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadData() {

    }

}