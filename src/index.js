
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer, SceneMode, Cartesian2, Cartesian3, Camera, ClockViewModel, defined } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";

// This is simplified version of Cesium's Getting Started tutorial.
// See https://cesium.com/docs/tutorials/getting-started/ for more details.

// We want our two views to be synced across time, so we create
// a shared clock object that both views share
var clockViewModel = new ClockViewModel();

var options3D = {
    fullscreenButton: false,
    sceneModePicker: false,
    clockViewModel: clockViewModel,
};

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
};


// We create two viewers, a 2D and a 3D one
// The CSS is set up to place them side by side
var view3D = new Viewer("view3D", options3D);
var view2D = new Viewer("view2D", options2D);

var worldPosition;
var distance;

window.view3D = view3D;
window.view2D = view2D;

function sync2DView() {
    // The center of the view is the point that the 3D camera is focusing on
    var viewCenter = new Cartesian2(
        Math.floor(view3D.canvas.clientWidth / 2),
        Math.floor(view3D.canvas.clientHeight / 2)
    );
    // Given the pixel in the center, get the world position
    var newWorldPosition = view3D.scene.camera.pickEllipsoid(viewCenter);
    if (defined(newWorldPosition)) {
        // Guard against the case where the center of the screen
        // does not fall on a position on the globe
        worldPosition = newWorldPosition;
    }
    // Get the distance between the world position of the point the camera is focusing on, and the camera's world position
    distance = Cartesian3.distance(
        worldPosition,
        view3D.scene.camera.positionWC
    );
    // Tell the 2D camera to look at the point of focus. The distance controls how zoomed in the 2D view is
    // (try replacing `distance` in the line below with `1e7`. The view will still sync, but will have a constant zoom)
    view2D.scene.camera.lookAt(
        worldPosition,
        new Cartesian3(0.0, 0.0, distance * 7)
    );
}

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

