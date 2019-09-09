import { Component, h, State} from '@stencil/core'
// import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
// import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation'

@Component({
    tag: 'app-start'
  })
export class AppStart{
    @State() currentLocation: String;
    @State() destination: String;

    onCurrentLocationChange = (e) => {
        this.currentLocation = e.detail.srcElement.value
    }
    onDestinationChange = (e) => {
        this.destination = e.detail.srcElement.value
    }
    componentDidLoad(){
        window.addEventListener('deviceorientation', function(event) {
                var alpha    = event.alpha; //z axis rotation [0,360)
                var beta     = event.beta; //x axis rotation [-180, 180]
                var gamma    = event.gamma; //y axis rotation [-90, 90]      //Check if absolute values have been sent
                if (typeof event.webkitCompassHeading !== "undefined") {
                  alpha = event.webkitCompassHeading; //iOS non-standard
                  var heading = alpha
                  document.getElementById("heading").innerHTML = heading.toFixed([0]);
                }
                else {
                  alert("Your device is reporting relative alpha values, so this compass won't point north :(");
                  var heading = 360 - alpha; //heading [0, 360)
                  document.getElementById("heading").innerHTML = heading.toFixed([0]);
                }
        });
    }
    render(){
        
        
        
        // if (window.DeviceOrientationEvent) {
        //     //alert("Inside")
        //     // Listen for the deviceorientation event and handle the raw data
        //     window.addEventListener('deviceorientation', function(eventData) {
        //       var compassdir;
          
        //       if(event.webkitCompassHeading) {
        //         // Apple works only with this, alpha doesn't work
        //         compassdir = event.webkitCompassHeading;  
        //       }
        //       else compassdir = event.alpha;
        //       alert(compassdir)
        //     });
            
        //   }
        return (
            <div>
                <ion-header>
                    <ion-toolbar color="primary">
                    <ion-title>Location Info</ion-title>
                    </ion-toolbar>
                </ion-header>
                    <div style={{'paddingTop': '40px'}}></div>
                    <p id="heading">Test</p>
                    <ion-item>
                        <ion-label position="stacked">Current Building</ion-label>
                        <ion-input onIonInput={this.onCurrentLocationChange}></ion-input>
                    </ion-item>
                    {/* <ion-list>
                        <ion-item>{this.currentLocation}</ion-item>
                        <ion-item>{this.currentLocation}1</ion-item>
                    </ion-list> */}
                    <div style={{'paddingTop': '40px'}}></div>
                    <ion-item>
                        <ion-label position="stacked">Destination</ion-label>
                        <ion-input onIonInput={this.onDestinationChange}></ion-input>
                    </ion-item>
                    <div style={{'paddingTop': '40px'}}></div>
                    <ion-button expand="block" href={`/route/${this.currentLocation}/${this.destination}`}>Go</ion-button>
            </div>
        )
    }
}