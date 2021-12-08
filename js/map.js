class Carte {
	constructor(idMap, lat, long, zoom) {

        this.idMap = idMap;
        this.lat = lat;
        this.long = long;
        this.zoom = zoom;
        this.initMap();
    }


    initMap() {
        this.map = L.map(this.idMap).setView([this.lat, this.long], this.zoom);
        this.mapStyle = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        });
        this.map.addLayer(this.mapStyle);
  
        this.getStations();
    }

    getStations() {

        $.get("https://api.jcdecaux.com/vls/v1/stations?contract=bruxelles&apiKey=ece67fcc6c594795d340005e50ae9d5e0e4e327e", (stations) => {

            stations.forEach((station) => { 
                this.setMarker(station);    
                this.clickPanel(station);   
            });
            this.map.addLayer(this.mapStyle); 
        });
    }

    setMarker(station) {

        let iconPath;
        
        if (station.status === "OPEN" && station.available_bikes > 0) {
            iconPath = 'images/map_pin.svg';
        }
        else {
            iconPath = 'images/map_pinred.svg';
        }

        this.markerStyle = L.icon({
            iconUrl: iconPath,
            iconSize: [25, 34] 
        });
        this.marker = L.marker([station.position.lat, station.position.lng], {
            icon: this.markerStyle
        });
        this.map.addLayer(this.marker); 
    }

    clickPanel(station) {

        $(this.marker).on("click", () => {
            $.get("https://api.jcdecaux.com/vls/v1/stations/" + station.number + "?contract=bruxelles&apiKey=ece67fcc6c594795d340005e50ae9d5e0e4e327e", (infoStation) => {
                this.selectedStation = infoStation;
                $("#map_formulaire").show(500);
                
                if (sessionStorage.getItem("count")) {
                    $("#map_formulaire_timer").show(500);
                    $("#map_formulaire_infos").show(500);
                    $("#map_formulaire_booking").hide(500);
                } else {
                    $("#map_formulaire_timer").hide(500);
                    $("#map_formulaire_infos").show(500);
                    $("#map_formulaire_booking").hide(500);

                }
                $("#name").text(infoStation.name);
                $("#address").text(infoStation.address);
                $("#status").text(infoStation.status);
                $("#stands").text(infoStation.available_bike_stands);
                this.colorStatus(infoStation);
                this.msgAlreadyBooked(infoStation);
                this.bikeStationStatus(infoStation);

            });
        });
    }


    bikeStationStatus(infoStation) {

        if ((infoStation.available_bikes === 0) || (infoStation.available_bike_stands === "CLOSED")) {
            
            $("#booking_btn").hide();
        }
        if ((sessionStorage.getItem("station") === infoStation.name) && sessionStorage.getItem("bikesLeft") !== null) {

            let bikesLeft = sessionStorage.getItem("bikesLeft");
            $("#free_bikes").text(bikesLeft);

        } else {
            $("#free_bikes").text(infoStation.available_bikes);
        }
    }

    colorStatus(infoStation) {
        if (infoStation.status === "OPEN") {
            $("#status").css("color", "#252b2b");
            $("#status").text("OUVERTE");
        } else {
            $("#status").css("color", "#8b1717");
            $("#status").text("FERMÉ");
        }
    }


    msgAlreadyBooked(infoStation) {
        if ((infoStation.name) === (sessionStorage.getItem("station"))) {
            $("#bookedMsg").show();
            $("#booking_btn").hide();
        } else {
            $("#bookedMsg").hide();
            $("#booking_btn").show();
        }
    }



};

const mapBruxelles = new Carte("map",50.850,4.35,13);

