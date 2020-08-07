import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

//   componentDidLoad(){
//     window.addEventListener('devicemotion', function(event) {
//               JSON.stringify(event.acceleration)
//     }.bind(this));
// }

@State() platform = ""
@State() version = -1
@State() granted = null

// enableMotion = () => {
//   window.DeviceMotionEvent.requestPermission()
//   .then(response => {
//     if (response == 'granted') {
//       this.granted = true
//       this.window.location.pathname = '/start'
//     } else {
//       this.granted = false
//     }
//   })
// }
getStarted = () => {
  window.location.pathname = '/start'
}
// iOSVersion = () => {
//   var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
//       version;

//   if (match !== undefined && match !== null) {
//     version = [
//       parseInt(match[1], 10),
//       parseInt(match[2], 10),
//       0
//     ];
//     return parseFloat(version.join('.'));
//   }

//   return false;
// }

  componentDidLoad(){
    // this.platform = "ios"
    // this.version = this.iOSVersion()
  }

  render() {
    return (
      <div>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Tunnel Navigation</ion-title>
            <ion-buttons slot="primary">
              <ion-button>
                <ion-icon name="settings"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        `<h1>First, lets setup the system...</h1>
          <div style={{'paddingTop': '100px'}}></div>
          {
            this.version < 13 
              ? <h1>Please go to Settings>Safari>Enable Motion and Orientation</h1>
              : <ion-button>Enable Motion and Orientation Access</ion-button>

          }
          <div style={{'paddingTop': '200px'}}></div>
          <ion-button onClick={this.getStarted}>Get Started</ion-button>
        {/* <ion-slides pager="true" options="slideOpts">
        <ion-slide>
          <h1>For when it gets cold</h1>
          <div style={{'paddingTop': '100px'}}></div>
        </ion-slide>
        <ion-slide>
          <h1>Never get cold again?</h1>
          <div style={{'paddingTop': '100px'}}></div>
        </ion-slide>
        <ion-slide>
          <div>
          <h1>First, lets setup the system...</h1>
          <div style={{'paddingTop': '100px'}}></div>
          {
            this.version < 13 
              ? <h1>Please go to Settings>Safari>Enable Motion and Orientation</h1>
              : <ion-button onClick={this.enableMotion}>Enable Motion and Orientation Access</ion-button>

          }
          <div style={{'paddingTop': '200px'}}></div>
          </div>
        </ion-slide>
      </ion-slides> */}
    </div>
    );
  }
}
