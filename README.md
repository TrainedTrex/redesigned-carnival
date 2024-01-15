# redesigned-carnival

![test](/cesium-basic/favicon.ico)

Cesium Demo Example

![Cesium world view](/assets/Cesium_Main.png "Cesium Application")

## Description

Example cesium build that can be shipped out and serves as a small sample Cesium and CesiumJS capabilities.

Capabilities:

- [x] Cesium Viewer
- [x] Ion globe layers
- [x] Ion 3D tile integration
- [x] ADSB Exchange data integration

Additional:

- [x] Toggle for ADSB labels
- [x] Dynamic ADSB data legend
- [ ] Multiple ADSB filter options
- [ ] Cesium Ion API integration through webpage
- [x] Compass showing 'North'
- [ ] Toggleable 3D tile and layers
- [ ] Zoom too button for 3D tiles

## Usecase

Cesium deployed as a container that can either be stand alone or a front end for a backend service in the future.

## How To

These are the steps needed to get all functionality working.

1. Create Cesium Ion Account
2. Add imagery assets from Asset depo to "my assets"
   1. See [this](AssetWalkthrough.md) walkthrough for details if needed
3. Import Custom NYC Layer and adjust location
   1. This guide is a good reference: <https://cesium.com/learn/3d-tiling/ion-tile-photogrammetry/>
   2. You may need to adjust asset ID# for any custom layers/3D models in site.js
4. Update API Keys in config.json (see below)
5. Build container
6. Enjoy

Continue to next section.

## Update API Keys

When cloning the repo, there is a config.json.github file. Do the following:

- Rename config.json.github to config.json
- Update CesiumAPIKey & ADSBxAPIKey to your key values
- Save file

> This will allow you to pull data from Cesium Ion and ADSB Exchange correctly

## Example build command

```pwsh
cd .\cesium-basic\
docker build --tag cesium .
```

> Make sure to CD into container directory before running the build command

## Run the container

to run the container use the run command below.

| **Flag** | **Value** |
| :----- | :----- |
| -p, --publish | localport:8080 |
| --name | desired container name |
| -d, --detach | Detatch process from Command Prompt or PowerShell |

### Example Run Command

```pwsh
docker run -d --name cesium --publish 8080:8080 cesium
```

## Testing

Now that the container is running it can be tested by going to the Cesium front end

Go to: http://localhost:8080
> This will display the Cesium frontend with custom data being integrated and displayed
