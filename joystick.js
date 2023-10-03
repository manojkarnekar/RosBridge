// Initialize ROS
const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090', // ROS Bridge URL
  });
  
  ros.on('connection', () => {
    console.log('Connected to ROS.');
  });
  
  ros.on('error', (error) => {
    console.error('Error connecting to ROS:', error);
  });
  
  ros.on('close', () => {
    console.log('Disconnected from ROS.');
  });
  
  // Create a publisher for the cmd_vel topic
  const cmdVelPublisher = new ROSLIB.Topic({
    ros: ros,
    name: '/cmd_vel',
    messageType: 'geometry_msgs/Twist',
  });
  
  // Initialize joystick elements
  const joystickContainer = document.getElementById('joystickContainer');
  const joystickKnob = document.getElementById('joystickKnob');
  
  // Initialize joystick parameters
  const joystickRadius = joystickContainer.offsetWidth / 2;
  let isDragging = false;
  
  // Initialize velocity values
  let linearVel = 0.0;
  let angularVel = 0.0;
  
  // Add event listeners for joystick interaction
  joystickKnob.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  function startDrag(e) {
    isDragging = true;
    joystickKnob.style.transition = 'none';
  }
  
  function drag(e) {
    if (isDragging) {
      const rect = joystickContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - joystickRadius;
      const y = e.clientY - rect.top - joystickRadius;
      
      // Calculate normalized joystick values (-1 to 1)
      const magnitude = Math.min(Math.sqrt(x * x + y * y), joystickRadius);
      const angle = Math.atan2(y, x);
      
      const normalizedX = magnitude / joystickRadius * Math.cos(angle);
      const normalizedY = magnitude / joystickRadius * Math.sin(angle);
  
      // Update knob position
      joystickKnob.style.transform = `translate(${normalizedX * joystickRadius}px, ${normalizedY * joystickRadius}px)`;
  
      // Calculate velocity values based on joystick position
      linearVel = -normalizedY; // Invert Y-axis for ROS convention
      angularVel = -normalizedX; // Invert X-axis for ROS convention
    }
  }
  
  function endDrag() {
    isDragging = false;
    joystickKnob.style.transition = '0.3s ease-out';
  
    // Reset knob position to the center
    joystickKnob.style.transform = 'translate(0, 0)';
  
    // Stop the robot (set velocities to 0) when the joystick is released
    linearVel = 0.0;
    angularVel = 0.0;
  }
  
  // Publish velocity commands to ROS
  function publishVelocity() {
    const twist = new ROSLIB.Message({
      linear: {
        x: linearVel,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: angularVel,
      },
    });
  
    cmdVelPublisher.publish(twist);
  }
  
  // Periodically publish velocity commands (adjust the frequency as needed)
  setInterval(publishVelocity, 100);
  
  