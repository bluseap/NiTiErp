var corporationClientController = function () {


    this.initialize = function () {
        
        loadData();
        loadCorporationService();
        registerEvents();        

    }

    function registerEvents() {
        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'en',
            rules: {
                txtFullName: { required: true },
                txtUserName: { required: true },
                txtPassword: {
                    required: true,
                    minlength: 6
                },
                txtConfirmPassword: {
                    equalTo: "#txtPassword"
                },
                txtEmail: {
                    required: true,
                    email: true
                },
                txtCorporationName: {required: true},
                txtCorporationAddress: {required: true}
            }
        });

        $("#btnCreate").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');
        });

    }    

    function loadData(isPageChanged) {
        var template = $('#table-template').html();
        var render = "";
        $.ajax({
            type: 'GET',            
            url: '/client/corporationClient/GetAllCorporations',
            dataType: 'json',
            success: function (response) {
                var template = $('#table-template').html();
                console.log(response);
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Id: item.Id,
                        Name: item.Name,
                        Email: item.Email,
                        PhoneNumber1: item.PhoneNumber1,
                        ImageLogo: item.ImageLogo === null ? '<img src="/admin-side/images/user.png" width=50' : '<img src="' + item.Image + '" width=50 />',
                        //Status: tedu.getStatus(item.Status)
                    });
                });
               
                if (render !== '') {
                    $('#tbl-content').html(render);
                }
               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Cannot loading data', 'error');
            }
        });
    }

    function loadCorporationService() {
        return $.ajax({
            type: "GET",
            url: "/Client/CorporationClient/GetAllCorporationService",
            dataType: "json",
            success: function (response) {              
                var render = "";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCorporationService').html(render);
            }
        });
    }

    function resetFormMaintainance() {       
        $('#hidId').val('');        
        $('#txtFullName').val('');
        $('#txtUserName').val('');
        $('#txtPassword').val('');
        $('#txtConfirmPassword').val('');       
        $('#txtEmail').val('');
        $('#txtPhoneNumber').val('');
        $('#txtCorporationName').val('');
        $('#txtCorporationAddress').val('');
    }
   

}