var hosoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var imageNhanVien = [];

    this.initialize = function () {              

        loadKhuVuc();

        loadData();

        registerEvents();

    }

    function registerEvents() {                

        $('#txtNgaySinh, #txtNgayCapCMND, #txtNgayKyHopDong').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        formMainValidate();        

        $('#btnTimNhanVien').on('click', function () {
            LoadTableHoSoNhanVien();           
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                LoadTableHoSoNhanVien();               
            }
        });

        $("#btn-create").on('click', function () {
            resetFormMaintainance();

            NhanVienId();// ho so nhan vien id new guid

            $('#modal-add-edit-HoSo').modal('show');
        });

        $('#btnSave').on('click', function (e) {
            var hosoInserId = $('#hidLyLichIdInsert').val();

            if (hosoInserId == 1) {
                UpdateHoSoNhanVien(e);
            }
            else
            {
                SaveHoSoNhanVien(e);
            }                   
        });

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();

            $('#hidLyLichIdInsert').val(1);

            var hosoId = $(this).data('id');
            loadHoSoNhanVien(hosoId);           
           
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
        if ($('#frmMainLyLich').valid() && $('#frmMainHopDong').valid() && $('#frmMainCongViec').valid()) {
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
        $('#txtQueQuan').val('');
        $('#txtNoiOHienNay').val('');
        $('#ddlHonNhan')[0].selectedIndex = 0;
        $('#ddlDanToc')[0].selectedIndex = 0;
        $('#ddlTonGiao')[0].selectedIndex = 0;
        $('#ddlXuatThan')[0].selectedIndex = 0;
    }
    function resetFormTabTrinhDo() {
        $('#hidTrinhDoId').val(0);

        $('#ddlLoaiBang')[0].selectedIndex = 0;
        $('#ddlLoaiHinh')[0].selectedIndex = 0;
        $('#ddlXepLoai')[0].selectedIndex = 0;
        $('#txtChuyenNganh').val('');  
        $('#txtNamCapBang').val('');  
        $('#txtTenTruongCapBang').val('');
        $('#txtGhiChuTrinhDo').val('');
    }
    function resetFormTabHopDong() {
        $('#hidHopDongId').val(0);
        
        $('#ddlLoaiHopDong')[0].selectedIndex = 0;
        $('#ddlChucVuKyHopDong')[0].selectedIndex = 0;          
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
        $('#txtDacDiemBanThanCu').val('');
        $('#txtNgayNhapNgu').val('');
        $('#txtNgayXuatNgu').val('');
        $('#txtDonViQuanDoi').val('');   
    }
    function resetFormTabCongViec() {
        $('#hidCongViecId').val(0);

        $('#ddlCongTyXiNghiep')[0].selectedIndex = 0;
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
        LoadTabDanhMucHopDong();
        LoadTabDanhMucDangDoan();
        LoadTabDanhMucCongViec();

        $('#txtHeSoLuongCoBan').val('0.00');
        $('#txtLuongCoBan').val('0');

        var gioitinh = [{ value:"1", ten:"Nam" }, { value:"0", ten:"Nữ" } ];        
        var render = "";
        for (var i = 0; i < gioitinh.length ; i++) {
            render += "<option value='" + gioitinh[i].value + "'>" + gioitinh[i].ten + "</option>";            
        }
        $('#ddlGioiTinh').html(render);        
        
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
                            HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png" width=70' : '<img src="' + item.HinhNhanVien + '" width=80 />',
                            TenKhuVuc: item.CorporationName,
                            TenPhong: item.TenPhong,
                            TenChucVu: item.TenChucVu,
                            NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                            CreateDate: tedu.getFormattedDate(item.CreateDate)
                            // Price: tedu.formatNumber(item.Price, 0),                        
                            //Status: tedu.getStatus(item.Status)
                        });

                    });
                }

                $('#lblHoSoNhanVienTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentHoSoNhanVien').html(render);
                }

                wrapPaging(response.Result.RowCount, function () {
                    LoadTableHoSoNhanVien();
                },
                isPageChanged);
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
        if ($('#paginationUL a').length === 0 || changePageSize === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationUL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                tedu.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
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

                loadPhongKhuVuc($("#ddlKhuVuc").val());
                loadPhongKhuVucTabCongViec($("#ddlCongTyXiNghiep").val());                      

                LoadTableHoSoNhanVien();
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

            var hosoid = $('#hidLyLichId').val();   // set Guid Id
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

                    LoadTableHoSoNhanVien(true);

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
                $('#txtQueQuan').val(hoso.QueQuan);
                $('#txtNoiOHienNay').val(hoso.NoiOHienNay);
                $('#ddlHonNhan').val(hoso.HonNhanDanhMucId);
                $('#ddlDanToc').val(hoso.DanTocDanhMucId);
                $('#ddlTonGiao').val(hoso.TonGiaoDanhMucId);
                $('#ddlXuatThan').val(hoso.XuatThanDanhMucId);                       

                // tab cong viec
                $('#ddlCongTyXiNghiep').val(hoso.CorporationId);
                $('#ddlPhongtabCongViec').val(hoso.PhongBanDanhMucId);

                //$('#ckStatusM').prop('checked', data.Status === 1);

                $('#modal-add-edit-HoSo').modal('show');

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
            var hosoidinup = $('#hidLyLichIdInsert').val();

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

                    LoadTableHoSoNhanVien(true);

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