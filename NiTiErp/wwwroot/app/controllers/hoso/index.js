var hosoController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    var imageNhanVien = [];
    var imageBang1 = [];
    var imageBang2 = [];
   

    this.initialize = function () {
        loadKhuVuc();

        loadData(); 

        registerEvents();      

        loadTieuDe();
    }

    function registerEvents() {   

        $("#ddlThanhPhoTinhQueQuan").on('change', function () {
            var matinh = $('#ddlThanhPhoTinhQueQuan').val();
            loadQuanHuyenMaTinhQueQuan(matinh);
        });

        $("#ddlQuanHuyenQueQuan").on('change', function () {
            var mahuyen = $('#ddlQuanHuyenQueQuan').val();
            loadPhuongXaMaTinhQueQuan(mahuyen);
        });

        $("#ddlThanhPhoTinh").on('change', function () {
            var matinh = $('#ddlThanhPhoTinh').val();
            loadQuanHuyenMaTinh(matinh);
        });

        $("#ddlQuanHuyen").on('change', function () {
            var mahuyen = $('#ddlQuanHuyen').val();
            loadPhuongXaMaTinh(mahuyen);
        });

        $('body').on('click', '.btnNhapHoSoNhanVien', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $('#txtHeSoLuongCoBan').prop('disabled', false);

        $('#txtLuongCoBan').prop('disabled', false);

        $('#txtNgaySinh, #txtNgayCapCMND, #txtNgayKyHopDong, #txtNgayHopDong, #txtNgayHieuLuc, #txtNgayHetHan, #txtNgayVaoDang, #txtNgayVaoDoan, #txtNgayVaoCongDoan, #txtNgayThamGiaCachMang, #txtNgayNhapNgu, #txtNgayXuatNgu, #txtNgayKyCongViec, #txtNgayHieuLucCongViec    ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();

        $('#btnTimNhanVien').on('click', function () {
            //loadData();  

            LoadHopDongDangCongViec();
            LoadTableHoSoNhanVien();
            LoadTableInHoSo();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                //loadData();                 

                LoadHopDongDangCongViec();
                LoadTableHoSoNhanVien();
            }
        });

        $("#ddl-show-pageHoSoNhanVien").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableHoSoNhanVien(true);
        });

        $("#ddl-show-pageTrinhDo").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            LoadTableTrinhDo(true);
        });

        $("#btn-create").on('click', function () {
            LoadHopDongDangCongViec();

            resetFormMaintainance();

            NhanVienId();// ho so nhan vien id new guid

            LoadTableClear();

            $('#modal-add-edit-HoSo').modal('show');
        });

        $("#btnSaveTrinhDo").on('click', function (e) {
            var hosoInserId = $('#hidLyLichIdInsert').val(); // sua la bang = 1     
            var trinhdoId = $('#hidTrinhDoId').val(); // sua la bang = 1     

            //tedu.notify("Chưa lưu được Save Trình độ. Kiểm tra và vào Hợp đồng nhập mới.", "error");
            if (hosoInserId == 1) {  // tao moi ho so, trinh do
                SaveHoSoNhanVienTrinhDo2(e);
                SaveTrinhDoNhanVien(e);
            }
            else if (hosoInserId == 1 && trinhdoId == 1) {// add trinh do    
                UpdateTrinhDo(e);
            }
        });

        $('#btnSave').on('click', function (e) {           
            var hosoInserId = $('#hidLyLichIdInsert').val(); // sua la bang = 1     
            var trinhdoId = $('#hidTrinhDoId').val(); // sua la bang = 1     

            if ($('#frmMainHopDong').valid()) {
                if (hosoInserId != 1) { // add hop dong   
                    SaveHoSoNhanVienTrinhDo(e);

                    if ($('#frmMainTrinhDo').valid()) {
                        SaveTrinhDoNhanVien(e);

                        SaveHopDongNhanVien(e);
                    }
                    else {
                        SaveHopDongNhanVien(e);
                    }
                }
                else if ($('#frmMainTrinhDo').valid()) {
                    tedu.notify("Chưa lưu được hợp đồng. Kiểm tra và vào Hợp đồng nhập mới.", "error");
                    if (hosoInserId == 1 && trinhdoId == 1) { // update ten bang                      
                        UpdateTrinhDo(e);
                    }
                    else {  // add bang moi
                        SaveTrinhDoNhanVien(e);
                    }
                }
                else {
                    if (hosoInserId == 1) {
                        SaveHoSoNhanVienTrinhDo(e);
                    }
                }
            }
            else if ($('#frmMainTrinhDo').valid()) {
                tedu.notify("Chưa lưu được hợp đồng. Kiểm tra và vào Hợp đồng nhập mới.", "error");
                if (hosoInserId == 1) {  // tao moi ho so, trinh do
                    SaveHoSoNhanVienTrinhDo(e);
                    SaveTrinhDoNhanVien(e);
                }
                else if (hosoInserId == 1 && trinhdoId == 1) {// add trinh do    
                    UpdateTrinhDo(e);
                }
            }            
            else {
                tedu.notify("Chưa lưu được trình độ. Kiểm tra và nhập lại trình độ.", "error");
                if (hosoInserId == 1) {
                    UpdateHoSoNhanVien(e);
                }
                else { // tao moi
                    SaveHoSoNhanVien(e);
                }
            }     

            var txtNgayVaoDang = $('#txtNgayVaoDang').val();
            var chucvudang = $('#ddlChucVuDang').val();
            if (txtNgayVaoDang && chucvudang != "%") {
                var updateDangId = $('#hidUpdateDangId').val();

                if ((hosoInserId == 0 && updateDangId == 0) || (hosoInserId == 1 && updateDangId == 0)) { // add dang  
                    SaveDang(e);
                }                
                else {                    
                    UpdateDang(e);
                }
            }
            else {
                tedu.notify("Phải nhập Ngày vào Đảng, Chức vụ Đảng (Nếu có).", "error");
            }

            var txtNgayVaoDoan = $('#txtNgayVaoDoan').val();
            var chucvudoan = $('#ddlChucVuDoan').val();
            if (txtNgayVaoDoan && chucvudoan != "%") {
                var updateDoanId = $('#hidUpdateDoanId').val();

                if ((hosoInserId == 0 && updateDoanId == 0) || (hosoInserId == 1 && updateDoanId == 0)) { // add doan 
                    SaveDoan(e);
                }
                else {
                    UpdateDoan(e);
                }
            }

            var txtNgayVaoCongDoan = $('#txtNgayVaoCongDoan').val();
            var chucvucongdoan = $('#ddlChucVuCongDoan').val();
            if (txtNgayVaoCongDoan && chucvucongdoan != "%") {
                var updateCongDoanId = $('#hidUpdateCongDoanId').val();

                if ((hosoInserId == 0 && updateCongDoanId == 0) || (hosoInserId == 1 && updateCongDoanId == 0)) { // add cong doan
                    SaveCongDoan(e);
                }
                else {
                    UpdateCongDoan(e);
                }
            }

            var txtNgayThamGiaCachMang = $('#txtNgayThamGiaCachMang').val();            
            if (txtNgayThamGiaCachMang ) {
                var updateThamGiaCachMangId = $('#hidUpdateCachMangId').val();

                if ((hosoInserId == 0 && updateThamGiaCachMangId == 0) || (hosoInserId == 1 && updateThamGiaCachMangId == 0)) { // add tham gia cach mang
                    SaveThamGiaCachMang(e);
                }
                else {
                    UpdateThamGiaCachMang(e);
                }
            }

            var txtNgayNhapNgu = $('#txtNgayNhapNgu').val();
            var chucvuquandoi = $('#ddlChucVuQuanDoi').val();
            if (txtNgayNhapNgu && chucvuquandoi != "%") {
                var updateNhapNguId = $('#hidUpdateNhapNguId').val();

                if ((hosoInserId == 0 && updateNhapNguId == 0) || (hosoInserId == 1 && updateNhapNguId == 0)) { // add quan dpo
                    SaveNhapNgu(e);
                }
                else {
                    UpdateNhapNgu(e);
                }
            }

            var phongbancongviec = $('#ddlPhongtabCongViec').val();
            var chucvucongviec = $('#ddlChucVuNhanVien').val();
            if (phongbancongviec != "%" && chucvucongviec != "%") {
                var inscongviecId = $('#hidInsertCongViecId').val();

                if ((hosoInserId == 0 && inscongviecId == 0) || (hosoInserId == 1 && inscongviecId == 0)) { // add cong viec
                    SaveCongViec(e);
                }
                else {
                    UpdateCongViec(e);
                }
            }

        });

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();

            resetFormMaintainance();

            //loadPhongKhuVucTabCongViec($("#ddlCongTyXiNghiep").val());

            $('#hidLyLichIdInsert').val(1);           

            var hosoId = $(this).data('id');
            loadHoSoNhanVien(hosoId);

            HideHopDong(true);
            loadHopDong(hosoId);   

            loadDangDoan(hosoId);

            loadCongViec(hosoId);

            loadIsLockHoSo(hosoId);
            
        });

        $('body').on('click', '.btn-editTrinhDo', function (e) {
            e.preventDefault();

            $('#hidLyLichIdInsert').val(1);
            $('#hidTrinhDoId').val(1);
                        
            var trinhdoId = $(this).data('id');
            loadTrinhDo(trinhdoId);

            //tedu.notify(trinhdoId, "success");

        });
        $('body').on('click', '.btn-deleteTrinhDo', function (e) {
            e.preventDefault();

            $('#hidLyLichIdInsert').val(1);
            $('#hidTrinhDoId').val(1);
            
            var trinhdoId = $(this).data('id');
            loadDeleteTrinhDo(trinhdoId);

            //tedu.notify(trinhdoId, "success");
        });

        $('#btnInHoSo').on('click', function (e) {
            e.preventDefault();   
            
            InHoSo(e);
        });

        //$('#btnXuatPDF').on('click', function (e) {
        //    e.preventDefault();
        //    XuatPDF();
        //});

        $('#btnXuatExcel').on('click', function (e) {
            e.preventDefault();
            XuatExcel();
        }); 

        $("#ddlChucVuKyHopDong").on('change', function () {
            //tedu.notify("chuc vu hop dong", "success");
            var congty = $('#ddlCongTyXiNghiep').val();
            var chucvu = $("#ddlChucVuKyHopDong").val();

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
                        $('#txtHeSoLuongCoBan').val(0);
                        $('#txtLuongCoBan').val(0);
                    }
                    else {
                        var hopdong = response.Result.Results[0];
                        
                        $('#hidHeSoLuongDanhMucId').val(hopdong.HeSoLuongDanhMucId);
                        $('#txtHeSoLuongCoBan').val(hopdong.HeSoLuong);
                        $('#txtLuongCoBan').val(hopdong.LuongCoBan);
                    }
                },
                error: function (status) {
                    console.log(status);
                    tedu.notify('Không có hệ số lương phù hợp.', 'error');
                }
            });

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

        $("#fileHinhBangCap1").on('change', function () {
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
                    clearFileBang1Input($("#fileHinhBangCap1"));
                    imageBang1.push(path);

                    $('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    tedu.notify('Đã tải ảnh lên thành công!', 'success');
                },
                error: function () {
                    tedu.notify('There was error uploading files!', 'error');
                }
            });
        });

        $("#fileHinhBangCap2").on('change', function () {
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
                    clearFileBang2Input($("#fileHinhBangCap2"));
                    imageBang2.push(path);

                    $('#imagelistBang2').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
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
    function clearFileBang1Input(ctrl) {
        try {
            imageBang1 = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) { }
    }
    function clearFileBang2Input(ctrl) {
        try {
            imageBang2 = [];
            ctrl.value = null;
            ctrl.value('');
        }
        catch (ex) { }
    }

    function isFormMainValidate()
    {
        if ($('#frmMainLyLich').valid() && $('#frmMainCongViec').valid()) {
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
                //txtNoiOHienNay: { required: true },               
                txtSoNhaTenDuongQueQuan: { required: true },
                ddlThanhPhoTinhQueQuan: {
                    required: true,
                    isDanhMuc: true
                },
                ddlQuanHuyenQueQuan: {
                    required: true,
                    isDanhMuc: true
                },
                ddlPhuongXaQueQuan: {
                    required: true,
                    isDanhMuc: true
                },

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
                //txtNoiOHienNay: { required: "Nhập nơi ở hiện nay." },

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
                ddlLoaiBang: { required: true, isDanhMuc: true },
                txtChuyenNganh: { required: true },
                ddlLoaiHinh: { required: true, isDanhMuc: true },
                ddlXepLoai: { required: true, isDanhMuc: true },
                txtNamCapBang: { required: true },
                txtTenTruongCapBang: { required: true }
            },
            messages: {
                ddlLoaiBang: { required: "Nhập loại bằng!" },
                ddlLoaiHinh: { required: "Nhập loại hình đào tạo!" },
                ddlXepLoai: { required: "Nhập xếp loại bằng!" }
            }
        });

        $('#frmMainHopDong').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtSoHopDong: {
                    required: true
                },
                ddlLoaiHopDong: {
                    required: true,
                    isDanhMuc: true
                },
                txtNgayKyHopDong: {
                    required: true,
                    isDateVietNam: true
                },                
                txtNgayHieuLuc: {
                    required: true,
                    isDateVietNam: true
                },
                txtNgayHetHan: {
                    required: true,
                    isDateVietNam: true
                },
                ddlChucVuKyHopDong: {
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
                txtSoHopDong: { required: "Nhập số hợp đồng!" },
                txtHeSoLuongCoBan: { required: "Chỉ nhập số!" },
                txtLuongCoBan: { required: "Chỉ nhập số!" }
            }
        });

        //$('#txtNgayVaoDang').validate({
        //    errorClass: 'red',
        //    ignore: [],
        //    lang: 'vi',
        //    rules: {
        //        txtNgayVaoDang: {
        //            required: true,
        //            isDateVietNam: true
        //        }
        //    },
        //    messages: {
        //        txtNgayVaoDang: { required: "Nhập ngày vào Đảng!"}
        //    }
        //});

        $('#frmMainDangDoan').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {               
                ddlChucVuDang: {
                    required: true,
                    isDanhMuc: true
                },
                txtNgayVaoDoan: {
                    required: true,
                    isDateVietNam: true
                },
                ddlChucVuDoan: {
                    required: true,
                    isDanhMuc: true
                },
                txtNgayVaoCongDoan: {
                    required: true,
                    isDateVietNam: true
                },
                ddlChucVuCongDoan: {
                    required: true,
                    isDanhMuc: true
                },
                lbNgayThamGiaCachMang: {
                    required: true,
                    isDateVietNam: true
                },
                txtNgayNhapNgu: {
                    required: true,
                    isDateVietNam: true
                },
                ddlChucVuQuanDoi: {
                    required: true,
                    isDanhMuc: true
                }
            }
        });

        $('#frmMainCongViec').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                ddlPhongtabCongViec: {
                    required: true,
                    isDanhMuc: true
                }
            },
            messages: {
                ddlPhongtabCongViec: { required: "Chọn phòng!" }
            }
        });

        $('#ddlKhuVuc').on('change', function () {
            var corporationId = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(corporationId);

            tedu.notify('Danh mục phòng theo khu vực.', 'success');
        });

        $('#ddlCongTyXiNghiep').on('change', function () {
            var corporationId = $('#ddlCongTyXiNghiep').val();
            loadPhongKhuVucTabCongViec(corporationId);

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
        $('#txtSoDienThoai').val('');
        $('#txtHoVaTen').val('');
        $('#txtTenGoiKhac').val('');
        $('#ddlGioiTinh')[0].selectedIndex = 0;
        $('#txtNgaySinh').val('');
        $('#txtSoCMND').val('');
        $('#txtNgayCapCMND').val('');
        $('#txtNoiCapCMND').val('');
        $('#txtNoiSinh').val('');
        //$('#txtQueQuan').val('');
        //$('#txtNoiOHienNay').val('');
        $('#ddlHonNhan')[0].selectedIndex = 0;
        $('#ddlDanToc')[0].selectedIndex = 0;
        $('#ddlTonGiao')[0].selectedIndex = 0;
        $('#ddlXuatThan')[0].selectedIndex = 0;

        $('#txtSoNhaTenDuong').val('');
        $('#ddlThanhPhoTinh')[0].selectedIndex = 1;
        $('#ddlQuanHuyen')[0].selectedIndex = 0;
        $('#ddlPhuongXa')[0].selectedIndex = 0;

        $('#txtSoNhaTenDuongQueQuan').val('');
        $('#ddlThanhPhoTinhQueQuan')[0].selectedIndex = 1;
        $('#ddlQuanHuyenQueQuan')[0].selectedIndex = 0;
        $('#ddlPhuongXaQueQuan')[0].selectedIndex = 0;
    }
    function resetFormTabTrinhDo() {
        $('#hidTrinhDoId').val(0);
        $('#hidtrinhdoEditId').val('');        

        $('#ddlLoaiBang')[0].selectedIndex = 0;
        $('#ddlLoaiHinh')[0].selectedIndex = 0;
        $('#ddlXepLoai')[0].selectedIndex = 0;
        $('#txtChuyenNganh').val('');
        $('#txtNamCapBang').val('');
        $('#txtTenTruongCapBang').val('');
        $('#txtGhiChuTrinhDo').val('');

        clearFileBang1Input($("#fileHinhBangCap1"));
        $('#imagelistBang1').html('');
        imageBang1 = [];

        clearFileBang2Input($("#fileHinhBangCap2"));
        $('#imagelistBang2').html('');
        imageBang2 = [];
    }
    function resetFormTabHopDong() {       
        $('#hidHopDongId').val(0);
        $('#hidhopdongEditId').val('');        
        $('#hidHeSoLuongDanhMucId').val('');

        $('#ddlLoaiHopDong')[0].selectedIndex = 0;
        $('#ddlChucVuKyHopDong')[0].selectedIndex = 0;
        $('#txtSoHopDong').val('');
        $('#txtNgayKyHopDong').val('');

        var ngayhopdong = tedu.getFormattedDate(new Date());
        $('#txtNgayHopDong').val(ngayhopdong);

        $('#txtNgayHieuLuc').val('');
        $('#txtNgayHetHan').val('');
        $('#txtHeSoLuongCoBan').val('0.00');
        $('#txtLuongCoBan').val('0');
        $('#txtTenKyHopDong').val('');
    }
    function resetFormTabDangDoan() {
        $('#hidDangDoanId').val(0);

        $('#hidInsertDangId').val(0);
        $('#hidInsertDoanId').val(0);
        $('#hidInsertCongDoanId').val(0);
        $('#hidInsertCachMangId').val(0);
        $('#hidInsertNhapNguId').val(0);

        $('#hidUpdateDangId').val(0);
        $('#hidUpdateDoanId').val(0);
        $('#hidUpdateCongDoanId').val(0);
        $('#hidUpdateCachMangId').val(0);
        $('#hidUpdateNhapNguId').val(0);

        $('#ddlChucVuDang')[0].selectedIndex = 0;
        $('#ddlChucVuDoan')[0].selectedIndex = 0;
        $('#ddlChucVuCongDoan')[0].selectedIndex = 0;
        $('#ddlChucVuQuanDoi')[0].selectedIndex = 0;
        $('#ddlCapBacQuanDoi')[0].selectedIndex = 0;
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
        $('#txtDacDiemBanThanMoi').val('');
        $('#txtNgayNhapNgu').val('');
        $('#txtNgayXuatNgu').val('');
        $('#txtDonViQuanDoi').val('');
    }
    function resetFormTabCongViec() {
        $('#hidCongViecId').val(0);

        $('#hidInsertCongViecId').val(0);
        $('#hidUpdateCongViecId').val(0);        

        $('#ddlCongTyXiNghiep')[0].selectedIndex = 1;
        $('#ddlPhongtabCongViec')[0].selectedIndex = 0;
        $('#ddlChucVuNhanVien')[0].selectedIndex = 1;
        $('#txtCongTacChinh').val('');
        $('#txtSoQuyetDinhCongViec').val('');
        $('#txtTenQuyetDinhCongViec').val('');
        $('#txtNgayKyCongViec').val('');
        $('#txtNgayHieuLucCongViec').val('');
    }

    function loadData() {
        //LoadTableHoSoNhanVien();

        LoadTabDanhMucLyLich();
        LoadTabDanhMucTrinhDo();
        //LoadTabDanhMucHopDong();
        //LoadTabDanhMucDangDoan();
        //LoadTabDanhMucCongViec();

        $('#txtHeSoLuongCoBan').val('0.00');
        $('#txtLuongCoBan').val('0');

        var gioitinh = [{ value:"1", ten:"Nam" }, { value:"0", ten:"Nữ" } ];
        var render = "";
        for (var i = 0; i < gioitinh.length ; i++) {
            render += "<option value='" + gioitinh[i].value + "'>" + gioitinh[i].ten + "</option>";
        }
        $('#ddlGioiTinh').html(render);
    }

    function LoadHopDongDangCongViec() {
        LoadTabDanhMucHopDong();
        LoadTabDanhMucDangDoan();
        LoadTabDanhMucCongViec();
    }

    function LoadTableHoSoNhanVien(isPageChanged) {
        var template = $('#table-HoSoNhanVien').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/hoso/GetAllPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblHoSoNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoNhanVien').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPaging(response.Result.RowCount, function () {
                        LoadTableHoSoNhanVien();
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function wrapPaging(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULHoSoNhanVien a').length === 0 || changePageSize === true) {
            $('#paginationULHoSoNhanVien').empty();
            $('#paginationULHoSoNhanVien').removeData("twbs-pagination");
            $('#paginationULHoSoNhanVien').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULHoSoNhanVien').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                //tedu.configs.pageIndex = p;
                //setTimeout(callBack(), 200);
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                } 
            }
        });
    }
    function wrapPagingTrinhDo(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULTrinhDo a').length === 0 || changePageSize === true) {
            $('#paginationULTrinhDo').empty();
            $('#paginationULTrinhDo').removeData("twbs-paginationTrinhDo");
            $('#paginationULTrinhDo').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULTrinhDo').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                //tedu.configs.pageIndex = p;
                //setTimeout(callBack(), 200);
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function loadPhuongXaMaTinh(huyenid) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/PhuongXaGetListMaHuyen',
            data: { huyenId: huyenid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhuongXa + "</option>";
                });
                $('#ddlPhuongXa').html(render);

                //var tinhid = $('#ddlThanhPhoTinh').val();
                //loadQuanHuyenMaTinh(tinhid);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });
    }

    function loadQuanHuyenMaTinh(tinhid) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/QuanHuyenGetListMaTinh',
            data: { tinhId: tinhid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenQuanHuyen + "</option>";
                });
                $('#ddlQuanHuyen').html(render);
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });
    }

    function loadPhuongXaMaTinhQueQuan(huyenid) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/PhuongXaGetListMaHuyen',
            data: { huyenId: huyenid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenPhuongXa + "</option>";
                });
                $('#ddlPhuongXaQueQuan').html(render);
                
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });
    }

    function loadQuanHuyenMaTinhQueQuan(tinhid) {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/QuanHuyenGetListMaTinh',
            data: { tinhId: tinhid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenQuanHuyen + "</option>";
                });
                $('#ddlQuanHuyenQueQuan').html(render);
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });
    }

    function LoadTabDanhMucLyLich() {
        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ThanhPhoTinhGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenTinh + "</option>";
                });
                $('#ddlThanhPhoTinhQueQuan').html(render);
                $('#ddlThanhPhoTinhQueQuan')[0].selectedIndex = 1;

                var tinhid = $('#ddlThanhPhoTinhQueQuan').val();
                loadQuanHuyenMaTinhQueQuan(tinhid);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });

        $.ajax({
            type: 'GET',
            url: '/admin/hoso/ThanhPhoTinhGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenTinh + "</option>";
                });
                $('#ddlThanhPhoTinh').html(render);
                $('#ddlThanhPhoTinh')[0].selectedIndex = 1;

                var tinhid = $('#ddlThanhPhoTinh').val();
                loadQuanHuyenMaTinh(tinhid);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Thành phố, tỉnh.', 'error');
            }
        });

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
                $("#ddlChucVuNhanVien")[0].selectedIndex = 1;
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

                LoadTableHoSoNhanVien(true);

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                loadPhongKhuVucTabCongViec($("#ddlCongTyXiNghiep").val());
                
                //LoadTableInHoSo();
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
                //$("#ddlPhongBan")[0].selectedIndex = 1;

                //$('#ddlPhongtabCongViec').html(render);
                //$("#ddlPhongtabCongViec")[0].selectedIndex = 1;
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadPhongKhuVucTabCongViec(makhuvuc) {
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
                //$('#ddlPhongBan').html(render);
                //$("#ddlPhongBan")[0].selectedIndex = 1;

                $('#ddlPhongtabCongViec').html(render);
                //$("#ddlPhongtabCongViec")[0].selectedIndex = 1;
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

            var hosoid = $('#hidLyLichId').val();   // set new Guid Id
            var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0

            var sodienthoai = $('#txtSoDienThoai').val();
            var sothenhanvien = $('#txtSoTheNhanVien').val();
            var hovaten = $('#txtHoVaTen').val();

            var corporationid = $('#ddlCongTyXiNghiep').val();
            var phongid = $('#ddlPhongtabCongViec').val();
            var chucvuid = $("#ddlChucVuNhanVien").val();

            var tengoikhac = $('#txtTenGoiKhac').val();
            var gioitinh = $('#ddlGioiTinh').val();
            var ngaysinh = tedu.getFormatDateYYMMDD($('#txtNgaySinh').val());
            var socmnd = $('#txtSoCMND').val();
            var ngaycap = tedu.getFormatDateYYMMDD($('#txtNgayCapCMND').val());
            var noicap = $('#txtNoiCapCMND').val();
            var noisinh = $('#txtNoiSinh').val();
            //var quequan = $('#txtQueQuan').val();
            //var noiohiennay = $('#txtNoiOHienNay').val();

            var sonha = $('#txtSoNhaTenDuong').val();
            var tinhid = $('#ddlThanhPhoTinh').val();
            var huyenid = $('#ddlQuanHuyen').val();
            var phuongid = $('#ddlPhuongXa').val();

            var sonhaquequan = $('#txtSoNhaTenDuongQueQuan').val();
            var tinhquequanid = $('#ddlThanhPhoTinhQueQuan').val();
            var huyenquequanid = $('#ddlQuanHuyenQueQuan').val();
            var phuongquequanid = $('#ddlPhuongXaQueQuan').val();

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
                    ChucVuNhanVienId: chucvuid,

                    SoDienThoai: sodienthoai,
                    SoTheNhanVien: sothenhanvien,

                    HinhNhanVien: imageNhanVien,

                    TenGoiKhac: tengoikhac,
                    GioiTinh: gioitinh,
                    NgaySinh: ngaysinh,
                    SoCMND: socmnd,
                    NgayCapCMND: ngaycap,
                    NoiCapCMND: noicap,
                    NoiSinh: noisinh,
                    //QueQuan: quequan,
                    //NoiOHienNay: noiohiennay,
                    SoNhaDuong: sonha,
                    ThanhPhoTinhId: tinhid,
                    QuanHuyenId: huyenid,
                    PhuongXaId: phuongid, 
                    SoNhaDuongQueQuan: sonhaquequan,
                    ThanhPhoTinhQueQuanId: tinhquequanid,
                    QuanHuyenQueQuanId: huyenquequanid,
                    PhuongXaQueQuanId: phuongquequanid,

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
                    if (response.Success == false) {
                        tedu.notify(response.Message, "error");
                    }
                    else {
                        tedu.notify('Tạo hồ sơ nhân viên.', 'success');

                        LoadTableHoSoNhanVien(true);

                        $('#modal-add-edit-HoSo').modal('hide');

                        resetFormMaintainance();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Hồ sơ nhân viên', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function loadHoSoNhanVien(hosoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetHoSoId",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var hoso = response.Result.Results[0];

                $('#hidLyLichId').val(hoso.Id);

                $('#imagelistHinhThe').html('');
                imagelistHinhThe = [];
                $('#imagelistHinhThe').append('<div class="col-md-3"><img width="100"  data-path="' + hoso.HinhNhanVien + '" src="' + hoso.HinhNhanVien + '"></div>');
                imageNhanVien.push(hoso.HinhNhanVien);

                $('#txtTenGoiKhac').val(hoso.TenGoiKhac);
                $('#txtHoVaTen').val(hoso.Ten);
                $('#txtSoDienThoai').val(hoso.SoDienThoai);
                $('#txtSoTheNhanVien').val(hoso.SoTheNhanVien);
                $('#ddlGioiTinh').val(hoso.GioiTinh);
                $('#txtNgaySinh').val(tedu.getFormattedDate(hoso.NgaySinh));

                $('#txtSoCMND').val(hoso.SoCMND);
                $('#txtNgayCapCMND').val(tedu.getFormattedDate(hoso.NgayCapCMND));
                $('#txtNoiCapCMND').val(hoso.NoiCapCMND);
                $('#txtNoiSinh').val(hoso.NoiSinh);
                //$('#txtQueQuan').val(hoso.QueQuan);
                //$('#txtNoiOHienNay').val(hoso.NoiOHienNay);

                $('#txtSoNhaTenDuong').val(hoso.SoNhaDuong);
                $('#ddlThanhPhoTinh').val(hoso.ThanhPhoTinhId);
                $('#ddlQuanHuyen').val(hoso.QuanHuyenId);
                $('#ddlPhuongXa').val(hoso.PhuongXaId);

                $('#txtSoNhaTenDuongQueQuan').val(hoso.SoNhaDuongQueQuan);
                $('#ddlThanhPhoTinhQueQuan').val(hoso.ThanhPhoTinhQueQuanId);
                $('#ddlQuanHuyenQueQuan').val(hoso.QuanHuyenQueQuanId);
                $('#ddlPhuongXaQueQuan').val(hoso.PhuongXaQueQuanId);

                $('#ddlHonNhan').val(hoso.HonNhanDanhMucId);
                $('#ddlDanToc').val(hoso.DanTocDanhMucId);
                $('#ddlTonGiao').val(hoso.TonGiaoDanhMucId);
                $('#ddlXuatThan').val(hoso.XuatThanDanhMucId);

                // tab hopdong
                $('#ddlChucVuKyHopDong').val(hoso.ChucVuNhanVienId);                

                // tab cong viec
                $('#ddlCongTyXiNghiep').val(hoso.CorporationId);
                //$('#ddlPhongtabCongViec').val(hoso.ChucVuNhanVienId);

                //$('#ckStatusM').prop('checked', data.Status === 1);                

                $('#modal-add-edit-HoSo').modal('show');

                LoadTableTrinhDo(true);

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateHoSoNhanVien(e) {
        var isMainValidate = isFormMainValidate();

        //tedu.notify("3423423423", 'error');
        //return false;

        if (isMainValidate === true) {
            e.preventDefault();

            var hosoid = $('#hidLyLichId').val();
            var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 1

            var sodienthoai = $('#txtSoDienThoai').val();
            var sothenhanvien = $('#txtSoTheNhanVien').val();
            var hovaten = $('#txtHoVaTen').val();

            var corporationid = $('#ddlCongTyXiNghiep').val();
            var phongid = $('#ddlPhongtabCongViec').val();
            var chucvuid = $("#ddlChucVuNhanVien").val();

            var tengoikhac = $('#txtTenGoiKhac').val();
            var gioitinh = $('#ddlGioiTinh').val();
            var ngaysinh = tedu.getFormatDateYYMMDD($('#txtNgaySinh').val());
            var socmnd = $('#txtSoCMND').val();
            var ngaycap = tedu.getFormatDateYYMMDD($('#txtNgayCapCMND').val());
            var noicap = $('#txtNoiCapCMND').val();
            var noisinh = $('#txtNoiSinh').val();
            //var quequan = $('#txtQueQuan').val();
            //var noiohiennay = $('#txtNoiOHienNay').val();
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
                    ChucVuNhanVienId: chucvuid,

                    SoDienThoai: sodienthoai,
                    SoTheNhanVien: sothenhanvien,

                    HinhNhanVien: imageNhanVien,

                    TenGoiKhac: tengoikhac,
                    GioiTinh: gioitinh,
                    NgaySinh: ngaysinh,
                    SoCMND: socmnd,
                    NgayCapCMND: ngaycap,
                    NoiCapCMND: noicap,
                    NoiSinh: noisinh,
                    //QueQuan: quequan,
                    //NoiOHienNay: noiohiennay,
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
                    if (response.Success == false) {
                        tedu.notify(response.Message, "error");
                    }
                    else {
                        tedu.notify('Tạo hồ sơ nhân viên.', 'success');

                        LoadTableHoSoNhanVien(true);

                        $('#modal-add-edit-HoSo').modal('hide');

                        resetFormMaintainance();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Hồ sơ nhân viên', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function SaveHoSoNhanVienTrinhDo(e) {
        
        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            e.preventDefault();

            var hosoid = $('#hidLyLichId').val();   // set new Guid Id
            var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0

            var sodienthoai = $('#txtSoDienThoai').val();
            var sothenhanvien = $('#txtSoTheNhanVien').val();
            var hovaten = $('#txtHoVaTen').val();

            var corporationid = $('#ddlCongTyXiNghiep').val();
            var phongid = $('#ddlPhongtabCongViec').val();
            var chucvuid = $("#ddlChucVuNhanVien").val();

            var tengoikhac = $('#txtTenGoiKhac').val();
            var gioitinh = $('#ddlGioiTinh').val();
            var ngaysinh = tedu.getFormatDateYYMMDD($('#txtNgaySinh').val());
            var socmnd = $('#txtSoCMND').val();
            var ngaycap = tedu.getFormatDateYYMMDD($('#txtNgayCapCMND').val());
            var noicap = $('#txtNoiCapCMND').val();
            var noisinh = $('#txtNoiSinh').val();
            //var quequan = $('#txtQueQuan').val();
            //var noiohiennay = $('#txtNoiOHienNay').val();
            var sonha = $('#txtSoNhaTenDuong').val();
            var tinhid = $('#ddlThanhPhoTinh').val();
            var huyenid = $('#ddlQuanHuyen').val();
            var phuongid = $('#ddlPhuongXa').val();

            var sonhaquequan = $('#txtSoNhaTenDuongQueQuan').val();
            var tinhquequanid = $('#ddlThanhPhoTinhQueQuan').val();
            var huyenquequanid = $('#ddlQuanHuyenQueQuan').val();
            var phuongquequanid = $('#ddlPhuongXaQueQuan').val();

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
                    ChucVuNhanVienId: chucvuid,

                    SoDienThoai: sodienthoai,
                    SoTheNhanVien: sothenhanvien,

                    HinhNhanVien: imageNhanVien,

                    TenGoiKhac: tengoikhac,
                    GioiTinh: gioitinh,
                    NgaySinh: ngaysinh,
                    SoCMND: socmnd,
                    NgayCapCMND: ngaycap,
                    NoiCapCMND: noicap,
                    NoiSinh: noisinh,
                    //QueQuan: quequan,
                    //NoiOHienNay: noiohiennay,
                    SoNhaDuong: sonha,
                    ThanhPhoTinhId: tinhid,
                    QuanHuyenId: huyenid,
                    PhuongXaId: phuongid,
                    SoNhaDuongQueQuan: sonhaquequan,
                    ThanhPhoTinhQueQuanId: tinhquequanid,
                    QuanHuyenQueQuanId: huyenquequanid,
                    PhuongXaQueQuanId: phuongquequanid,

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
                    if (response.Success == false) {
                        tedu.notify(response.Message, "error");
                    }
                    else {
                        tedu.notify('Tạo hồ sơ nhân viên.', 'success');

                        LoadTableHoSoNhanVien(true);

                        $('#modal-add-edit-HoSo').modal('hide');

                        //resetFormMaintainance();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Hồ sơ nhân viên', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function SaveHoSoNhanVienTrinhDo2(e) {

        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {
            e.preventDefault();

            var hosoid = $('#hidLyLichId').val();   // set new Guid Id
            var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0

            var sodienthoai = $('#txtSoDienThoai').val();
            var sothenhanvien = $('#txtSoTheNhanVien').val();
            var hovaten = $('#txtHoVaTen').val();

            var corporationid = $('#ddlCongTyXiNghiep').val();
            var phongid = $('#ddlPhongtabCongViec').val();
            var chucvuid = $("#ddlChucVuNhanVien").val();

            var tengoikhac = $('#txtTenGoiKhac').val();
            var gioitinh = $('#ddlGioiTinh').val();
            var ngaysinh = tedu.getFormatDateYYMMDD($('#txtNgaySinh').val());
            var socmnd = $('#txtSoCMND').val();
            var ngaycap = tedu.getFormatDateYYMMDD($('#txtNgayCapCMND').val());
            var noicap = $('#txtNoiCapCMND').val();
            var noisinh = $('#txtNoiSinh').val();
            //var quequan = $('#txtQueQuan').val();
            //var noiohiennay = $('#txtNoiOHienNay').val();
            var sonha = $('#txtSoNhaTenDuong').val();
            var tinhid = $('#ddlThanhPhoTinh').val();
            var huyenid = $('#ddlQuanHuyen').val();
            var phuongid = $('#ddlPhuongXa').val();

            var sonhaquequan = $('#txtSoNhaTenDuongQueQuan').val();
            var tinhquequanid = $('#ddlThanhPhoTinhQueQuan').val();
            var huyenquequanid = $('#ddlQuanHuyenQueQuan').val();
            var phuongquequanid = $('#ddlPhuongXaQueQuan').val();

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
                    ChucVuNhanVienId: chucvuid,
                    SoDienThoai: sodienthoai,
                    SoTheNhanVien: sothenhanvien,
                    HinhNhanVien: imageNhanVien,
                    TenGoiKhac: tengoikhac,
                    GioiTinh: gioitinh,
                    NgaySinh: ngaysinh,
                    SoCMND: socmnd,
                    NgayCapCMND: ngaycap,
                    NoiCapCMND: noicap,
                    NoiSinh: noisinh,
                    //QueQuan: quequan,
                    //NoiOHienNay: noiohiennay,
                    SoNhaDuong: sonha,
                    ThanhPhoTinhId: tinhid,
                    QuanHuyenId: huyenid,
                    PhuongXaId: phuongid,
                    SoNhaDuongQueQuan: sonhaquequan,
                    ThanhPhoTinhQueQuanId: tinhquequanid,
                    QuanHuyenQueQuanId: huyenquequanid,
                    PhuongXaQueQuanId: phuongquequanid,

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
                    if (response.Success == false) {
                        tedu.notify(response.Message, "error");
                    }
                    else {
                        tedu.notify('Tạo hồ sơ nhân viên.', 'success');

                        LoadTableHoSoNhanVien(true);

                        //$('#modal-add-edit-HoSo').modal('hide');

                        //resetFormMaintainance();

                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Không thể lưu Hồ sơ nhân viên', 'error');
                    tedu.stopLoading();
                }
            });

            return false;
        }
    }

    function SaveTrinhDoNhanVien(e) {
        e.preventDefault();
        
        var hosoid = $('#hidLyLichId').val(); // new guid Id
        var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0        
        var tringdoid = 0; // tringdoId = 0

        var loaibang = $('#ddlLoaiBang').val();
        var chuyennganh = $('#txtChuyenNganh').val();
        var loaihinh = $('#ddlLoaiHinh').val();
        var xeploai = $('#ddlXepLoai').val();
        var namcapbang = $('#txtNamCapBang').val();
        var tentruong = $('#txtTenTruongCapBang').val();
        var ghichutrinhdo = $('#txtGhiChuTrinhDo').val();

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateTrinhDo",
            data: {
                HoSoNhanVienId: hosoid,
                InsertUpdateId: hosoidinup, // = 0
                InsertUpdateTrinhDoId: tringdoid, // = 0
                
                LoaiBangDanhMucId: loaibang,   
                ChuyenNganh: chuyennganh,
                LoaiDaoTaoDanhMucId: loaihinh,
                XepLoaiDanhMucId: xeploai,
                NamCapBang: namcapbang,
                TenTruong: tentruong,  
                GhiChu: ghichutrinhdo, 
                HinhBangMatPath1: imageBang1,
                HinhBangMatPath2: imageBang2              
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
                    tedu.notify('Trình độ nhân viên.', 'success');

                    LoadTableTrinhDo(true);

                    resetFormTabTrinhDo();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Trình độ nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LoadTableTrinhDo(isPageChanged) {
        var template = $('#table-TrinhDo').html();
        var render = "";

        var makhuvuc = "";
        var phongId = "";
        var timnhanvien = "";
        var hosoid = $('#hidLyLichId').val();
        var trinhdoid = "";

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: hosoid,
                rinhdoId: trinhdoid
            },
            url: '/admin/hoso/GetAllTrinhDoPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenLoaiBang: item.TenLoaiBang,
                            ChuyenNganh: item.ChuyenNganh,
                            TenLoaiHinhDaoTao: item.TenLoaiHinhDaoTao,
                            HinhBangMatPath1: item.HinhBangMatPath1 === null ? '<img src="/admin-side/images/user.png?h=90" ' : '<img src="' + item.HinhBangMatPath1 + '?h=90" />',
                            HinhBangMatPath2: item.HinhBangMatPath2 === null ? '<img src="/admin-side/images/user.png?h=90" ' : '<img src="' + item.HinhBangMatPath2 + '?h=90" />'
                                                        
                        });
                    });
                }

                $('#lbl-totalTrinhDo-records').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentTrinhDo').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingTrinhDo(response.Result.RowCount, function () {
                        LoadTableTrinhDo();
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
                $('#tbl-contentTrinhDo').html(render);

                //console.log(status);
                //tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadTrinhDo(trinhdoid) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetTrinhDoId",
            data: { trinhdoId: trinhdoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var trinhdo = response.Result.Results[0];             
                
                $('#hidtrinhdoEditId').val(trinhdo.Id);

                $('#ddlLoaiBang').val(trinhdo.LoaiBangDanhMucId);
                $('#txtChuyenNganh').val(trinhdo.ChuyenNganh);
                $('#ddlLoaiHinh').val(trinhdo.LoaiDaoTaoDanhMucId);
                $('#ddlXepLoai').val(trinhdo.XepLoaiDanhMucId);
                $('#txtNamCapBang').val(trinhdo.NamCapBang);
                $('#txtTenTruongCapBang').val(trinhdo.TenTruong);
                $('#txtGhiChuTrinhDo').val(trinhdo.GhiChu);    

                $('#imagelistBang1').html('');
                imageBang1 = [];
                $('#imagelistBang1').append('<div class="col-md-3"><img width="100"  data-path="' + trinhdo.HinhBangMatPath1 + '" src="' + trinhdo.HinhBangMatPath1 + '"></div>');
                imageBang1.push(trinhdo.HinhBangMatPath1);

                $('#imagelistBang2').html('');
                imageBang2 = [];
                $('#imagelistBang2').append('<div class="col-md-3"><img width="100"  data-path="' + trinhdo.HinhBangMatPath2 + '" src="' + trinhdo.HinhBangMatPath2 + '"></div>');
                imageBang2.push(trinhdo.HinhBangMatPath2);

                //LoadTableTrinhDo();

                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }
    
    function UpdateTrinhDo(e) {
        e.preventDefault();

        var trinhdoid = $('#hidtrinhdoEditId').val();

        var hosoid = $('#hidLyLichId').val(); // new guid Id
        var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 1      
        var tringdoid = $('#hidTrinhDoId').val(); // tringdoId =1

        var loaibang = $('#ddlLoaiBang').val();
        var chuyennganh = $('#txtChuyenNganh').val();
        var loaihinh = $('#ddlLoaiHinh').val();
        var xeploai = $('#ddlXepLoai').val();
        var namcapbang = $('#txtNamCapBang').val();
        var tentruong = $('#txtTenTruongCapBang').val();
        var ghichutrinhdo = $('#txtGhiChuTrinhDo').val();

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateTrinhDo",
            data: {
                Id: trinhdoid,
                HoSoNhanVienId: hosoid,
                InsertUpdateId: hosoidinup, // = 1
                InsertUpdateTrinhDoId: tringdoid, // = 1

                LoaiBangDanhMucId: loaibang,
                ChuyenNganh: chuyennganh,
                LoaiDaoTaoDanhMucId: loaihinh,
                XepLoaiDanhMucId: xeploai,
                NamCapBang: namcapbang,
                TenTruong: tentruong,
                GhiChu: ghichutrinhdo,
                HinhBangMatPath1: imageBang1,
                HinhBangMatPath2: imageBang2
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
                    tedu.notify('Trình độ nhân viên.', 'success');

                    LoadTableTrinhDo(true);

                    resetFormTabTrinhDo();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Trình độ nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    } 

    function loadDeleteTrinhDo(trinhdoid) {
        var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 1      
        var tringdoid = $('#hidTrinhDoId').val(); // tringdoId =1

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/Hoso/DeleteTrinhDo",
                data: { Id: trinhdoid, 
                    InsertUpdateId: hosoidinup, // = 1
                    InsertUpdateTrinhDoId: tringdoid // = 1 },
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();

                    $('#hidLyLichIdInsert').val(1);
                    $('#hidTrinhDoId').val(0);

                    LoadTableTrinhDo(true);
                },
                error: function (status) {
                    tedu.notify('Xóa trình độ lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function LoadTableClear() {        
        var rendertrinhdo = "";
        var renderhopdong = "";
        var rendercongviec = "";

        rendertrinhdo = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
        $('#tbl-contentTrinhDo').html(rendertrinhdo);

        renderhopdong = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
        $('#tbl-contentHopDong').html(renderhopdong);

        rendercongviec = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th></tr>";
        $('#tbl-contentCongViec').html(rendercongviec);

        HideHopDong(false);
    }

    function SaveHopDongNhanVien(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // new guid Id
        var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0
        var hesoluongdanhmuc = $('#hidHeSoLuongDanhMucId').val();         

        var corporationid = $('#ddlCongTyXiNghiep').val();
        var chucvuid = $('#ddlChucVuKyHopDong').val();

        var sohopdong = $('#txtSoHopDong').val();
        var loaihopdong = $('#ddlLoaiHopDong').val();
        var ngaykyhopdong = tedu.getFormatDateYYMMDD($('#txtNgayKyHopDong').val()); 
        var ngayhopdong = tedu.getFormatDateYYMMDD($('#txtNgayHopDong').val());
        var ngayhieuluc = tedu.getFormatDateYYMMDD($('#txtNgayHieuLuc').val());
        var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());
        //var chucvukyhopdong = $('#ddlChucVuKyHopDong').val();
        var tenkyhopdong = $('#txtTenKyHopDong').val();
        var hesoluongcoban = $('#txtHeSoLuongCoBan').val();
        var luongcoban = $('#txtLuongCoBan').val();                

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateHopDong",
            data: {
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

                    resetFormTabHopDong();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Hợp đồng nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function XuatExcel() {
        //tedu.notify("Excel ho so", "success");
        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = '';

        var that = $('#hidId').val();
        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/ExportExcel",
            data: {
                billId: that,
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien
            },
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                window.location.href = response;
                tedu.stopLoading();
            }
        });
    }

    //function XuatPDF() {
    //    tedu.notify("PDF ho so", "success");               
    //}

    function InHoSo() {       
        //tedu.notify("In ho so", "success");     

        $("#divInHoSoNhanVien").print({
            //Use Global styles
            globalStyles: false,
            //Add link with attrbute media=print
            mediaPrint: true,
            //Custom stylesheet
            stylesheet: "http://fonts.googleapis.com/css?family=Inconsolata",
            //Print in a hidden iframe
            iframe: false,
            //Don't print this
            noPrintSelector: ".avoid-this",
            //Add this at top
            //prepend: "Hello World!!!",   //Add this on bottom
            //append : "Buh Bye!",      //Log to console when printing is done via a deffered callback
            deferred: $.Deferred().done(function () {
                console.log('Printing done', arguments);
            }),
            doctype: '<!doctype html> '
        });

    }

    function LoadTableInHoSo() {
        var template = $('#table-InHoSoNhanVien').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlPhongBan').val();
        var timnhanvien = $('#txtTimNhanVien').val();

        tedu.notify(timnhanvien, "success");

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: 1,
                pageSize: 10       
            },
            url: '/admin/hoso/GetAllHoSoIn',
            dataType: 'json',
            success: function (response) {
                if (response.Result.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=60 && w=40"' : '<img src="' + item.HinhNhanVien + '?h=90 && w=40" />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate)
                        });
                    });
                }

                if (render !== '') {
                    $('#tblContenIntHoSoNhanVien').html(render);
                }

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể In dữ liệu .', 'error');
            }
        });
    }

    function loadHopDong(hosoid) {
        $('#hidhopdongEditId').val(1);

        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetMaxHopDongId",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    resetFormTabHopDong();
                }
                else {
                    var hopdong = response.Result.Results[0];               

                    $('#txtSoHopDong').val(hopdong.SoHopDong);
                    $('#ddlLoaiHopDong').val(hopdong.HopDongDanhMucId);

                    $('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong));
                    $('#txtNgayHopDong').val(tedu.getFormattedDate(hopdong.NgayHopDong));
                    $('#txtNgayHieuLuc').val(tedu.getFormattedDate(hopdong.NgayHieuLuc));
                    $('#txtNgayHetHan').val(tedu.getFormattedDate(hopdong.NgayHetHan));

                    //$('#ddlChucVuKyHopDong').val(hopdong.HopDongDanhMucId);
                    $('#txtTenKyHopDong').val(hopdong.TenNguoiKyHopDong);
                    $('#txtHeSoLuongCoBan').val(hopdong.HeSoLuong);
                    $('#txtLuongCoBan').val(hopdong.LuongCoBan);   
                }               
                //$('#ckStatusM').prop('checked', data.Status === 1);     
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });

        loadTableTabHopDong(hosoid);
    }

    function loadTableTabHopDong(hosoid) {
        var template = $('#table-HopDongChiTiet').html();
        var render = "";

        $.ajax({
            type: 'GET',
            data: {
                hosoId: hosoid
            },
            url: '/admin/hopdong/GetAllHoSoHopDongId',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            Ten: item.Ten,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,

                            SoHopDong: item.SoHopDong,
                            TenLoaiHopDong: item.TenLoaiHopDong,
                            HeSoLuong: item.HeSoLuong,
                            LuongCoBan: item.LuongCoBan,
                            NgayHieuLuc: tedu.getFormattedDate(item.LuongCoBan),
                            NgayHetHan: tedu.getFormattedDate(item.NgayHetHan),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                        });
                    });
                }

                $('#lbl-total-recordsHopDongChiTiet').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tbl-contentHopDongChiTiet').html(render);
                }

                //if (response.Result.RowCount !== 0) {
                //    wrapPaging(response.Result.RowCount, function () {
                //        LoadTableHopDongChiTiet();
                //    },
                //        isPageChanged);
                //}
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function HideHopDong(para) {
        $('#txtSoHopDong').prop('disabled', para);
        $('#ddlLoaiHopDong').prop('disabled', para);
        $('#txtNgayKyHopDong').prop('disabled', para);
        $('#txtNgayHopDong').prop('disabled', para);
        $('#txtNgayHieuLuc').prop('disabled', para);
        $('#txtNgayHetHan').prop('disabled', para);
        $('#ddlChucVuKyHopDong').prop('disabled', para);
        $('#txtTenKyHopDong').prop('disabled', para);                        
    }

    function SaveDang(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    
                
        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid =$('#hidInsertNhapNguId').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD($('#txtNgayVaoDang').val());   
        var mathedang = $('#txtMaTheDang').val();      
        var chucvudang = $('#ddlChucVuDang').val();      
        var noisinhhoatdang = $('#txtNoiSinhHoatDang').val();    

        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');   
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');   
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');   
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');   
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');   

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "InDang",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                NgayVaoDang: ngayvaodang,
                MaTheDang: mathedang,
                ChucVuDangId: chucvudang,
                NoiSinhHoatDang: noisinhhoatdang,

                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Đảng nhân viên.', 'success');    
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Đảng nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadDangDoan(hosoid) {
        $('#hidDangDoanId').val(1);

        $('#hidInsertDangId').val(1);
        $('#hidInsertDoanId').val(1);
        $('#hidInsertCongDoanId').val(1);
        $('#hidInsertCachMangId').val(1);
        $('#hidInsertNhapNguId').val(1);      

        LoadDangParameter(hosoid, "GetDangId"); 
        LoadDoanParameter(hosoid, "GetDoanId");
        LoadCongDoanParameter(hosoid, "GetCongDoanId");

        LoadCachMangParameter(hosoid, "GetCachMangId");
        LoadQuanDoiParameter(hosoid, "GetQuanDoiId");
    }  

    function LoadDangParameter(hosoid, para) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetDangDoanId",
            data: { hosoId: hosoid, parameter: para},
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var dang = response.Result.Results[0];

                if (dang.KETQUA == 'SAI' ) {
                    $('#hidUpdateDangId').val(0);

                    $('#txtNgayVaoDang').val('');
                    $('#txtMaTheDang').val('');
                    $('#ddlChucVuDang')[0].selectedIndex = 0;
                    $('#txtNoiSinhHoatDang').val('');    
                }
                else {   
                    $('#hidUpdateDangId').val(dang.ThamGiaDangId);
                    
                    $('#txtNgayVaoDang').val(tedu.getFormattedDate(dang.NgayVaoDang));
                    $('#txtMaTheDang').val(dang.MaTheDang);
                    $('#ddlChucVuDang').val(dang.ChucVuDangId);
                    $('#txtNoiSinhHoatDang').val(dang.NoiSinhHoatDang);     
                }               
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateDang(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var thamgiadangid = $('#hidUpdateDangId').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD($('#txtNgayVaoDang').val());
        var mathedang = $('#txtMaTheDang').val();
        var chucvudang = $('#ddlChucVuDang').val();
        var noisinhhoatdang = $('#txtNoiSinhHoatDang').val();

        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "UpDang",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                ThamGiaDangId: thamgiadangid,

                NgayVaoDang: ngayvaodang,
                MaTheDang: mathedang,
                ChucVuDangId: chucvudang,
                NoiSinhHoatDang: noisinhhoatdang,

                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Đảng nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Đảng nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }
    
    function SaveDoan(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ngayvaodoan = tedu.getFormatDateYYMMDD($('#txtNgayVaoDoan').val());
        var mathedoan = $('#txtMaTheDoan').val();
        var chucvudoan = $('#ddlChucVuDoan').val();
        var noisinhhoatdoan = $('#txtNoiSinhHoatDoan').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "InDoan",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                NgayVaoDoan: ngayvaodoan,
                MaTheDoan: mathedoan,
                ChucVuDoanId: chucvudoan,
                NoiSinhHoatDoan: noisinhhoatdoan,

                NgayVaoDang: ngayvaodang,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Đoàn thanh niên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Đoàn thanh niên', 'error');
                tedu.stopLoading();
            }
        });
    }   

    function LoadDoanParameter(hosoid, para) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetDangDoanId",
            data: { hosoId: hosoid, parameter: para },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var doan = response.Result.Results[0];

                if (doan.KETQUA == 'SAI') {
                    $('#hidUpdateDoanId').val(0);

                    $('#txtNgayVaoDoan').val('');
                    $('#txtMaTheDoan').val('');
                    $('#ddlChucVuDoan')[0].selectedIndex = 0;
                    $('#txtNoiSinhHoatDoan').val('');
                }
                else {
                    $('#hidUpdateDoanId').val(doan.ThamGiaDoanId);

                    $('#txtNgayVaoDoan').val(tedu.getFormattedDate(doan.NgayVaoDoan));
                    $('#txtMaTheDoan').val(doan.MaTheDoan);
                    $('#ddlChucVuDoan').val(doan.ChucVuDoanId);
                    $('#txtNoiSinhHoatDoan').val(doan.NoiSinhHoatDoan);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateDoan(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var thamgiadoanid = $('#hidUpdateDoanId').val();

        var ngayvaodoan = tedu.getFormatDateYYMMDD($('#txtNgayVaoDoan').val());
        var mathedoan = $('#txtMaTheDoan').val();
        var chucvudoan = $('#ddlChucVuDoan').val();
        var noisinhhoatdoan = $('#txtNoiSinhHoatDoan').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "UpDoan",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                ThamGiaDoanId: thamgiadoanid,

                NgayVaoDoan: ngayvaodoan,
                MaTheDoan: mathedoan,
                ChucVuDoanId: chucvudoan,
                NoiSinhHoatDoan: noisinhhoatdoan,

                NgayVaoDang: ngayvaodang,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Đoàn thanh niên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Đoàn thanh niên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveCongDoan(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ngayvaocongdoan = tedu.getFormatDateYYMMDD($('#txtNgayVaoCongDoan').val());
        var mathecongdoan = $('#txtMaTheCongDoan').val();
        var chucvucongdoan = $('#ddlChucVuCongDoan').val();
        var noisinhhoatcongdoan = $('#txtNoiSinhHoatCongDoan').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "InCongDoan",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                NgayVaoCongDoan: ngayvaocongdoan,
                MaTheCongDoan: mathecongdoan,
                ChucVuCongDoanId: chucvucongdoan,
                NoiSinhHoatCongDoan: noisinhhoatcongdoan,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Công Đoàn nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Công Đoàn nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LoadCongDoanParameter(hosoid, para) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetDangDoanId",
            data: { hosoId: hosoid, parameter: para },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var congdoan = response.Result.Results[0];

                if (congdoan.KETQUA == 'SAI') {
                    $('#hidUpdateCongDoanId').val(0);

                    $('#txtNgayVaoCongDoan').val('');
                    $('#txtMaTheCongDoan').val('');
                    $('#ddlChucVuCongDoan')[0].selectedIndex = 0;
                    $('#txtNoiSinhHoatCongDoan').val('');
                }
                else {
                    $('#hidUpdateCongDoanId').val(congdoan.ThamGiaCongDoanId);

                    $('#txtNgayVaoCongDoan').val(tedu.getFormattedDate(congdoan.NgayVaoCongDoan));
                    $('#txtMaTheCongDoan').val(congdoan.MaTheCongDoan);
                    $('#ddlChucVuCongDoan').val(congdoan.ChucVuCongDoanId);
                    $('#txtNoiSinhHoatCongDoan').val(congdoan.NoiSinhHoatCongDoan);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateCongDoan(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var thamgiacongdoanid = $('#hidUpdateCongDoanId').val();

        var ngayvaocongdoan = tedu.getFormatDateYYMMDD($('#txtNgayVaoCongDoan').val());
        var mathecongdoan = $('#txtMaTheCongDoan').val();
        var chucvucongdoan = $('#ddlChucVuCongDoan').val();
        var noisinhhoatcongdoan = $('#txtNoiSinhHoatCongDoan').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "UpCongDoan",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                ThamGiaCongDoanId: thamgiacongdoanid,

                NgayVaoCongDoan: ngayvaocongdoan,
                MaTheCongDoan: mathecongdoan,
                ChucVuCongDoanId: chucvucongdoan,
                NoiSinhHoatCongDoan: noisinhhoatcongdoan,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayThamGiaCachMang: ngaythamgiacachmang,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Công Đoàn nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Công Đoàn nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveThamGiaCachMang(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD($('#txtNgayThamGiaCachMang').val());
        var dacdiembanthancu = $('#txtDacDiemBanThanCu').val();
        var dacdiembanthanmoi = $('#txtDacDiemBanThanMoi').val();        

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "InCachMang",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                NgayThamGiaCachMang: ngaythamgiacachmang,
                DacDiemBanThanCu: dacdiembanthancu,
                DacDiemBanThanMoi: dacdiembanthanmoi,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Tham gia cách mạng nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Tham gia cách mạng nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LoadCachMangParameter(hosoid, para) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetDangDoanId",
            data: { hosoId: hosoid, parameter: para },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var cachmang = response.Result.Results[0];

                if (cachmang.KETQUA == 'SAI') {
                    $('#hidUpdateCachMangId').val(0);

                    $('#txtNgayThamGiaCachMang').val('');
                    $('#txtDacDiemBanThanCu').val('');                   
                    $('#txtDacDiemBanThanMoi').val('');
                }
                else {
                    $('#hidUpdateCachMangId').val(cachmang.ThamGiaCachMangId);

                    $('#txtNgayThamGiaCachMang').val(tedu.getFormattedDate(cachmang.NgayThamGiaCachMang));
                    $('#txtDacDiemBanThanCu').val(cachmang.DacDiemBanThanCu);                   
                    $('#txtDacDiemBanThanMoi').val(cachmang.DacDiemBanThanMoi);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateThamGiaCachMang(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ThamGiaCachMangId = $('#hidUpdateCachMangId').val();

        var ngaythamgiacachmang = tedu.getFormatDateYYMMDD($('#txtNgayThamGiaCachMang').val());
        var dacdiembanthancu = $('#txtDacDiemBanThanCu').val();        
        var dacdiembanthanmoi = $('#txtDacDiemBanThanMoi').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaynhapngu = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayxuatngu = tedu.getFormatDateYYMMDD('01/01/2111');

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "UpCachMang",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                ThamGiaCachMangId: ThamGiaCachMangId,

                NgayThamGiaCachMang: ngaythamgiacachmang,
                DacDiemBanThanCu: dacdiembanthancu,               
                DacDiemBanThanMoi: dacdiembanthanmoi,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu
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
                    tedu.notify('Công Đoàn nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Công Đoàn nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function SaveNhapNgu(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ngaynhapngu = tedu.getFormatDateYYMMDD($('#txtNgayNhapNgu').val());
        var ngayxuatngu = tedu.getFormatDateYYMMDD($('#txtNgayXuatNgu').val());
        var chucvuquandoi = $('#ddlChucVuQuanDoi').val();
        var capbacquandoi = $('#ddlCapBacQuanDoi').val();
        var donviquandoi = $('#txtDonViQuanDoi').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaycachmang = tedu.getFormatDateYYMMDD('01/01/2111');        

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "InQuanDoi",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu,
                ChucVuQuanDoiId: chucvuquandoi,
                CapBacQuanDoiId: capbacquandoi,
                DonViQuanDoi: donviquandoi,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaycachmang
                
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
                    tedu.notify('Tham gia quân dội nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Tham gia quân dội nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function LoadQuanDoiParameter(hosoid, para) {
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetDangDoanId",
            data: { hosoId: hosoid, parameter: para },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var quandoi = response.Result.Results[0];

                if (quandoi.KETQUA == 'SAI') {
                    $('#hidUpdateNhapNguId').val(0);

                    $('#txtNgayNhapNgu').val('');
                    $('#txtNgayXuatNgu').val('');
                    $('#ddlChucVuQuanDoi')[0].selectedIndex = 0;
                    $('#ddlCapBacQuanDoi')[0].selectedIndex = 0;
                    $('#txtDonViQuanDoi').val('');                        
                }
                else {
                    $('#hidUpdateNhapNguId').val(quandoi.ThamGiaQuanDoiId);

                    $('#txtNgayNhapNgu').val(tedu.getFormattedDate(quandoi.NgayNhapNgu));
                    $('#txtNgayXuatNgu').val(tedu.getFormattedDate(quandoi.NgayXuatNgu));
                    $('#ddlChucVuQuanDoi').val(quandoi.ChucVuQuanDoiId);
                    $('#ddlCapBacQuanDoi').val(quandoi.CapBacQuanDoiId);
                    $('#txtDonViQuanDoi').val(quandoi.DonViQuanDoi);
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function UpdateNhapNgu(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var dangdoanid = $('#hidDangDoanId').val(); // Id = 0    

        var dangid = $('#hidInsertDangId').val();
        var doanid = $('#hidInsertDoanId').val();
        var congdoanid = $('#hidInsertCongDoanId').val();
        var cachmangid = $('#hidInsertCachMangId').val();
        var nhapnguid = $('#hidInsertNhapNguId').val();

        var ThamGiaQuanDoiId = $('#hidUpdateNhapNguId').val();

        var ngaynhapngu = tedu.getFormatDateYYMMDD($('#txtNgayNhapNgu').val());
        var ngayxuatngu = tedu.getFormatDateYYMMDD($('#txtNgayXuatNgu').val());
        var chucvuquandoi = $('#ddlChucVuQuanDoi').val();
        var capbacquandoi = $('#ddlCapBacQuanDoi').val();
        var donviquandoi = $('#txtDonViQuanDoi').val();

        var ngayvaodang = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaodoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngayvaocongdoan = tedu.getFormatDateYYMMDD('01/01/2111');
        var ngaycachmang = tedu.getFormatDateYYMMDD('01/01/2111');        

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateDangDoan",
            data: {
                Parameters: "UpQuanDoi",
                HoSoNhanVienId: hosoid,
                InsertUpdateDangDoanId: dangdoanid, // = 0

                InsertUpdateDangId: dangid,
                InsertUpdateDoanId: doanid,
                InsertUpdateCongDoanId: congdoanid,
                InsertUpdateCachMangId: cachmangid,
                InsertUpdateNhapNguId: nhapnguid,

                ThamGiaQuanDoiId: ThamGiaQuanDoiId,

                NgayNhapNgu: ngaynhapngu,
                NgayXuatNgu: ngayxuatngu,
                ChucVuQuanDoiId: chucvuquandoi,
                CapBacQuanDoiId: capbacquandoi,
                DonViQuanDoi: donviquandoi,

                NgayVaoDang: ngayvaodang,
                NgayVaoDoan: ngayvaodoan,
                NgayVaoCongDoan: ngayvaocongdoan,
                NgayThamGiaCachMang: ngaycachmang
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
                    tedu.notify('Quân đội nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Quân đội nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }
        
    function SaveCongViec(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // new guid Id
        var hosoidinup = $('#hidLyLichIdInsert').val(); // Id = 0        
        var congviecid = 0; // tringdoId = 0

        var congtyxinghiep = $('#ddlCongTyXiNghiep').val();
        var phongcongviec = $('#ddlPhongtabCongViec').val();
        var chucvucongviec = $('#ddlChucVuNhanVien').val();
        var congtacchinh = $('#txtCongTacChinh').val();
        var soquyetdinhcongviec = $('#txtSoQuyetDinhCongViec').val();
        var tenquyetdinhcongviec = $('#txtTenQuyetDinhCongViec').val();

        var ngaykycongviec = tedu.getFormatDateYYMMDD($('#txtNgayKyCongViec').val());
        var ngayhieuluccongviec = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucCongViec').val());   
        var ngayketthucid = tedu.getFormatDateYYMMDD('01/01/2111');

        if (ngaykycongviec) {
            ngaykycongviec = tedu.getFormatDateYYMMDD($('#txtNgayKyCongViec').val());            
        }
        else {
            ngaykycongviec = tedu.getFormatDateYYMMDD('01/01/2111');
        }

        if ( ngayhieuluccongviec) {           
            ngayhieuluccongviec = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucCongViec').val());
        }
        else {            
            ngayhieuluccongviec = tedu.getFormatDateYYMMDD('01/01/2111');
        }                

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateCongViec",
            data: {
                HoSoNhanVienId: hosoid,
                InsertUpdateId: hosoidinup, // = 0
                InsertUpdateTrinhDoId: congviecid, // = 0

                CorporationId: congtyxinghiep,
                PhongDanhMucId: phongcongviec,
                ChucVuCongTyId: chucvucongviec,
                CongTacChinh: congtacchinh,
                SoQuyetDinh: soquyetdinhcongviec,
                TenQuyetDinh: tenquyetdinhcongviec,
                NgayKy: ngaykycongviec,  
                NgayHieuLuc: ngayhieuluccongviec,
                NgayKetThuc: ngayketthucid
                
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
                    tedu.notify('Công việc nhân viên.', 'success');                    

                    resetFormTabCongViec();

                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Công việc nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCongViec(hosoid) {
        var parameterId = "GetCongViecId";

        $('#hidCongViecId').val(1);        
        
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/GetCongViecId",
            data: { hosoId: hosoid, parameter: parameterId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var congviec = response.Result.Results[0];

                if (congviec.KETQUA == 'SAI') {
                    $('#hidInsertCongViecId').val(0);
                    $('#hidUpdateCongViecId').val(0);

                    $('#ddlCongTyXiNghiep')[0].selectedIndex = 1;
                    $('#ddlPhongtabCongViec')[0].selectedIndex = 0;
                    $('#ddlChucVuNhanVien')[0].selectedIndex = 1;
                    $('#txtCongTacChinh').val('');
                    $('#txtSoQuyetDinhCongViec').val('');
                    $('#txtTenQuyetDinhCongViec').val('');
                    $('#txtNgayKyCongViec').val('01/11/2011');
                    $('#txtNgayHieuLucCongViec').val('01/11/2011');
                }
                else {
                    $('#hidInsertCongViecId').val(1);
                    $('#hidUpdateCongViecId').val(congviec.Id);

                    $('#ddlCongTyXiNghiep').val(congviec.CorporationId);
                    $('#ddlPhongtabCongViec').val(congviec.PhongDanhMucId);
                    $('#ddlChucVuNhanVien').val(congviec.ChucVuCongTyId);
                    $('#txtCongTacChinh').val(congviec.CongTacChinh);
                    $('#txtSoQuyetDinhCongViec').val(congviec.SoQuyetDinh);
                    $('#txtTenQuyetDinhCongViec').val(congviec.TenQuyetDinh);                          
                          
                    $('#txtNgayKyCongViec').val(tedu.getFormattedDate(congviec.NgayKy));
                    $('#txtNgayHieuLucCongViec').val(tedu.getFormattedDate(congviec.NgayHieuLuc));
                  
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
        
    }

    function UpdateCongViec(e) {
        e.preventDefault();

        var hosoid = $('#hidLyLichId').val(); // get new guid Id
        var congviecid = $('#hidCongViecId').val(); // Id = 0    

        var incongviecid = $('#hidInsertCongViecId').val();  
        var upcongviecid = $('#hidUpdateCongViecId').val();
        
        var congtycongviec = $('#ddlCongTyXiNghiep').val();
        var phongcongviec = $('#ddlPhongtabCongViec').val();
        var chucvucongviec = $('#ddlChucVuNhanVien').val();
        var congtacchinh = $('#txtCongTacChinh').val();
        var soquyetdinhcongviec = $('#txtSoQuyetDinhCongViec').val();
        var tenquyetdinhcongviec = $('#txtTenQuyetDinhCongViec').val(); 

        var ngaykycongviec = tedu.getFormatDateYYMMDD($('#txtNgayKyCongViec').val());    
        var ngayhieuluccongviec = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucCongViec').val());            
        var ngayketthucid = tedu.getFormatDateYYMMDD('01/01/2111');

        if (ngaykycongviec) {
            ngaykycongviec = tedu.getFormatDateYYMMDD($('#txtNgayKyCongViec').val());
        }
        else {
            ngaykycongviec = tedu.getFormatDateYYMMDD('01/01/2111');
        }

        if (ngayhieuluccongviec) {
            ngayhieuluccongviec = tedu.getFormatDateYYMMDD($('#txtNgayHieuLucCongViec').val());
        }
        else {
            ngayhieuluccongviec = tedu.getFormatDateYYMMDD('01/01/2111');
        }

        $.ajax({
            type: "POST",
            url: "/Admin/Hoso/AddUpdateCongViec",
            data: {   
                Id: upcongviecid,
                HoSoNhanVienId: hosoid,
               
                InsertUpdateId: congviecid,                
                InsertUpdateCongViecId: incongviecid,   
              
                CorporationId: congtycongviec,
                PhongDanhMucId: phongcongviec,
                ChucVuCongTyId: chucvucongviec,
                CongTacChinh: congtacchinh,
                SoQuyetDinh: soquyetdinhcongviec,
                TenQuyetDinh: tenquyetdinhcongviec,

                NgayKy: ngaykycongviec,
                NgayHieuLuc: ngayhieuluccongviec,
                NgayKetThuc: ngayketthucid
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
                    tedu.notify('Công việc nhân viên.', 'success');
                    tedu.stopLoading();

                    $('#modal-add-edit-HoSo').modal('hide');
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Không thể lưu Công việc nhân viên', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadIsLockHoSo(hosoid) {      
        $.ajax({
            type: "GET",
            url: "/Admin/Hoso/IsLockHoSo",
            data: { hosoId: hosoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var islockhoso = response.Result;

                if (islockhoso.KETQUA == 'DUNG') {
                    $('#btnSave').hide();
                }
                else {                    
                    $('#btnSave').show();
                }
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadTieuDe() {
        $('#lbTieuDe1').text("dasd AS");     

    }


}