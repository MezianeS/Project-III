
class Booking {
    constructor(idForm, LeafletObj, CanvasObj) {

        this.LeafletObj = LeafletObj;
        this.CanvasObj = CanvasObj;

        $(`#${idForm}`).on("submit", this.booking.bind(this));
        $("#go").on("click", ()=> {
            $('html, body').animate({
                scrollTop: $("#map").offset().top
            }, 1000);
        });
        
        $("#step_timer").hide();
        this.panelBooking();
        this.timer();
        this.fillSession();

    }
 


    fillSession() {
        if ((localStorage.getItem("surname")) && (localStorage.getItem("firstname"))) {
            this.localSurname = localStorage.getItem("surname");
            this.localFirstname = localStorage.getItem("firstname");
            $("#surname").val(this.localSurname);
            $("#firstname").val(this.localFirstname);

        }
        if (sessionStorage.getItem("station") && sessionStorage.getItem("count")) {
            $("#step_timer").show();
            $("#booked_name").text(`${localStorage.getItem("surname")} ${localStorage.getItem("firstname")}`);
            $("#booked_station").text(sessionStorage.getItem("station"));
        }
    }

    checkInput(elt) { 
        this.regex = /^[a-zA-Z]+$/;
        this.value = $(elt).val();
        if ((this.value.length === 0) || (this.regex.test($(elt).val()) === false)) {
            return false;
        } else {
            return true;
        }
    }


    checkCanvas() { 
        if (this.CanvasObj.isEmpty === true) {
            return false;
        } else {
            return true;
        }
    }

    booking(e) {
        e.preventDefault();        
        if ((this.checkCanvas($("#canvas"))) && (this.checkInput($("#firstname"))) && (this.checkInput($("#surname")))) {

            localStorage.setItem("surname", $("#surname").val());
            localStorage.setItem("firstname", $("#firstname").val());
            sessionStorage.setItem("station", this.LeafletObj.selectedStation.name);
            sessionStorage.setItem("bikesLeft", this.LeafletObj.selectedStation.available_bikes - 1); 
            sessionStorage.setItem("count", Date.now()); 

            this.panelTimer();
            this.timer();
        } else {
            $("#inputMsg").text("Veuillez remplir les champs et signer");
        }
    }

    timer() {
        const minutes = 20;
        const minInMs = minutes * 60 * 1000;

        let chrono = setInterval(() => {
            let time = Date.now() - Number(sessionStorage.getItem("count"));
            let timeRemain = minInMs - time;

            let minutesRemain = Math.floor(timeRemain / 1000 / 60)
            let secondsRemain = Math.floor(timeRemain / 1000 % 60);

            if (String(secondsRemain).length === 1) {
                secondsRemain = "0" + secondsRemain;
            }
            if (time < minInMs) {
                $("#countdown").text(minutesRemain + "min " + secondsRemain + "s");
            } else {
                clearInterval(chrono);
                sessionStorage.clear();
                $("#step_timer").hide();
            }
        }, 1000);
    }

    panelBooking() {
        $("#booking_btn").on("click", () => {
            $("#step_booking").show();
            $("#step_infos").hide();
        });
    }

    panelTimer() {
        $("#step_booking").hide();
        $("#step_timer").show();
        $("#booked_name").text(`${localStorage.getItem("surname")} ${localStorage.getItem("firstname")}`);
        $("#booked_station").text(sessionStorage.getItem("station"));

    }
}


const newBooking = new Booking("booking_form", mapBruxelles, newCanvas);