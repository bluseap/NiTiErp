var AddEditHopDong = function () {

   
    this.initialize = function () {
        loadDataChiTiet();

        LoadAddEditDataHopDong();

        LoadAddEditTableHopDong();

        registerEvents();
    }

    function registerEvents() {
        $('#btnSaveHopDong').on('click', function () {
            tedu.notify("vao hop dong", "success");

        });
    }

    function resetFormHopDongChiTiet() {
        resetHopDongChiTiet();
    }

    function resetHopDongChiTiet() {
        $('#hidHopDongId').val(0);
        $('#hidInsertHopDongId').val(0);

    }

    function LoadAddEditDataHopDong() {

    }

    function LoadAddEditTableHopDong() {

    }

    function loadDataChiTiet() {
        loadLoaiHopDongChiTiet();
        loadChucVuChiTiet();
    }

    function loadLoaiHopDongChiTiet() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/LoaiHopDongGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenLoaiHopDong + "</option>";
                });
                $('#ddlLoaiHopDongChiTietCu').html(render);
                $('#ddlLoaiHopDongChiTietMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });
    }

    function loadChucVuChiTiet() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuNhanVienGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVu + "</option>";
                });
                $('#ddlChucVuKyHopDongChiTietCu').html(render);
                $('#ddlChucVuKyHopDongChiTietMoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
    }

}