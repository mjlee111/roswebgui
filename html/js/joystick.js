let controllerData = [];

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
    const gamepads = navigator.getGamepads();
    
    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            let buttonsData = [];
            let axesData = [];
            
            for (let j = 0; j < gamepad.buttons.length; j++) {
                const button = gamepad.buttons[j];
                buttonsData.push({
                    index: j,
                    pressed: button.pressed
                });
            }

            for (let k = 0; k < gamepad.axes.length; k++) {
                axesData.push({
                    index: k,
                    value: gamepad.axes[k].toFixed(2)
                });
            }

            controllerData.push({
                controllerIndex: i,
                buttons: buttonsData,
                axes: axesData
            });

            const infoDiv = document.getElementById("controller-info");
            infoDiv.innerHTML = '';
            const controllerDiv = document.createElement("div");
            controllerDiv.classList.add("controller");

            const buttonsHTML = buttonsData.map(button => `Button ${button.index}: ${button.pressed ? 'Pressed' : 'Released'}`).join('<br>');
            const axesHTML = axesData.map(axis => `Axis ${axis.index}: ${axis.value}`).join('<br>');

            controllerDiv.innerHTML = `<h2>Controller ${i}</h2><div>${buttonsHTML}</div><div>${axesHTML}</div>`;
            infoDiv.appendChild(controllerDiv);
        }
    }
}

function gameLoop() {
    updateControllerInfo();
    requestAnimationFrame(gameLoop);
}

gameLoop();