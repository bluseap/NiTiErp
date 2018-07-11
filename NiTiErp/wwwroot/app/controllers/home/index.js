﻿var HomeController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    this.initialize = function () {
        //initDateRangePicker();
        loadData();
       
    }

    function loadData(from, to) {
        var khuvuc = userCorporationId;

        $.ajax({
            type: "GET",
            url: "/Admin/Home/TKSLNhanVien",
            data: {
                corporationId: khuvuc,
                phongId: "",
                chucvuId: "",
                trinhdoId: ""
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
              //  initChart(response);

                $(document).ready(function () {
                    Morris.Bar({
                        element: 'graph_bar2',
                        data: 
                            response,
                        xkey: 'TenPhong',
                        ykeys: ['SoNguoi'],
                        labels: ['Nhân viên: '],
                        barRatio: 0.4,
                        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        xLabelAngle: 35,
                        hideHover: 'auto',
                        resize: true
                    });
                   
                });

            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }
    function initChart(data) {
        var arrRevenue = [];
        var arrProfit = [];

        $.each(data, function (i, item) {
            arrRevenue.push([new Date(item.Date).getTime(), item.Revenue]);
        });
        $.each(data, function (i, item) {
            arrProfit.push([new Date(item.Date).getTime(), item.Profit]);
        });

        var chart_plot_02_settings = {
            grid: {
                show: true,
                aboveData: true,
                color: "#3f3f3f",
                labelMargin: 10,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: true,
                mouseActiveRadius: 100
            },
            series: {
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                },
                points: {
                    show: true,
                    radius: 4.5,
                    symbol: "circle",
                    lineWidth: 3.0
                }
            },
            legend: {
                position: "ne",
                margin: [0, -25],
                noColumns: 0,
                labelBoxBorderColor: null,
                labelFormatter: function (label, series) {
                    return label + '&nbsp;&nbsp;';
                },
                width: 40,
                height: 1
            },
            colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s: %y.0",
                xDateFormat: "%d/%m",
                shifts: {
                    x: -30,
                    y: -50
                },
                defaultTheme: false
            },
            yaxis: {
                min: 0
            },
            xaxis: {
                mode: "time",
                minTickSize: [1, "day"],
                timeformat: "%d/%m/%y",
                //min: arrRevenue[0][0],
                //max: arrRevenue[20][0]
            }
        };
        if ($("#chart_plot_02").length) {
            console.log('Plot2');

            $.plot($("#chart_plot_02"),
                [{
                    label: "Revenue",
                    data: arrRevenue,
                    lines: {
                        fillColor: "rgba(150, 202, 89, 0.12)"
                    },
                    points: {
                        fillColor: "#fff"
                    }
                },
                {
                    label: "Profit",
                    data: arrProfit,
                    lines: {
                        fillColor: "rgba(140, 232, 289, 0.12)"
                    },
                    points: {
                        fillColor: "#fff"
                    }
                }], chart_plot_02_settings);

        }
    }
    function initDateRangePicker() {

        if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
        console.log('init_daterangepicker');

        var cb = function (start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        };

        var optionSet1 = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: moment().format('MM/DD/YYYY'),
            dateLimit: {
                days: 60
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Clear',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        };

        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#reportrange').daterangepicker(optionSet1, cb);
        $('#reportrange').on('show.daterangepicker', function () {
            console.log("show event fired");
        });
        $('#reportrange').on('hide.daterangepicker', function () {
            console.log("hide event fired");
        });
        $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
            console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
            loadData(picker.startDate.format("MM/DD/YYYY"), picker.endDate.format('MM/DD/YYYY'));


        });
        $('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
            console.log("cancel event fired");
        });
        $('#options1').click(function () {
            $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
        });
        $('#options2').click(function () {
            $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
        });
        $('#destroy').click(function () {
            $('#reportrange').data('daterangepicker').remove();
        });
    }

    function loadChartPhongTo() {
        var date = new Date();        
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        var datachart = loadData(tungayId, tungayId);

        //$(document).ready(function () {
        //    Morris.Bar({
        //        element: 'graph_bar2',
        //        data: //[
        //            //{ device: 'iPhone 4', geekbench: 380 },
        //            //{ device: 'iPhone 4S', geekbench: 655 },
        //            //{ device: 'iPhone 3GS', geekbench: 275 },
        //            //{ device: 'iPhone 5', geekbench: 1571 },
        //            //{ device: 'iPhone 5S', geekbench: 655 },
        //            //{ device: 'iPhone 6', geekbench: 2154 },
        //            //{ device: 'iPhone 6 Plus', geekbench: 1144 },
        //            //{ device: 'iPhone 6S', geekbench: 2371 },
        //            //{ device: 'iPhone 6S Plus', geekbench: 1471 },
        //            //{ device: 'Other', geekbench: 1371 }
        //            //]
        //            datachart,
        //        xkey: 'device',
        //        ykeys: ['geekbench'],
        //        labels: ['Geekbench'],
        //        barRatio: 0.4,
        //        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        //        xLabelAngle: 35,
        //        hideHover: 'auto',
        //        resize: true
        //    });
            
        //    //$MENU_TOGGLE.on('click', function () {
        //    //    $(window).resize();
        //    //});
        //});
    }

}