# Seesaw Physics Simulation

A realistic interactive seesaw simulation built with vanilla JavaScript, HTML5 Canvas, and CSS. Experience realistic physics with torque-based rotation, weight distribution, and smooth animations.

## Features

### Core Physics

- **Torque-based rotation** using the formula: `angle = max(-30°, min(30°, (rightTorque - leftTorque) / 10))`
- **Dynamic weight distribution** with balls of varying mass (1-10kg)
- **Realistic collision detection** with trajectory prediction to prevent pass-through
- **Smooth rotation animations** with momentum and damping

### Interactive Elements

- **Click-to-drop mechanics** - Click above the seesaw to drop weighted balls
- **Variable ball sizes** - Ball radius scales with weight for visual clarity
- **Real-time weight tracking** - Live display of total weight on each side
- **Tilt angle indicator** - Shows current seesaw angle with directional arrows
- **Activity logging** - Timestamped log of all ball drops with position data

### Technical Implementation

- **Consistent spawn bounds** - Prevents balls from falling through during rotation
- **Velocity capping** - Maintains stable physics at all frame rates
- **State persistence** - Automatic save/restore using localStorage
- **Optimized rendering** - Smooth 60fps animation with efficient collision detection

## Getting Started

### Prerequisites

- Modern web browser with HTML5 Canvas support
- No additional dependencies required

### Installation

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start dropping balls by clicking above the seesaw

### Usage

- **Drop balls**: Click anywhere above the seesaw plank
- **Strategic placement**: Position balls closer to edges for maximum torque effect
- **Monitor balance**: Watch the weight displays and tilt angle in real-time
- **Clear simulation**: Use the "Clear Balls" button to reset
- **View history**: Check the drop log for detailed activity tracking

## Project Structure

```
seesaw-simulation/
├── index.html          # Main HTML structure
├── scripts/
│   ├── main.js         # Core application logic and animation loop
│   ├── physics.js      # Physics calculations and collision detection
│   ├── seesaw.js       # Seesaw rendering with rotation support
│   └── utils.js        # Utility functions and state management
└── styles/
    ├── base.css        # Main stylesheet and layout
    ├── seesaw.css      # Seesaw-specific styling
    └── variables.css   # CSS custom properties
```

## Physics Model

The simulation implements a simplified but accurate physics model:

### Torque Calculation

Each ball contributes torque based on its weight and distance from the fulcrum:

```
torque = weight × distance_from_center
```

### Rotation Dynamics

The seesaw rotation angle is determined by the torque difference between sides:

```
target_angle = clamp((right_torque - left_torque) / 10, -30°, 30°)
```

### Collision System

- **Trajectory prediction**: Prevents high-velocity balls from passing through
- **Rotated surface collision**: Accounts for seesaw rotation in collision detection
- **Position correction**: Ensures balls rest precisely on the surface

## Performance Notes

The simulation is optimized for smooth performance:

- Efficient collision detection with early termination
- Velocity capping to prevent physics instability
- Optimized rendering pipeline with minimal canvas operations
- Memory management for long-running sessions
