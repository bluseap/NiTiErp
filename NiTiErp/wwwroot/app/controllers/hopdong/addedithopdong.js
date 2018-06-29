var AddEditHopDong = function () {

   
    this.initialize = function () {
        loadDataChiTiet();        

        disabledHopDongChiTiet(true);

        resetFormHopDongChiTiet();

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

        $('#txtSoHopDongMoi').val('');
        $('#ddlLoaiHopDongChiTietMoi')[0].selectedIndex = 1;        
        $('#txtNgayKyHopDongMoi').val('');
        $('#txtNgayHopDongMoi').val('');
        $('#txtNgayHieuLucMoi').val('');
        $('#txtNgayHetHanMoi').val('');
        $('#ddlChucVuKyHopDongChiTietMoi')[0].selectedIndex = 1;
        $('#txtTenKyHopDongMoi').val('');
        $('#txtHeSoLuongCoBanMoi').val('');
        $('#txtLuongCoBanMoi').val('');
    }

    function disabledHopDongChiTiet(para) {
        $('#txtHoTenChiTiet').prop('disabled', para);
        $('#txtTenPhongChiTiet').prop('disabled', para);
        $('#txtSoHopDong').prop('disabled', para);
        $('#ddlLoaiHopDongChiTietCu').prop('disabled', para);
        $('#txtNgayKyHopDong').prop('disabled', para);
        $('#txtNgayHopDong').prop('disabled', para);
        $('#txtNgayHieuLuc').prop('disabled', para);
        $('#txtNgayHetHan').prop('disabled', para);
        $('#ddlChucVuKyHopDongChiTietCu').prop('disabled', para);
        $('#txtTenKyHopDongCu').prop('disabled', para);
        $('#txtHeSoLuongCoBan').prop('disabled', para);
        $('#txtLuongCoBan').prop('disabled', para);
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