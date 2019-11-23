// https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API/Using_VR_controllers_with_WebVR

// TODO: reproduce this for WebXR API as well

var initialRun = true

if (navigator.getVRDisplays && navigator.getGamepads) {
  console.log('WebVR API and Gamepad API supported.')
  reportDisplays()
} else {
  console.log('WebVR API and/or Gamepad API not supported by this browser.')
}

function reportDisplays() {
  navigator.getVRDisplays().then(function(displays) {
    console.log(displays.length + ' displays')
    for (var i = 0; i < displays.length; i++) {
      var cap = displays[i].capabilities
      // cap is a VRDisplayCapabilities object
      var listItem = document.createElement('li')
      listItem.innerHTML =
        '<strong>Display ' +
        (i + 1) +
        '</strong>' +
        '<br>VR Display ID: ' +
        displays[i].displayId +
        '<br>VR Display Name: ' +
        displays[i].displayName +
        '<br>Display can present content: ' +
        cap.canPresent +
        "<br>Display is separate from the computer's main display: " +
        cap.hasExternalDisplay +
        '<br>Display can return position info: ' +
        cap.hasPosition +
        '<br>Display can return orientation info: ' +
        cap.hasOrientation +
        '<br>Display max layers: ' +
        cap.maxLayers
      list.appendChild(listItem)
    }

    setTimeout(reportGamepads, 1000)
    // For VR, controllers will only be active after their corresponding headset is active
  })
}

function reportGamepads() {
  var gamepads = navigator.getGamepads()
  console.log(gamepads.length + ' controllers')
  for (var i = 0; i < gamepads.length; ++i) {
    var gp = gamepads[i]
    if (gp) {
      var listItem = document.createElement('li')
      listItem.classList = 'gamepad'
      listItem.innerHTML =
        '<strong>Gamepad ' +
        gp.index +
        '</strong> (' +
        gp.id +
        ')' +
        '<br>Associated with VR Display ID: ' +
        gp.displayId +
        '<br>Gamepad associated with which hand: ' +
        gp.hand +
        '<br>Available haptic actuators: ' +
        gp.hapticActuators.length +
        '<br>Gamepad can return position info: ' +
        gp.pose.hasPosition +
        '<br>Gamepad can return orientation info: ' +
        gp.pose.hasOrientation
      list.appendChild(listItem)
    }
  }
  initialRun = false
}
