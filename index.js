require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/layers/FeatureLayer"
  ], function(Map, MapView, BasemapGallery, FeatureLayer) {
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

    var basemapGallery = new BasemapGallery({
        view: view,
        source: {
          portal: {
            url: "https://www.arcgis.com",
            useVectorBasemaps: true // Load vector tile basemaps
          }
        }
      });

    view.ui.add(basemapGallery, "top-right");

    var sqlExpressions = [
        "IsValid = 1",
        "CalculatedAcres > 500",
        "FireCause = 'Human'",
        "FireCause = 'Natural'",
        "FireCause = 'Unknown'",
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
        option.value = sql;
        option.innerHTML = sql;
        selectFilter.appendChild(option);
      });
      
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
      
      function setFeatureLayerFilter(expression) {
        firesLayer.definitionExpression = expression;
      }

      selectFilter.addEventListener('change', function (event) {
        setFeatureLayerFilter(event.target.value);
      });

      map.add(firesLayer);
  });