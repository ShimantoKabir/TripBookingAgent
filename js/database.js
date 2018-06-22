// Initialize Firebase .....
var config = {
    apiKey: "AIzaSyAZDTY293DjjaVOYnhD_M4zF_25HBZ7aJw",
    authDomain: "trip-booking-agent.firebaseapp.com",
    databaseURL: "https://trip-booking-agent.firebaseio.com",
    projectId: "trip-booking-agent",
    storageBucket: "trip-booking-agent.appspot.com",
    messagingSenderId: "220835022418"
};

firebase.initializeApp(config);
var db = firebase.database();

$(document).ready(function () {

    $("#save_package_info_loader").hide();

    $(".save_trip_package").click(function () {

        $("#save_package_info_loader").show();

        var date = new Date();
        var uniqueKey = date.getFullYear()+'_'+date.getMonth()+'_'+date.getDay()+'_'+date.getHours()+'_'+date.getMinutes()+'_'+date.getSeconds();

        var placeName = $('#placeName').val();
        var noOfChildren = $('#noOfChildren').val();
        var noOfAdults = $('#noOfAdults').val();
        var vipHotelCst = $('#vipHotelCst').val();
        var ecoHotelCst = $('#ecoHotelCst').val();
        var stdHotelCst = $('#stdHotelCst').val();
        var vipFoodCst = $('#vipFoodCst').val();
        var ecoFoodCst = $('#ecoFoodCst').val();
        var stdFoodCst = $('#stdFoodCst').val();
        var busTptCst = $('#busTptCst').val();
        var trainTptCst = $('#trainTptCst').val();
        var airTptCst = $('#airTptCst').val();
        var noOfDays = $('#noOfDays').val();
        var noOfNights = $('#noOfNights').val();
        var busPickPLace = $('#busPickPLace').val();
        var trainPickPlace = $('#trainPickPlace').val();
        var airPickPlace = $('#airPickPlace').val();
        var imgUri = $('#imgUri').val();
        var description = $('#description').val();

        var tripPackageInfo = {
            packAgeId : uniqueKey,
            placeName : placeName,
            noOfChildren : noOfChildren,
            noOfAdults : noOfAdults,
            vipHotelCst : vipHotelCst,
            ecoHotelCst : ecoHotelCst,
            stdHotelCst : stdHotelCst,
            vipFoodCst : vipFoodCst,
            ecoFoodCst : ecoFoodCst,
            stdFoodCst : stdFoodCst,
            busTptCst : busTptCst,
            trainTptCst : trainTptCst,
            airTptCst : airTptCst,
            noOfDays : noOfDays,
            noOfNights : noOfNights,
            busPickPLace : busPickPLace,
            trainPickPlace : trainPickPlace,
            airPickPlace : airPickPlace,
            imgUri : imgUri,
            description : description
        };

        db.ref('tripPackageInfos/'+uniqueKey).set(tripPackageInfo)
            .then(function (success) {

                $("#save_package_info_loader").hide();

                $("#placeName").val("");
                $("#noOfChildren").val("");
                $("#noOfAdults").val("");
                $("#vipHotelCst").val("");
                $("#ecoHotelCst").val("");
                $("#stdHotelCst").val("");
                $("#vipFoodCst").val("");
                $("#ecoFoodCst").val("");
                $("#stdFoodCst").val("");
                $("#busTptCst").val("");
                $("#trainTptCst").val("");
                $("#airTptCst").val("");
                $("#noOfDays").val("");
                $("#noOfNights").val("");
                $("#busPickPLace").val("");
                $("#trainPickPlace").val("");
                $("#airPickPlace").val("");
                $("#imgUri").val("");
                $("#description").val("");

            })
            .catch(function (error) {
                console.log("ERROR -> "+error);
            });

        console.log(JSON.stringify(tripPackageInfo));

    });

    db.ref('/tripBookerInfo/').once('value')
    .then(function (snapshot) {

        $("#addTripBooker").html("");

        snapshot.forEach(function (data) {
            console.log(data.val());
            var val = data.val();
            $("#addTripBooker").append("\n" +
                "<tr>\n" +
                "    <td>"+val.packageId+"</td>\n" +
                "    <td>"+val.hotelType+"</td>\n" +
                "    <td>"+val.foodType+"</td>\n" +
                "    <td>"+val.transportType+"</td>\n" +
                "    <td>"+val.contactNumber+"</td>\n" +
                "    <td>"+val.eamil+"</td>\n" +
                "    <td><i id='"+val.packageId+"' class='fas fa-external-link-alt view_details_by_package_id'></i></td>\n" +
                "</tr>");

            $(".view_details_by_package_id").click(function () {
                console.log(this.id);
                var packageId = this.id;
                $("#tripBookerList").hide();
                $("#tripPackageInfoById").show();
                readPackageInfoById(packageId);
            })

        })

        $("#showTripBookerLoader").hide();

    })
    .catch(function (error) {
        $("#showTripBookerLoader").hide();
        alert("error");
        console.log("ERROR : " + error);
    })

    function textShortener(ln, str) {

        if (str.length > ln) {
            str = str.substring(0, ln)+'...';
        }

        return str;
    }

    db.ref('/tripPackageInfos/').once('value')
    .then(function (snapshot) {
        $(".show_package_list").html("");
        snapshot.forEach(function (data) {
            console.log(data.val());
            var val = data.val();
            $(".show_package_list").append('' +
                '<div class="card" style="width:300px">\n' +
                '       <img class="card-img-top" src="'+val.imgUri+'" alt="Card image" style="width:100%">\n' +
                '    <div class="card-body">\n' +
                '        <h4 class="card-title">'+val.placeName+'</h4>\n' +
                '        <p class="card-text">'+textShortener(150,val.description)+'</p>\n' +
                '        <button id="'+val.packAgeId+'" class="btn btn-primary more_package_info">More</button>\n' +
                '    </div>\n' +
                '</div>');
        })
        $("#show_package_info_loader").hide();
        // package more click action ...
        $(".more_package_info").click(function () {
            console.log(this.id);
            var packageId = this.id;
            $(".show_package_list_area").hide();
            $("#tripPackageInfoById").show();
            readPackageInfoById(packageId);
        })
    })
    .catch(function (error) {
        alert("Error");
        console.log("ERROR : " + error);
    })

    function readPackageInfoById(packageId) {

        db.ref('tripPackageInfos/'+packageId).once('value')
        .then(function (data) {
            var val = data.val();
            console.log(val.placeName);

            $("#tripPackageInfoByIdLoader").hide();

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

    $("#backToPackageList").click(function () {
        $(".show_package_list_area").show();
        $("#tripPackageInfoById").hide();
    });

    $("#backToTripBookerList").click(function () {
        $("#tripBookerList").show();
        $("#tripPackageInfoById").hide();
    });


});





