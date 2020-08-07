import { Component, h ,Prop, State } from "@stencil/core";
class Edge{
    weight: number;
    physical: Boolean;
    tunnel: Boolean;
    constructor(weight, physical, tunnel=false){
        this.weight = weight
        this.physical = physical
        this.tunnel = tunnel
    }
    isPhysical = () => {
        return this.physical
    }
    isTunnel = () => {
        return this.tunnel
    }
    connections = () => {
        var result = []
        if (this.isPhysical()) result.push('physical');
        if(this.isTunnel()) result.push('tunnel');
        return result
    }
}

class Graph{
    buildingNumbers: Object;
    reverseBuildingNumbers: Object;
    displayNumbers: Object;
    constructor(){
        this.buildingNumbers = {0: 1, 1: 2,2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7:8, 8:9, 9:10, 10: 12, 11: 13, 12: 14, 13: 16, 14: 17, 15: 18, 16: 24, 17:26, 18:31, 19:32, 20:33, 21:34, 22:35, 23:36, 24:37, 25:38, 26:39, 27: 54, 28:56, 29:57, 30:66, 31:68, 32: 69, 33: 70, 34:71, 35:72, 36:73}
        this.reverseBuildingNumbers = {}
        this.displayNumbers = {32: 'E17', 33: 'E18', 34: 'E19', 35: 'E25', 36: 'E23'}
        
        for(var i in this.buildingNumbers){
            this.reverseBuildingNumbers[this.buildingNumbers[i]] = i
        }
    }
    getBuildingNumber = (index: number) => {
        return this.buildingNumbers[index]
    }
    getIndex = (index: number) => {
        return this.reverseBuildingNumbers[index]
    }
    minDistance = (dist: number[], queue:number[]) => {
        var minimum = Infinity
        var min_index = -1

        for(var i = 0; i < dist.length; i++){
            if(dist[i] < minimum && queue.find((val) => val == i) !== undefined){
                minimum = dist[i]
                min_index = i
            }
        }
        return min_index
    }
    printPath = (parent, j, array=[]) => {
        if(parent[j] == -1){
            return array.push(this.buildingNumbers[j])
        }
        array.push(this.buildingNumbers[j])
        this.printPath(parent, parent[j], array)
        return array
    }

    printSolution = (src, dist, parent, dest) => {
        console.debug(src, dist)
        return this.printPath(parent, this.reverseBuildingNumbers[dest])
    }
    dijkstra = (graph, src0, dest) => {
        var src = this.reverseBuildingNumbers[src0]
        var row = graph.length
        var col = graph[0].length
        
        var dist: number[] = []
        for(var i = 0; i < row; i++){
            dist.push(Infinity)
        }
        var parent = []
        for(var i = 0; i < row; i++){
            parent.push(-1)
        }
        dist[src] = 0
        var queue = []
        for(var i = 0; i < row; i++){
            queue.push(i)
        }
        while(queue.length != 0){
            var u = this.minDistance(dist, queue)
            var index = queue.indexOf(u);
            if (index > -1) {
                queue.splice(index, 1);
            }
            for(var i = 0; i < col; i++){
                if(graph[u][i] != 0 && queue.find((val) => val == i) !== undefined){
                    if(dist[u] + 1 < dist[i])// if dist[u] + graph[u][i] < dist[i]:
                    dist[i] = dist[u] + 1   //graph[u][i]
                    parent[i] = u
                }
            }
        }
        return this.printSolution(src0, dist, parent, dest)
    }
}

@Component({
    tag: 'app-route',
    styleUrl: 'app-route.css'
})
export class AppRoute{
    @Prop() start: String;
    @Prop() destination: String;

    @State() heading = 0;
    @State() bottom = 95;
    @State() left = 30;
    @State() path = []

