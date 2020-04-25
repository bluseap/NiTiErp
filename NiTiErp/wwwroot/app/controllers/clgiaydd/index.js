var clgiayddController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var cachedObj = {
        congtactai: []
    };
    //var addeditclgdd = new addeditclgddController();

    this.initialize = function () {
        loadKhuVuc();
        loadCongTacTai();
        cachedObj.congtactai = [{ Id: '1', Value: 'Trong tỉnh' }, { Id: '2', Value: 'Ngoài tỉnh' }];
      
        registerEvents();

        //addeditclgdd.initialize();

    }

    function registerEvents() {
        $('#txtDenNgay').datepicker({
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

            var ddlCLGiayDDThem = $('#ddlCongTacTai').val();
            var lydo = $('#txtLyDo').val();

            
            var template = $('#template-table-CLGiayDiDuongIn').html();
            var render = Mustache.render(template, {
                Id: 0,
                NgayNhap: getTuNgay(),
                Ten: 'ten',
                ChucVu: 'Chúc vụ',
                TuNgay: getTuNgay(),
                DenNgay: getTuNgay(),
                CongTacTai: getCongTacTai(ddlCLGiayDDThem),
                LyDo: lydo,
                GhiChu: 'Ghi chú'
            });
            $('#table-CLGiayDiDuongIn-content').append(render);

            $('.txtDenNgayIn').datepicker({
                autoclose: true,
                format: 'dd/mm/yyyy',
                language: 'vi'
            });                
        
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
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Phòng.', 'error');
            }
        });
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
    function getTuNgay() {
        var tai = '<input type="text" class="form-control txtDenNgayIn" />';
        return tai;
    }

    function loadTableCLGiayDD() {

    }

}