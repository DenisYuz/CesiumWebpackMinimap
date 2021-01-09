import {
    Cesium3DTileset, createWorldTerrain, IonResource, Ion, Viewer, SceneMode,
    Cartesian2, Cartesian3, Camera, ClockViewModel, defined, Rectangle, StripeMaterialProperty, Color,
    Math as CesiumMath,
    VerticalOrigin,
    PinBuilder,
    Transforms,
    Model,
    KmlDataSource,
    HeadingPitchRoll
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