    lat1 = 42.3588531086851
    lon1 = -71.09295845031738
    feetPerPixel = 20
    done = false;
    // buildingCoords = {7: {p1: [42.3595, -71.0936], p2: [42.3597,-71.0932]}, p3: [42.3590, -71.0932], p4: [42.3591, -71.0929]}
    buildingCoords = {
      7: {
        location: [[42.359547, -71.093561], [42.359665,-71.093239], [42.359118, -71.092912], [42.359003, -71.093276]], 
        image: [[25,58], [37, 58],[37, 73],[45,73],[45, 80], [37,81], [24,82]]}, 
      3: {
        location: [[42.359394, -71.092814], [42.358356, -71.092186], [42.358431, -71.091967], [42.359303, -71.092509], [42.359390, -71.092187], [42.359568, -71.092299]],
        image: [[45, 73],[45, 117], [53, 117],[53, 80], [64, 80], [64, 73]]}, 
      10: {
        location: [[42.359382, -71.092178], [42.359564, -71.091609], [42.359703, -71.091706], [42.359528, -71.092264]],
        image: [[65,82],[85,82],[82,62], [67,62]]},
      13: {
        location: [],
        image: [[40, 51], [85, 51], [86, 62], [40, 62]]
      },
      12: {
        location: [],
        image: [[85, 53], [92, 53], [92, 49], [110, 49], [112, 59], [125, 59], [120, 66],[112,66],[112, 69],[91, 69],[91,63], [85, 63]]
      },
      4:{
        location:[],
        image: [[84, 73], [105, 73], [105, 117], [96,117], [96, 80], [84, 80]]
      },
      8: {
        location: [],
        image: [[105, 73], [116, 73], [116, 67], [124, 67], [124, 80], [106,80]]
      },
      16: {
        location: [],
        image: [[120, 59], [145, 59], [145, 66], [120, 66]]
      },
      26: {
        location: [],
        image: [[116, 56], [137, 55], [137, 48], [125,48], [125,19],[123, 19], [123, 18], [119, 18],[119, 19], [117, 19], [117, 24], [112, 25], [112, 32], [118, 33]]
      },
      2: {
        location: [],
        image: [[105,110],[125, 110], [125, 139], [96, 139], [96, 132], [115, 132], [115, 118], [105, 118]]
      },
      5: {
        location: [],
        image: [[25, 82], [34, 82], [34, 111], [25, 111]]
      },
      1: {
        location: [],
        image: [[25,110], [45, 110], [45, 117], [33, 117], [33, 133], [54, 133], [54, 139], [25,139]]
      },
      6: {
        location: [],
        image: [[115, 79], [124, 79], [124, 110], [114, 110]]
      },
      18: {
        location: {},
        image: []
      }
    }
    constraintElements = () => {
        var image = document.getElementsByClassName('nonsense')[0]
        // var x = window.getComputedStyle(image).getPropertyValue('height')
        console.log(image.getBoundingClientRect())
        var height = image.getBoundingClientRect().height//window.getComputedStyle(image).getPropertyValue("height").match(/\d+/)[0];
        var left_margin = window.getComputedStyle(image).getPropertyValue("margin-left").match(/\d+/)[0];
        var right_margin = window.getComputedStyle(image).getPropertyValue("margin-right").match(/\d+/)[0];
        var dial = document.getElementById('dial')
        var currLocButton = document.getElementById('currLocButton')
        dial.style.right = (35 + parseInt(left_margin)).toString() + "px"
        currLocButton.style.left = (40 + parseInt(right_margin)).toString() + "px"
        var start = document.getElementById('startingMarker').getBoundingClientRect().top
        var finish = document.getElementById('finalMarker').getBoundingClientRect().top
        // document.querySelector('.container').style.setProperty('--height', (finish - start).toString() + 'px')
        document.getElementById('cont').style.setProperty('--height', (finish - start).toString() + 'px')
        
        var mapContainer = document.getElementsByClassName('mapContainer')[0] as HTMLElement
        mapContainer.style.height = height.toString() + 'px'
    }
    inside = (point, vs) => {
      // ray-casting algorithm based on
      // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  
      var x = point[0], y = point[1];
  
      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var xi = vs[i][0], yi = vs[i][1];
          var xj = vs[j][0], yj = vs[j][1];
  
          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
  
      return inside;
  };
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
    
    componentDidLoad(){
      window.addEventListener('deviceorientation', (event) => {
        // do something with e
        var alpha    = event.alpha; //z axis rotation [0,360)
          //@ts-ignore
          if (typeof event.webkitCompassHeading !== "undefined") {
              //@ts-ignore
            alpha = event.webkitCompassHeading; //iOS non-standard
            var heading = alpha
            this.heading = heading + 17
           // TODO: Make somicething out of the heading
          }
          else {
            alert("Your device is reporting relative alpha values, so this compass won't point north :(");
            var head = 360 - alpha; //heading [0, 360)
            
            this.heading = head + 17
           // TODO: Make something out of the heading
          }
      })
        navigator.geolocation.watchPosition((position: Position) => {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          var current = null
          for(var property in this.buildingCoords){
            if(this.inside([lat, long],this.buildingCoords[property].location)){
              current = property
              break;
            }
          }
          if(current == null){
            this.draw(this.path, this.start)
          }
          else{
            this.draw(this.path, current)
          }
        })
    }

