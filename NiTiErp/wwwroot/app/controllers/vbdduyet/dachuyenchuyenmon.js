var dachuyenchuyenmonController = function () {

   

    this.initialize = function () {

        registerEvents();

    }

    this.loadCountVanBanDenCCM = function (makhuvuc) {
        loadCountVanBanDenChuyenChuyenMon(makhuvuc);
    }

    function registerEvents() {
        $('#btnTimDaChuyenChuyenMon').on('click', function () {
            tedu.notify("da chuyen chuyen mon", "success");

        });

    }

    function loadCountVanBanDenChuyenChuyenMon(makv) {
        $.ajax({
            type: 'GET',
            url: '/admin/vbdthem/GetCountVBDenDuyetCCM',
            data: {
                corporationId: makv
            },
            dataType: 'json',
            success: function (response) {
                $('#spanDaChuyenChuyenMon').text(response);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }

}