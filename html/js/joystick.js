window.addEventListener("gamepadconnected", (event) => {
    const gamepad = event.gamepad;
    const statusDiv = document.getElementById("controller-status");
    statusDiv.textContent = `Controller connected: ${gamepad.id}`;

    updateControllerInfo();
});

window.addEventListener("gamepaddisconnected", (event) => {
    const statusDiv = document.getElementById("controller-status");
    statusDiv.textContent = "No controller connected.";

    const infoDiv = document.getElementById("controller-info");
    infoDiv.innerHTML = '';
});

function updateControllerInfo() {
    console.log("joy update");
    const gamepads = navigator.getGamepads();
    const infoDiv = document.getElementById("controller-info");
    infoDiv.innerHTML = '';

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            const controllerDiv = document.createElement("div");
            controllerDiv.classList.add("controller");

            const buttons = gamepad.buttons.map((button, index) => `Button ${index}: ${button.pressed ? 'Pressed' : 'Released'}`).join('<br>');
            const axes = gamepad.axes.map((axis, index) => `Axis ${index}: ${axis.toFixed(2)}`).join('<br>');

            controllerDiv.innerHTML = `<h2>Controller ${i}</h2><div>${buttons}</div><div>${axes}</div>`;
            infoDiv.appendChild(controllerDiv);
        }
    }
}

function gameLoop() {
    updateControllerInfo();
    requestAnimationFrame(gameLoop);
}

