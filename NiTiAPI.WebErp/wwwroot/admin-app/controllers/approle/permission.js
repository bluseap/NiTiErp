
var permissionController = function () {

    var userName = $("#hidUserName").val();

    this.loadFunctionList = function () {
        loadFunctionList();
    } 

    this.fillPermission = function (roleid) {
        fillPermission(roleid);
    }    

    this.initialize = function () {
        registerEvents();
        loadFunctionList();
    }

    function registerEvents() {

    }

    function fillPermission(roleid) {
        $('#ckCheckAllView').prop('checked', false);
        $('#ckCheckAllCreate').prop('checked', false);
        $('#ckCheckAllEdit').prop('checked', false);
        $('#ckCheckAllDelete').prop('checked', false);

        var strUrl = "/Admin/AppRole/GetListFunPer";
        return $.ajax({
            type: "POST",
            url: strUrl,
            data: {
                roleId: roleid
            },
            dataType: "json",
            beforeSend: function () {
                niti.stopLoading();
            },
            success: function (response) {
                var litsPermission = response;
                $.each($('#tblFunction tbody tr'), function (i, item) {
                    if (litsPermission.length === 0) {
                        $(item).find('.ckView').first().prop('checked', false);
                        $(item).find('.ckAdd').first().prop('checked', false);
                        $(item).find('.ckEdit').first().prop('checked', false);
                        $(item).find('.ckDelete').first().prop('checked', false);
                    }
                    else {
                        $.each(litsPermission, function (j, jitem) {                         
                            if (jitem.FunctionId === $(item).data('id')) {
                                $(item).find('.ckView').first().prop('checked', jitem.HasView);
                                $(item).find('.ckAdd').first().prop('checked', jitem.HasCreated);
                                $(item).find('.ckEdit').first().prop('checked', jitem.HasUpdate);
                                $(item).find('.ckDelete').first().prop('checked', jitem.HasDelete);
                            }
                        });
                    }
                });
                niti.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    function loadFunctionList(callback) {
        var strUrl = "/admin/AppRole/GetAllFunPer";
        return $.ajax({
            type: "GET",
            url: strUrl,
            dataType: "json",
            beforeSend: function () {
                niti.startLoading();
            },
            success: function (response) {
                var template = $('#result-data-function').html();
                var render = "";
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Name: item.Name,
                        treegridparent: item.ParentId !== null ? "treegrid-parent-" + item.ParentId : "",
                        Id: item.Id,
                        FunctionId: item.FunctionId,
                        AllowCreate: item.HasCreated ? "checked" : "",
                        AllowEdit: item.HasUpdate ? "checked" : "",
                        AllowView: item.HasView ? "checked" : "",
                        AllowDelete: item.HasDelete ? "checked" : ""
                        //Status: niti.getStatus(item.Status)
                    });
                });
                if (render !== undefined) {
                    $('#lst-data-function').html(render);
                }
                //$('.tree').treegrid();
                $('.tree').treegrid();

                $('#ckCheckAllView').on('click', function () {
                    $('.ckView').prop('checked', $(this).prop('checked'));
                });

                $('#ckCheckAllCreate').on('click', function () {
                    $('.ckAdd').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllEdit').on('click', function () {
                    $('.ckEdit').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllDelete').on('click', function () {
                    $('.ckDelete').prop('checked', $(this).prop('checked'));
                });

                $('.ckView').on('click', function () {
                    if ($('.ckView:checked').length === response.length) {
                        $('#ckCheckAllView').prop('checked', true);
                    } else {
                        $('#ckCheckAllView').prop('checked', false);
                    }
                });
                $('.ckAdd').on('click', function () {
                    if ($('.ckAdd:checked').length === response.length) {
                        $('#ckCheckAllCreate').prop('checked', true);
                    } else {
                        $('#ckCheckAllCreate').prop('checked', false);
                    }
                });
                $('.ckEdit').on('click', function () {
                    if ($('.ckEdit:checked').length === response.length) {
                        $('#ckCheckAllEdit').prop('checked', true);
                    } else {
                        $('#ckCheckAllEdit').prop('checked', false);
                    }
                });
                $('.ckDelete').on('click', function () {
                    if ($('.ckDelete:checked').length === response.length) {
                        $('#ckCheckAllDelete').prop('checked', true);
                    } else {
                        $('#ckCheckAllDelete').prop('checked', false);
                    }
                });
                if (callback !== undefined) {
                    callback();
                }
                niti.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

}