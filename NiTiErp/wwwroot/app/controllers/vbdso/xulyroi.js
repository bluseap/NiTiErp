var xulyroiController = function () {

    var vanbandenduyetfile = new vbdduyetfileController();
    var _quatrinhxuly = new _quatrinhxulyController();

    var bientimClick = 0;

    this.initialize = function () {
        registerEvents();
    }

    this.loadCountXuLyRoi = function (makv) {
        loadCountXuLyRoi(makv);
    }

    this.loadTableVBDXuLyRoi = function () {
        loadTableVBDXuLyRoi();
        $('#btnTimXuLyRoi').hide();
    }

    function registerEvents() { 

        $('body').on('click', '.btnVBDSoTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimXuLyRoi').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimXuLyRoi').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimXuLyRoi').on('click', function () {
            loadTableVBDXuLyRoi();
        });

        $("#ddl-show-pageXuLyRoi").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDXuLyRoi(true);
        });

        $('body').on('click', '.btnXuLyRoiPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnXuLyRoiPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnQTXuLyRoi', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            _quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        $('body').on('click', '.btnXuLyRoiButPheLD', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            vanbandenduyetfile.loadTableVBDDuyetFileVBDId(vanbandenId);
            $('#btnVBDDUyetFileId').hide();
            $('#modal-add-edit-VBDDuyetFile').modal('show');
        });

        const sliderxlroi = document.querySelector('#table-responsiveXuLyRoi');
        let isDown = false;
        let startX;
        let scrollLeft;
        sliderxlroi.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderxlroi.classList.add('active');
            startX = e.pageX - sliderxlroi.offsetLeft;
            scrollLeft = sliderxlroi.scrollLeft;
        });
        sliderxlroi.addEventListener('mouseleave', () => {
            isDown = false;
            sliderxlroi.classList.remove('active');
        });
        sliderxlroi.addEventListener('mouseup', () => {
            isDown = false;
            sliderxlroi.classList.remove('active');
        });
        sliderxlroi.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderxlroi.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            sliderxlroi.scrollLeft = scrollLeft - walk;
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

    function loadTableVBDXuLyRoi(isPageChanged) {
        var template = $('#table-SoTatCa').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDXuLyRoi',
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
                            VanBanDenId: item.VanBanDenId,
                            ButPheLanhDao: item.ButPheLanhDao === "Invalid Date" ? "" : item.ButPheLanhDao
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                $('#lblXuLyRoiTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentXuLyRoi').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDXuLyRoi(response.Result.RowCount, function () {
                        loadTableVBDXuLyRoi();
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
    function wrapPagingVBDXuLyRoi(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULXuLyRoi a').length === 0 || changePageSize === true) {
            $('#paginationULXuLyRoi').empty();
            $('#paginationULXuLyRoi').removeData("twbs-pagination");
            $('#paginationULXuLyRoi').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULXuLyRoi').twbsPagination({
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

    function loadCountXuLyRoi(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDXuLyRoi',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanXuLyRoi').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }    


}