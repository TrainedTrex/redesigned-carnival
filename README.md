# redesigned-carnival

Cesium Demo Example

## Description

Example cesium build that can be shipped out and serves as a small sample of the capabilites of Cesium and CesiumJS. 

Capabilities:

- [x] Cesium Viewer
- [ ] Ion globe layers
- [ ] Ion 3D tile integration (toggleable)
- [x] ADSB Exchange data integration
- [ ] TBD

Additional:

- [ ] Multiple ADSB distance options
- [ ] Cesium Ion API integration through webpage

## Usecase

Cesium deployed as a container that can either be stand alone or a front end for a backend service in the future.

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
> This will display the Cesium frontend with propagated TLE Data
