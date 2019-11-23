// https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API/Using_VR_controllers_with_WebVR

// TODO: reproduce this for WebXR API as well

function detectControllers() {
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
        // var listItem = document.createElement('li')
        // listItem.innerHTML =
        //   '<strong>Display ' +
        //   (i + 1) +
        //   '</strong>' +
        //   '<br>VR Display ID: ' +
        //   displays[i].displayId +
        //   '<br>VR Display Name: ' +
        //   displays[i].displayName +
        //   '<br>Display can present content: ' +
        //   cap.canPresent +
        //   "<br>Display is separate from the computer's main display: " +
        //   cap.hasExternalDisplay +
        //   '<br>Display can return position info: ' +
        //   cap.hasPosition +
        //   '<br>Display can return orientation info: ' +
        //   cap.hasOrientation +
        //   '<br>Display max layers: ' +
        //   cap.maxLayers
        // console.log(listItem)
        console.log('displays[i].displayName', displays[i].displayName)
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
        // var listItem = document.createElement('li')
        // listItem.classList = 'gamepad'
        // listItem.innerHTML =
        //   '<strong>Gamepad ' +
        //   gp.index +
        //   '</strong> (' +
        //   gp.id +
        //   ')' +
        //   '<br>Associated with VR Display ID: ' +
        //   gp.displayId +
        //   '<br>Gamepad associated with which hand: ' +
        //   gp.hand +
        //   '<br>Available haptic actuators: ' +
        //   gp.hapticActuators.length +
        //   '<br>Gamepad can return position info: ' +
        //   gp.pose.hasPosition +
        //   '<br>Gamepad can return orientation info: ' +
        //   gp.pose.hasOrientation
        // console.log(listItem)
        console.log('gp.id', gp.id)
        updateControllerHelpText(gp.id)
      }
    }
    initialRun = false
  }

  function updateControllerHelpText(id) {
    const grabButton = {
      left: 'Grip',
      right: 'Grip',
    }
    const teleportButton = {
      left: '',
      right: '',
    }
    switch (id) {
      // Vive Wand Controllers
      case 'OpenVR Gamepad':
        teleportButton.left = 'Trackpad'
        teleportButton.right = 'Trackpad'
        break
      // This doesn't seem to be working
      case 'Oculus Touch (Left)':
        teleportButton.left = 'X'
        break
      // This doesn't seem to be working
      case 'Oculus Touch (Right)':
        teleportButton.right = 'A'
        break
      // will use the Oculus Touch controllers
      // as the default case for now
      default:
        teleportButton.left = 'X'
        teleportButton.right = 'A'
    }

    const helpText = {
      left: `\n${grabButton.left}: Grab object\n${teleportButton.left}: Teleport`,
      right: `\n${grabButton.right}: Grab object\n${teleportButton.right}: Teleport`,
    }

    d3.select('#ctlLText').remove()
    d3.select('#ctlL')
      .append('a-text')
      .attr('value', helpText.left)
      .attr('id', 'ctlRtext')
      .attr('position', '0 0.05 0')
      .attr('rotation', '-90 0 0')
      .attr('scale', '0.1 0.1 0.1')
      .attr('align', 'center')
      .attr('color', '#FFFFFF')

    d3.select('#ctlRText').remove()
    d3.select('#ctlR')
      .append('a-text')
      .attr('value', helpText.right)
      .attr('id', 'ctlRtext')
      .attr('position', '0 0.05 0')
      .attr('rotation', '-90 0 0')
      .attr('scale', '0.1 0.1 0.1')
      .attr('align', 'center')
      .attr('color', '#FFFFFF')
  }
}
