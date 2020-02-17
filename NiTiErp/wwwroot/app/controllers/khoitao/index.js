var khoitaoController = function () {

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

        $("#btnKhoiTaoKyLuong").on('click', function () {            
            KhoiTaoKyLuong();
        }); 


        $('#loading-body-btn').click(function () {            
            $('body').loading({
                stoppable: true
            });
        });
        $('#loading-body2-btn').click(function () {
            $('body').loading({
                //stoppable: true,
                message: 'Đang khởi tạo kỳ lương mới...',
                theme: 'dark'
            });
        });

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

    function loadData() {
        var newdate = new Date();
        var namNow = newdate.getFullYear();
        var thangNow = newdate.getMonth() + 1;

        $('#txtNam').val(namNow);    
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

    function KhoiTaoKyLuong() {           
        $('body').loading({
            //stoppable: true,
            message: 'Đang khởi tạo kỳ lương mới...',
            theme: 'dark'
        });

        var makhuvuc = $("#ddlKhuVuc").val();
        var thang = $("#ddlThang").val();
        var nam = $("#txtNam").val();

        if (makhuvuc === "%") {
            tedu.notify('Chọn khu vực cần khởi tạo. Kiểm tra lại. ', 'error');
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
                       
                        $.ajax({
                            type: "POST",
                            url: "/Admin/khoitao/KhoiTaoKyLuong",
                            data: {
                                CorporationId: makhuvuc,
                                LockDate: nam + "/" + thang + "/01"
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
                                    loadTableLockLuongDotIn(true);

                                    $(':loading').loading('stop');

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
                        tedu.notify("Kỳ này khởi tạo rồi. Chọn kỳ khác.", "error");
                    }

                },
                error: function (status) {
                    console.log(status);
                    tedu.notify('Khởi tạo lương tháng đợt in.', 'error');
                }
            });
        }       
                
    }
   

}