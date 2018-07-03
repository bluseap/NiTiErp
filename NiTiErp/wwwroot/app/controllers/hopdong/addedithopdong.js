var AddEditHopDong = function () {

   
    this.initialize = function () {
        loadDataChiTiet();        

        disabledHopDongChiTiet(true);

        resetFormHopDongChiTiet();

        registerEvents();
    }

    function registerEvents() {
        $('#btnSaveHopDong').on('click', function (e) {            
            SaveHopDongNhanVien(e);            
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

    function SaveHopDongNhanVien(e) {
        e.preventDefault();
        tedu.notify("vao hop dong", "success");

        var hopdongnhanvienidcu = $('#hidHopDongNhanVienCuId').val();
        var hosoid = $('#hidHoSoId').val();
        var hesoluongcu = $('#hidHeSoLuongDanhMucCuId').val();

        var hopdongid = $('#hidHopDongId').val(); //  id = 1 ; para update insert
        var inshopdongid = $('#hidInsertHopDongId').val(); // Id = 0
        var hesoluongid = $('#hidHeSoLuongDanhMucId').val(); // id = 0

        var corporationid = $('#ddlKhuVuc').val();
        var chucvuid = $('#ddlChucVuKyHopDongChiTietMoi').val();

        var sohopdong = $('#txtSoHopDongMoi').val();
        var loaihopdong = $('#ddlLoaiHopDongChiTietMoi').val();
        var ngaykyhopdong = tedu.getFormatDateYYMMDD($('#txtNgayKyHopDongMoi').val());
        var ngayhopdong = tedu.getFormatDateYYMMDD($('#txtNgayHopDongMoi').val());
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucMoi').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanMoi').val());
       
        var tenkyhopdong = $('#txtTenKyHopDongMoi').val();
        var hesoluongcoban = $('#txtHeSoLuongCoBanMoi').val();
        var luongcoban = $('#txtLuongCoBanMoi').val();

        $.ajax({
            type: "POST",
            url: "/Admin/hopdong/AddUpdateHopDong",
            data: {
                HopDongNhanVienCuId: hopdongnhanvienidcu,

                HoSoNhanVienId: hosoid,
                InsertUpdateId: hosoidinup, // = 0
                InsertUpdateHopDongId: 0, // = 0
                HeSoLuongDanhMucId: hesoluongdanhmuc,

                CorporationId: corporationid,
                ChucVuNhanVienId: chucvuid,

                SoHopDong: sohopdong,
                HopDongDanhMucId: loaihopdong,
                NgayKyHopDong: ngaykyhopdong,
                NgayHopDong: ngayhopdong,
                NgayHieuLuc: ngayhieuluc,
                NgayHetHan: ngayhethan,
                TenNguoiKyHopDong: tenkyhopdong,
                HeSoLuong: hesoluongcoban,
                LuongCoBan: luongcoban
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success == false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.notify('Hợp đồng nhân viên.', 'success');
                    $('#modal-add-edit-HopDong').modal('hide');  
                    resetFormHopDongChiTiet();
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Hợp đồng nhân viên', 'error');
                tedu.stopLoading();
            }
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