# redesigned-carnival
Cesium Demo Example

### Example build command ### 

> Make sure to CD into container directory before build command

```docker 
docker build --tag node-cesium .
```
## Run the container ##

to run the containers

| **Flag** | **Value** |
| :----- | :----- |
| -p, --publish | <localport>:8080 |
| --name | desired container name |
| -v, --volume | <LocalFileLocation>/tleViewer-docker/Data_Folder:app/Data  |
| -d, --detach | Detatch process from Command Prompt or PowerShell |

### Example Run Command ###

```docker 
docker run -d --name cesium -v C:\Users\<UserName>\Documents\docker\redesigned-carnival:/app/Data --publish 8080:8080 node-cesium
```

## Testing ## 

Now that the container is running it can be tested by going to the Cesium front end

Go to: http://localhost:8080
> This will display the Cesium frontend with propagated TLE Data
