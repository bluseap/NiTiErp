var addedithesoluongController = function () {

    this.initialize = function () {
        //loadKhuVucAddEdit();

        loadAddEditData();        

        registerEvents();
    }


    function registerEvents() {
        

    }

    function loadAddEditData() {

        loadDataAddEdit();

        disabledAddEditData(true);
    }

    function disabledAddEditData(para) {
        $('#txtAddEditMucLuongToiThieuVung').prop('disabled', para);
    }

    function loadDataAddEdit() {
        $.ajax({
            type: 'GET',
            url: '/admin/qdnangngach/BacLuongGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenBacLuong + "</option>";
                });
                $('#ddlAddEditBacLuong').html(render);                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có Bậc lương nhân viên.', 'error');
            }
        });
    }

    

}