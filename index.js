require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/layers/FeatureLayer"
  ], function(Map, MapView, BasemapToggle, FeatureLayer) {

    //a few functions: 
    function showCoordinates(pt) {
      var coords =
        "Lat/Lon " +
        pt.latitude.toFixed(3) +
        " " +
        pt.longitude.toFixed(3) +
        " | Scale 1:" +
        Math.round(view.scale * 1) / 1 +
        " | Zoom " +
        view.zoom;
      coordsWidget.innerHTML = coords;
    }

    // client-side queries
    function setFeatureLayerViewFilter(expression) {
      view.whenLayerView(firesLayer).then(function (featureLayerView) {
        featureLayerView.filter = {
          where: expression
        };
      });
    }

    //set up map and view
    var map = new Map({
      basemap: "topo-vector"
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-122.188, 44.821], // longitude, latitude
      zoom: 10
    });

    // add some map elements
    // set up queries for fire layer
    var sqlExpressions = [
        ["All fires", "IsValid = 1"],
        ["Greater than 500 acres", "CalculatedAcres > 500"],
        ["Human caused", "FireCause = 'Human'"],
        ["Natural", "FireCause = 'Natural'"],
        ["Unknown cause", "FireCause = 'Unknown'"],
        //recent starts
      ];
      
      var selectFilter = document.createElement("select");
      selectFilter.setAttribute("class", "esri-widget esri-select");
      selectFilter.setAttribute(
        "style",
        "width: 275px; font-family: Avenir Next W00; font-size: 1em;"
      );
      
      sqlExpressions.forEach(function (sql) {
        var option = document.createElement("option");
        option.value = sql[1];
        option.innerHTML = sql[0];
        selectFilter.appendChild(option);
      });

      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "7px 15px 5px";

        
      var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite"
      });

    // add features
    var firesLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/IRWIN_Incidents_2020/FeatureServer",
        //   renderer: irwinRenderer,
        labelingInfo: [{
          symbol: {
            type: "text",
            color: "#FFFFFF",
            haloColor: "#5E8D74",
            haloSize: "2px",
            font: {
              size: "12px",
              family: "Noto Sans",
              style: "italic",
              weight: "normal"
            }
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
              expression: "$feature.IncidentName"
            }
        }],
        popupTemplate: {
          title: "Fire Name: {IncidentName}",
          content: "Cause: {FireCause}<br> Start date: {FireDiscoveryDateTime} <br> Acres: {CalculatedAcres}"
        }
      });

      //Configure the view
      view.ui.add(basemapToggle, "bottom-right");

      view.ui.add(coordsWidget, "bottom-right");
          
      view.ui.add(selectFilter, "top-right");

      selectFilter.addEventListener("change", function (event) {
        setFeatureLayerViewFilter(event.target.value);
      });

      view.watch("stationary", function (isStationary) {
        showCoordinates(view.center);
      });
      
      view.on("pointer-move", function (evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
      });

      map.add(firesLayer);
  });