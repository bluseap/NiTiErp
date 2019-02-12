var homevanbanController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var userName = $("#hidUserName").val();

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/vanban")
        .build();
    connection.start().catch(err => console.error(err.toString()));

    this.initialize = function () {      

        loadKhuVuc();

        loadData();

        registerEvents();        
    }

    function registerEvents() {

        $('body').on('click', '.btnDenDienTu', function (e) {
            e.preventDefault();
            tedu.notify("văn bản đến điện tử", "success");
            
        });

        $('body').on('click', '.btnDenChuaXuLy', function (e) {
            e.preventDefault();
            window.location.href = "vbdthem/index";
        });

        $('body').on('click', '.btnDenDangXuLy', function (e) {
            e.preventDefault();
            window.location.href = "vbdxem/index";
        });

        $('body').on('click', '.btnDenChoDuyet', function (e) {
            e.preventDefault();
            window.location.href = "vbdduyet/index";
        });

        $('body').on('click', '.btnDenChuPhatHanh', function (e) {
            e.preventDefault();
            tedu.notify("Chưa phát hành", "success");
        });

        $('body').on('click', '.btnDiChoXuLy', function (e) {
            e.preventDefault();
            tedu.notify("Chờ xư ly", "success");

        });

        $('body').on('click', '.btnDiChoDuyet', function (e) {
            e.preventDefault();
            tedu.notify("Đi chờ duyệt", "success");

        });

        $('body').on('click', '.btnDiChuaPhatHanh', function (e) {
            e.preventDefault();
            tedu.notify("Chưa phát hành", "success");

        });       


        $('#btnTimNhanVien').on('click', function () {
            var makhuvuc = $('#ddlKhuVuc').val();
            //if (makhuvuc === "%") {
            //    $('#divThongKeTatCa').show();
            //    $('#divThongKeKhuVuc').hide();
            //}
            //else {
            //    $('#divThongKeTatCa').hide();
            //    $('#divThongKeKhuVuc').show();
            //    loadChart();
            //}
        });

        //$('#txtTimNhanVien').on('keypress', function (e) {
        //    if (e.which === 13) {
        //        var makhuvuc = $('#ddlKhuVuc').val();
        //        if (makhuvuc === "%") {
        //            $('#divThongKeTatCa').show();
        //            $('#divThongKeKhuVuc').hide

        //        }
        //        else {
        //            $('#divThongKeTatCa').hide();
        //            $('#divThongKeKhuVuc').show();
        //            loadChart();
        //        }
        //    }
        //});

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
                $("#ddlKhuVuc")[0].selectedIndex = 1;   
                var makv = $('#ddlKhuVuc').val();
                //thongbao();

                loadSumVanBan(makv);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadSumVanBan(makv) {
        loadVanBanDenTTXL(connection, makv);
        loadCountVanBanDenDangXL(connection, makv);
        loadCountVanBanDenChoDuyet(connection, makv);
        loadCountVanBanDenChuaPhatHanh(connection, makv);
        loadCountVanBanDenDienTu(connection, makv);
    }

    function loadVanBanDenTTXL(connection, makv) {       

        //var makhuvuc = $('#ddlKhuVuc').val();
        var sovanbanden = $('#ddlVanBanDenSoMoi').val();
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDenTTXL',
            data: {
                corporationId: makv,
                sovanbanden: sovanbanden,
                keyword: timnoidung,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                //const connection = new signalR.HubConnectionBuilder()
                //    .withUrl("/vanban")
                //    .build();
                //connection.start().catch(err => console.error(err.toString()));

                connection.on("VanBanDenChuaXuLy", (message) => {
                    $('#spanDenChuaXuLy').text(message);
                });

                if (response.Result.length === 0) {
                    connection.invoke("SendVanBanDenChuaXuLy", "9").catch(function (err) {
                        $('#spanDenChuaXuLy').text("0");
                    });
                }
                else {
                    var tongttxl = response.Result.length;
                    connection.invoke("SendVanBanDenChuaXuLy", tongttxl).catch(function (err) {
                        $('#spanDenChuaXuLy').text(tongttxl);
                    });
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVanBanDenDangXL(connection, makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDangXL',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {      
                connection.on("VanBanDenDangXuLy", (response) => {
                    $('#spanDenDangXuLy').text(response);
                });
                connection.invoke("SendVanBanDenDangXuLy", response).catch(function (err) {    
                    $('#spanDenDangXuLy').text(response);
                });                  
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVanBanDenChoDuyet(connection, makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenChoDuyet',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {                
                connection.on("VanBanDenChoDuyet", (response) => {
                    $('#spanDenChoDuyet').text(response);
                });
                connection.invoke("SendVanBanDenChoDuyet", response).catch(function (err) {
                    $('#spanDenChoDuyet').text(response);
                });
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVanBanDenChuaPhatHanh(connection, makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenChuaPhatHanh',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                connection.on("VanBanDenChuaPhatHanh", (response) => {
                    $('#spanDenChuaPhatHanh').text(response);
                });
                connection.invoke("SendVanBanDenChuaPhatHanh", response).catch(function (err) {
                    $('#spanDenChuaPhatHanh').text(response);
                });
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadCountVanBanDenDienTu(connection, makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDienTu',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                connection.on("VanBanDenDienTu", (response) => {
                    $('#spanDenDienTu').text(response);
                });
                connection.invoke("SendVanBanDenDienTu", response).catch(function (err) {
                    $('#spanDenDienTu').text(response);
                });
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadData() {
        ClewarData();
        loadAppUser(userName); // load HoSoNhanVienId
    }

    function ClewarData() {
        $('#hidHoSoNhanVienId').val('');

    }

    function loadAppUser(tennguoidung) {
        $.ajax({
            type: 'POST',
            url: '/admin/user/GetUserName',
            data: {
                username: tennguoidung
            },
            dataType: 'json',
            success: function (response) {
                $('#hidHoSoNhanVienId').val(response.HoSoNhanVienId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }



}