var $ = require('jquery');
require('bootstrap');
require('tether');
require('bootstrap-datepicker');

jQuery(function(){

    $("#search_form_dob").datepicker({
        format: "yyyy-mm-dd"

    });

});

