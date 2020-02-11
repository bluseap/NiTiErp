var chochuyenchuyenmonController = function () {
  
    var chuyenchuyenmon = new _chuyenchuyenmonController();
    var quatrinhxuly = new _quatrinhxulyController();
    var choduyet = new choduyetController();
    var duyettatca = new duyettatcaController();

    var bientimClick = 0;

    this.initialize = function () {     

        registerEvents();

        quatrinhxuly.initialize();
        chuyenchuyenmon.initialize();

        loadCCCMData();

    }

    this.loadCountVanBanDen = function(makhuvuc) {
        loadCountVanBanDenChuaCCM(makhuvuc);
        chuyenchuyenmon.loadCountVBChuyenChuyenMon(makhuvuc);
        choduyet.loadCountVBDChoDuyet(makhuvuc);
        duyettatca.loadCountVBDDuyetTatCa(makhuvuc);
    }

    this.loadTableCCCM = function () {
        loadTableCCCM();
        $('#btnTimChoChuyenChuyenMon').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDDuyetTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimChoChuyenChuyenMon').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimChoChuyenChuyenMon').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimChoChuyenChuyenMon').on('click', function () {            
            loadTableCCCM();
        });

        $("#ddl-show-pageChoChuyenChuyenMon").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableCCCM(true);
        });

        $('body').on('click', '.btnCCCMPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnCCCMPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });       

        $('body').on('click', '.btnCCCMChuyen', function (e) {
            e.preventDefault();
            var vanbandenduyetId = $(this).data('id');
            //tedu.notify(vanbandenduyetId, "success");
           
            $('#hidVanBanDenDuyetId').val(vanbandenduyetId);
            $('#hidInsertVBDDNVXLId').val(1);

            chuyenchuyenmon.loadNhanVienXuLyVanBanDen(vanbandenduyetId);

            $('#modal-add-edit-ChuyenChuyenMon').modal('show');  
        });

        $('body').on('click', '.btnQuaTrinhXL', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        const slidercccm = document.querySelector('#table-responsiveChoChuyenChuyenMon');
        let isDown = false;
        let startX;
        let scrollLeft;
        slidercccm.addEventListener('mousedown', (e) => {
            isDown = true;
            slidercccm.classList.add('active');
            startX = e.pageX - slidercccm.offsetLeft;
            scrollLeft = slidercccm.scrollLeft;
        });
        slidercccm.addEventListener('mouseleave', () => {
            isDown = false;
            slidercccm.classList.remove('active');
        });
        slidercccm.addEventListener('mouseup', () => {
            isDown = false;
            slidercccm.classList.remove('active');
        });
        slidercccm.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slidercccm.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slidercccm.scrollLeft = scrollLeft - walk;
            //console.log(walk);
        });

    }    

    function loadPatchFile(vanbandenId) {
        $.ajax({
            type: "GET",
            url: "/Admin/vbdthem/GetVanBanDenId",
            data: { vanbandenId: vanbandenId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var vanbanden = response.Result[0];
                var win = window.open(vanbanden.DuongDanFile, '_blank');
                win.focus();
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function loadCountVanBanDenChuaCCM(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetChuaCCM',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanChoChuyenChuyenMon').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

    function loadTableCCCM(isPageChanged) {
        var template = $('#table-ChoChuyenChuyenMon').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDenTTDuyet',
            data: {
                corporationId: makhuvuc,                
                keyword: "%",

                NamVanBan: namvanban,
                SoVanBan: sovanban,
                KyHieuVanBan: kyhieuvanban,
                TrichYeu: trichyeu,
                CoQuanBanHanh: coquanbanhanh,

                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize
            },

            dataType: 'json',
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TenSoVanBanDen: item.NamSoVanBan + '-' + item.TenSoVanBan,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            TrichYeuCuaVanBan: item.TrichYeuCuaVanBan,
                            SoKyHieuDen: item.SoVanBanDenStt + ' ' + item.SoKyHieuCuaVanBan,
                            TenCoQuanBanHanh: item.TenCoQuanBanHanh,
                            NgayBanHanhCuaVanBan: tedu.getFormattedDate(item.NgayBanHanhCuaVanBan),
                            NgayDenCuaVanBan: tedu.getFormattedDate(item.NgayDenCuaVanBan),
                            TTXuLy: tedu.getVanBanDenTTXuLy(item.TTXuLy),
                            VanBanDenId: item.VanBanDenId
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblChoChuyenChuyenMonTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentChoChuyenChuyenMon').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingCCCM(response.Result.RowCount, function () {
                        loadTableCCCM();
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
    function wrapPagingCCCM(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULChoChuyenChuyenMon a').length === 0 || changePageSize === true) {
            $('#paginationULChoChuyenChuyenMon').empty();
            $('#paginationULChoChuyenChuyenMon').removeData("twbs-pagination");
            $('#paginationULChoChuyenChuyenMon').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULChoChuyenChuyenMon').twbsPagination({
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

    function loadCCCMData() {

    }


}