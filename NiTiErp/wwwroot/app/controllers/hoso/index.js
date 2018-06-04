var hosoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var imageNhanVien = [];

    this.initialize = function () {               
        registerEvents();

        loadData();

        loadKhuVuc();         
    }

    function registerEvents() {                

        $('#txtNgaySinh, #txtNgayCapCMND, #txtNgayKyHopDong').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();        

        $("#btn-create").on('click', function () {
            NhanVienId();// ho so nhan vien id new guid

            $('#modal-add-edit-HoSo').modal('show');
        });
        //$('body').on('click', '.btnEditHoSo', function (e) {
        //    e.preventDefault();           

        //    var that = $(this).data('id');          
        //    loadDetails(that);
        //    $('#hidLyLichIdInsert').val(1);
        //});

        $('#btnSave').on('click', function (e) {   
            SaveHoSoNhanVien(e);            
        });

        $("#fileInputHinhNhanVien").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;

            var data = new FormData();

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadImageNhanVien",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    clearFileHinhNhanVienInput($("#fileInputHinhNhanVien"));
                    imageNhanVien.push(path);

                    $('#imagelistHinhThe').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    tedu.notify('Đã tải ảnh lên thành công!', 'success');

                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });

    }

    function clearFileHinhNhanVienInput(ctrl) {
        try {
            imageNhanVien = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) { }
    }
    
    function isFormMainValidate()
    {        
        if ($('#frmMainLyLich').valid() && $('#frmMainHopDong').valid()) {
            return true;
        }        
        else {
            return false;
        }       
    }

    function formMainValidate()
    {
        jQuery.validator.addMethod("isDanhMuc", function (value, element) {
            if (value === "%")
                return false;
            else
                return true;
        },
           "Xin chọn danh mục.."
        );

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
               return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
           },
           "Nhập theo định dạng ngày, tháng, năm."
        );

        //Init validation
        $('#frmMainLyLich').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtNgaySinh: {
                    required: true,
                    isDateVietNam: true
                },
                txtNoiOHienNay: { required: true },
                ddlHonNhan: {
                    required: true,
                    isDanhMuc : true
                },
                ddlDanToc: {
                    required: true,
                    isDanhMuc: true
                },
                ddlTonGiao: {
                    required: true,
                    isDanhMuc: true
                },
                ddlXuatThan: {
                    required: true,
                    isDanhMuc: true
                },

                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
                
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên.." },
                txtNgaySinh: { required: "Nhập ngày sinh cho đúng.." },
                txtNoiOHienNay: { required: "Nhập nơi ở hiện nay." },

                txtHeSoLuongCoBan: {
                    required: "Nhập hệ số..",
                    number: "Chỉ nhập số.."
                },
                txtLuongCoBan: {
                    required: "Nhập lương cơ bản..",
                    number: "Chỉ nhập số.."
                }
            }
        });

        $('#frmMainTrinhDo').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên!" },
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#frmMainHopDong').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {                
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {               
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#frmMainDangDoan').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtHoVaTen: { required: true },
                ddlGioiTinh: { required: true },
                txtHeSoLuongCoBan: {
                    required: true,
                    number: true
                },
                txtLuongCoBan: {
                    required: true,
                    number: true
                }
            },
            messages: {
                txtHoVaTen: { required: "Nhập họ và tên!" },
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        $('#ddlKhuVuc').on('change', function () {    
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlCongTyXiNghiep').on('change', function () {
            var corporationId = $('#ddlCongTyXiNghiep').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

    }

    function resetFormMaintainance() {
        $('#hidLyLichIdInsert').val(0);

        resetFormTabLyLich();
        resetFormTabTrinhDo();
        resetFormTabHopDong();                  
        resetFormTabDangDoan();
        resetFormTabCongViec();

        //$('#txtPriceM').val('0');        
        //CKEDITOR.instances.txtContentM.setData('');
        //$('#ckStatusM').prop('checked', true);
    }

    function resetFormTabLyLich() {       
        $('#hidLyLichId').val(0);

        clearFileHinhNhanVienInput($("#fileInputHinhNhanVien"));
        $('#imagelistHinhThe').html('');
        imagelistHinhThe = [];

        $('#txtSoTheNhanVien').val('');
        $('#txtHoVaTen').val('');
        $('#txtTenGoiKhac').val('');
        $('#ddlGioiTinh').val('');
        $('#txtNgaySinh').val('');
        $('#txtSoCMND').val('');
        $('#txtNgayCapCMND').val('');
        $('#txtNoiCapCMND').val('');
        $('#txtNoiSinh').val('');
        $('#txtQueQuan').val('');
        $('#txtNoiOHienNay').val('');
        $('#ddlHonNhan').val('');
        $('#ddlDanToc').val('');
        $('#ddlTonGiao').val('');
        $('#ddlXuatThan').val('');
    }
    function resetFormTabTrinhDo() {
        $('#hidTrinhDoId').val(0);

        $('#txtChuyenNganh').val('');  
        $('#txtNamCapBang').val('');  
        $('#txtTenTruongCapBang').val('');
        $('#txtGhiChuTrinhDo').val('');
    }
    function resetFormTabHopDong() {
        $('#hidHopDongId').val(0);

        $('#txtSoHopDong').val('');
        $('#txtNgayKyHopDong').val('');
        $('#txtNgayHopDong').val('');
        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');
        $('#txtHeSoLuongCoBan').val('0.00');
        $('#txtLuongCoBan').val('0');
        $('#txtTenKyHopDong').val('');
    }
    function resetFormTabDangDoan() {
        $('#hidDangDoanId').val(0);

        $('#txtNgayVaoDang').val('');
        $('#txtMaTheDang').val('');
        $('#txtNoiSinhHoatDang').val('');
        $('#txtNgayVaoDoan').val('');
        $('#txtMaTheDoan').val('');
        $('#txtNoiSinhHoatDoan').val('');
        $('#txtNgayVaoCongDoan').val('');
        $('#txtMaTheCongDoan').val('');
        $('#txtNoiSinhHoatCongDoan').val('');
        $('#txtNgayThamGiaCachMang').val('');
        $('#txtDacDiemBanThanCu').val('');
        $('#txtDacDiemBanThanCu').val('');
        $('#txtNgayNhapNgu').val('');
        $('#txtNgayXuatNgu').val('');
        $('#txtDonViQuanDoi').val('');   
    }
    function resetFormTabCongViec() {
        $('#hidCongViecId').val(0);

        $('#txtCongTacChinh').val('');   
        $('#txtSoQuyetDinhCongViec').val('');   
        $('#txtTenQuyetDinhCongViec').val('');   
        $('#txtNgayKyCongViec').val('');
        $('#txtNgayHieuLucCongViec').val('');  
    } 

    function loadData() {

        $('#txtHeSoLuongCoBan').val('0.00');
        $('#txtLuongCoBan').val('0');

        var gioitinh = [{ value:"1", ten:"Nam" }, { value:"0", ten:"Nữ" } ];        
        var render = "";
        for (var i = 0; i < gioitinh.length ; i++) {
            render += "<option value='" + gioitinh[i].value + "'>" + gioitinh[i].ten + "</option>";            
        }
        $('#ddlGioiTinh').html(render);
        
        LoadTabDanhMucLyLich();
        LoadTabDanhMucTrinhDo();
        LoadTabDanhMucHopDong();
        LoadTabDanhMucDangDoan();
        LoadTabDanhMucCongViec();
    }
   
    function LoadTabDanhMucLyLich() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/HonNhanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenHonNhan + "</option>";
                });
                $('#ddlHonNhan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Hôn nhân.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/DanTocGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenDanToc + "</option>";
                });
                $('#ddlDanToc').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Dân tộc.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/TonGiaoGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenTonGiao + "</option>";
                });
                $('#ddlTonGiao').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Tôn giáo.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/XuatThanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenXuatThan + "</option>";
                });
                $('#ddlXuatThan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Xuất thân.', 'error');
            }
        });
    }
    function LoadTabDanhMucTrinhDo() {
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
                $('#ddlLoaiBang').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Bằng loại..', 'error');
            }
        });

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
                $('#ddlLoaiHinh').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Hình thức đào tạo.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/XepLoaiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenXepLoai + "</option>";
                });
                $('#ddlXepLoai').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Xếp loại.', 'error');
            }
        });
    }
    function LoadTabDanhMucHopDong() {
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
                $('#ddlLoaiHopDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Loại hợp đồng.', 'error');
            }
        });

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
                $('#ddlChucVuKyHopDong').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ hợp đồng.', 'error');
            }
        });
    }
    function LoadTabDanhMucDangDoan() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuDangGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVuDang + "</option>";
                });
                $('#ddlChucVuDang').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ Đảng.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuDoanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVuDoan + "</option>";
                });
                $('#ddlChucVuDoan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ Đoàn.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuCongDoanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVuCongDoan + "</option>";
                });
                $('#ddlChucVuCongDoan').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ Công Đoàn.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ChucVuQuanDoiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenChucVuQuanDoi + "</option>";
                });
                $('#ddlChucVuQuanDoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ Quân Đội.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/CapBacQuanDoiGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenCapBac + "</option>";
                });
                $('#ddlCapBacQuanDoi').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Cấp bậc Quân Đội.', 'error');
            }
        });

    }
    function LoadTabDanhMucCongViec() {
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
                $('#ddlChucVuNhanVien').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh Chức vụ Nhân viên.', 'error');
            }
        });

    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {              
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlCongTyXiNghiep').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlCongTyXiNghiep').prop('disabled', true);
                }
                else
                {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlCongTyXiNghiep').prop('disabled', false);
                }
                //alert($("#ddlKhuVuc")[0].selectedIndex);
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $("#ddlCongTyXiNghiep")[0].selectedIndex = 1;

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                loadPhongKhuVuc($("#ddlCongTyXiNghiep").val());
                
                //var userCorporationId = $("#hidUserCorporationId").val();
                //alert(userCorporationId);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadPhongKhuVuc(makhuvuc) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListPhongKhuVuc',
            data: { makv: makhuvuc },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhong + "</option>";
                });
                $('#ddlPhongBan').html(render);
                $("#ddlPhongBan")[0].selectedIndex = 1;

                $('#ddlPhongtabCongViec').html(render);
                $("#ddlPhongtabCongViec")[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function NhanVienId() {       
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetHoSoNhanVienId',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hosonhanvienId = response;

                $('#hidLyLichId').val(hosonhanvienId);
                $('#hidLyLichIdInsert').val(0);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Tạo hồ sơ Nhân viên.', 'error');
            }
        });
    }

    function SaveHoSoNhanVien(e) {
        //var ngaysinh = $('#txtNgaySinh').val().split("/");
        //var f = new Date(ngaysinh[2], ngaysinh[1] - 1, ngaysinh[0]).toDateString("yyyy/MM/dd");;
        //tedu.notify(f, 'error');

        //var ngaysinh2 = $('#txtNgaySinh').val();
        //var f2=$('#txtNgaySinh').text($.datepicker.formatDate('yy/m/d', $.datepicker.parseDate('dd/mm/yy', ngaysinh2))).toString();
              
        //tedu.notify(f2, 'error');
        //return false;

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {           
            e.preventDefault();

            var hosoid = $('#hidLyLichId').val();
            var hosoidinup = $('#hidLyLichIdInsert').val();

            var sodienthoai = $('#txtSoDienThoai').val();
            var sothenhanvien = $('#txtSoTheNhanVien').val();
            var hovaten = $('#txtHoVaTen').val();

            var corporationid = $('#ddlCongTyXiNghiep').val();
            var phongid = $('#ddlPhongtabCongViec').val();

            var tengoikhac = $('#txtTenGoiKhac').val();
            var gioitinh = $('#ddlGioiTinh').val();
            var ngaysinh = tedu.getFormatDateYYMMDD($('#txtNgaySinh').val());
            var socmnd = $('#txtSoCMND').val();
            var ngaycap = tedu.getFormatDateYYMMDD($('#txtNgayCapCMND').val());
            var noicap = $('#txtNoiCapCMND').val();
            var noisinh = $('#txtNoiSinh').val();
            var quequan = $('#txtQueQuan').val();
            var noiohiennay = $('#txtNoiOHienNay').val();
            var honnhan = $('#ddlHonNhan').val();
            var dantoc = $('#ddlDanToc').val();
            var tocgiao = $('#ddlTonGiao').val();
            var xuatthan = $('#ddlXuatThan').val();

            $.ajax({
                type: "POST",
                url: "/Admin/Hoso/AddUpdateHosoNhanVien",
                data: {
                    Id: hosoid,
                    InsertUpdateId: hosoidinup,

                    Ten: hovaten,
                    CorporationId: corporationid,
                    PhongBanDanhMucId: phongid,

                    SoDienThoai: sodienthoai,
                    SoTheNhanVien: sothenhanvien,

                    HinhNhanVien: imageNhanVien,
                    //Email: "",

                    TenGoiKhac: tengoikhac,
                    GioiTinh: gioitinh,
                    NgaySinh: ngaysinh,
                    SoCMND: socmnd,
                    NgayCapCMND: ngaycap,
                    NoiCapCMND: noicap,
                    NoiSinh: noisinh,
                    QueQuan: quequan,
                    NoiOHienNay: noiohiennay,
                    HonNhanDanhMucId: honnhan,
                    DanTocDanhMucId: dantoc,
                    TonGiaoDanhMucId: tocgiao,
                    XuatThanDanhMucId: xuatthan
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Tạo hồ sơ nhân viên.', 'success');

                    $('#modal-add-edit-HoSo').modal('hide');

                    resetFormMaintainance();

                    tedu.stopLoading();                    
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Hồ sơ nhân viên', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }
  


}