const OrbitalControls = ({ yawSpeed = 0.01, pitchSpeed = 0.01, zoomSpeed = 0.02, pinchThreshold = 150, minY = 0, maxY = 100 } = {}) => {
  return (entities, { touches }) => {
    const camera = entities.camera;
    const moves = touches.filter(x => x.type == "move");

    if (camera && moves.length > 1) {

      //-- Yaw and pitch rotation
      const { x, y, z } = camera.position;
      const finger1 = moves[0];
      const finger2 = moves[1];
      const locationX = (finger1.delta.locationX + finger2.delta.locationX) / 2
      const locationY = (finger1.delta.locationY + finger2.delta.locationY) / 2

      camera.position.x = x * Math.cos(-locationX * yawSpeed) + z * Math.sin(-locationX * yawSpeed);
      camera.position.z = z * Math.cos(-locationX * yawSpeed) - x * Math.sin(-locationX * yawSpeed);
      camera.position.y += locationY * pitchSpeed;

      //-- Apply constraints
      if (camera.position.y < minY)
        camera.position.y = minY;

      if (camera.position.y > maxY)
        camera.position.y = maxY;

      //-- Zooming (pinching)
      const f1Location = new THREE.Vector2(finger1.event.locationX, finger1.event.locationY);
      const f1PreviousLocation = f1Location.clone().sub(new THREE.Vector2(finger1.delta.locationX, finger1.delta.locationY));
      const f2Location = new THREE.Vector2(finger2.event.locationX, finger2.event.locationY);
      const f2PreviousLocation = f2Location.clone().sub(new THREE.Vector2(finger2.delta.locationX, finger2.delta.locationY));
      const currentDistance = f1Location.distanceTo(f2Location);
      const previousDistance = f1PreviousLocation.distanceTo(f2PreviousLocation);
  
      if (currentDistance > pinchThreshold) {
        const zoomFactor = currentDistance > previousDistance ? (1 - zoomSpeed) : (1 + zoomSpeed);

        camera.left *= zoomFactor
        camera.right *= zoomFactor
        camera.top *= zoomFactor
        camera.bottom *= zoomFactor
        camera.updateProjectionMatrix();
      }
    }
    
    return entities;
  }
}

export default OrbitalControls;