var khoasoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();


    this.initialize = function () {
        loadKhuVuc();        

        loadData();

        registerEvents();        
    }

    function registerEvents() {

        $("#btnTimNhanVien").on('click', function () {          
            loadTableLockLuongDotIn();
            loadLockLuongDotIn();
        });   

        $("#btnLuu").on('click', function () {            
            SaveLockLuongDotIn();
        });   

    }

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();
        var thangNow = newdate.getMonth() + 1;

        $('#txtNam').val(namNow);
        $('#txtAddEditNam').val(namNow);
        loadThang(thangNow);
    }

    function loadThang(thangnow) {
        var render;
        render += "<option value='1'>Tháng 01 </option>";
        render += "<option value='2'>Tháng 02 </option>";
        render += "<option value='3'>Tháng 03 </option>";
        render += "<option value='4'>Tháng 04 </option>";
        render += "<option value='5'>Tháng 05 </option>";
        render += "<option value='6'>Tháng 06 </option>";
        render += "<option value='7'>Tháng 07 </option>";
        render += "<option value='8'>Tháng 08 </option>";
        render += "<option value='9'>Tháng 09 </option>";
        render += "<option value='10'>Tháng 10 </option>";
        render += "<option value='11'>Tháng 11 </option>";
        render += "<option value='12'>Tháng 12 </option>";
        $('#ddlThang').html(render);
        $('#ddlThang').val(thangnow);
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);               

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);                    
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);                    
                }
                //$("#ddlKhuVuc")[0].selectedIndex = 1;   
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadLockLuongDotIn() {
        //tedu.notify("tim khoa so", "success"); 
        var nammoi = $('#txtNam').val();
        var thangmoi = $('#ddlThang').val();   
        var makv = $("#ddlKhuVuc").val();

        $('#ckCheckAllDot1').prop('checked', false);

        var strUrl = "/Admin/khoaso/KhoaSoGetList2";
        return $.ajax({
            type: "POST",
            url: strUrl,
            data: {
                corporationId: makv,
                dotinId: "1",
                nam: nammoi,
                thang: thangmoi,
                keyword: "%",
                page: 1,
                pageSize: 1000
            },
            dataType: "json",
            beforeSend: function () {
                tedu.stopLoading();
            },
            success: function (response) {
                var litsPermission = response.Result;
                $.each($('#tblLockLuongDotIn tbody tr'), function (i, item) {
                    $.each(litsPermission, function (j, jitem) {
                        if (jitem.Id === $(item).data('id')) {                            
                            if (jitem.IsLockLuongDotInKy === "False") {
                                $(item).find('.ckDotIn').first().prop('checked', false);
                            }
                            else {
                                $(item).find('.ckDotIn').first().prop('checked', true);
                            }
                           //$(item).find('.ckDotIn').first().prop('checked', jitem.IsLockLuongDotInKy);
                           // $(item).find('.ckDotIn').first().prop('checked', true);                     
                        }
                    });
                });

                //if ($('.ckDotIn:checked').length === $('#tblLockLuongDotIn tbody tr .ckDotIn').length) {
                //    $('#ckCheckAllDot1').prop('checked', true);
                //}
                //else {
                //    $('#ckCheckAllDot1').prop('checked', false);
                //}                

                tedu.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    function loadTableLockLuongDotIn(callback) {
        var nammoi = $('#txtNam').val();
        var thangmoi = $('#ddlThang').val();
        var makv = $("#ddlKhuVuc").val();

        var strUrl = "/admin/khoaso/KhoaSoGetList2";
        return $.ajax({
            type: "GET",
            url: strUrl,
            data: {
                corporationId: makv,
                dotinId: "1",
                nam: nammoi,
                thang: thangmoi,
                keyword: "%",
                page: 1,
                pageSize: 1000
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var template = $('#result-data-LockLuongDotIn').html();
                var render = "";
                $.each(response.Result, function (i, item) {
                    render += Mustache.render(template, {
                        KyLockLuong: tedu.getFormattedDateYYYYMM(item.LockDate),
                        TenKhuVuc: item.TenKhuVuc,
                        IsLockLuongDotInKy: item.IsLockLuongDotInKy ? "checked" : "",
                        //treegridparent: item.ParentId !== null ? "treegrid-parent-" + item.ParentId : "",
                        Id: item.Id                       
                        //AllowDelete: item.AllowDelete ? "checked" : "",
                        //Status: tedu.getStatus(item.Status),
                    });
                });
                if (render !== undefined) {
                    $('#lst-data-LockLuongDotIn').html(render);
                }
                $('.tree').treegrid();

                $('#ckCheckAllDot1').on('click', function () {
                    $('.ckDotIn').prop('checked', $(this).prop('checked'));
                });                

                $('.ckDotIn').on('click', function () {
                    if ($('.ckDotIn:checked').length === response.length) {
                        $('#ckCheckAllDot1').prop('checked', true);
                    } else {
                        $('#ckCheckAllDot1').prop('checked', false);
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

    function SaveLockLuongDotIn() {        
        var listlockluong = [];

        $.each($('#tblLockLuongDotIn tbody tr'), function (i, item) {
            listlockluong.push({                
                Id: $(item).data('id'),
                IsLockLuongDotInKy: $(item).find('.ckDotIn').first().prop('checked')                
            });
        });        

        var xml = '';
        xml = xml + "<tables>";

        for (var i = 0; i < listlockluong.length; i++) {
            var field = listlockluong[i];
            xml += "<items>";
            for (var prop in field) {
                //tedu.notify(prop, "success");
                //tedu.notify(field[prop], "success");
                xml += '<' + prop + '>' + field[prop] + '</' + prop + '>';
            }     
            xml += "</items>";
        }        
       
        xml = xml + '</tables>';        

        //tedu.notify(xml, "success");

        SaveLockLuongDotInXML(xml);
    }

    function SaveLockLuongDotInXML(stringXML) {
        var makhuvuc = $("#ddlKhuVuc").val();
        var thang = $("#ddlThang").val();
        var nam = $("#txtNam").val();             

        if (makhuvuc === "%") {
            $.ajax({
                type: "POST",
                url: "/Admin/khoaso/SaveLockLuong",
                data: {
                    StringXML: stringXML,
                    InsertLockLuongDotInId: 1
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    if (response.Success === false) {
                        tedu.notify(response.Message, "error");
                    }
                    else {
                        loadLockLuongDotIn();
                        tedu.notify('Lưu lock khóa sổ.', 'success');
                        tedu.stopLoading();

                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu ', 'error');
                    tedu.stopLoading();
                }
            });
        }
        else {
            $.ajax({
                type: 'GET',
                url: '/admin/khoaso/GetLockLuongKyId',
                data: {
                    makhuvuc: makhuvuc,
                    thang: thang,
                    nam: nam,
                    dotinluongid: "1"
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    lockluong = response.Result[0];

                    if (response.Result.length === 0) {
                        tedu.notify("Kỳ này chưa khởi tạo. Kiểm tra lại.", "error");
                    }
                    else {
                        if (lockluong.IsLockKhoiTao === "False") {
                            $.ajax({
                                type: "POST",
                                url: "/Admin/khoaso/SaveLockLuong",
                                data: {
                                    StringXML: stringXML,
                                    InsertLockLuongDotInId: 1
                                },
                                dataType: "json",
                                beforeSend: function () {
                                    tedu.startLoading();
                                },
                                success: function (response) {
                                    if (response.Success === false) {
                                        tedu.notify(response.Message, "error");
                                    }
                                    else {
                                        loadLockLuongDotIn();
                                        tedu.notify('Lưu lock khóa sổ.', 'success');
                                        tedu.stopLoading();

                                    }
                                },
                                error: function () {
                                    tedu.notify('Có lỗi! Không thể lưu ', 'error');
                                    tedu.stopLoading();
                                }
                            });
                        }
                        else if (lockluong.IsLockKhoiTao === "True") {
                            tedu.notify('Lương tháng đã khởi tạo kỳ mới. Kiểm tra lại.', 'error');
                        }
                    }

                },
                error: function (status) {
                    console.log(status);
                    tedu.notify('Khóa sổ lương tháng đợt in.', 'error');
                }
            });
        }
        
        
    }

}