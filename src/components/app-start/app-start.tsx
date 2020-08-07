import { Component, h, State} from '@stencil/core'
import Fuse from 'fuse.js';
// TODO:
// Finish autocomplete layout
// Finish extra info where connected
// 	EX. Connected physically through the second floor and throught the tunnels
// 	EX. Only connected through the tunnels
// Add option to select whether you are currently in the tunnels
// 	Requires a way to know if building has tunnels

@Component({
    tag: 'app-start'
  })
export class AppStart{
    @State() currentLocation: String = "";
    @State() destination: String = "";
    @State() currShow: Boolean = true;
    @State() destShow: Boolean = true;
    @State() status: Boolean = false;
    @State() granted = false;

    private router: HTMLIonRouterElement = document.querySelector('ion-router')
    
    onCurrentLocationChange = (e) => {
        this.currentLocation = e.detail.srcElement.value
    }
    onDestinationChange = (e) => {
        this.destination = e.detail.srcElement.value
    }
    presentToken = async (message) => {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 1000;
      
        document.body.appendChild(toast);
        return toast.present();
    }
    getResults(query){
        var buildingNames = [{"number":"1","name":"Pierce Laboratory"},{"number":"2","name":"The Simmons Building"},{"number":"3","name":"Maclaurin Buildings (3)"},{"number":"4","name":"Maclaurin Buildings (4)"},{"number":"5","name":"Pratt School"},{"number":"6","name":"Eastman Laboratories"},{"number":"7","name":"Rogers Building"},{"number":"8","name":""},{"number":"9","name":"Samuel Tak Lee Building"},{"number":"10","name":"Maclaurin Buildings (10)"},{"number":"11","name":"Homberg Building"},{"number":"13","name":"Bush Building"},{"number":"14","name":"Hayden Memorial Library"},{"number":"16","name":"Dorrance Building"},{"number":"17","name":"Wright Brothers Wind Tunnel"},{"number":"18","name":"Dreyfus Building"},{"number":"24","name":""},{"number":"26","name":"Compton Laboratories"},{"number":"31","name":"Sloan Laboratories"},{"number":"32","name":"Ray and Maria Stata Cener"},{"number":"33","name":"Guggenheim Laboratory"},{"number":"34","name":"EG&G Educational Center"},{"number":"35","name":"Sloan Laboratory"},{"number":"36","name":"Fairchild Building (36)"},{"number":"37","name":"McNair Building"},{"number":"38","name":"Fairchild Building (38)"},{"number":"39","name":"Brown Building"},{"number":"41","name":""},{"number":"42","name":"Power Plant"},{"number":"43","name":"Power Plant Annex"},{"number":"44","name":"Cyclotron"},{"number":"46","name":"Brain and Congnitive Sciences"},{"number":"48","name":"Parsons Laboratory"},{"number":"50","name":"Walker Memorial"},{"number":"51","name":"Wood Sailing Pavilion"},{"number":"54","name":"Green Building"},{"number":"56","name":"Whitaker Building"},{"number":"57","name":"Wang Fitness Center and Alumni Pool"},{"number":"62","name":"East Campus"},{"number":"64","name":"East Campus"},{"number":"66","name":"Landau Building"},{"number":"68","name":"Koch Biology Building"},{"number":"76","name":"Koch Institute"},{"number":"E17","name":"Mudd Building"},{"number":"E18","name":"Ford Building (E18)"},{"number":"E19","name":"Ford Building (E19)"},{"number":"E25","name":"Whitaker College"},{"number":"E23","name":"Health Services"}]
        var options = {
            shouldSort: true,
            includeMatches: true,
            threshold: 0.6,
            tokenize: true,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [{
                name: 'number',
                weight: 0.6
            },
            {
                name: 'name',
                weight: 0.4
            }]
          };
        var fuse = new Fuse(buildingNames, options)
        return fuse.search(query).slice(0, 5);
    }
    iOSVersion = () => {
        var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
            version;
      
        if (match !== undefined && match !== null) {
          version = [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            0
          ];
          return parseFloat(version.join('.'));
        }
      
        return false;
    }
    enableMotion = () => {
        //@ts-ignore
        DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response == 'granted') {
            this.presentToken("Compass activated...")
            this.granted = true;
          }
          else{ 
            this.presentToken("Error activating compass...");
            this.granted = false;
          }
        })
        .catch((error) => alert(error))
      }

      goToRoute = () => {
           this.enableMotion();
           this.router.push(`/route/${this.currentLocation.split(' ')[1]}/${this.destination.split(' ')[1]}${this.status ? '?status=true' : ''}`, 'forward');
        //   window.location.pathname = `/route/${this.currentLocation.split(' ')[1]}/${this.destination.split(' ')[1]}${this.status ? '?status=true' : ''}`;
      }
      
    render(){
        
        // var buildingNames = {'1': 'Pierce Laboratory', '2': 'The Simmons Building', '3': 'Maclaurin Buildings (3)', '4': 'Maclaurin Buildings (4)', '5': 'Pratt School', '6': 'Eastman Laboratories', '7': 'Rogers Building', '8': '', '9': 'Samuel Tak Lee Building', '10': 'Maclaurin Buildings (10)', '11': 'Homberg Building', '13': 'Bush Building', '14': 'Hayden Memorial Library', '16': 'Dorrance Building', '17': 'Wright Brothers Wind Tunnel', '18': 'Dreyfus Building', '24': '', '26': 'Compton Laboratories', '31': 'Sloan Laboratories', '32': 'Ray and Maria Stata Cener', '33': 'Guggenheim Laboratory', '34': 'EG&G Educational Center', '35': 'Sloan Laboratory', '36': 'Fairchild Building (36)', '37': 'McNair Building', '38': 'Fairchild Building (38)', '39': 'Brown Building', '41': '', '42': 'Power Plant', '43': 'Power Plant Annex', '44': 'Cyclotron', '46': 'Brain and Congnitive Sciences', '48': 'Parsons Laboratory', '50': 'Walker Memorial', '51': 'Wood Sailing Pavilion', '54': 'Green Building', '56': 'Whitaker Building', '57': 'Wang Fitness Center and Alumni Pool', '62': 'East Campus', '64': 'East Campus', '66': 'Landau Building', '68': 'Koch Biology Building', '76': 'Koch Institute', 'E17': 'Mudd Building', 'E18': 'Ford Building (E18)', 'E19': 'Ford Building (E19)', 'E25': 'Whitaker College', 'E23': 'Health Services'}
        var hasTunnels = {'1': true, '2': true, '3': true, '4': true, '5': true, '6': true, '7': true, '8': true, '9': true, '10': true, '11': false, '13': true, '14': true, '16': true, '17': false, '18': true, '24': false, '26': true, '31': false, '32': true, '33': false, '34': false, '35': false, '36': true, '37': false, '38': false, '39': false, '41': false, '42': false, '43': false, '44': false, '46': false, '48': false, '50': false, '51': false, '54': true, '56': true, '57': false, '62': false, '64': false, '66': true, '68': true, '76': false, 'E17': true, 'E18': true, 'E19': true, 'E25': true, 'E23': false}
        var currResults = this.getResults(this.currentLocation)
        var destResults = this.getResults(this.destination)
        console.log(currResults)
        return (
            <div>
                <ion-header>
                    <ion-toolbar color="primary">
                    <ion-title>MIT Navigator</ion-title>
                    </ion-toolbar>
                </ion-header>
                    <div style={{'paddingTop': '40px'}}></div>
                    <ion-item>
                        <ion-label position="stacked">Current Building</ion-label>
                        <ion-input onIonInput={this.onCurrentLocationChange} value={this.currentLocation.toString()} onIonFocus={() => this.currShow = true} placeholder="Enter building number or name"></ion-input>
                    </ion-item>
                    {
                        this.currentLocation != "" && this.currShow
                            ? (
                                <ion-card style={{'marginTop': '10px', 'padding': '10px'}}>
                                    <ion-list>
                                        {
                                            currResults.length > 0
                                                ? currResults.map((val) => {
                                                    return (<ion-item button onClick={() => {this.currentLocation = 'Building ' + val['item'].number; this.currShow=false}}>
                                                        <div style={{'paddingTop': '10px'}}>
                                                        {/* <p style={{}}>{buildingNames[val]}</p> */}
                                                        <ion-card-subtitle>{val['item'].name}</ion-card-subtitle>
                                                        <p style={{marginTop: '10px'}}>Building {val['item'].number}</p>
                                                        </div>
                                                    </ion-item>)
                                                })
                                                : <ion-item>Not Found</ion-item>
                                        }
                                    </ion-list>
                                </ion-card>
                            )
                            : null
                    }
                    {
                        !this.currShow && hasTunnels[this.currentLocation.split(' ')[1]]
                            ? <div>
                                <div style={{'paddingTop': '20px'}}></div>
                                <ion-item>
                                    <ion-label>Are you currently in the tunnels?</ion-label>
                                    <ion-toggle value={this.status.toString()} onIonChange={(event) => this.status = event.detail.checked}></ion-toggle>
                                </ion-item>
                            </div>
                            : null
                    }
                    
                    <div style={{'paddingTop': '30px'}}></div>
                    <ion-item>
                        <ion-label position="stacked">Destination</ion-label>
                        <ion-input onIonInput={this.onDestinationChange} value={this.destination.toString()} onIonFocus={() => this.destShow=true} placeholder="Enter building number or name"></ion-input>
                    </ion-item>
                    {
                        this.destination != "" && this.destShow
                            ? (
                                <ion-card style={{'marginTop': '10px', 'padding': '10px'}}>
                                    <ion-list>
                                        {
                                            destResults.length > 0
                                                ? destResults.map((val) => {
                                                    console.log(val)
                                                    return (<ion-item button onClick={() => {this.destination = 'Building ' + val['item'].number; this.destShow=false}}>
                                                        <div style={{'paddingTop': '10px'}}>
                                                        {/* <p style={{}}>{buildingNames[val]}</p> */}
                                                        <ion-card-subtitle>{val['item'].name}</ion-card-subtitle>
                                                        <p style={{marginTop: '10px'}}>Building {val['item'].number}</p>
                                                        </div>
                                                    </ion-item>)
                                                })
                                                : <ion-item>Not Found</ion-item>
                                        }
                                    </ion-list>
                                </ion-card>
                            )
                            : null
                    }
                    <div style={{'paddingTop': '40px'}}></div>
                    <ion-button expand="block" onClick={() => this.goToRoute()}>Go</ion-button>
            </div>
        )
    }
}