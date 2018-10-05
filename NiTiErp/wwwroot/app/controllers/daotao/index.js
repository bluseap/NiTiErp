var daotaoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditDaoTao = new addeditdaotaoController();
    var daotaoDangKy = new daotaodangkyController();

    this.initialize = function () {
       
        registerEvents();

        addeditDaoTao.initialize();
        daotaoDangKy.initialize();

        loadData();
    }

    function registerEvents() {

        $("#btnSaveDaoTao").on('click', function () {  
            var insertDaoTaoLop = $('#hidInsertDaoTaoId').val(); // update

            if (insertDaoTaoLop === "2") {
                UpdateDaoTaoLopGiaoVien();
            }
            else {
                SaveDaoTaoLopGiaoVien();
            }

            //SaveDaoTaoLopGiaoVien();           
        });

        $("#btn-create").on('click', function () {

            resetFormAddEditDaoTao();

            $('#hidInsertDaoTaoId').val(1); // insert

            var template = $('#table-DaoTao').html();
            var render = "";
            $('#table-contentAddEditDaoTaoGiaoVien').html(render);            

            $('#modal-add-edit-DaoTao').modal('show'); 
        });

        $('body').on('click', '.btn-editDaoTao', function (e) {
            e.preventDefault();

            resetFormAddEditDaoTao();

            $('#hidInsertDaoTaoId').val(2); // update            

            var daotaoId = $(this).data('id');

            $('#hidDaoTaoId').val(daotaoId);

            var template = $('#table-DaoTao').html();
            var render = "";
            $('#table-contentAddEditDaoTaoGiaoVien').html(render);    

            loadDaoTaoLop(daotaoId);

            $('#modal-add-edit-DaoTao').modal('show'); 

        });

        $('#btn-AddEditDaoTaoGiaoVien').on('click', function () {
            var template = $('#template-table-AddEditDaoTaoGiaoVien').html();
            var render = Mustache.render(template, {  
                GiaoVienTenGiaoVien: "",
                GiaoVienChucDanh: "",
                GiaoVienSoDienThoai: "",
                GiaoVienEmail: "",
                GiaoVienId: "00000000-0000-0000-0000-000000000000"
               
            });
            $('#table-contentAddEditDaoTaoGiaoVien').append(render);
        });


        $('body').on('click', '.btn-deleteAddEditDaoTaoGiaoVien', function (e) {
            e.preventDefault();
            var insertDaoTaoLop = $('#hidInsertDaoTaoId').val(); // inser 1; update 2
            var giaovienid = $(this).data("id");

            if (giaovienid === "00000000-0000-0000-0000-000000000000") {             
                $(this).closest('tr').remove();                
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "/Admin/daotao/DeleteDaoTaoGiaoVien",
                    data: {
                        Id: giaovienid
                    },
                    dataType: "json",
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function (response) {
                        tedu.notify('Xóa thành công', 'success');
                        tedu.stopLoading();

                    },
                    error: function (status) {
                        tedu.notify('Xóa Quết định Giáo viên lỗi! Kiểm tra lại.', 'error');
                        tedu.stopLoading();
                    }
                });   

                $(this).closest('tr').remove();
                //deleteGiaoVien(giaovienid);
            }            
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

        $('#ddlAddEditDaoTaoNoi')[0].selectedIndex = 0;
        $('#ddlAddEditLoaiDaoTao')[0].selectedIndex = 0;
        $('#ddlAddEditLoaiBang')[0].selectedIndex = 0;
        $('#txtAddEditChuyenMon').val('');
        $('#txtAddEditNoiHoc').val('');
        $('#txtAddEditDiaChiHoc').val('');
        $('#txtAddEditSoDienThoai').val('');
        $('#txtAddEditSoLuongDangKy').val('');
        $('#txtAddEditSoLuongHoc').val('');
        $('#txtAddEditNgayBatDau').val('');
        $('#txtAddEditNgayKetThuc').val('');

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

    function UpdateDaoTaoLopGiaoVien() {
        var giaovienList = [];
        $.each($('#table-contentAddEditDaoTaoGiaoVien').find('tr'), function (i, item) {
            //console.log(item);
            giaovienList.push({
                Id: $(item).find('input.GiaoVienId').first().val(),
                TenGiaoVien: $(item).find('input.GiaoVienTenGiaoVien').first().val(),
                ChucDanh: $(item).find('input.GiaoVienChucDanh').first().val(),
                SoDienThoai: $(item).find('input.GiaoVienSoDienThoai').first().val(),
                Email: $(item).find('input.GiaoVienEmail').first().val()
            });
            //console.log(giaovienList);
        });

        var daotaolopid = $('#hidDaoTaoId').val();

        var noidaotao = $('#ddlAddEditDaoTaoNoi').val();
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
                Id: daotaolopid,

                InsUpDaoTaoLopId: insupdatetaolopid,
                DaoTaoNoiId: noidaotao,

                LoaiDaoTaoDanhMucId: loaidaotao,
                LoaiBangDanhMucId: loaibang,
                ChuyenMon: chuyenmon,
                NoiHoc: noihoc,
                DiaChiHoc: diachihoc,
                SoDienThoai: sodienthoai,
                SoLuongDangKy: soluongdangky,
                SoLuongHoc: soluonghoc,
                NgayBatDau: ngaybatdau,
                NgayKetThuc: ngayketthuc,

                DaoTaoGiaoVienList: giaovienList
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                loadTableDaoTao();
                $('#modal-add-edit-DaoTao').modal('hide');
                $('#table-contentAddEditDaoTaoGiaoVien').html('');
                resetFormAddEditDaoTao();
            }
        });
    }

    function SaveDaoTaoLopGiaoVien() {
        var giaovienList = [];
        $.each($('#table-contentAddEditDaoTaoGiaoVien').find('tr'), function (i, item) {
            //console.log(item);
            giaovienList.push({
                GiaoVienId: '0',
                TenGiaoVien: $(item).find('input.GiaoVienTenGiaoVien').first().val(),
                ChucDanh: $(item).find('input.GiaoVienChucDanh').first().val(),
                SoDienThoai: $(item).find('input.GiaoVienSoDienThoai').first().val(),
                Email: $(item).find('input.GiaoVienEmail').first().val()
            });
            //console.log(giaovienList);
        });       

        var noidaotao = $('#ddlAddEditDaoTaoNoi').val();

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
                NgayKetThuc: ngayketthuc,

                DaoTaoGiaoVienList: giaovienList
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                loadTableDaoTao();
                $('#modal-add-edit-DaoTao').modal('hide');
                $('#table-contentAddEditDaoTaoGiaoVien').html('');
                resetFormAddEditDaoTao();
            }
        });

    }

    function loadDaoTaoLop(daotaoid) {

        tedu.notify(daotaoid, "success");

        $.ajax({
            type: "GET",
            url: "/Admin/daotao/GetDaoTaoId",
            data: { daotaolopId: daotaoid },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var daotao = response.Result.Results[0];

                $('#ddlAddEditDaoTaoNoi').val(daotao.DaoTaoNoiId);
                $('#ddlAddEditLoaiDaoTao').val(daotao.LoaiDaoTaoDanhMucId);
                $('#ddlAddEditLoaiBang').val(daotao.LoaiBangDanhMucId);
                $('#txtAddEditChuyenMon').val(daotao.ChuyenMon);
                $('#txtAddEditNoiHoc').val(daotao.NoiHoc);
                $('#txtAddEditDiaChiHoc').val(daotao.DiaChiHoc);
                $('#txtAddEditSoDienThoai').val(daotao.SoDienThoai);
                $('#txtAddEditSoLuongDangKy').val(daotao.SoLuongDangKy);
                $('#txtAddEditSoLuongHoc').val(daotao.SoLuongHoc);
                $('#txtAddEditNgayBatDau').val(tedu.getFormattedDate(daotao.NgayBatDau));
                $('#txtAddEditNgayKetThuc').val(tedu.getFormattedDate(daotao.NgayKetThuc));

                loadGiaoVienLop(daotaoid);

                //$('#txtNgaKyQuyetDinh').val(tedu.getFormattedDate(bonhiem.NgayKyQuyetDinh));  
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadGiaoVienLop(daotaoid) {
        var daotaogiaovien = [];
        $.ajax({
            url: '/admin/daotao/GetDaoTaoGiaoVienLopId',
            data: {
                daotaoId: daotaoid
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                //daotaogiaovien = response.Result.Results;
                var render = '';
                var template = $('#template-table-AddEditDaoTaoGiaoVien').html();

                $.each(response.Result, function (i, item) {
                    render += Mustache.render(template, {
                        GiaoVienId: item.Id,
                        GiaoVienTenGiaoVien: item.TenGiaoVien,
                        GiaoVienChucDanh: item.ChucDanh,
                        GiaoVienSoDienThoai: item.SoDienThoai,
                        GiaoVienEmail: item.Email
                    });
                });
                $('#table-contentAddEditDaoTaoGiaoVien').html(render);
            }
        });
    }

    function deleteGiaoVien(giaovienid) {       
        //tedu.notify(inserkhenthuong);
        tedu.confirm('Bạn có chắc chắn xóa Giáo viên này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/daotao/DeleteDaoTaoGiaoVien",
                data: {
                    Id: giaovienid
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    $(this).closest('tr').remove();    
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();  
                   
                },
                error: function (status) {
                    tedu.notify('Xóa Quết định Kỷ luật lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

}