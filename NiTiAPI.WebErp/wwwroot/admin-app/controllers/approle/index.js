var approleController = function () {
    var self = this;
    var userCorporationId = $("#hidUserCorporationId").val();     

    var addeditRole = new addeditroleController();

    this.initialize = function () {     
      
        loadCorporation();

        loadData();

        registerEvents();

        addeditRole.initialize();
        //loadFunctionList();
    }

    function registerEvents() {

        $('#txt-search-keyword').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                addeditRole.loadTableRole();
            }
        });

        $("#btn-search").on('click', function () {
            addeditRole.loadTableRole();
        });

        $("#ddl-show-pageRoles").on('change', function () {
            niti.configs.pageSize = $(this).val();
            niti.configs.pageIndex = 1;
            addeditRole.loadTableRole(true);
        });

        $("#btn-create").on('click', function () {
            addeditRole.clearAddEditData();
            // 1 - Update Role
            $('#hidInsertRole').val(1);

            $('#modal-add-edit').modal('show');
        });       

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var roleId = $(this).data('id');    
            // 2 - Update Role
            $('#hidInsertRole').val(2);
            loadEditRole(roleId);            
        });


       
        //Grant permission
        //$('body').on('click', '.btn-grant', function () {
        //    //$('#hidRoleId').val($(this).data('id'));
        //    //$.when(loadFunctionList())
        //    //    .done(fillPermission($('#hidRoleId').val()));
        //    //$('#modal-grantpermission').modal('show');

        //    $('#hidRoleId').val($(this).data('id'));

        //    var roleid = $('#hidRoleId').val();
        //    tedu.notify(roleid, "success");
        //    fillPermission(roleid);

        //    $('#modal-grantpermission').modal('show');
        //});        

        //$('body').on('click', '.btn-delete', function (e) {
        //    e.preventDefault();
        //    var that = $(this).data('id');
        //    tedu.confirm('Are you sure to delete?', function () {
        //        $.ajax({
        //            type: "POST",
        //            url: "/Admin/Role/Delete",
        //            data: { id: that },
        //            beforeSend: function () {
        //                tedu.startLoading();
        //            },
        //            success: function (response) {
        //                tedu.notify('Delete successful', 'success');
        //                tedu.stopLoading();
        //                loadData();
        //            },
        //            error: function (status) {
        //                tedu.notify('Has an error in deleting progress', 'error');
        //                tedu.stopLoading();
        //            }
        //        });
        //    });
        //});

        //$("#btnSavePermission").off('click').on('click', function () {
        //    var listPermmission = [];
        //    $.each($('#tblFunction tbody tr'), function (i, item) {
        //        listPermmission.push({
        //            RoleId: $('#hidRoleId').val(),
        //            FunctionId: $(item).data('id'),
        //            CanRead: $(item).find('.ckView').first().prop('checked'),
        //            CanCreate: $(item).find('.ckAdd').first().prop('checked'),
        //            CanUpdate: $(item).find('.ckEdit').first().prop('checked'),
        //            CanDelete: $(item).find('.ckDelete').first().prop('checked'),
        //        });
        //    });
        //    $.ajax({
        //        type: "POST",
        //        url: "/admin/role/SavePermission",
        //        data: {
        //            listPermmission: listPermmission,
        //            roleId: $('#hidRoleId').val()
        //        },
        //        beforeSend: function () {
        //            tedu.startLoading();
        //        },
        //        success: function (response) {
        //            tedu.notify('Save permission successful', 'success');
        //            $('#modal-grantpermission').modal('hide');
        //            tedu.stopLoading();
        //        },
        //        error: function () {
        //            tedu.notify('Has an error in save permission progress', 'error');
        //            tedu.stopLoading();
        //        }
        //    });
        //});
    };

    function loadFunctionList(callback) {
        var strUrl = "/admin/Function/GetAll";
        return $.ajax({
            type: "GET",
            url: strUrl,
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var template = $('#result-data-function').html();
                var render = "";
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Name: item.Name,
                        treegridparent: item.ParentId !== null ? "treegrid-parent-" + item.ParentId : "",
                        Id: item.Id,
                        AllowCreate: item.AllowCreate ? "checked" : "",
                        AllowEdit: item.AllowEdit ? "checked" : "",
                        AllowView: item.AllowView ? "checked" : "",
                        AllowDelete: item.AllowDelete ? "checked" : "",
                        Status: tedu.getStatus(item.Status)
                    });
                });
                if (render !== undefined) {
                    $('#lst-data-function').html(render);
                }
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
                tedu.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    function fillPermission(roleId) {
        $('#ckCheckAllView').prop('checked', false);
        $('#ckCheckAllCreate').prop('checked', false);
        $('#ckCheckAllEdit').prop('checked', false);
        $('#ckCheckAllDelete').prop('checked', false);

        var strUrl = "/Admin/Role/ListAllFunction";
        return $.ajax({
            type: "POST",
            url: strUrl,
            data: {
                roleId: roleId
            },
            dataType: "json",
            beforeSend: function () {
                tedu.stopLoading();
            },
            success: function (response) {
                var litsPermission = response;
                $.each($('#tblFunction tbody tr'), function (i, item) {
                    $.each(litsPermission, function (j, jitem) {
                        if (jitem.FunctionId === $(item).data('id')) {
                            $(item).find('.ckView').first().prop('checked', jitem.CanRead);
                            $(item).find('.ckAdd').first().prop('checked', jitem.CanCreate);
                            $(item).find('.ckEdit').first().prop('checked', jitem.CanUpdate);
                            $(item).find('.ckDelete').first().prop('checked', jitem.CanDelete);
                        }
                    });
                });

                //if ($('.ckView:checked').length === $('#tblFunction tbody tr .ckView').length) {
                //    $('#ckCheckAllView').prop('checked', true);
                //}
                //else {
                //    $('#ckCheckAllView').prop('checked', false);
                //}

                //if ($('.ckAdd:checked').length === $('#tblFunction tbody tr .ckAdd').length) {
                //    $('#ckCheckAllCreate').prop('checked', true);
                //}
                //else {
                //    $('#ckCheckAllCreate').prop('checked', false);
                //}

                //if ($('.ckEdit:checked').length === $('#tblFunction tbody tr .ckEdit').length) {
                //    $('#ckCheckAllEdit').prop('checked', true);
                //}
                //else {
                //    $('#ckCheckAllEdit').prop('checked', false);
                //}

                //if ($('.ckDelete:checked').length === $('#tblFunction tbody tr .ckDelete').length) {
                //    $('#ckCheckAllDelete').prop('checked', true);
                //}
                //else {
                //    $('#ckCheckAllDelete').prop('checked', false);
                //}

                tedu.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    


    function loadData() {

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
                $('#ddlAddUpdateCorporation').html(render);
                
                if (userCorporationId !== "1") {
                    $('#ddlCorporation').prop('disabled', true);
                    $('#ddlAddUpdateCorporation').prop('disabled', true);
                }
                else {
                    $('#ddlCorporation').prop('disabled', false);
                    $('#ddlAddUpdateCorporation').prop('disabled', false);
                }

                $("#ddlCorporation")[0].selectedIndex = 1;
                $("#ddlAddUpdateCorporation")[0].selectedIndex = 1;         

                addeditRole.loadTableRole();
            },
            error: function () {                
                niti.notify(resources['NotFound'], 'error');
            }
        });
    }

    function loadEditRole(roleid) {
        $.ajax({
            type: "GET",
            url: "/Admin/AppRole/GetRoleId",
            data: { id: roleid },
            dataType: "json",
            beforeSend: function () {
                niti.startLoading();
            },
            success: function (response) {
                var role = response;

                $('#hidRoleId').val(role.Id);               

                $('#ddlAddUpdateCorporation').val(role.CorporationId);
                $('#txtRoleName').val(role.Name);
                $('#txtRoleDescription').val(role.Description);

                $('#modal-add-edit').modal('show');
                niti.stopLoading();
            },
            error: function (status) {
                niti.notify(status, 'error');
                niti.stopLoading();
            }
        });
    }

}