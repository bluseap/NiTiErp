var AddEditHopDong = function () {

    //var hopdongController = new hopdongController();

    this.initialize = function () {
        loadDataChiTiet();        

        disabledHopDongChiTiet(true);

        resetFormHopDongChiTiet();

        registerEvents();
    }

    function registerEvents() {
        $('#txtNgayKyHopDongMoi, #txtNgayHopDongMoi, #txtNgayHieuLucMoi, #txtNgayHetHanMoi').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });        

        $("#ddlChucVuKyHopDongChiTietMoi").on('change', function () {
            //tedu.notify("chuc vu hop dong", "success");
            var congty = $('#ddlKhuVuc').val();
            var chucvu = $("#ddlChucVuKyHopDongChiTietMoi").val();

            $.ajax({
                type: 'GET',
                url: '/admin/hoso/GetHopDongChucVuLuongId',
                data: {
                    corporationId: congty,
                    chucvuId: chucvu
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    if (response.Result.Results.length === 0) {
                        $('#hidHeSoLuongDanhMucId').val(0);
                        $('#txtHeSoLuongCoBanMoi').val(0);
                        $('#txtLuongCoBanMoi').val(0);
                    }
                    else {
                        var hopdong = response.Result.Results[0];

                        $('#hidHeSoLuongDanhMucId').val(hopdong.HeSoLuongDanhMucId);
                        $('#txtHeSoLuongCoBanMoi').val(hopdong.HeSoLuong);
                        $('#txtLuongCoBanMoi').val(hopdong.LuongCoBan);
                    }
                },
                error: function (status) {
                    console.log(status);
                    tedu.notify('Không có hệ số lương phù hợp.', 'error');
                }
            });

        });
                
    }    

    function resetFormHopDongChiTiet() {
        resetHopDongChiTiet();
    }

    function resetHopDongChiTiet() {
        $('#hidHopDongId').val(0);
        $('#hidInsertHopDongId').val(0);      
        $('#hidHeSoLuongDanhMucId').val(0);

        $('#hidHopDongNhanVienCuId').val(0);
        $('#hidHopDongNhanVienMoiId').val(0);
        $('#hidHeSoLuongDanhMucCuId').val(0);
           
        //$('#txtSoHopDongMoi').val('');
        //$('#ddlLoaiHopDongChiTietMoi')[0].selectedIndex = 1;        
        //$('#txtNgayKyHopDongMoi').val('');
        //$('#txtNgayHopDongMoi').val('');
        //$('#txtNgayHieuLucMoi').val('');
        //$('#txtNgayHetHanMoi').val('');
        //$('#ddlChucVuKyHopDongChiTietMoi')[0].selectedIndex = 1;
        //$('#txtTenKyHopDongMoi').val('');
        //$('#txtHeSoLuongCoBanMoi').val('');
        //$('#txtLuongCoBanMoi').val('');
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