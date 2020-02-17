var UserController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    this.initialize = function () {
        loadKhuVuc();  

        loadData();

        loadCorporation();

        registerEvents();
    }

    function registerEvents() {
        $('#txtFullName').prop('disabled', true);

        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'en',
            rules: {
                txtFullName: { required: true },
                txtUserName: { required: true,                 
                    remote: {
                        type: "post",
                        url: "/Admin/User/GetUserName",
                        data: {
                            userName: function() { return $("#txtUserName").val(); }
                        },
                        dataType: "json",
                        success: function (response) {                           
                            var username = $("#txtUserName").val();
                            if (response !== undefined) {                                
                                if (response.UserName === username) {
                                    tedu.notify('Trùng User name.', 'error');
                                }
                            }
                        }
                    }
                },
                txtPassword: {
                    required: true,
                    minlength: 6
                },
                txtConfirmPassword: {
                    equalTo: "#txtPassword"
                },
                txtEmail: {
                    required: true,
                    email: true
                }
            }
        });

        $('#txt-search-keyword').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                tedu.startLoading();
                tedu.notify("asdas", "success");
                //loadData();
                loadDataTable();
            }
        });
        $("#btn-search").on('click', function () {
            //loadData();
            loadDataTable();
        });
        $("#ddl-show-page").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            //loadData(true);
            loadDataTable();
        });

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            initRoleList();
            $('#hidHoSoNhanVienId').val('00000000-0000-0000-0000-000000000000');
            $('#modal-add-edit').modal('show');
        });

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');          

            $.ajax({
                type: "GET",
                url: "/Admin/User/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidId').val(data.Id);
                    $('#txtFullName').val(data.FullName);
                    $('#txtUserName').val(data.UserName);
                    $('#txtEmail').val(data.Email);
                    $('#txtPhoneNumber').val(data.PhoneNumber);
                    $('#ddlCorporation').val(data.CorporationId);
                    $('#ckStatus').prop('checked', data.Status === 1);

                    if (data.HoSoNhanVienId !== "00000000-0000-0000-0000-000000000000") {
                        loadHoSoNhanVien(data.HoSoNhanVienId);
                    }
                    else {
                        $('#hidHoSoNhanVienId').val('00000000-0000-0000-0000-000000000000');
                    }

                    initRoleList(data.Roles);

                    disableFieldEdit(true);

                    $('#modal-add-edit').modal('show');
                    tedu.stopLoading();

                },
                error: function () {
                    tedu.notify('Có lỗi xảy ra', 'error');
                    tedu.stopLoading();
                }
            });
        });

        $('body').on('click', '.btn-editpass', function (e) {
            e.preventDefault();
            var that = $(this).data('id');

            $('#txtCurrentPassword').prop('disabled', true);

            $.ajax({
                type: "GET",
                url: "/Admin/User/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    var data = response;

                    $('#hidEditPassId').val(data.Id);                   
                    $('#modal-edit-password').modal('show');

                    tedu.stopLoading();
                },
                error: function () {
                    tedu.notify('Có lỗi xảy ra', 'error');
                    tedu.stopLoading();
                }
            });
        });

        $('#btnSave').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();

                var id = $('#hidId').val();
                var fullName = $('#txtFullName').val();
                var hosoid = $('#hidHoSoNhanVienId').val();
                var userName = $('#txtUserName').val();
                var password = $('#txtPassword').val();
                var email = $('#txtEmail').val();
                var phoneNumber = $('#txtPhoneNumber').val();
                var hinhnhanvien = $('#hidHinhNhanVien').val();
                var roles = [];
                $.each($('input[name="ckRoles"]'), function (i, item) {
                    if ($(item).prop('checked') === true)
                        roles.push($(item).prop('value'));
                });
                var status = $('#ckStatus').prop('checked') === true ? 1 : 0;
                var corporationId = $('#ddlCorporation').val();

                $.ajax({
                    type: "POST",
                    url: "/Admin/User/SaveEntity",
                    data: {
                        Id: id,
                        FullName: fullName,
                        HoSoNhanVienId: hosoid, 
                        UserName: userName,
                        Password: password,
                        Email: email,
                        PhoneNumber: phoneNumber,
                        CorporationId: corporationId,
                        Avatar: hinhnhanvien,
                        Status: status,
                        Roles: roles                        
                    },
                    dataType: "json",
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function () {
                        tedu.notify('Save user succesful', 'success');
                        $('#modal-add-edit').modal('hide');
                        resetFormMaintainance();

                        tedu.stopLoading();
                        loadData(true);
                    },
                    error: function () {
                        tedu.notify('Has an error', 'error');
                        tedu.stopLoading();
                    }
                });
            }
            return false;
        });

        $('#btnSaveEditPass').on('click', function (e) {
            if ($('#frmMainEditPassword').valid()) {
                e.preventDefault();

                var id = $('#hidEditPassId').val();
                var currentpassword = $('#txtCurrentPassword').val();
                var newpassword = $('#txtNewPassword').val();                

                $.ajax({
                    type: "POST",
                    url: "/Admin/User/SaveEditPass",
                    data: {
                        Id: id,
                        CurrentPassword: currentpassword,
                        NewPassword: newpassword                       
                    },
                    dataType: "json",
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function () {
                        tedu.notify('Edit password user succesful', 'success');
                        $('#modal-edit-password').modal('hide');
                        resetFormMaintainance();

                        tedu.stopLoading();                        
                    },
                    error: function () {
                        tedu.notify('Has an error', 'error');
                        tedu.stopLoading();
                    }
                });
            }
            return false;
        });

        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            tedu.confirm('Are you sure to delete?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/User/Delete",
                    data: { id: that },
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function () {
                        tedu.notify('Delete successful', 'success');
                        tedu.stopLoading();
                        loadData();
                    },
                    error: function () {
                        tedu.notify('Has an error', 'error');
                        tedu.stopLoading();
                    }
                });
            });
        });

        $('#btnTimNhanVienAddEdit').on('click', function () {
            LoadTableHoSo();
        });

        $('#txtTimNhanVienAddEdit').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSo();
            }
        });

        $("#ddl-show-pageHoSoTimNhanVien").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSo(true);
        });

        $("#btnTimHoSo").on('click', function () {
            $('#modal-add-edit-TimNhanVien').modal('show');
        });

        $('body').on('click', '.btn-editHoSoTimNhanVien', function (e) {
            e.preventDefault();
            var hosoid = $(this).data('id');      
            $('#hidHoSoNhanVienId').val(hosoid);
            loadHoSoNhanVien(hosoid);                   
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlKhuVucAddEdit').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVucIndex(corporationId);
            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

    }

    function loadPhongKhuVucIndex(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBanAddEdit').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadPhongKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBanIndex').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function disableFieldEdit(disabled) {
        $('#txtUserName').prop('disabled', disabled);
        $('#txtPassword').prop('disabled', disabled);
        $('#txtConfirmPassword').prop('disabled', disabled);
    }

    function resetFormMaintainance() {
        disableFieldEdit(false);

        $('#hidId').val('');

        initRoleList();

        $('#txtFullName').val('');
        $('#txtUserName').val('');
        $('#txtPassword').val('');
        $('#txtConfirmPassword').val('');
        $('input[name="ckRoles"]').removeAttr('checked');
        $('#txtEmail').val('');
        $('#txtPhoneNumber').val('');
        $('#ckStatus').prop('checked', true);

        $('#txtCurrentPassword').val('');
        $('#txtNewPassword').val('');

        $('#hidHoSoNhanVienId').val('00000000-0000-0000-0000-000000000000');

        $('#hidHinhNhanVien').val('');
    }

    function initRoleList(selectedRoles) {
        var makv = userCorporationId;

        $.ajax({
            type: 'GET',
            url: "/Admin/Role/GetAllKhuVuc",
            data: { corporationId: makv },
            dataType: 'json',
            async: false,
            success: function (response) {
                var template = $('#role-template').html();
                var data = response;
                var render = '';
                $.each(data, function (i, item) {
                    var checked = '';
                    if (selectedRoles !== undefined && selectedRoles.indexOf(item.Name) !== -1)
                        checked = 'checked';
                    render += Mustache.render(template,
                        {
                            Name: item.Name,
                            Description: item.Description,
                            Checked: checked
                        });
                });
                $('#list-roles').html(render);
            }
        });

        //$.ajax({
        //    url: "/Admin/Role/GetAll",
        //    type: 'GET',
        //    dataType: 'json',
        //    async: false,
        //    success: function (response) {
        //        var template = $('#role-template').html();
        //        var data = response;
        //        var render = '';
        //        $.each(data, function (i, item) {
        //            var checked = '';
        //            if (selectedRoles !== undefined && selectedRoles.indexOf(item.Name) !== -1)
        //                checked = 'checked';
        //            render += Mustache.render(template,
        //                {
        //                    Name: item.Name,
        //                    Description: item.Description,
        //                    Checked: checked
        //                });
        //        });
        //        $('#list-roles').html(render);
        //    }
        //});
    }

    function loadData(isPageChanged) {
        var makv = $('#ddlKhuVuc').val();

        $.ajax({
            type: "GET",
            url: "/admin/user/GetAllPagingKhuVucCor",
            data: {
                corporationId: makv,
                keyword: $('#txt-search-keyword').val(),
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var template = $('#table-template').html();
                var render = "";
                if (response.RowCount > 0) {
                    $.each(response.Results, function (i, item) {
                        render += Mustache.render(template, {
                            FullName: item.FullName,
                            Id: item.Id,
                            UserName: item.UserName,
                            //Avatar: item.Avatar === undefined ? '<img src="/admin-side/images/user.png" width=25 />' : '<img src="' + item.Avatar + '" width=25 />',
                            Avatar: '<img src="/admin-side/images/powacmo.png" width=25 />' ,
                            //DateCreated: tedu.dateTimeFormatJson(item.DateCreated),
                            DateCreated: tedu.getFormattedDate(item.DateCreated),
                            Status: tedu.getStatus(item.Status)
                        });
                    });
                    $("#lbl-total-records").text(response.RowCount);
                    if (render !== undefined) {
                        $('#tbl-content').html(render);

                    }
                    wrapPaging(response.RowCount, function () {
                        loadData();
                    }, isPageChanged);


                }
                else {
                    $('#tbl-content').html('');
                }
                tedu.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    };

    function wrapPaging(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationUL a').length === 0 || changePageSize === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationUL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                tedu.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
    }

    function loadCorporation() {
        return $.ajax({
            type: "GET",
            url: "/admin/corporation/GetAllCorporations",
            dataType: "json",
            success: function (response) {
                //cachedObj.paymentMethods = response;
                var render = "";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });

                $('#ddlCorporation').html(render);                

            }
        });
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlKhuVucAddEdit').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlKhuVucAddEdit').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlKhuVucAddEdit').prop('disabled', false);
                }

                $("#ddlKhuVuc")[0].selectedIndex = 1;
                loadData();
                loadPhongKhuVucIndex($("#ddlKhuVuc").val());

                $("#ddlKhuVucAddEdit")[0].selectedIndex = 1;
                loadPhongKhuVucAddEdit($("#ddlKhuVucAddEdit").val());
                //loadPhongKhuVuc($("#ddlKhuVuc").val());

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVucIndex(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBanIndex').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    } 

    function loadPhongKhuVucAddEdit(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBanAddEdit').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }  

    function LoadTableHoSo(isPageChanged) {
        var template = $('#table-HoSoTimNhanVien').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVucAddEdit').val();
        var phongId = $('#ddlPhongBanAddEdit').val();
        var timnhanvien = $('#txtTimNhanVienAddEdit').val();

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hoso/GetAllPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblHoSoTimNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoTimNhanVien').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingHoSo(response.Result.RowCount, function () {
                        LoadTableHoSo();
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }
    function wrapPagingHoSo(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHoSoTimNhanVien a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoTimNhanVien').empty();
            $('#paginationULHoSoTimNhanVien').removeData("twbs-pagination");
            $('#paginationULHoSoTimNhanVien').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoTimNhanVien').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                //tedu.configs.pageIndex = p;
                //setTimeout(callBack(), 200);
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function loadHoSoNhanVien(hosoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetHoSoId",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hoso = response.Result.Results[0];
                $('#hidHoSoNhanVienId').val(hoso.Id);
                $('#txtFullName').val(hoso.Ten);
                $('#hidHinhNhanVien').val(hoso.HinhNhanVien);

                $('#modal-add-edit-TimNhanVien').modal('hide');
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadDataTable() {
        var khuvuc = $('#ddlKhuVuc').val(); //'%'
        var phongbanid = $('#ddlPhongBanIndex').val();//'%'
        var keyword = $('#txt-search-keyword').val();

        if (khuvuc !== "%" && phongbanid !== "%" && keyword === "") {
            //tedu.notify("thanh csdjflskjdf", "success");
            loadDataKhuVucPhong();
        }
        else {
            loadData();
        }
    }

    function loadDataKhuVucPhong(isPageChanged) {
        var makv = $('#ddlKhuVuc').val();
        var phongbanid = $('#ddlPhongBanIndex').val();

        $.ajax({
            type: "GET",
            url: "/admin/user/GetAllPagingKhuVucCorPhong",
            data: {
                corporationId: makv,
                phongId: phongbanid,
                keyword: $('#txt-search-keyword').val(),
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var template = $('#table-template').html();
                var render = "";
                if (response.RowCount > 0) {
                    $.each(response.Results, function (i, item) {
                        render += Mustache.render(template, {
                            FullName: item.FullName,
                            Id: item.Id,
                            UserName: item.UserName,
                            //Avatar: item.Avatar === undefined ? '<img src="/admin-side/images/user.png" width=25 />' : '<img src="' + item.Avatar + '" width=25 />',
                            Avatar: '<img src="/admin-side/images/powacmo.png" width=25 />',
                            //DateCreated: tedu.dateTimeFormatJson(item.DateCreated),
                            DateCreated: tedu.getFormattedDate(item.DateCreated),
                            Status: tedu.getStatus(item.Status)
                        });
                    });
                    $("#lbl-total-records").text(response.RowCount);
                    if (render !== undefined) {
                        $('#tbl-content').html(render);

                    }
                    wrapPagingKhuVucPhong(response.RowCount, function () {
                        loadData();
                    }, isPageChanged);
                }
                else {
                    $('#tbl-content').html('');
                }
                tedu.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    };
    function wrapPagingKhuVucPhong(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationUL a').length === 0 || changePageSize === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationUL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                tedu.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
    }

}