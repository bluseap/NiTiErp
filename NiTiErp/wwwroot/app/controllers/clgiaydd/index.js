var clgiayddController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var cachedObj = {
        congtactai: []
    };
    //var addeditclgdd = new addeditclgddController();

    this.initialize = function () {
        loadKhuVuc();
        loadCongTacTai();        

        registerEvents();

        loadData();
        clearData();
        //addeditclgdd.initialize();
    }

    function registerEvents() {
        $('#txtNgayNhap, #txtTuNgay, #txtDenNgay, #txtTuNgay2, #txtDenNgay2').datepicker({      
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });      

        $('#btnTimNoiDung').on('click', function () {          
            loadTableCLGiayDD();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {              
                loadTableCLGiayDD();
            }
        });

        $('#btnCLGiayDDThem').on('click', function () {        
            themIn();            
        });

        $('body').on('click', '.btn-delete-CLGiayDiDuongIn', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });

        $('#btnCLGiayDDCLear').on('click', function () {
            xoaHet();
        });

        $('#ddlChonNhanVienPhong').on('change', function (e) {
            e.preventDefault();

            var tungay = $('#txtTuNgay2').val();
            var denngay = $('#txtDenNgay2').val();
            var chonnhanvien = $('#ddlChonNhanVienPhong').val();

            if (tungay === '' || denngay === '' || chonnhanvien === '%') {
                tedu.notify("Chọn từ ngày, đến ngày.", "error");
            }
            else {
                themNhanVienPhong(); 
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

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                var makv = $('#ddlKhuVuc').val();

                loadPhongKhuVuc(makv);

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

                $('#ddlChonNhanVienPhong').html(render);               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
    }

    function loadData() {
        loadAutocomplete();

        cachedObj.congtactai = [{ Id: '1', Value: 'Trong tỉnh' }, { Id: '2', Value: 'Ngoài tỉnh' }];
        $('#txtLyDo').val("Công tác");
        $('#lblTableCLGiayDDInTotalRecords').text('0');
    }

    function clearData() {
        var datenow = new Date();       

        $('#txtNgayNhap').val(tedu.getFormattedDate(datenow));
        $('#txtTen').val('');
        $('#txtChucVu').val('');
        $('#ddlCongTacTai')[0].selectedIndex = 1;
        $('#txtLyDo').val('Công tác');
        $('#txtTuNgay').val('');
        $('#txtDenNgay').val('');
        $('#txtGhiChu').val('');

        //$('#ddlCongTacTai')[0].selectedIndex = 0;
    }

    function loadCongTacTai() {
        var render = "<option value='%' >-- Lựa chọn --</option>";        
        render += "<option value='1'>Trong tỉnh</option>";
        render += "<option value='2'>Ngoài tỉnh</option>";
      
        $('#ddlCongTacTai').html(render);
        
        $("#ddlCongTacTai")[0].selectedIndex = 1;
    }

    function getCongTacTai(selectedId) {
        var tai = "<select class='form-control ddlCLGiayDDThem2'>";
        $.each(cachedObj.congtactai, function (i, congtactai1) {
            if (selectedId === congtactai1.Id)
                tai += '<option value="' + congtactai1.Id + '" selected="select">' + congtactai1.Value + '</option>';
            else
                tai += '<option value="' + congtactai1.Id + '">' + congtactai1.Value + '</option>';
        });
        tai += "</select>";
        return tai;        
    }     

    function themIn() {
        //var ngaynhap = tedu.getFormatDateYYMMDD($('#txtNgayNhap').val());
        var ngaynhap = $('#txtNgayNhap').val();
        var tennhanvien = $('#txtTen').val();
        var chucvu = $('#txtChucVu').val();
        var ddlCLGiayDDThem = $('#ddlCongTacTai').val();
        var lydo = $('#txtLyDo').val();
        var tungay = $('#txtTuNgay').val();
        var denngay = $('#txtDenNgay').val();
        var ghichu = $('#txtGhiChu').val();

        var template = $('#template-table-CLGiayDiDuongIn').html();
        var render = Mustache.render(template, {
            Id: 0,
            NgayNhap: ngaynhap,
            Ten: tennhanvien,
            ChucVu: chucvu,
            TuNgay: tungay,
            DenNgay: denngay,
            CongTacTai: getCongTacTai(ddlCLGiayDDThem),
            LyDo: lydo,
            GhiChu: ghichu
        });
        $('#table-CLGiayDiDuongIn-content').append(render);

        var counttable = $('tr', $('#table-responsiveCLGiayDDIn').find('tbody')).length;

        $('#lblTableCLGiayDDInTotalRecords').text(counttable);

        $('.txtDenNgayIn').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });  

        clearData();
    }

    function xoaHet() {
        $('#table-CLGiayDiDuongIn-content').html(''); 
        $('#lblTableCLGiayDDInTotalRecords').text('0');
    }

    function themNhanVienPhong() {
        //$('#table-CLGiayDiDuongIn-content').html('');        

        var template = $('#template-table-CLGiayDiDuongIn').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var phongId = $('#ddlChonNhanVienPhong').val();
        var timnhanvien = '%';
        //tedu.notify(timnhanvien, "success");

        var ddlCLGiayDDThem = $('#ddlCongTacTai').val();

        var ngaynhap = $('#txtNgayNhap').val();
        var tungay2 = $('#txtTuNgay2').val();
        var denngay2 = $('#txtDenNgay2').val();
        var lydo = $('#txtLyDo').val();
        var ghichu = $('#txtGhiChu').val();

        $.ajax({
            type: 'GET',
            data: {
                corporationId: makhuvuc,
                phongId: phongId,
                keyword: timnhanvien,
                page: 1,
                pageSize: 1000
            },
            url: '/admin/hoso/GetAllPaging',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    tedu.notify("Không có Nhân viên trong phòng.", "error");
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            NgayNhap: ngaynhap,
                            Ten: item.Ten,
                            ChucVu: item.TenChucVu,
                            TuNgay: tungay2,
                            DenNgay: denngay2,
                            CongTacTai: getCongTacTai(ddlCLGiayDDThem),
                            LyDo: lydo,
                            GhiChu: ghichu
                        });
                        $('#table-CLGiayDiDuongIn-content').append(render);
                    });

                    var counttable = $('tr', $('#table-responsiveCLGiayDDIn').find('tbody')).length;

                    $('#lblTableCLGiayDDInTotalRecords').text(counttable);

                    $('.txtDenNgayIn').datepicker({
                        autoclose: true,
                        format: 'dd/mm/yyyy',
                        language: 'vi'
                    });
                   
                }

            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });        

    }

    function loadAutocomplete() {
        var makhuvuc = $('#ddlKhuVuc').val();
        $.ajax({
            type: 'GET',
            url: "/admin/VBAutocomplete/GetListHoSoAuto",
            data: {
                codeXL: makhuvuc
            },
            async: true,
            dataType: 'json',
            success: function (database) {
                arrayReturn = [];
                var data = database.Result;
                for (var i = 0, len = data.length; i < len; i++) {
                    arrayReturn.push({ 'value': data[i].TenNhanVien, 'TenChucVu': data[i].TenChucVu });
                }
                //send parse data to autocomplete function
                loadSuggestions(arrayReturn);
                //console.log(countries);               
            }
        });
    }

    function loadSuggestions(options) {
        $('#txtTen').autocomplete({
            lookup: options,
            onSelect: function (suggestion) {
                //tedu.notify(suggestion.value, 'error');
                $('#txtChucVu').val(suggestion.TenChucVu);
            }
        });
    }

    function loadTableCLGiayDD() {

    }

}