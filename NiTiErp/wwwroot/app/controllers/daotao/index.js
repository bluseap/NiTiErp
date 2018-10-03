var daotaoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditDaoTao = new addeditdaotaoController();
    var daotaoDangKy = new daotaodangkyController();

    this.initialize = function () {
       
        registerEvents();

        addeditDaoTao.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btnSaveDaoTao").on('click', function () {  
            SaveDaoTaoLopGiaoVien();           
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditDaoTao();

            $('#hidInsertDaoTaoId').val(1); // insert

            var template = $('#table-DaoTao').html();
            var render = "";
            $('#table-contentAddEditDaoTaoGiaoVien').html(render);            

            $('#modal-add-edit-DaoTao').modal('show'); 
        });

        $('#btn-AddEditDaoTaoGiaoVien').on('click', function () {
            var template = $('#template-table-AddEditDaoTaoGiaoVien').html();
            var render = Mustache.render(template, {               
                GiaoVienTenGiaoVien: "",
                GiaoVienChucDanh: "",
                GiaoVienSoDienThoai: "",
                GiaoVienEmail: ""
            });
            $('#table-contentAddEditDaoTaoGiaoVien').append(render);
        });

        $('body').on('click', '.btn-deleteAddEditDaoTaoGiaoVien', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });
    }

    function loadNewGuid() {
        $.ajax({
            type: 'GET',
            url: '/admin/daotao/GetNewGuid',           
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var newgui = response;
                $('#hidNewGuidDaoTaoGiaoVienId').val(newgui);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không tạo được Giáo viên cho đào tạo.', 'error');
            }
        });
    }

    function loadData() {
        loadDaoTaoNoi();

        loadTableDaoTao();
    }

    function loadDaoTaoNoi() {
        $.ajax({
            type: 'GET',
            url: '/admin/daotaonoi/GetListDaoTaoNoi',        
            data: {
                keyword: "%", 
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result.Results, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.TenTruong + "</option>";
                });
                $('#ddlDaoTaoNoi').html(render);               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục nơi đào tạo.', 'error');
            }
        });
    }

    function resetFormAddEditDaoTao() {
        $('#hidDaoTaoId').val(0); 
        $('#hidHoSoNhanVienId').val(''); 
        $('#hidInsertDaoTaoId').val('0');  

        $('#hidDaoTaoGiaoVienId').val('');
        $('#hidInsertDaoTaoGaiVienId').val('0');  
        $('#hidNewGuidDaoTaoGiaoVienId').val("");

    }

    function loadTableDaoTao(isPageChanged) {
        var template = $('#table-DaoTao').html();
        var render = "";

        var timnhanvien = $('#txtTimNhanVien').val();

        $.ajax({
            type: 'GET',
            data: {
                daotaonoiId: "",
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },
            url: '/admin/daotao/GetListDaoTao',
            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenLoaiHinhDaoTao: item.TenLoaiHinhDaoTao,
                            TenLoaiBang: item.TenLoaiBang,
                            ChuyenMon: item.ChuyenMon,
                            DiaChiHoc: item.DiaChiHoc,
                            TenTruong: item.TenTruong,
                            NgayBatDau: tedu.getFormattedDate(item.NgayBatDau),
                            NgayKetThuc: tedu.getFormattedDate(item.NgayKetThuc),
                            SoLuongDangKy: item.SoLuongDangKy,
                            SoLuongHoc: item.SoLuongHoc,  
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),  //NgaySinh: tedu.getFormattedDate(item.NgaySinh),
                        });
                    });
                }

                $('#lblDaoTaoTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentDaoTao').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingDaoTao(response.Result.RowCount, function () {
                        loadTableDaoTao();
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
    function wrapPagingDaoTao(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        if ($('#paginationULDaoTao a').length === 0 || changePageSize === true) {
            $('#paginationULDaoTao').empty();
            $('#paginationULDaoTao').removeData("twbs-pagination");
            $('#paginationULDaoTao').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULDaoTao').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }

    function SaveDaoTaoLopGiaoVien() {
        var giaovienList = [];
        $.each($('#table-contentAddEditDaoTaoGiaoVien').find('tr'), function (i, item) {
            //console.log(item);
            giaovienList.push({ 
                Id: '0',
                TenGiaoVien: $(item).find('input.GiaoVienTenGiaoVien').first().val(),
                ChucDanh: $(item).find('input.GiaoVienChucDanh').first().val(),
                SoDienThoai: $(item).find('input.GiaoVienSoDienThoai').first().val(),
                Email: $(item).find('input.GiaoVienEmail').first().val()
            });
            //console.log(giaovienList);
        });

        var noidaotao = $('#ddlAddEditDaoTaoNoi').val();
        $.ajax({
            url: '/admin/daotao/SaveDaoTaoGiaoVien',
            data: {
                DaoTaoNoiId: noidaotao,
                daotaogiaovienList: giaovienList
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                SaveDaoTaoLop(noidaotao);
            }
        });

        
    }

    function SaveDaoTaoLop(noidaotao) {

        var insupdatetaolopid = $('#hidInsertDaoTaoId').val();
        
        var loaidaotao = $('#ddlAddEditLoaiDaoTao').val();
        var loaibang = $('#ddlAddEditLoaiBang').val();
        var chuyenmon = $('#txtAddEditChuyenMon').val();
        var noihoc = $('#txtAddEditNoiHoc').val(); 
        var diachihoc = $('#txtAddEditDiaChiHoc').val();
        var sodienthoai = $('#txtAddEditSoDienThoai').val();
        var soluongdangky = $('#txtAddEditSoLuongDangKy').val();
        var soluonghoc = $('#txtAddEditSoLuongHoc').val();
        var ngaybatdau = tedu.getFormatDateYYMMDD($('#txtAddEditNgayBatDau').val());  
        var ngayketthuc = tedu.getFormatDateYYMMDD($('#txtAddEditNgayKetThuc').val()); 

        $.ajax({
            url: '/admin/daotao/AddUpdateDaoTao',
            data: {
                InsUpDaoTaoLopId: insupdatetaolopid,
                DaoTaoNoiId: noidaotao,

                LoaiDaoTaoDanhMucId: loaidaotao,
                LoaiBangDanhMucId: loaibang,
                ChuyenMon:   chuyenmon ,
                NoiHoc: noihoc,
                DiaChiHoc: diachihoc ,
                SoDienThoai: sodienthoai ,
                SoLuongDangKy: soluongdangky,
                SoLuongHoc: soluonghoc,
                NgayBatDau: ngaybatdau ,
                NgayKetThuc: ngayketthuc 
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {

                $('#modal-add-edit-DaoTao').modal('hide');
                $('#table-contentAddEditDaoTaoGiaoVien').html('');
                resetFormAddEditDaoTao();
            }
        });

    }

}