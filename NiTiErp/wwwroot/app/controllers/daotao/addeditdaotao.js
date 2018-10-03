var addeditdaotaoController = function () {


    this.initialize = function () {

        registerEvents();

        loadAddEditData();
    }

    function registerEvents() {

        $('#txtAddEditNgayBatDau, #txtAddEditNgayKetThuc').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );


    }

    function loadAddEditData() {
        loadAddEditDaoTaoNoi();
        loadAddEditLoaiDaoTao();
        loadAddEditLoaiBang();
    }

    function loadAddEditDaoTaoNoi() {
        $.ajax({
            type: 'GET',
            url: '/admin/daotaonoi/GetListDaoTaoNoi',
            data: {
                keyword: "%",
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result.Results, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenTruong + "</option>";
                });
                $('#ddlAddEditDaoTaoNoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục nơi đào tạo.', 'error');
            }
        });
    }

    function loadAddEditLoaiDaoTao() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/LoaiDaoTaoGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiHinhDaoTao + "</option>";
                });
                $('#ddlAddEditLoaiDaoTao').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Hình thức đào tạo.', 'error');
            }
        });
    }

    function loadAddEditLoaiBang() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/LoaiBangGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiBang + "</option>";
                });
                $('#ddlAddEditLoaiBang').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Bằng loại..', 'error');
            }
        });
    }


}