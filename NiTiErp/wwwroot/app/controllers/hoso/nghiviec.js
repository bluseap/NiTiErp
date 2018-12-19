var nghiviecController = function () {



    this.initialize = function () {

        registerEvents();
    }

    this.loadSaveNghiViec = function (hosoId) {
        loadNghiViec(hosoId);
    }

    function registerEvents() {

        $('#btnSaveNghiViec').on('click', function () {
            SaveNghiViec();
        });

        $('#txtNghiViecNgayNghi ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

    }

    function loadNghiViec(hosoId) {
        tedu.notify(hosoId, "success");
    }

    function SaveNghiViec() {
        tedu.notify("luu nghi viec nhan vien", "success");

    }

}