    draw = (path, current) => {
      console.log("Here")
      var cnvs = document.getElementById("mapCanvas") as HTMLCanvasElement;
      console.log(cnvs)
      var ctx = cnvs.getContext("2d");
      ctx.clearRect(0, 0, cnvs.width, cnvs.height);
      for(var i in path){
        var property = path[i]
        console.log(property)
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = (current != property) ? '#f00' : '#0000ff';
        ctx.beginPath();
        ctx.moveTo(this.buildingCoords[property].image[0][0], this.buildingCoords[property].image[0][1]);
      for( var item = 1 ; item < this.buildingCoords[property].image.length; item++ ){
        ctx.lineTo(this.buildingCoords[property].image[item][0], this.buildingCoords[property].image[item][1])
      }
      ctx.closePath();
      ctx.fill();
      }
      
    }
    
    componentDidRender() {
      var image = document.getElementById('map') as HTMLImageElement;
      image.addEventListener('load', () => {
        this.constraintElements()
        console.log("Loaded")
      });
      image.src = "/assets/MITTunnelsMap.jpg"
      this.draw(this.path, this.start)
      // if(!this.done){
      //   console.log('Doing it')
      //   this.constraintElements()
      //   this.done = true
      // }
        
    }
    // componentDidUpdate(){
    //   this.constraintElements()
    // }

