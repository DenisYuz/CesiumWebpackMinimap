
import {
    Cesium3DTileset, createWorldTerrain, IonResource, Viewer, SceneMode,
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

// This is simplified version of Cesium's Getting Started tutorial.
// See https://cesium.com/docs/tutorials/getting-started/ for more details.

// We want our two views to be synced across time, so we create
// a shared clock object that both views share
var clockViewModel = new ClockViewModel();

var options2D = {
    homeButton: false,
    fullscreenButton: false,
    sceneModePicker: false,
    clockViewModel: clockViewModel,
    infoBox: false,
    geocoder: false,
    sceneMode: SceneMode.SCENE2D,
    navigationHelpButton: false,
    animation: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity
};

var options3D = {
    fullscreenButton: false,
    sceneModePicker: false,
    clockViewModel: clockViewModel,
    terrainProvider: createWorldTerrain(),
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity
};

// We create two viewers, a 2D and a 3D one
// The CSS is set up to place them side by side
let view3D = new Viewer("view3D", options3D);
let view2D = new Viewer("view2D", options2D);
let toolbar = document.getElementById('toolbar');
const ellipsoid = view3D.scene.globe.ellipsoid;
window.ellipsoid = ellipsoid;
view3D.scene.skyBox.show = false;
view2D.scene.skyBox.show = false;

var viewRectangle3D = new Rectangle();
var viewCenter;
var newCenterPosition;



var centerPosition;
var distance;
window.view3D = view3D;
window.view2D = view2D;

var scene = view3D.scene;
var modelMatrix = Transforms.eastNorthUpToFixedFrame(
    Cartesian3.fromDegrees(34.53415396442325, 31.1633431264729, 0.0));

var model = scene.primitives.add(Model.fromGltf({
    url: './Assets/GroundVehicle.glb',
    modelMatrix: modelMatrix,
    scale: 20000.0
}));
//view3D.zoomTo(drone_tileset);

// view3D.dataSources.add(KmlDataSource
//     .load('./Assets/kml/building1/building1.kml', {
//         camera: view3D.camera,
//         canvas: view3D.canvas
//     })
// )
//     .then(function (dataSource) {
//         // view3D.flyTo(dataSource.entities._entyties._array[0]);
//         // view3D.zoomTo(dataSource.entities._entyties._array[0])
//     });


var origin = Cartesian3.fromDegrees(34.53415396442325, 31.1633431264729, 0.0);
modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);
var model_building = scene.primitives.add(Model.fromGltf({
    url: './Assets/building1.glb',
    modelMatrix: modelMatrix,
    minimumPixelSize: 128,
    maximumScale: 20
}));

view3D.entities.removeAll();

var position = Cartesian3.fromDegrees(34.53415396442325, 31.1633431264729, 100.0);
var heading = CesiumMath.toRadians(135);
var pitch = 0;
var roll = 0;
var hpr = new HeadingPitchRoll(heading, pitch, roll);
var orientation = Transforms.headingPitchRollQuaternion(position, hpr);


var entity = view3D.entities.add({
    name: './Assets/building1.glb',
    position: position,
    orientation: orientation,
    model: {
        uri: './Assets/building1.glb',
        minimumPixelSize: 1,
        maximumScale: 2000000000
    }
});
view3D.trackedEntity = entity;
view3D.flyTo(entity);


// A normal b3dm tileset of photogrammetry
let tileset = new Cesium3DTileset({
    url: IonResource.fromAssetId(40866),
});
view3D.scene.primitives.add(tileset);
//view3D.zoomTo(tileset);

view3D.entities.add({
    position: Cartesian3.fromDegrees(35, 32, 0.0),
    model: {
        uri: './Assets/building1.glb'
    }
})


// Apply our sync function every time the 3D camera view changes
view3D.camera.changed.addEventListener(sync2DView);
// By default, the `camera.changed` event will trigger when the camera has changed by 50%
// To make it more sensitive, we can bring down this sensitivity
view3D.camera.percentageChanged = 0.01;

// Since the 2D view follows the 3D view, we disable any
// camera movement on the 2D view
view2D.scene.screenSpaceCameraController.enableRotate = false;
view2D.scene.screenSpaceCameraController.enableTranslate = false;
view2D.scene.screenSpaceCameraController.enableZoom = false;
view2D.scene.screenSpaceCameraController.enableTilt = false;
view2D.scene.screenSpaceCameraController.enableLook = false;





function sync2DView() {
    // The center of the view is the point that the 3D camera is focusing on
    viewCenter = new Cartesian2(
        Math.floor(view3D.canvas.clientWidth / 2),
        Math.floor(view3D.canvas.clientHeight * 2 / 3)
    );
    // Given the pixel in the center, get the world position
    newCenterPosition = view3D.scene.camera.pickEllipsoid(viewCenter);
    window.newCenterPosition = newCenterPosition;
    if (defined(newCenterPosition)) {
        // Guard against the case where the center of the screen
        // does not fall on a position on the globe
        centerPosition = newCenterPosition;
    }
    // Get the distance between the world position of the point the camera is focusing on, and the camera's world position
    distance = Cartesian3.distance(
        centerPosition,
        view3D.scene.camera.positionWC
    );
    // Tell the 2D camera to look at the point of focus. The distance controls how zoomed in the 2D view is
    // (try replacing `distance` in the line below with `1e7`. The view will still sync, but will have a constant zoom)
    view2D.scene.camera.lookAt(
        centerPosition,
        new Cartesian3(0.0, 0.0, distance * 10)
    );


    let rect = view3D.camera.computeViewRectangle(ellipsoid, viewRectangle3D);

    view2D.entities.removeAll();

    view2D.entities.add({
        rectangle: {
            coordinates: viewRectangle3D,
            material: Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Color.BLACK,
            outlineWidth: 2.0,
            minimumPixelSize: 128
        }
    })

    view2D.entities.add({
        name: "Center of the map",
        position: centerPosition,
        billboard: {
            image: new PinBuilder().fromColor(Color.YELLOW, 48).toDataURL(),
            verticalOrigin: VerticalOrigin.BOTTOM,
        },
    });

    // toolbar.innerHTML = '<pre>' +
    //     'West: ' + CesiumMath.toDegrees(rect.west).toFixed(4) + '<br/>' +
    //     'South: ' + CesiumMath.toDegrees(rect.south).toFixed(4) + '<br/>' +
    //     'East: ' + CesiumMath.toDegrees(rect.east).toFixed(4) + '<br/>' +
    //     'North: ' + CesiumMath.toDegrees(rect.north).toFixed(4) + '</pre>';
}


// setInterval(() => {
//     view3d.scene.requestRender();
// }, 1000);

// var extent = Rectangle.fromDegrees(-100, 20, -90, 30);
// Camera.DEFAULT_VIEW_RECTANGLE = extent;
// Camera.DEFAULT_VIEW_FACTOR = 0;


window.setCameraView = function ({ x, y, z, headingAngle, pitchAngle, rollAngle }) {
    view3D.camera.setView({
        destination: new Cartesian3(x, y, z),
        orientation: {
            heading: headingAngle,
            pitch: pitchAngle,
            roll: rollAngle
        }
    })
}







