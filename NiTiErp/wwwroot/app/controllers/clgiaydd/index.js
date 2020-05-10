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
        loadNewGuid();

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

        $('#ddl-show-pageCLGiayDD').on('change', function (e) {
            e.preventDefault();

            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableCLGiayDD(true);
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

        $('#ddlKhuVuc').on('change', function (e) {
            e.preventDefault();
            var makv = $('#ddlKhuVuc').val();
            loadPhongKhuVuc(makv);            
        });    

        $('body').on('click', '.btn-addGiayDD', function (e) {
            e.preventDefault();
            var giaydiduongId = $(this).data('id');
            addToGiayDiDuong(giaydiduongId);        
        });

        $('#btnCLGiayDDIn').on('click', function () {
            saveIn();
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

                //loadTableCLGiayDD();

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

    function loadNewGuid() {
        var newGuid = tedu.getNewGuid();
        $('hidNewGuidGiayDD').val(newGuid);
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

        loadNewGuid();
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

    function loadTableCLGiayDD(isPageChanged) {
        var template = $('#table-CLGiayDD').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var maphong = $('#ddlPhongBan').val();
        var timnoidung = $('#txtTimNoiDung').val();

        $.ajax({
            type: 'GET',
            url: '/admin/CLGiayDD/GetListCLGiayDD',
            data: {
                khuvucId: makhuvuc,
                maphongIc: maphong,
                keyword: timnoidung,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            NgayNhap: tedu.getFormattedDate(item.NgayNhap),
                            Ten: item.Ten,
                            ChucVu: item.ChucVu,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TuNgay: tedu.getFormattedDate(item.TuNgay),
                            DenNgay: tedu.getFormattedDate(item.DenNgay),
                            Status: tedu.getCLGiayDiDuong(item.Status),
                            LyDo: item.LyDo,
                            GhiChu: item.GhiChu                                                     
                        });
                    });
                }

                $('#lblCLGiayDDTotalRecords').text(response.RowCount);

                if (render !== '') {
                    $('#tblContentCLGiayDD').html(render);
                }

                if (response.RowCount !== 0) {
                    wrapPagingCLGiayDD(response.RowCount, function () {
                        loadTableCLGiayDD();
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
    function wrapPagingCLGiayDD(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULCLGiayDD a').length === 0 || changePageSize === true) {
            $('#paginationULCLGiayDD').empty();
            $('#paginationULCLGiayDD').removeData("twbs-pagination");
            $('#paginationULCLGiayDD').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULCLGiayDD').twbsPagination({
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

    function addToGiayDiDuong(giaydiduongId) {
        $.ajax({
            type: "GET",
            url: "/Admin/CLGiayDD/GetCLGiayDD",
            data: {
                giaydiduongid: giaydiduongId
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var giaydiduong = response.Result[0];

                var ngaynhap = $('#txtNgayNhap').val();
                var tennhanvien = giaydiduong.Ten;
                var chucvu = giaydiduong.ChucVu;

                //var ddlCLGiayDDThem = giaydiduong.ChucVu;

                var lydo = giaydiduong.LyDo;
                var tungay = tedu.getFormattedDate(giaydiduong.TuNgay);
                var denngay = tedu.getFormattedDate(giaydiduong.DenNgay);
                var ghichu = giaydiduong.GhiChu;

                var template = $('#template-table-CLGiayDiDuongIn').html();
                var render = Mustache.render(template, {
                    Id: 0,
                    NgayNhap: ngaynhap,
                    Ten: tennhanvien,
                    ChucVu: chucvu,
                    TuNgay: tungay,
                    DenNgay: denngay,
                    CongTacTai: getCongTacTai(giaydiduong.Status),//1 ngoai tinh; 2 trong tinh
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

                //var guid = CreateGuid();
                //$('#hidCodeFileGuidId').val(vanbanden.CodeFileGuidId === '00000000-0000-0000-0000-000000000000' ? guid : vanbanden.CodeFileGuidId);
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });        
       
    }

    function saveIn() {
        var giaydiduongList = [];
        var newGUid = $('hidNewGuidGiayDD').val();

        $.each($('#table-CLGiayDiDuongIn-content').find('tr'), function (i, item) {
            giaydiduongList.push({
                Id: 0,
                NgayNhap: tedu.getFormattedDateYYYYMMDD($(item).find('input.txtNgayNhapIn').first().val()),
                Ten: $(item).find('input.txtTenIn').first().val(),
                ChucVu: $(item).find('input.txtChucVuIn').first().val(),
                TuNgay: tedu.getFormattedDateYYYYMMDD($(item).find('input.txtTuNgayIn').first().val()),
                DenNgay: tedu.getFormattedDateYYYYMMDD($(item).find('input.txtDenNgayIn').first().val()),
                CongTacTai: $(item).find('select.ddlCLGiayDDThem2').first().val(),//1 trong tinh; 2 ngoai tinh                //LyDo: lydo,
                GhiChu: $(item).find('input.txtGhiChuIn').first().val()                   
                //Quantity: $(item).find('input.txtQuantity').first().val(),               
                //ColorId: $(item).find('select.ddlColorId').first().val()
            });
        });

        var xml = '';
        xml = xml + "<tables>";
        for (var i = 0; i < giaydiduongList.length; i++) {
            var listfield = giaydiduongList[i];
            xml += "<items>";
            xml += '<Id>0</Id>';
            xml += '<NgayNhap>' + listfield.NgayNhap + '</NgayNhap>';
            xml += '<Ten>' + listfield.Ten + '</Ten>';
            xml += '<ChucVu>' + listfield.ChucVu + '</ChucVu>';
            xml += '<TuNgay>' + listfield.TuNgay + '</TuNgay>';
            xml += '<DenNgay>' + listfield.DenNgay + '</DenNgay>';
            xml += '<CongTacTai>' + listfield.CongTacTai + '</CongTacTai>';
            xml += '<GhiChu>' + listfield.GhiChu + '</GhiChu>';
            xml += "</items>";
        }
        xml = xml + '</tables>';

        //console.log(xml);

        $.ajax({
            type: "POST",
            url: '/admin/CLGiayDD/SaveXML',
            data: {
                giaydiduongXML: xml,
                username: userCorporationId,
                newguid: newGUid
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function () {
                tedu.notify("Save data..", "success");
                printGiayDD();
                tedu.stopLoading();                
            }
        });
    }

    function printGiayDD() {
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

}