/*****************************************************************************
 * FILE:    Add Watershed
 * DATE:    2/26/2015
 * AUTHOR:  Alan Snow
 * COPYRIGHT: (c) 2015 Brigham Young University
 * LICENSE: BSD 2-Clause
 *****************************************************************************/

/*****************************************************************************
 *                      LIBRARY WRAPPER
 *****************************************************************************/

var ERFP_ADD_WATERSHED = (function() {
    // Wrap the library in a package function
    "use strict"; // And enable strict mode for this library
    
    /************************************************************************
    *                      MODULE LEVEL / GLOBAL VARIABLES
    *************************************************************************/
    var m_uploading_data;

     /************************************************************************
    *                    PRIVATE FUNCTION DECLARATIONS
    *************************************************************************/
    var checkErrors, finishReset;


    /************************************************************************
    *                    PRIVATE FUNCTION IMPLEMENTATIONS
    *************************************************************************/
    //FUNCTION: Check output from array of xhr
    checkErrors = function(output_array) {
        output_array.forEach(function(output){
            if(output != null && typeof output != 'undefined') {
                if ("error" in output) {
                    return {"error" : output["error"]};
                }
            }
        });
        return {"success" : "Watershed Upload Success!"};
    };

    //FUNCTION: RESET EVERYTHING WHEN DONE
    finishReset = function(result, watershed_id) {
        if ("success" in result) {
            //reset inputs
            $('#watershed-name-input').val('');
            $('#subbasin-name-input').val('');
            $('#data-store-select').select2('val','1');
            $('#adhydro-data-store-watershed-name-input').val('');
            $('#adhydro-data-store-subbasin-name-input').val('');
            $('#geoserver-select').select2('val','1');
            $('#drainage-line-kml-upload-input').val('');
            $('#catchment-kml-upload-input').val('');
            $('#gage-kml-upload-input').val('');
            $('#geoserver-drainage-line-input').val('');
            $('#geoserver-catchment-input').val('');
            $('#geoserver-gage-input').val('');
            $('#drainage-line-shp-upload-input').val('');
            $('#catchment-shp-upload-input').val('');
            $('#gage-shp-upload-input').val('');
            $('.data_store').addClass('hidden');
            $('.kml').removeClass('hidden');
            $('.shapefile').addClass('hidden');
            addSuccessMessage("Watershed Upload Complete!");
        } else {
            //delete watershed and show error
            var xhr = ajax_update_database("delete",{watershed_id: watershed_id});
            appendErrorMessage(result["error"], "error_reset");
        }
     };


    /************************************************************************
    *                  INITIALIZATION / CONSTRUCTOR
    *************************************************************************/
    
    $(function() {
        //initialize modlule variables
        m_uploading_data = false;

        //initialize gizmo help blockss
        var help_html = '<p class="help-block hidden">No watershed name specified.</p>';
        $('#watershed-name-input').parent().parent().append(help_html);
        help_html = '<p class="help-block hidden">No subbasin name specified.</p>';
        $('#subbasin-name-input').parent().parent().append(help_html);

        help_html = '<p class="help-block hidden">No data store selected.</p>';
        $('#data-store-select').parent().append(help_html);
        help_html = '<p class="help-block hidden">No ADHydro watershed name specified.</p>';
        $('#adhydro-data-store-watershed-name-input').parent().append(help_html);
        help_html = '<p class="help-block hidden">No ADHydro subbasin name specified.</p>';
        $('#adhydro-data-store-subbasin-name-input').parent().append(help_html);

        help_html = '<p class="help-block hidden">No Geoserver selected.</p>';
        $('#geoserver-select').parent().append(help_html);
        help_html = '<p class="help-block hidden">No Geoserver drainage line layer name specified.</p>';
        $('#geoserver-drainage-line-input').parent().parent().append(help_html);
    
        //initialize gizmo classes
        $('#adhydro-data-store-watershed-name-input').parent().parent().addClass('data_store');
        $('#adhydro-data-store-subbasin-name-input').parent().parent().addClass('data_store');
        $('.data_store').addClass('hidden');

        $('#geoserver-drainage-line-input').parent().parent().addClass('shapefile');
        $('#geoserver-catchment-input').parent().parent().addClass('shapefile');
        $('#geoserver-gage-input').parent().parent().addClass('shapefile');
        $('#shp-upload-toggle').parent().parent().parent().addClass('shapefile');
        $('.shapefile').addClass('hidden');
        
        //handle the submit event
        $('#submit-add-watershed').click(function(){
            //scroll back to top
            window.scrollTo(0,0);
            //clear messages
            $('#message').addClass('hidden');
            $('#message').empty()
                .addClass('hidden')
                .removeClass('alert-success')
                .removeClass('alert-info')
                .removeClass('alert-warning')
                .removeClass('alert-danger');

            //check data store input
            var safe_to_submit = {val: true, error: ""};
            var watershed_name = checkInputWithError($('#watershed-name-input'),safe_to_submit);
            var subbasin_name = checkInputWithError($('#subbasin-name-input'),safe_to_submit);
            var data_store_id = checkInputWithError($('#data-store-select'),safe_to_submit, true);
            var geoserver_id = checkInputWithError($('#geoserver-select'),safe_to_submit, true);
    
            //initialize values
            var adhydro_data_store_watershed_name = "";
            var adhydro_data_store_subbasin_name = "";
            var geoserver_drainage_line_layer = "";
            var geoserver_catchment_layer = "";
            var geoserver_gage_layer = "";
            var drainage_line_shp_files = [];
            var catchment_shp_files = [];
            var gage_shp_files = [];
            var drainage_line_kml_file = null;
            var catchment_kml_file = null;
            var gage_kml_file = null;
            var kml_drainage_line_layer = "";
            var kml_catchment_layer = "";
            var kml_gage_layer = "";

            //Initialize Data Store Data
            if(data_store_id>1) {
                //check ADHydro inputs
                var adhydro_ready = false;
                adhydro_data_store_watershed_name = $('#adhydro-data-store-watershed-name-input').val();
                adhydro_data_store_subbasin_name = $('#adhydro-data-store-subbasin-name-input').val();
                if (typeof adhydro_data_store_watershed_name == 'undefined' || 
                    typeof adhydro_data_store_subbasin_name == 'undefined') {
                    adhydro_data_store_watershed_name = "";
                    adhydro_data_store_subbasin_name = "";
                } else {
                    adhydro_data_store_watershed_name = adhydro_data_store_watershed_name.trim();
                    adhydro_data_store_subbasin_name = adhydro_data_store_subbasin_name.trim();
                    adhydro_ready = (adhydro_data_store_watershed_name.length > 0 && 
                                       adhydro_data_store_subbasin_name.length > 0);
                }
                //need at least one to be OK to proceed
                if(!adhydro_ready) {
                    safe_to_submit.val = false;
                    safe_to_submit.error = "Need ADHydro watershed and subbasin names to proceed";
             
                }
            }

            //Initialize Geoserver Data
            if(geoserver_id==1){
                //kml upload
                drainage_line_kml_file = $('#drainage-line-kml-upload-input')[0].files[0];
                if(!checkKMLfile(drainage_line_kml_file, safe_to_submit)) {
                    $('#drainage-line-kml-upload-input').parent().addClass('has-error');
                }
                catchment_kml_file = $('#catchment-kml-upload-input')[0].files[0];
                if(typeof catchment_kml_file != 'undefined') {
                    if(!checkKMLfile(catchment_kml_file, safe_to_submit)) {
                        $('#catchment-kml-upload-input').parent().addClass('has-error');
                    }
                } else {
                    catchment_kml_file = null;;
                }
                gage_kml_file = $('#gage-kml-upload-input')[0].files[0];
                if(typeof gage_kml_file != 'undefined') {
                    if(!checkKMLfile(gage_kml_file, safe_to_submit)) {
                        $('#gage-kml-upload-input').parent().addClass('has-error');
                    }
                } else {
                    gage_kml_file = null;;
                }               
            } else if (!$('#shp-upload-toggle').bootstrapSwitch('state')) {
                //geoserver update
                geoserver_drainage_line_layer = checkInputWithError($('#geoserver-drainage-line-input'),safe_to_submit);
                geoserver_catchment_layer = $('#geoserver-catchment-input').val(); //optional
                geoserver_gage_layer = $('#geoserver-gage-input').val(); //optional
            } else {
                //geoserver upload
                drainage_line_shp_files = $('#drainage-line-shp-upload-input')[0].files;
                if(!checkShapefile(drainage_line_shp_files, safe_to_submit)) {
                    $('#drainage-line-shp-upload-input').parent().addClass('has-error');
                } else {
                    $('#drainage-line-shp-upload-input').parent().removeClass('has-error');
                }
                catchment_shp_files = $('#catchment-shp-upload-input')[0].files;
                if (catchment_shp_files.length > 0) {
                    if(!checkShapefile(catchment_shp_files, safe_to_submit)) {
                        $('#catchment-shp-upload-input').parent().addClass('has-error');
                    } else {
                        $('#catchment-shp-upload-input').parent().removeClass('has-error');
                    }
                }
                gage_shp_files = $('#gage-shp-upload-input')[0].files;
                if (gage_shp_files.length > 0) {
                    if(!checkShapefile(gage_shp_files, safe_to_submit)) {
                        $('#gage-shp-upload-input').parent().addClass('has-error');
                    } else {
                        $('#gage-shp-upload-input').parent().removeClass('has-error');
                    }
                }
            }
            
            //submit if the form is ready
            if(safe_to_submit.val && !m_uploading_data) {
                var submit_button = $(this);
                var submit_button_html = submit_button.html();
                var xhr = null;
                var xhr_catchment = null;
                var xhr_gage = null;
                //give user information
                addInfoMessage("Submiting data. Please be patient! " +
                               "This may take a few minutes ...");
                submit_button.text('Submitting ...');
                //update database
                if(geoserver_id==1 || $('#shp-upload-toggle').bootstrapSwitch('state')){
                    //upload files
                    var data = new FormData();
                    data.append("watershed_name",watershed_name);
                    data.append("subbasin_name",subbasin_name);
                    data.append("data_store_id",data_store_id);
                    data.append("adhydro_data_store_watershed_name",adhydro_data_store_watershed_name);
                    data.append("adhydro_data_store_subbasin_name",adhydro_data_store_subbasin_name);
                    data.append("geoserver_id",geoserver_id);
                    data.append("geoserver_drainage_line_layer",geoserver_drainage_line_layer);
                    data.append("geoserver_catchment_layer",geoserver_catchment_layer);
                    data.append("geoserver_gage_layer",geoserver_gage_layer);
                    data.append("drainage_line_kml_file",drainage_line_kml_file);
                    for(var i = 0; i < drainage_line_shp_files.length; i++) {
                        data.append("drainage_line_shp_file",drainage_line_shp_files[i]);
                    }
                    
                    if (drainage_line_kml_file != null || geoserver_drainage_line_layer != null) {
                        appendInfoMessage("Uploading Drainage Line ...", "message_drainage_line");
                    }
                    xhr = ajax_update_database_multiple_files("submit",data, 
                            "Drainage Line Upload Success!", "message_drainage_line");
                    
                    //upload catchment when drainage line finishes if catchment exists
                    xhr.done(function(return_data){
                        if ('success' in return_data) {
                            if('watershed_id' in return_data) {
                                var watershed_id  = return_data['watershed_id'];
                                //upload catchment when  drainage line finishes if exists
                                if(catchment_kml_file != null || catchment_shp_files.length >= 4) {
                                    appendInfoMessage("Uploading Catchment ...", "message_catchment");
                                    var data = new FormData();
                                    data.append("watershed_id", watershed_id)
                                    data.append("watershed_name",watershed_name);
                                    data.append("subbasin_name",subbasin_name);
                                    data.append("data_store_id",data_store_id);
                                    data.append("adhydro_data_store_watershed_name",adhydro_data_store_watershed_name);
                                    data.append("adhydro_data_store_subbasin_name",adhydro_data_store_subbasin_name);
                                    data.append("geoserver_id",geoserver_id);
                                    if ('geoserver_drainage_line_layer' in return_data) {
                                        geoserver_drainage_line_layer = return_data['geoserver_drainage_line_layer'];
                                    }
                                    data.append("geoserver_drainage_line_layer", geoserver_drainage_line_layer);
                                    for(var i = 0; i < catchment_shp_files.length; i++) {
                                        data.append("catchment_shp_file",catchment_shp_files[i]);
                                    }
                                    if ('kml_drainage_line_layer' in return_data) {
                                        kml_drainage_line_layer = return_data['kml_drainage_line_layer'];
                                    }
                                    data.append("kml_drainage_line_layer", kml_drainage_line_layer);
                                    data.append("catchment_kml_file", catchment_kml_file);
                                    xhr_catchment = ajax_update_database_multiple_files("update",
                                                                                        data, 
                                                                                        "Catchment Upload Success!",
                                                                                        "message_catchment");
                                }
    
                                //upload gage when catchment and drainage line finishes if gage exists
                                jQuery.when(xhr_catchment).done(function(catchment_data){
                                    if(gage_kml_file != null || gage_shp_files.length >= 4) {
                                        appendInfoMessage("Uploading Gages ...", "message_gages");
                                        var data = new FormData();
                                        data.append("watershed_id", watershed_id)
                                        data.append("watershed_name",watershed_name);
                                        data.append("subbasin_name",subbasin_name);
                                        data.append("data_store_id",data_store_id);
                                        data.append("adhydro_data_store_watershed_name",adhydro_data_store_watershed_name);
                                        data.append("adhydro_data_store_subbasin_name",adhydro_data_store_subbasin_name);
                                        data.append("geoserver_id",geoserver_id);
                                        if ('geoserver_drainage_line_layer' in return_data) {
                                            geoserver_drainage_line_layer = return_data['geoserver_drainage_line_layer'];
                                        }
                                        data.append("geoserver_drainage_line_layer", geoserver_drainage_line_layer);

                                        if(catchment_data != null && typeof catchment_data != 'undefined') {
                                            if('geoserver_catchment_layer' in catchment_data) {
                                                data.append("geoserver_catchment_layer",
                                                            catchment_data['geoserver_catchment_layer']);
                                            }
                                            if('kml_catchment_layer' in catchment_data) {
                                                kml_catchment_layer = catchment_data['kml_catchment_layer'];
                                            }
                                        }
    
                                        data.append("gage_kml_file",gage_kml_file);
                                        for(var i = 0; i < gage_shp_files.length; i++) {
                                            data.append("gage_shp_file",gage_shp_files[i]);
                                        }
                                        if ('kml_drainage_line_layer' in return_data) {
                                            kml_drainage_line_layer = return_data['kml_drainage_line_layer'];
                                        }
                                        data.append("kml_drainage_line_layer", kml_drainage_line_layer);
                                        data.append("kml_catchment_layer", kml_catchment_layer);
                                        data.append("gage_kml_file", gage_kml_file);

                                        xhr_gage = ajax_update_database_multiple_files("update",data,
                                                                                       "Gages Upload Success!",
                                                                                        "message_gages");
                                    }
                                    //upload gage when catchment and drainage line finishes if gage exists
                                    jQuery.when(xhr_gage).done(function(){
                                        //when everything is finished
                                        jQuery.when(xhr, xhr_catchment, xhr_gage)
                                              .done(function(xhr_data, xhr_catchment_data, xhr_gage_data){
                                                    //Reset The Output
                                                    finishReset(checkErrors([xhr_data, xhr_catchment_data, xhr_gage_data]),
                                                                 watershed_id);
                                        });
                                    });
                                });
                            }
                        } else {
                            appendErrorMessage(return_data['error'], "error_submit");
                        }
                    });
                } else {
                    var data = {
                            watershed_name: watershed_name,
                            subbasin_name: subbasin_name,
                            data_store_id: data_store_id,
                            adhydro_data_store_watershed_name: adhydro_data_store_watershed_name,
                            adhydro_data_store_subbasin_name: adhydro_data_store_subbasin_name,
                            geoserver_id: geoserver_id,
                            geoserver_drainage_line_layer: geoserver_drainage_line_layer,
                            geoserver_catchment_layer: geoserver_catchment_layer,
                            geoserver_gage_layer: geoserver_gage_layer,
                            };
            
                    var xhr = ajax_update_database("submit",data);

                    //when everything finishes uploading
                    xhr.done(function(return_data){
                        if ('success' in return_data) {
                            var watershed_id = return_data['watershed_id'];
                            finishReset(return_data);
                        } else {
                            appendErrorMessage(return_data['error'], "error_submit");
                        }
                    })
                }
                m_uploading_data = true;

                jQuery.when(xhr, xhr_catchment, xhr_gage).always(function(){
                    submit_button.html(submit_button_html);
                    m_uploading_data = false;
                });

            } else if (m_uploading_data) {
                //give user information
                addWarningMessage("Submitting Data. Please Wait.");
            } else {
                appendErrorMessage("Not submitted. Please fix form errors to proceed.", "error_form");
                appendErrorMessage(safe_to_submit.error, "error_form_info");
            }
        });
        
        //show/hide elements based on data store selection
        $('#data-store-select').change(function() {
            var select_val = $(this).val();
            if(select_val == 1) {
                //local upload
                $('.data_store').addClass('hidden');
            } else {
                //files on data store
                $('.data_store').removeClass('hidden');
            }        
        });

        //show/hide elements based on geoserver selection
        $('#geoserver-select').change(function() {
            var select_val = $(this).val();
            if(select_val == 1) {
                //local upload
                $('#geoserver-drainage-line-input').val('');
                $('#geoserver-catchment-input').val('');
                $('#drainage-line-shp-upload-input').val('');
                $('#catchment-shp-upload-input').val('');
                $('#gage-shp-upload-input').val('');
                $('.kml').removeClass('hidden');
                $('.shapefile').addClass('hidden');
            } else {
                //file located on geoserver
                $('.kml').addClass('hidden');
                $('.shapefile').removeClass('hidden');
                $('#drainage-line-kml-upload-input').val('');
                $('#catchment-kml-upload-input').val('');
                $('#gage-kml-upload-input').val('');
                $('#shp-upload-toggle').bootstrapSwitch('state',true);
                $('.upload').removeClass('hidden');
                $('#geoserver-drainage-line-input').parent().parent().addClass('hidden');
                $('#geoserver-catchment-input').parent().parent().addClass('hidden');
                $('#geoserver-gage-input').parent().parent().addClass('hidden');
            }
        
        });
    
        //show hide elements based on shape upload toggle selection
        $('#shp-upload-toggle').on('switchChange.bootstrapSwitch', function(event, state) {
            if(state) {
                //show file upload
                $('.upload').removeClass('hidden');
                $('#geoserver-drainage-line-input').parent().parent().addClass('hidden');
                $('#geoserver-catchment-input').parent().parent().addClass('hidden');
                $('#geoserver-gage-input').parent().parent().addClass('hidden');
            } else {
                $('.upload').addClass('hidden');
                $('#drainage-line-shp-upload-input').val('');
                $('#catchment-shp-upload-input').val('');
                $('#gage-shp-upload-input').val('');
                $('#geoserver-drainage-line-input').parent().parent().removeClass('hidden');
                $('#geoserver-catchment-input').parent().parent().removeClass('hidden');
                $('#geoserver-gage-input').parent().parent().removeClass('hidden');
            }
            
        });
    }); //page load
}()); // End of package wrapper 