    reverseArray = (arr) => {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
          newArray.push(arr[i]);
        }
        return newArray;
      }

    getAllUrlParams = (url) => {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
      
        // we'll store the parameters here
        var obj = {};
      
        // if query string exists
        if (queryString) {
      
          // stuff after # is not part of query string, so get rid of it
          queryString = queryString.split('#')[0];
      
          // split our query string into its component parts
          var arr = queryString.split('&');
      
          for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');
      
            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      
            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      
            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {
      
              // create key if it doesn't exist
              var key = paramName.replace(/\[(\d+)?\]/, '');
              if (!obj[key]) obj[key] = [];
      
              // if it's an indexed array e.g. colors[2]
              if (paramName.match(/\[\d+\]$/)) {
                // get the index value and add the entry at the appropriate position
                var index = /\[(\d+)\]/.exec(paramName)[1];
                obj[key][index] = paramValue;
              } else {
                // otherwise add the value to the end of the array
                obj[key].push(paramValue);
              }
            } else {
              // we're dealing with a string
              if (!obj[paramName]) {
                // if it doesn't exist, create property
                obj[paramName] = paramValue;
              } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                // if property does exist and it's a string, convert it to an array
                obj[paramName] = [obj[paramName]];
                obj[paramName].push(paramValue);
              } else {
                // otherwise add the property
                obj[paramName].push(paramValue);
              }
            }
          }
        }
      
        return obj;
      }
      
    render(){
        var adjList = [
            [0, 0, new Edge(159, true), 0, new Edge(250, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, new Edge(501, true, true), 0, new Edge(364, true, true), 0, 0, 0, 0, 0, 0, new Edge(150, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [new Edge(159, true), 0, 0, 0, 0, 0, new Edge(166, true, true), 0, 0, new Edge(501, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, new Edge(501, true, true), 0, 0, 0, 0, 0, new Edge(404, true, true), 0, new Edge(501, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [new Edge(250, true, true), 0, 0, 0, 0, 0, new Edge(258, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, new Edge(364, true, true), 0, 0, 0, 0, 0, new Edge(186, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, new Edge(166, true, true), 0, new Edge(258, true, true), 0, 0, 0, new Edge(211, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, new Edge(404, true, true), 0, new Edge(186, true, true), 0, 0, 0, 0, 0, 0, 0, new Edge(188, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, new Edge(211, true), 0, 0, 0, 0, new Edge(134, true, true), 0, 0, 0, 0, 0, 0, 0, 0, new Edge(136, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, new Edge(501, true, true), new Edge(501, true, true), 0, 0, 0, 0, 0, 0, 0, new Edge(220, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(370, true), 0, new Edge(279, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, new Edge(134, true, true), new Edge(220, true, true), new Edge(370, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, new Edge(150, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(331, false, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, new Edge(188, true, true), 0, 0, new Edge(279, true), 0, 0, 0, 0, new Edge(205, true, true), 0, new Edge(276, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(182, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(331, false, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(253, false, true), new Edge(400, true, true), 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(119, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(276, true, true), 0, 0, 0, 0, 0, new Edge(334, false, true), 0, 0, 0, new Edge(92, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(90, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(334, false, true), 0, 0, 0, 0, 0, new Edge(165, true), 0, 0, 0, 0, 0, new Edge(276, true), 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, new Edge(136, true), 0, 0, 0, 0, 0, new Edge(182, true), 0, 0, 0, 0, 0, 0, 0, new Edge(150, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(119, true), 0, 0, 0, 0, 0, 0, new Edge(87, true), 0, new Edge(150, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(150, true), 0, 0, 0, new Edge(276, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(92, true, true), 0, new Edge(165, true), 0, new Edge(87, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(90, true), 0, 0, 0, new Edge(276, true), 0, 0, 0, new Edge(211, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(150, true), 0, 0, 0, 0, new Edge(129, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(211, true), new Edge(129, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(253, false, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(224, false, true), 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(205, true, true), 0, new Edge(100, true, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(224, false, true), 0, 0, new Edge(254, true, true), 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(276, true), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(254, true, true), 0, 0, new Edge(322, true, true), 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(322, true, true), 0, new Edge(296, false, true), 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(296, false, true), 0, new Edge(92, true, true), 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(92, true, true), 0, new Edge(75,true, true), new Edge(175, true, true), 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(75, true, true), 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(175, true, true), 0, 0, new Edge(200, true)],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new Edge(200, true), 0]
            ]
            var buildingNames = {'1': 'Pierce Laboratory', '2': 'The Simmons Building', '3': 'Maclaurin Buildings (3)', '4': 'Maclaurin Buildings (4)', '5': 'Pratt School', '6': 'Eastman Laboratories', '7': 'Rogers Building', '8': '', '9': 'Samuel Tak Lee Building', '10': 'Maclaurin Buildings (10)', '11': 'Homberg Building', '13': 'Bush Building', '14': 'Hayden Memorial Library', '16': 'Dorrance Building', '17': 'Wright Brothers Wind Tunnel', '18': 'Dreyfus Building', '24': '', '26': 'Compton Laboratories', '31': 'Sloan Laboratories', '32': 'Ray and Maria Stata Cener', '33': 'Guggenheim Laboratory', '34': 'EG&G Educational Center', '35': 'Sloan Laboratory', '36': 'Fairchild Building (36)', '37': 'McNair Building', '38': 'Fairchild Building (38)', '39': 'Brown Building', '41': '', '42': 'Power Plant', '43': 'Power Plant Annex', '44': 'Cyclotron', '46': 'Brain and Congnitive Sciences', '48': 'Parsons Laboratory', '50': 'Walker Memorial', '51': 'Wood Sailing Pavilion', '54': 'Gree Building', '56': 'Whitaker Building', '57': 'Wang Fitness Center and Alumni Pool', '62': 'East Campus', '64': 'East Campus', '66': 'Landau Building', '68': 'Koch Biology Building', '76': 'Koch Institute', 'E17': 'Mudd Building', 'E18': 'Ford Building (E18)', 'E19': 'Ford Building (E19)', 'E25': 'Whitaker College', 'E23': 'Health Services'}
            var displayNumbers = {'E17': 69, 'E18': 70, 'E19': 71, 'E25': 72, 'E23': 73}
            var g = new Graph()
            // //@ts-ignore
            var path= g.dijkstra(adjList, displayNumbers[this.start.toString()] ? displayNumbers[this.start.toString()] : this.start , displayNumbers[this.destination.toString().split('?')[0]] ? displayNumbers[this.destination.toString().split('?')[0]] : this.destination.toString().split('?')[0])
            var reverse = this.reverseArray(path)
            this.path = reverse
            var steps = []
            var last = this.getAllUrlParams(window.location.href)['status'] == 'true' ? 'tunnel' : 'physical'

            for(var i = 0; i < reverse.length - 1; i++){
                var curr = reverse[i];
                var next = reverse[i + 1]
                var edge = adjList[g.getIndex(curr)][g.getIndex(next)] as Edge
                var connections = edge.connections();
                if(connections.find((val) => val == last) === undefined){
                    if(last == 'tunnel') {
                        steps.push({instruction: 'Exit Tunnels', type: 'exit'})
                        last = 'physical'
                    }
                    else{
                        steps.push({instruction: 'Enter Tunnels', type: 'enter'})
                        last= 'tunnel'
                    }
                }
                steps.push({ instruction: 'Go to Building ' + reverse[i + 1].toString(), type: 'building', number: reverse[i + 1]})
            }
            steps.push({type: 'arrived'})
        return (
            <div>
                <ion-header>
                    <ion-toolbar color="primary">
                        <ion-buttons slot="start">
                            <ion-back-button defaultHref="/start" />
                        </ion-buttons>
                        <ion-title>Suggested Route</ion-title>
                    </ion-toolbar>
                </ion-header>
              <div>
              
              <div id="mapContainer" class="mapContainer" style={{'position': 'relative'}}>
                    
                    <img src="/assets/MITTunnelsMap.jpg" style={{'maxHeight': '450px' ,'display': 'block', 'margin': 'auto', 'z-index': '10'}} id="map" class="nonsense"></img>
                    <canvas id="mapCanvas" style={{height: "100%", width: "100%", position: "absolute", 'zIndex': '20'}}></canvas>{/*style={{height: '100%', width: '100%', zIndex:'20'}}*/}
                    
                    {/* <div style={{'position': 'absolute', 'z-index': '11', 'left': `${this.left}px`, 'bottom': `${this.bottom}px`}} id="currLoc">
                      <svg width="15" height="15" viewBox="0 0 15 15">
                        <g id="Ellipse_1" data-name="Ellipse 1" fill="#198fff" stroke="#fff" stroke-width="3">
                          <circle cx="7.5" cy="7.5" r="7.5" stroke="none"/>
                          <circle cx="7.5" cy="7.5" r="6" fill="none"/>
                        </g>
                      </svg>
                    </div> */}
                    
                        <div style={{'position': 'absolute', 'z-index': '21', 'right': '0px', 'bottom': '25px', 'transformOrigin': '9px 40px', 'transform': `rotate(${this.heading}deg)`, '-webkit-transform': `rotate(${this.heading}deg)`}} id="dial">
                            <svg width="20px" height="51px" viewBox="0 0 20 51" version="1.1">
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="iPhone-XS-Copy-2" transform="translate(-320.000000, -141.000000)">
                                        <g id="Group-2" transform="translate(324.000000, 141.000000)">
                                            <g id="Group">
                                                <polyline id="Path" fill="#B60000" fill-rule="nonzero" points="1.64912281 37.1052632 9.89473684 37.1052632 5.77192982 0"></polyline>
                                                <circle id="Oval" stroke="#B60000" stroke-width="7" cx="5.77192982" cy="41.2280702" r="5.77192982"></circle>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <ion-button size="small" style={{'position': 'absolute', 'z-index': '21', 'left': '0px', 'bottom': '25px'}} id="currLocButton">
                          <ion-icon name="md-navigate"></ion-icon>
                        </ion-button>
                    </div>
                <ion-content fullscreen forceOverscroll>
                    <div class="container" id="cont">
                        {
                            steps.map((val, index) => {
                                if(index == 0){
                                    switch (val.type) {
                                        case "building":
                                            return (
                                                <div class="timeline-block timeline-block-right"
                                                  style={{'marginTop': '0px'}}>
                                                  <div class="markerBlue" id="startingMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <ion-card-header>
                                                        <ion-card-subtitle>{buildingNames[val.number.toString()]}</ion-card-subtitle>
                                                        <ion-card-title style={{'marginTop': '-3px'}}>Building {val.number}
                                                        </ion-card-title>
                                                      </ion-card-header>

                                                      <ion-card-content
                                                        style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                                        Enter through the tunnels/and or through physical means
                                                      </ion-card-content>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'enter':
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerGreen" id="startingMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Enter Tunnels</ion-card-title>
                                                        </ion-card-header>

                                                        <svg width="26px" height="21px" viewBox="0 0 26 21"
                                                          version="1.1" style={{'margin': 'auto 25px auto auto'}}>
                                                          <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                            fill-rule="evenodd">
                                                            <g id="_ionicons_svg_ios-exit-copy" fill="#63A000"
                                                              fill-rule="nonzero">
                                                              <path
                                                                d="M20,18.2676673 L20,11.575985 L8.75625,11.575985 L11.70625,14.5716073 C12.01875,14.8905566 12.01875,15.4033771 11.7,15.7223265 C11.38125,16.0350219 10.86875,16.0350219 10.55,15.7160725 L6.2375,11.3383365 C6.0875,11.1819887 6.00625,10.9756098 6.00625,10.7692308 C6.00625,10.6629143 6.025,10.5565979 6.06875,10.4565353 C6.10625,10.3627267 6.16875,10.275172 6.2375,10.2001251 L10.55,5.82238899 C10.8625,5.50343965 11.38125,5.49718574 11.7,5.81613508 C12.01875,6.12883052 12.025,6.64790494 11.70625,6.96685428 L8.75625,9.96247655 L20,9.96247655 L20,3.27079425 C20,1.89493433 18.875,0.769230769 17.5,0.769230769 L2.5,0.769230769 C1.125,0.769230769 -2.48689958e-14,1.89493433 -2.48689958e-14,3.27079425 L-2.13162821e-14,18.2676673 C-2.13162821e-14,19.6435272 1.125,20.7692308 2.5,20.7692308 L17.5,20.7692308 C18.875,20.7692308 20,19.6435272 20,18.2676673 Z M25.1875,11.6260163 C25.6375,11.6260163 26,11.2632896 26,10.8130081 C26,10.3627267 25.6375,10 25.1875,10 L20,10 L20,11.6260163 L25.1875,11.6260163 Z"
                                                                id="Shape"></path>
                                                            </g>
                                                          </g>
                                                        </svg>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'exit':
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerRed" id="startingMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Exit Tunnels</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="exit"
                                                          style={{'color': '#BF0000', 'margin': 'auto 25px auto auto', 'fontSize': '30px'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        default:
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerBrown" id="finalMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Arrived</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="pin"
                                                          style={{'fontSize': '30px', 'color': '#754F4F', 'margin': 'auto 25px auto auto'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            );
                                    }
                                }
                                else if(index % 2 == 0){
                                    switch (val.type) {
                                        case "building":
                                            return (
                                                <div class="timeline-block timeline-block-right"
                                                  style={{'marginTop': '0px'}}>
                                                  <div class="markerBlue"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <ion-card-header>
                                                        <ion-card-subtitle>{buildingNames[val.number.toString()]}</ion-card-subtitle>
                                                        <ion-card-title style={{'marginTop': '-3px'}}>Building {val.number}
                                                        </ion-card-title>
                                                      </ion-card-header>

                                                      <ion-card-content
                                                        style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                                        Enter through the tunnels/and or through physical means
                                                      </ion-card-content>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'enter':
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerGreen"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Enter Tunnels</ion-card-title>
                                                        </ion-card-header>

                                                        <svg width="26px" height="21px" viewBox="0 0 26 21"
                                                          version="1.1" style={{'margin': 'auto 25px auto auto'}}>
                                                          <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                            fill-rule="evenodd">
                                                            <g id="_ionicons_svg_ios-exit-copy" fill="#63A000"
                                                              fill-rule="nonzero">
                                                              <path
                                                                d="M20,18.2676673 L20,11.575985 L8.75625,11.575985 L11.70625,14.5716073 C12.01875,14.8905566 12.01875,15.4033771 11.7,15.7223265 C11.38125,16.0350219 10.86875,16.0350219 10.55,15.7160725 L6.2375,11.3383365 C6.0875,11.1819887 6.00625,10.9756098 6.00625,10.7692308 C6.00625,10.6629143 6.025,10.5565979 6.06875,10.4565353 C6.10625,10.3627267 6.16875,10.275172 6.2375,10.2001251 L10.55,5.82238899 C10.8625,5.50343965 11.38125,5.49718574 11.7,5.81613508 C12.01875,6.12883052 12.025,6.64790494 11.70625,6.96685428 L8.75625,9.96247655 L20,9.96247655 L20,3.27079425 C20,1.89493433 18.875,0.769230769 17.5,0.769230769 L2.5,0.769230769 C1.125,0.769230769 -2.48689958e-14,1.89493433 -2.48689958e-14,3.27079425 L-2.13162821e-14,18.2676673 C-2.13162821e-14,19.6435272 1.125,20.7692308 2.5,20.7692308 L17.5,20.7692308 C18.875,20.7692308 20,19.6435272 20,18.2676673 Z M25.1875,11.6260163 C25.6375,11.6260163 26,11.2632896 26,10.8130081 C26,10.3627267 25.6375,10 25.1875,10 L20,10 L20,11.6260163 L25.1875,11.6260163 Z"
                                                                id="Shape"></path>
                                                            </g>
                                                          </g>
                                                        </svg>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'exit':
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerRed"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Exit Tunnels</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="exit"
                                                          style={{'color': '#BF0000', 'margin': 'auto 25px auto auto', 'fontSize': '30px'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        default:
                                            return (
                                                <div class="timeline-block timeline-block-right">
                                                  <div class="markerBrown" id="finalMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Arrived</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="pin"
                                                          style={{'fontSize': '30px', 'color': '#754F4F', 'margin': 'auto 25px auto auto'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            );
                                    }
                                }
                                else{
                                    switch (val.type) {
                                        case "building":
                                            return (
                                                <div class="timeline-block timeline-block-left"
                                                  style={{'marginTop': '0px'}}>
                                                  <div class="markerBlue"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <ion-card-header>
                                                        <ion-card-subtitle>{buildingNames[val.number.toString()]}</ion-card-subtitle>
                                                        <ion-card-title style={{'marginTop': '-3px'}}>Building {val.number}
                                                        </ion-card-title>
                                                      </ion-card-header>

                                                      <ion-card-content
                                                        style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                                        Enter through the tunnels/and or through physical means
                                                      </ion-card-content>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'enter':
                                            return (
                                                <div class="timeline-block timeline-block-left">
                                                  <div class="markerGreen"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Enter Tunnels</ion-card-title>
                                                        </ion-card-header>

                                                        <svg width="26px" height="21px" viewBox="0 0 26 21"
                                                          version="1.1" style={{'margin': 'auto 25px auto auto'}}>
                                                          <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                            fill-rule="evenodd">
                                                            <g id="_ionicons_svg_ios-exit-copy" fill="#63A000"
                                                              fill-rule="nonzero">
                                                              <path
                                                                d="M20,18.2676673 L20,11.575985 L8.75625,11.575985 L11.70625,14.5716073 C12.01875,14.8905566 12.01875,15.4033771 11.7,15.7223265 C11.38125,16.0350219 10.86875,16.0350219 10.55,15.7160725 L6.2375,11.3383365 C6.0875,11.1819887 6.00625,10.9756098 6.00625,10.7692308 C6.00625,10.6629143 6.025,10.5565979 6.06875,10.4565353 C6.10625,10.3627267 6.16875,10.275172 6.2375,10.2001251 L10.55,5.82238899 C10.8625,5.50343965 11.38125,5.49718574 11.7,5.81613508 C12.01875,6.12883052 12.025,6.64790494 11.70625,6.96685428 L8.75625,9.96247655 L20,9.96247655 L20,3.27079425 C20,1.89493433 18.875,0.769230769 17.5,0.769230769 L2.5,0.769230769 C1.125,0.769230769 -2.48689958e-14,1.89493433 -2.48689958e-14,3.27079425 L-2.13162821e-14,18.2676673 C-2.13162821e-14,19.6435272 1.125,20.7692308 2.5,20.7692308 L17.5,20.7692308 C18.875,20.7692308 20,19.6435272 20,18.2676673 Z M25.1875,11.6260163 C25.6375,11.6260163 26,11.2632896 26,10.8130081 C26,10.3627267 25.6375,10 25.1875,10 L20,10 L20,11.6260163 L25.1875,11.6260163 Z"
                                                                id="Shape"></path>
                                                            </g>
                                                          </g>
                                                        </svg>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        case 'exit':
                                            return (
                                                <div class="timeline-block timeline-block-left">
                                                  <div class="markerRed"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Exit Tunnels</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="exit"
                                                          style={{'color': '#BF0000', 'margin': 'auto 25px auto auto', 'fontSize': '30px'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            )
                                        default:
                                            return (
                                                <div class="timeline-block timeline-block-left">
                                                  <div class="markerBrown" id="finalMarker"></div>
                                                  <div class="timeline-content">
                                                    <ion-card>
                                                      <div style={{'display': 'flex'}}>
                                                        <ion-card-header>
                                                          <ion-card-title>Arrived</ion-card-title>
                                                        </ion-card-header>
                                                        <ion-icon name="pin"
                                                          style={{'fontSize': '30px', 'color': '#754F4F', 'margin': 'auto 25px auto auto'}}>
                                                        </ion-icon>
                                                      </div>
                                                    </ion-card>
                                                  </div>
                                                </div>
                                            );
                                    }
                                }
                            })
                        }

                {/* <div class="timeline-block timeline-block-right" style={{'marginTop': '0px'}}>
                <div class="markerBlue"></div>
                <div class="timeline-content">
                    <ion-card>
                                <ion-card-header>
                                    <ion-card-subtitle>Bush Building</ion-card-subtitle>
                                    <ion-card-title style={{'marginTop': '-3px'}}>Building 13</ion-card-title>
                                </ion-card-header>

                                <ion-card-content style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                    Enter through the tunnels/and or through physical means
                                </ion-card-content>
                    </ion-card>
                </div>
                </div>

                <div class="timeline-block timeline-block-left">
                <div class="markerRed"></div>
                <div class="timeline-content">
                    <ion-card>
                                <div style={{'display': 'flex'}}>
                                    <ion-card-header>
                                        <ion-card-title>Exit Tunnels</ion-card-title>
                                    </ion-card-header>
                                    <ion-icon name="exit" style={{'color': '#BF0000', 'margin': 'auto 25px auto auto', 'fontSize': '30px'}}></ion-icon>
                                </div>
                    </ion-card>
                </div>
                </div>

                <div class="timeline-block timeline-block-right">
                <div class="markerBlue"></div>
                <div class="timeline-content">
                    <ion-card>
                                <ion-card-header>
                                    <ion-card-subtitle>Nanotech Building</ion-card-subtitle>
                                    <ion-card-title style={{'marginTop': '-3px'}}>Building 12</ion-card-title>
                                </ion-card-header>

                                <ion-card-content style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                Enter through the tunnels/and or through physical means
                                </ion-card-content>
                    </ion-card>
                </div>
                </div>

                <div class="timeline-block timeline-block-left">
                <div class="markerGreen"></div>
                <div class="timeline-content">
                <ion-card>
                            <div style={{'display': 'flex'}}>
                                <ion-card-header>
                                    <ion-card-title>Enter Tunnels</ion-card-title>
                                </ion-card-header>
                        
                                <svg width="26px" height="21px" viewBox="0 0 26 21" version="1.1" style={{'margin': 'auto 25px auto auto'}}>
                                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="_ionicons_svg_ios-exit-copy" fill="#63A000" fill-rule="nonzero">
                                            <path d="M20,18.2676673 L20,11.575985 L8.75625,11.575985 L11.70625,14.5716073 C12.01875,14.8905566 12.01875,15.4033771 11.7,15.7223265 C11.38125,16.0350219 10.86875,16.0350219 10.55,15.7160725 L6.2375,11.3383365 C6.0875,11.1819887 6.00625,10.9756098 6.00625,10.7692308 C6.00625,10.6629143 6.025,10.5565979 6.06875,10.4565353 C6.10625,10.3627267 6.16875,10.275172 6.2375,10.2001251 L10.55,5.82238899 C10.8625,5.50343965 11.38125,5.49718574 11.7,5.81613508 C12.01875,6.12883052 12.025,6.64790494 11.70625,6.96685428 L8.75625,9.96247655 L20,9.96247655 L20,3.27079425 C20,1.89493433 18.875,0.769230769 17.5,0.769230769 L2.5,0.769230769 C1.125,0.769230769 -2.48689958e-14,1.89493433 -2.48689958e-14,3.27079425 L-2.13162821e-14,18.2676673 C-2.13162821e-14,19.6435272 1.125,20.7692308 2.5,20.7692308 L17.5,20.7692308 C18.875,20.7692308 20,19.6435272 20,18.2676673 Z M25.1875,11.6260163 C25.6375,11.6260163 26,11.2632896 26,10.8130081 C26,10.3627267 25.6375,10 25.1875,10 L20,10 L20,11.6260163 L25.1875,11.6260163 Z" id="Shape"></path>
                                        </g>
                                    </g>
                                </svg>
                                </div>
                    </ion-card>
                </div>
                </div>

                <div class="timeline-block timeline-block-right">
                <div class="markerBlue"></div>
                <div class="timeline-content">
                <ion-card>
                                <ion-card-header>
                                    <ion-card-subtitle>Dorrance Building</ion-card-subtitle>
                                    <ion-card-title style={{'marginTop': '-3px'}}>Building 16</ion-card-title>
                                </ion-card-header>

                                <ion-card-content style={{'marginTop': '-25px', 'fontSize': '13px'}}>
                                Enter through the tunnels/and or through physical means
                                </ion-card-content>
                    </ion-card>
                </div>
                </div>

                <div class="timeline-block timeline-block-left">
                <div class="markerBrown"></div>
                <div class="timeline-content">
                <ion-card>
                <div style={{'display': 'flex'}}>
                                <ion-card-header>
                                    <ion-card-title>Arrived</ion-card-title>
                                </ion-card-header>
                                <ion-icon name="pin" style={{'fontSize': '30px', 'color': '#754F4F', 'margin': 'auto 25px auto auto'}}></ion-icon>
                                </div>
                    </ion-card>
                </div>
                </div> */}

                </div>
                  {/* <ion-list>
                    {
                    steps.map((value) => {
                        return (
                            <ion-card>
                            <ion-card-header>
                                <ion-card-subtitle>Maria and William State Building</ion-card-subtitle>
                                <ion-card-title>Building 12</ion-card-title>
                            </ion-card-header>

                            <ion-card-content style={{'marginTop': '-10px'}}>
                                You can enter only from the tunnels
                            </ion-card-content>
                            </ion-card>
                        )
                    })
                    }
                  </ion-list> */}
                </ion-content>
              </div>
              
            </div>
            
        )
    }
}