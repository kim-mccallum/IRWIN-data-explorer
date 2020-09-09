require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/layers/FeatureLayer"
  ], function(Map, MapView, BasemapToggle, FeatureLayer) {
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

    var basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "satellite"
    });

    view.ui.add(basemapToggle, "bottom-right");

    // make this an array of arrays
    // make this an array of arrays
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

      view.ui.add(coordsWidget, "bottom-right");
          
      view.ui.add(selectFilter, "top-right");

    //create labels
    var irwinLabels = {
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
      };
    
    // create popup
    var irwinPopup = {
        title: "Fire Name: {IncidentName}",
        content: "Cause: {FireCause}<br> Start date: {FireDiscoveryDateTime} <br> Acres: {CalculatedAcres}"
      };
    // add features
    var firesLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/IRWIN_Incidents_2020/FeatureServer",
        //   renderer: irwinRenderer,
        labelingInfo: [irwinLabels],
        popupTemplate: irwinPopup
      });

      // // server-side 
    //   function setFeatureLayerFilter(expression) {
    //     firesLayer.definitionExpression = expression;
    //   }

    //   selectFilter.addEventListener('change', function (event) {
    //     setFeatureLayerFilter(event.target.value);
    //   });

      // client-side queries
      function setFeatureLayerViewFilter(expression) {
        view.whenLayerView(firesLayer).then(function (featureLayerView) {
          featureLayerView.filter = {
            where: expression
          };
        });
      }

      selectFilter.addEventListener("change", function (event) {
        // setFeatureLayerFilter(event.target.value);
        setFeatureLayerViewFilter(event.target.value);
      });

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

      view.watch("stationary", function (isStationary) {
        showCoordinates(view.center);
      });
      
      view.on("pointer-move", function (evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
      });

      map.add(firesLayer);
  });