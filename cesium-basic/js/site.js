var site = (function() {
    var viewer;
    var countryFilter = [];
    var missionTypeFilter = [];
    var config = {};
    var regimes = ['LEO','HEO','MEO','GEO'];
    var czmlString = '';
    dataSource = new Cesium.CzmlDataSource()
    var compassContainer = document.createElement('div');

    var _readConfig = function() {
        console.log("READING CONFIG:")
        $.ajax({
            url: './config.json',
            async: false,
            success: function(data) {
                config = data;
            }
        });
    };

    var _initCesium = function() {

        _readConfig();

        console.log('Cesium version:', Cesium.VERSION);
        
        Cesium.Ion.defaultAccessToken = config.CesiumAPIKey; // Replace with your Cesium ion access token

        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: true,
            fullscreenButton: true,
            baseLayerPicker: false,
            geocoder: false,
            timeline: true,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            baseLayer: Cesium.ImageryLayer.fromWorldImagery({
                style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
              }),
        });

        CompassRose(true);

        try {
            _setUpLayers();
        } catch {
            console.log("Could not set up Layers, please check Cesium ION token")
        }

       
        initFilterWindow();
        toggleLabels();
        
    };

    var _setUpLayers = async function(){
        
        console.log("Setting up layers");
        const layers = viewer.scene.imageryLayers;
        const blackMarble = Cesium.ImageryLayer.fromProviderAsync(
            Cesium.IonImageryProvider.fromAssetId(3812)
            );
        blackMarble.alpha = 0.25;
        blackMarble.brightness = 1.0;
        layers.add(blackMarble);
        
        /*    
        // Add in Terrain Data
        // Currently commented out to showcase some 3D model data
        viewer.scene.setTerrain(
            new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(3956))
        );
        */
        
        // Add AGI HQ
        viewer.scene.primitives.add(
            await Cesium.Cesium3DTileset.fromIonAssetId(634533)
        );

        // Add NYC Data
        viewer.scene.primitives.add(
            await Cesium.Cesium3DTileset.fromIonAssetId(2422511)
        );
    };

    var _getADSB = function() {
        console.log("Getting ADSB Data")
        setInterval(() => {
            updateAircraftPositions(viewer);
        }, 5000); // Update every 5 seconds
        // Make that a config value in the future. 
    };

    var _ingestADSBdata = async function() {

        const options = {
        method: 'GET',
        url: 'https://adsbexchange-com1.p.rapidapi.com/v2/lat/39.95020/lon/-75.147646/dist/10/',
        headers: {
            'X-RapidAPI-Key': config.ADSBxAPIKey,
            'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
        }
        };

        try {
            var response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }; 

    var updateAircraftPositions = async function(viewer) {
        try {

            const adsbData = await _ingestADSBdata(); // Fetch ADS-B data
            
            adsbData.ac.forEach(ac => {
                try {
                    //filters: type: 'tisb_other'
                    // type: 'adsb_icao'
                    if (ac.type === 'adsb_icao'){

                        // Check if alt_baro is a number or can be converted to one, otherwise set a default value
                        var altitude = parseFloat(ac.alt_baro);
                        if (isNaN(altitude)) {
                            altitude = 0; // Default altitude, e.g., ground level
                        } else {
                            altitude *= 0.3048; // Convert feet to meters
                        }
            
                        // Validate latitude and longitude
                        if (typeof ac.lat === 'number' && ac.lat >= -90 && ac.lat <= 90 &&
                            typeof ac.lon === 'number' && ac.lon >= -180 && ac.lon <= 180) {
            
                            var id = ac.hex; // Using the aircraft's hex as a unique identifier
                            var position = Cesium.Cartesian3.fromDegrees(ac.lon, ac.lat, altitude);
                            
                            // Use ac.flight if it exists and is not just whitespace, otherwise use ac.r
                            var flightLabel = ac.flight && ac.flight.trim() !== '' ? ac.flight.trim() : ac.r;
                            var labelContent = flightLabel + '\n\n' + (altitude*3.28084).toFixed(2) + ' ft';

                            var entity = viewer.entities.getById(id);
                            
                            if (!entity) {
                                // Create a new entity for the aircraft
                                viewer.entities.add({
                                    id: id,
                                    position: position,
                                    point: {
                                        pixelSize: 10,
                                        color: Cesium.Color.RED
                                    },
                                    label: {
                                        text: labelContent,
                                        font: 'bold 15px sans-serif', // Adjust font size here
                                        fillColor: Cesium.Color.WHITE,
                                        strokeColor: Cesium.Color.BLACK, // Outline color
                                        strokeWidth: 4,
                                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                        eyeOffset: new Cesium.Cartesian3(0, 25, -20),
                                        verticalOrigin: Cesium.VerticalOrigin.CENTER
                                    }
                                });   
                            } else {
                                // Update the position of an existing entity
                                entity.position = position;
                                entity.label.text = labelContent;
                            }
                        }
                    }
                    else{
                        // Do not process that data, it doesn't fit the adsb format
                    }
                    
                } catch (error) {
                    console.error('Error updating aircraft position:', error);
                }
            });

        } catch (error) {
            console.error('Error updating aircraft positions:', error);
        }
    };

    var toggleLayers = function() {
        var layersCheckbox = document.getElementById("Show Layers");
        var k;

        layersCheckbox.onchange = function() {
            console.log("Layers Check Box Debug")
            if (layersCheckbox.checked) {
                
            } else {
                
            }
        };
    };

    var addprimative = function(){
        var center = Cesium.Cartesian3.fromDegrees(-75.147646, 39.95020);
        var radiusInMeters = 16093.4; // 10 miles in meters

        viewer.entities.add({
            position: center,
            ellipsoid: {
                radii: new Cesium.Cartesian3(radiusInMeters, radiusInMeters, radiusInMeters),
                material: Cesium.Color.WHITE.withAlpha(0.3), // Semi-transparent red material
                outline: true, // Optionally, add an outline
                outlineColor: Cesium.Color.BLACK
            }
        });
    };

    var toggleLabels = function() {
        var labelCheckbox = document.getElementById("Show Labels");
        var k;
        labelCheckbox.onchange = function() {
            console.log("Labels Check Box")
            if (labelCheckbox.checked) {
                for (k = 0; k < viewer.entities._entities._array.length; k++) {
                    viewer.entities._entities._array[k]._label.show = true
                }
            } else {
                for (k = 0; k < viewer.entities._entities._array.length; k++) {
                    viewer.entities._entities._array[k]._label.show = false
                }
            }
        };
    };

    var initFilterWindow = function() {
        var x = document.getElementById("filterMenu");
        x.style.display = "none";
    };

    // This is a diff way to add a div into the web viewer
    // It adding an image to act as a compass rose to show where "north" is
    async function CompassRose(show){
        if (show) {
          // Create a container div for the compass rose
          compassContainer.style.position = 'absolute';
          compassContainer.style.top = '60px';
          compassContainer.style.right = '10px';
          compassContainer.style.padding = '5px'; // Adjust as needed
          compassContainer.style.border = '1px solid rgba(0, 0, 0, 0.25)'; // Soft border
          compassContainer.style.borderRadius = '5px'; // Rounded corners
          compassContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent background
          viewer.container.appendChild(compassContainer);
    
          // Create the compass rose element (as an SVG image)
          var compassRose = document.createElement('img');
          compassRose.src = './images/cardinal-point.png';
          compassRose.style.width = '75px'; // Adjust size as needed
          compassRose.style.height = 'auto';
          compassContainer.appendChild(compassRose); // Append compass to the container
    
          // Update compass rose rotation based on camera heading
          // Update compass rose rotation based on camera orientation
          function updateCompass() {
            var heading = viewer.camera.heading;
            var angle = Cesium.Math.toDegrees(heading);
            compassRose.style.transform = 'rotate(' + -angle + 'deg)';
          }
          
          // Update compass on each rendered frame
          viewer.scene.postRender.addEventListener(function() {
              updateCompass();
          });
          console.log("added compass rose");
        }
        else {
            // Remove all child elements
            while (compassContainer.firstChild) {
                compassContainer.removeChild(compassContainer.firstChild);
            }
            console.log("removed compass rose");
        }
    }


    return {
        readConfig: _readConfig,
        initCesium: _initCesium,
        getADSB : _getADSB,
    };

})();