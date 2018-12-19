var filehosoController = function () {
   


    this.initialize = function () {       

        registerEvents();
    }

    this.loadSaveFileHoSo = function (hosoid) {
        loadFileHoSo(hosoid);
    }

    function registerEvents() {

        $('#btnSaveFileHoSo').on('click', function () { 
            SaveFileHoSo();
        });

    }

    function loadFileHoSo(hosoid) {
        tedu.notify(hosoid, "success");

    }

    function SaveFileHoSo() {
        tedu.notify("luu file ho so", "success");

    }

}