


$(function () {
    //var connection = new signalR.HubConnectionBuilder()
    //    .withUrl("/vanban")
    //    .build();
    //connection.start().catch(err => console.error(err.toString()));

    //loadVanBanDenTTXL(connection);   

    //var makhuvuc = $('#ddlKhuVuc').val();
    //loadCountVanBanDenDangXL(makhuvuc, connection);
});

function onConnected(connection) {
    console.log('Bắt đầu kết nối văn bản xử lý.');
}
function onConnectionError(error) {
    if (error && error.message) {
        console.error(error.message);
    }
    else {
        console.log('Close kết nối văn bản xử lý.');
    }
}


function loadVanBanDenTTXL(connection) {
    var template = $('#table-VBDThem').html();
    var render = "";

    var makhuvuc = $('#ddlKhuVuc').val();
    var sovanbanden = $('#ddlVanBanDenSoMoi').val();
    var timnoidung = $('#txtTimNoiDung').val();

    $.ajax({
        type: 'GET',
        url: '/admin/vbdthem/GetListVBDenTTXL',
        data: {
            corporationId: makhuvuc,
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

function loadCountVanBanDenDangXL(makv, connection) {
    $.ajax({
        type: 'GET',
        url: '/admin/vbdthem/GetCountVBDenDangXL',
        data: {
            corporationId: makv
        },
        dataType: 'json',
        success: function (response) {
            //const connection = new signalR.HubConnectionBuilder()
            //    .withUrl("/vanban")
            //    .build();
            //connection.start().catch(err => console.error(err.toString()));

            connection.on("VanBanDenDangXuLy", (response) => {
                $('#spanDenDangXuLy').text(response);
            });

            //if (response.Result.length === 0) {
            //    connection.invoke("SendVanBanDenDangXuLy", "9").catch(function (err) {
            //        $('#spanDenDangXuLy').text("0");
            //    });
            //}
            //else {
            //    var tongttxl = response.Result.length;
            //    connection.invoke("SendVanBanDenDangXuLy", tongttxl).catch(function (err) {
            //        $('#spanDenDangXuLy').text(tongttxl);
            //    });

            //}         
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });
}