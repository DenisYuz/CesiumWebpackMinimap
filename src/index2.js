import {
    Cesium3DTileset, createWorldTerrain, IonResource, Ion, Viewer, SceneMode, createOsmBuildings,
    Cartesian2, Cartesian3, Camera, ClockViewModel, defined, Rectangle, StripeMaterialProperty, Color,
    Math as CesiumMath,
    VerticalOrigin,
    PinBuilder,
    Transforms,
    Model,
    KmlDataSource,
    HeadingPitchRoll,
    Cesium3DTileStyle
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";


// Grant CesiumJS access to your ion assets
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MWUxZjEwZC00N2I3LTQ1ZGYtODhkNS1lNTMwNDVmNjFkYmEiLCJpZCI6MzUyNjIsImlhdCI6MTYwMTYzMzgwOH0.iV1EZEmaCQzAkU5zRgnJW5frbjrQW1s4zlX2ZB0xKVA";

var viewer = new Viewer("view3D", {
    terrainProvider: createWorldTerrain(),
});

var promise = IonResource.fromAssetId(248163)
    .then(function (resource) {
        var entity = viewer.entities.add({
            position: Cartesian3.fromDegrees(34.534153964422254, 31.163343136472803, 190.0),
            model: {
                uri: resource,
            },
        });
        viewer.trackedEntity = entity;
    })
    .otherwise(function (error) {
        console.log(error);
    });

promise = IonResource.fromAssetId(286874)
    .then(function (resource) {
        var entity2 = viewer.entities.add({
            position: Cartesian3.fromDegrees(34.5333166830521, 31.162330802652704, 190),
            model: {
                uri: resource,
            },
        });
        viewer.trackedEntity = entity2;
    })
    .otherwise(function (error) {
        console.log(error);
    });

viewer.scene.primitives.add(createOsmBuildings());

viewer.scene.camera.flyTo({
    destination: Cartesian3.fromDegrees(34.5333166830521, 31.162330802652704, 400),
    orientation: {
        heading: Math.toRadians(20),
        pitch: Math.toRadians(-20),
    },
}); 