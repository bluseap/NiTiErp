var khoitaoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();


    this.initialize = function () {
        loadKhuVuc(); 
        loadData();
        registerEvents();
    }

    function registerEvents() {     
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

   

}