var homevanbanController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

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
            tedu.notify("Chưa xư ly", "success");

        });

        $('body').on('click', '.btnDenDangXuLy', function (e) {
            e.preventDefault();
            tedu.notify("Đang xư ly", "success");

        });

        $('body').on('click', '.btnDenChoDuyet', function (e) {
            e.preventDefault();
            tedu.notify("Chờ duyệt", "success");

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
                //$("#ddlKhuVuc")[0].selectedIndex = 1;   
                //var makv = $('#ddlKhuVuc').val();
                //thongbao();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadData() {
     
    }


}