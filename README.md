# redesigned-carnival

Cesium Demo Example

## Description

Example cesium build that can be shipped out and serves as a small sample of the capabilites of Cesium and CesiumJS.

Capabilities:

- [x] Cesium Viewer
- [x] Ion globe layers
- [x] Ion 3D tile integration
- [x] ADSB Exchange data integration

Additional:

- [x] Toggle for ADSB labels
- [ ] Multiple ADSB filter options
- [ ] Cesium Ion API integration through webpage
- [ ] Toggleable 3D tile and layers
- [ ] Zoom too button for 3D tiles

## Usecase

Cesium deployed as a container that can either be stand alone or a front end for a backend service in the future.

## How To

This is a step by step guide to getting

This Guide: <https://cesium.com/learn/3d-tiling/ion-tile-photogrammetry/>

This Guide: <>

### Example build command

> Make sure to CD into container directory before build command

```docker
docker build --tag cesium .
```

## Run the container

to run the containers

| **Flag** | **Value** |
| :----- | :----- |
| -p, --publish | <localport>:8080 |
| --name | desired container name |
| -v, --volume | <LocalFileLocation>/tleViewer-docker/Data_Folder:app/Data  |
| -d, --detach | Detatch process from Command Prompt or PowerShell |

### Example Run Command

```docker
docker run -d --name cesium -v C:\Users\<UserName>\Documents\docker\redesigned-carnival:/app/Data --publish 8080:8080 cesium
```

## Testing

Now that the container is running it can be tested by going to the Cesium front end

Go to: http://localhost:8080
> This will display the Cesium frontend with custom data being integrated and displayed
