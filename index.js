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
    
    // create renderer 
    // var irwinRenderer = {
    //         type: "simple",  // autocasts as new SimpleRenderer()
    //         symbol: { type: "simple-marker" },  // autocasts as new SimpleFillSymbol()
    //         visualVariables: [{
    //           type: "color",
    //           field: "CalculatedAcres",
    //           // features with 30 ppl/sq km or below are assigned the first color
    //           stops: [{ value: 0, color: "#f70905" },
    //                 { value: 100000, color: "#0cf2ee" }]
    //         }]
    //       };
    // add features
    var firesLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/IRWIN_Incidents_2020/FeatureServer",
        //   renderer: irwinRenderer,
        labelingInfo: [irwinLabels]
      });
      
      map.add(firesLayer);
  });