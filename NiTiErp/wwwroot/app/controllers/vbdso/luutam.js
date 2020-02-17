var luutamController = function () {

    var _quatrinhxuly = new _quatrinhxulyController();

    var bientimClick = 0;

    this.initialize = function () {

        registerEvents();        

    }

    this.loadCountLuuTam = function (makv) {
        loadCountLuuTam(makv);
    }

    this.loadTableVBDSoLuuTam = function () {
        loadTableVBDSoLuuTam();
        $('#btnTimLuuTam').hide();
    }

    function registerEvents() {

        $('body').on('click', '.btnVBDSoTim', function (e) {
            e.preventDefault();
            if (bientimClick === 0) {
                $('#btnTimLuuTam').show();
                bientimClick = 1;
            }
            else if (bientimClick === 1) {
                $('#btnTimLuuTam').hide();
                bientimClick = 0;
            }
        });

        $('#btnTimLuuTam').on('click', function () {
            //tedu.notify("luu tam", "success");
            loadTableVBDSoLuuTam();
        });

        $("#ddl-show-pageLuuTam").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            loadTableVBDSoLuuTam(true);
        });

        $('body').on('click', '.btnLTPatchFileKyHieu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });

        $('body').on('click', '.btnLTPatchFileTrichYeu', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            loadPatchFile(vanbandenId);
        });        

        $('body').on('click', '.btnLTQuaTrinhXL', function (e) {
            e.preventDefault();
            var vanbandenId = $(this).data('id');
            _quatrinhxuly.loadQuaTrinhXuLy(vanbandenId);
            $('#modal-add-edit-QuaTrinhXuLy').modal('show');
        });

        const sliderluutam = document.querySelector('#table-responsiveLuuTam');
        let isDown = false;
        let startX;
        let scrollLeft;
        sliderluutam.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderluutam.classList.add('active');
            startX = e.pageX - sliderluutam.offsetLeft;
            scrollLeft = sliderluutam.scrollLeft;
        });
        sliderluutam.addEventListener('mouseleave', () => {
            isDown = false;
            sliderluutam.classList.remove('active');
        });
        sliderluutam.addEventListener('mouseup', () => {
            isDown = false;
            sliderluutam.classList.remove('active');
        });
        sliderluutam.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderluutam.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            sliderluutam.scrollLeft = scrollLeft - walk;
            //console.log(walk);
        });

    } 

    function loadCountLuuTam(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDSoLuuTam',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanLuuTam').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
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

    function loadTableVBDSoLuuTam(isPageChanged) {
        var template = $('#table-LuuTam').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val();
        var namvanban = $('#txtNamVanBan').val();
        var sovanban = $('#txtSoVanBan').val();
        var kyhieuvanban = $('#txtKyHieuVanBan').val();
        var trichyeu = $('#txtTrichYeu').val();
        var coquanbanhanh = $('#ddlCoQuanBanHanh').val();

        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetListVBDSoLuuTam',
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

                $('#lblLuuTamTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentLuuTam').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingVBDSoLuuTam(response.Result.RowCount, function () {
                        loadTableVBDSoLuuTam();
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
    function wrapPagingVBDSoLuuTam(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULLuuTam a').length === 0 || changePageSize === true) {
            $('#paginationULLuuTam').empty();
            $('#paginationULLuuTam').removeData("twbs-pagination");
            $('#paginationULLuuTam').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULLuuTam').twbsPagination({
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

}