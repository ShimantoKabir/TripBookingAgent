$(document).ready(function () {

    $.ajax({
        url: "LocalDataJson/sideNavMenu.json",
        type: "GET",
        dataType: "json",
        cache: false,
        success: function(response){

            for (var i = 0; i < response.sideNavMenu.length; i++) {

                $(".side_nav_menu").append("" +
                    "<div id='side_nav_menu_div"+i+"' class='side_nav_menu_div' >\n" +
                    "    <div class='side_nav_menu_head' >\n" +
                    "        <div class='side_nav_menu_head_name_icon' >\n" +
                    "            <i class='"+response.sideNavMenu[i].icon+"'></i>\n" +
                    "            <h6>"+response.sideNavMenu[i].menuName+"</h6>\n" +
                    "        </div>\n" +
                    "        <div class='side_nav_menu_head_rotate_icon' >\n" +
                    "            <i id='rotate"+i+"' class='fas fa-angle-down'></i>\n" +
                    "        </div>\n" +
                    "    </div>\n" +
                    "    <div id='side_nav_sub_menu_list"+i+"' class='side_nav_sub_menu_list' >");

                console.log(response.sideNavMenu[i].menuName);
                console.log("----Sub Menu----");

                for (var j = 0; j < response.sideNavMenu[i].subMenu.length; j++) {
                    console.log(response.sideNavMenu[i].subMenu[j].name);
                    $("#side_nav_sub_menu_list"+i).append("<a href='"+response.sideNavMenu[i].subMenu[j].href+"' > <i class='fas fa-arrow-right'></i> "+response.sideNavMenu[i].subMenu[j].name+"</a>");
                }

                $(".side_nav_menu").append("" +
                    "    </div>\n" +
                    "</div>");
            }

            // show and hide side menu ....
            $(".side_nav_sub_menu_list").hide();

            $(".side_nav_menu_div").click(function () {

                var selected_side_nav_menu_div_id = this.id;

                var lastChar = selected_side_nav_menu_div_id.charAt(selected_side_nav_menu_div_id.length - 1);

                // hide and show sub menu list ....
                $("#side_nav_sub_menu_list"+lastChar+"").toggle("slow");

                // rotate the icon ....
                $("#rotate"+lastChar+"").toggleClass("down");

                hideUnActiveSubMenuList(lastChar);

            });

            function hideUnActiveSubMenuList(lastChar) {
                for (var i = 0; i < response.sideNavMenu.length; i++) {
                    if (i != lastChar){
                        $("#side_nav_sub_menu_list"+i+"").hide("slow");
                    }
                }
            }

        },
        error:function (response) {
            alert("ERROR -> " + response);
        }
    });

    // hide and show side nav
    var sideNavHideShowController = 0;
    $(".side_nav_close_btn").click(function () {

        sideNavHideShowController++;
        $(".main_container").css("width","100%");
        $(".main_container").css("margin-left","0%");
        $(".side_nav").css("width","0%");

        if (sideNavHideShowController>1){
            sideNavHideShowController=0;
            $(".main_container").css("width","80%");
            $(".main_container").css("margin-left","20%");
            $(".side_nav").css("width","20%");
        }

    });

    // when click main logo go to index.html
    $(".side_nav_head").click(function () {
        window.location.href = "index.html";
    });

    // open chat box ...
    $(".open_chat_box").click(function(){
        $(".my_modal").show('slow');
    });

    $("#close_chat_box").click(function(){
        $(".my_modal").hide('slow');
    });

    // dialog flow agent credential ...
    var accessToken = "ea0a9892e11a4509bd5280967a9ae33e";
    var baseUrl = "https://api.api.ai/v1/";

    // initially hide loader ...
    $(".loading").hide();
    // initially hide quick replay ...
    $(".quick_replay").hide();
    // initially hide card view ...
    $(".my_card_area").hide();
    // initially hide package details info by id
    $("#tripPackageInfoById").hide();
    // initial request json
    let requestJson = {};

    // input text hit enter listener ...
    $("#user_replay").keypress(function(event) {
        if (event.which == 13) {
            $(".quick_replay").hide();
            $(".loading").show();
            var userReplay = $("#user_replay").val();
            $("#user_replay").val("");
            $(".modal_body").append("<div class='user' ><p class='bot_res' >"+userReplay+"</p><i class='far fa-user'></i></div>");

            $(".modal_body").scrollTop($(".modal_body").height()+1000);

            var sId = "something";

            if (sessionStorage.getItem("packageId")){
                sId = sessionStorage.getItem("packageId");
            }

            let requestJson =   {
                "lang": "en",
                "query": userReplay,
                "sessionId": sId,
                "timezone": "America/New_York",
            };

            sendRequestToServer(requestJson);
        }
    });

    $(".bookPackage").click(function () {

        $(".my_modal").show();

        var pId = this.id;

        var userReplay = 'bookTripPackageById';

        sessionStorage.setItem("packageId", pId);

        var sessionId = "something";

        if (sessionStorage.getItem("packageId")){
            sessionId = sessionStorage.getItem("packageId");
        }

        let requestJson =   {
            "lang": "en",
            "query": userReplay,
            "sessionId": sessionId,
            "timezone": "America/New_York",
        };
        sendRequestToServer(requestJson);

    });

    $("#user_replay_icon").click(function () {
        $(".quick_replay").hide();
        $(".loading").show();
        var userReplay = $("#user_replay").val();

        $(".modal_body").append("<div class='user' ><p class='bot_res' >"+userReplay+"</p><i class='fab fa-user'></i></div>");
        $(".modal_body").scrollTop($(".modal_body").height()+1000);

        var sessionId = "something";

        if (sessionStorage.getItem("packageId")){
            sessionId = sessionStorage.getItem("packageId");
        }

        let requestJson =   {
            "lang": "en",
            "query": userReplay,
            "sessionId": sessionId,
            "timezone": "America/New_York",
        };

        sendRequestToServer(requestJson);
    });

    function sendRequestToServer(requestJson) {

        console.log("Hit = " + requestJson);

        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20150910",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify(requestJson),
            success: function(response) {
                $(".loading").hide();
                console.log(response)
                showResponseInChatBox(response);
            },
            error: function(error) {
               console.log("ERROR -> " + error);
            }
        });

    }

    function openQuickReplay(hotelType) {

        $(".quick_replay").html("");

        for (var i = 0; i < hotelType.length; i++) {
            $(".quick_replay").append("<button class='qr_button'>"+hotelType[i]+"</button>");
        }

        $(".quick_replay").show();
        $(".qr_button").click(function () {
            console.log($(this).text());
            var quickReplayValue = $(this).text();
            $(".modal_body").append("<div class='user' ><p class='bot_res' >"+quickReplayValue+"</p><i class='far fa-user'></i></div>");

            var sessionId = "something";

            if (sessionStorage.getItem("packageId")){
                sessionId = sessionStorage.getItem("packageId");
            }

            let requestJson =   {
                "lang": "en",
                "query": quickReplayValue,
                "sessionId": sessionId,
                "timezone": "America/New_York",
            };

            sendRequestToServer(requestJson);
            $(".quick_replay").hide();
        })

    }

    function showResponseInChatBox(response) {

        if (response.result.fulfillment.speech === "Let me know your hotel type") {

            var hotelType = ["Vip", "Standard", "Economy"];
            openQuickReplay(hotelType);

        }

        if (response.result.fulfillment.speech === "Please Choose your food") {

            var foodType = ["Low Price", "Medium Price", "High Price"];
            openQuickReplay(foodType);

        }

        if (response.result.fulfillment.speech === "Which transport you like to choose for you trip") {

            var hotelType = ["Bus", "Train", "Air"];
            openQuickReplay(hotelType);

        }

        if (response.result.fulfillment.messages) {
            var msg = response.result.fulfillment.messages;

            if (msg[0].type == 1){

                $(".my_card_area").show();
                $(".my_card_area").html("");

                for (var i = 0; i < msg.length; i++) {
                    $(".my_card_area").append("<div class='my_card' >\n" +
                    "    <div class='my_card_header' style='background-image: url("+msg[i].imageUrl+");' >\n" +
                    "        <div class='my_card_head_bottom' >\n" +
                    "            <h6 class='my_card_title' >"+msg[i].title+"</h6>\n" +
                    "        </div>\n" +
                    "    </div>\n" +
                    "    <div class='my_card_footer' >\n" +
                    "        <p class='my_card_description' >"+msg[i].subtitle+"</p>\n" +
                    "        <button id='"+msg[i].packageId+"' class='view_package_details' >View</button>\n" +
                    "    </div>\n" +
                    "</div>");
                }

                $(".view_package_details").click(function () {


                    $("#tripPackageInfoById").show();
                    var packageId = this.id;

                    window.location.href = "showPackageInfoById.html";

                    localStorage.setItem("packageIdForShowDetails",packageId);

                    readPackageInfoById(packageId);

                });

            }
        }else {
            console.log('INFO : No fulfilment Massages !');
        }

        var userReplay = JSON.stringify(response.result.fulfillment.speech);
        $(".modal_body").append("<div class='bot' ><i class='fab fa-drupal'></i><p class='bot_res' >"+userReplay+"</p></div>");
        $(".modal_body").scrollTop($(".modal_body").height()+500);

    }


    function readPackageInfoById(packageId) {

        db.ref('tripPackageInfos/'+packageId).once('value')
        .then(function (data) {

            var val = data.val();
            console.log(val.placeName);

            $("#packageId").attr('id',val.packAgeId);
            $("#placeName").text(val.placeName);
            $("#noOfChildren").text(val.noOfChildren);
            $("#noOfAdults").text(val.noOfAdults);
            $("#vipHotelCst").text(val.vipHotelCst);
            $("#ecoHotelCst").text(val.ecoHotelCst);
            $("#stdHotelCst").text(val.stdHotelCst);
            $("#vipFoodCst").text(val.vipFoodCst);
            $("#ecoFoodCst").text(val.ecoFoodCst);
            $("#stdFoodCst").text(val.stdFoodCst);
            $("#busTptCst").text(val.busTptCst);
            $("#trainTptCst").text(val.trainTptCst);
            $("#airTptCst").text(val.airTptCst);
            $("#noOfDays").text(val.noOfDays);
            $("#noOfNights").text(val.noOfNights);
            $("#busPickPLace").text(val.busPickPLace);
            $("#trainPickPlace").text(val.trainPickPlace);
            $("#airPickPlace").text(val.airPickPlace);
            $("#description").text(val.description);
            $('#imgUri').attr('src',val.imgUri);

        })
        .catch(function (error) {
            alert("error");
            console.log("ERROR : " + error);
        })
    }



});


