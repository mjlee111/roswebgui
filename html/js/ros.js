var image1_topic, image2_topic, image3_topic, image4_topic, image_main_topic;
var raw_data_topic;

var ros = null;

var robot_init = false;
var manipulator_init = false;

let controllerData = [];

let requestPublisher;
let controllerPublisher;
let cmdVelSubscriber;
let rokaStatusSubscriber;
let northStatusSubscriber;

let boolArray = [false, false, false, false, false, false, false, false];

const joyDeadZone = 0.09

function init2() {
    let robot_connect_button = document.getElementById('robot_connect_button');
    robot_connect_button.addEventListener('click', connect);
}

function connect() {
    if (ros) {
        ros.close();
        ros = null;
        const robot_connection_output = document.getElementById('connection_output');
        robot_connection_output.textContent = `Disconnected`;
        robot_connect_button.style = "height: 90%; background-color: rgb(255, 127, 127)";
    } else {
        init_ros();
    }
}

function init_ros() {
    const robot_address = document.getElementById('robot_address');
    const robot_port = document.getElementById('robot_port');
    const robot_connection_output = document.getElementById('connection_output');

    var address = robot_address.value;
    var port = robot_port.value;

    console.log("Robot HostServer or IP: " + address);
    console.log("Port: " + port);
    const url = `ws://${address}:${port}`;

    console.log("ROS initialization.");
    ros = new ROSLIB.Ros({
        url: url
    });

    robot_connection_output.textContent = `Connecting to ${url}...`;

    ros.on('connection', function() {
        console.log('Connected to ROS websocket server.');
        robot_connection_output.textContent = `Connected to ${url}`;
        robot_connect_button.style.backgroundColor = "rgb(55, 163, 64)";

        var statusPublisher = new ROSLIB.Topic({
            ros: ros,
            name: '/webgui/status',
            messageType: 'std_msgs/Bool'
        });

        setInterval(function() {
            var message = new ROSLIB.Message({
                data: true
            });
            statusPublisher.publish(message);
        }, 1000);

        initializeRosComponents();
        subscribeArmyStatusTopics();
    });

    ros.on('error', function(error) {
        console.log('Error connecting to ROS websocket server: ', error);
        robot_connection_output.textContent = `Error connecting to ROS websocket server: ${error}`;
        robot_connect_button.style = "height: 90%; background-color: rgb(255, 127, 127);";
    });

    ros.on('close', function() {
        console.log('Connection to ROS websocket server closed.');
    });

    requestPublisher = new ROSLIB.Topic({
        ros: ros,
        name: '/webgui/request',
        messageType: 'std_msgs/String'
    });

    controllerPublisher = new ROSLIB.Topic({
        ros: ros,
        name: '/joy',
        messageType: 'sensor_msgs/Joy'
    });

    cmdVelSubscriber = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    });

    cmdVelSubscriber.subscribe(function(message) {
        document.getElementById('linear_x').innerHTML = message.linear.x;
        document.getElementById('linear_y').innerHTML = message.linear.y;
        document.getElementById('linear_z').innerHTML = message.linear.z;
        document.getElementById('angular_x').innerHTML = message.angular.x;
        document.getElementById('angular_y').innerHTML = message.angular.y;
        document.getElementById('angular_z').innerHTML = message.angular.z;
    });
}

function initializeRosComponents() {
    document.getElementById('button_circuit').addEventListener('click', initializeRobot);
    document.getElementById('button_manipulator').addEventListener('click', initializeManipulator);

    addEventListenerToElement('image_main_topic_selector', 'click', () => listImageTopics('image_main_topic_selector'));
    addEventListenerToElement('image_main_topic_selector', 'click', () => subscribeImage('image_main_topic_selector', 'image_main_topic', 'image_main_viewer', image_main_topic));

    addEventListenerToElement('image1_topic_selector', 'click', () => listImageTopics('image1_topic_selector'));
    addEventListenerToElement('image1_topic_selector', 'click', () => subscribeImage('image1_topic_selector', 'image1_topic', 'image1_viewer', image1_topic));

    addEventListenerToElement('image2_topic_selector', 'click', () => listImageTopics('image2_topic_selector'));
    addEventListenerToElement('image2_topic_selector', 'click', () => subscribeImage('image2_topic_selector', 'image2_topic', 'image2_viewer', image2_topic));

    addEventListenerToElement('image3_topic_selector', 'click', () => listImageTopics('image3_topic_selector'));
    addEventListenerToElement('image3_topic_selector', 'click', () => subscribeImage('image3_topic_selector', 'image3_topic', 'image3_viewer', image3_topic));

    addEventListenerToElement('image4_topic_selector', 'click', () => listImageTopics('image4_topic_selector'));
    addEventListenerToElement('image4_topic_selector', 'click', () => subscribeImage('image4_topic_selector', 'image4_topic', 'image4_viewer', image4_topic));
}

function subscribeArmyStatusTopics() {
    rokaStatusSubscriber = new ROSLIB.Topic({
        ros: ros,
        name: '/army_status/roka',
        messageType: 'std_msgs/Bool'
    });

    northStatusSubscriber = new ROSLIB.Topic({
        ros: ros,
        name: '/army_status/north',
        messageType: 'std_msgs/Bool'
    });

    rokaStatusSubscriber.subscribe(function(message) {
        updateLabelBackground('ROKA', message.data);
    });

    northStatusSubscriber.subscribe(function(message) {
        updateLabelBackground('NORTH', message.data);
    });
}

function updateLabelBackground(labelId, status) {
    var label = document.getElementById(labelId);
    if (status) {
        if (labelId === 'ROKA') {
            label.style.backgroundColor = 'green';
        } else if (labelId === 'NORTH') {
            label.style.backgroundColor = 'red';
        }
    } else {
        label.style.backgroundColor = '';
    }
}

function listRosTopics(documentId) {
    var service = new ROSLIB.Service({
        ros: ros,
        name: '/rosapi/topics',
        serviceType: 'rosapi/Topics'
    });

    service.callService(new ROSLIB.ServiceRequest(), function(result) {
        var selector = document.getElementById(documentId);
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
        result.topics.forEach(function(topic) {
            var option = document.createElement('option');
            option.value = topic;
            option.text = topic;
            selector.appendChild(option);
        });
    });
}

function initializeRobot() {
    var button = document.getElementById('button_circuit');

    if (robot_init) {
        robot_init = false;
        button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(255, 127, 127);';
        button.innerHTML = 'START CIRCUIT';
        var message = new ROSLIB.Message({
            data: "STOP CIRCUIT"
        });
        requestPublisher.publish(message);
    } else {
        robot_init = true;
        button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(55, 163, 64);';
        button.innerHTML = 'STOP CIRCUIT';
        var message = new ROSLIB.Message({
            data: "START CIRCUIT"
        });
        requestPublisher.publish(message);
    }
}

function initializeManipulator() {
    var button = document.getElementById('button_manipulator');

    if (manipulator_init) {
        manipulator_init = false;
        button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(255, 127, 127);';
        button.innerHTML = 'START MANIPULATOR';
        var message = new ROSLIB.Message({
            data: "STOP MANIPULATOR"
        });
        requestPublisher.publish(message);
    } else {
        manipulator_init = true;
        button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(55, 163, 64);';
        button.innerHTML = 'STOP MANIPULATOR';
        var message = new ROSLIB.Message({
            data: "START MANIPULATOR"
        });
        requestPublisher.publish(message);
    }
}

function listImageTopics(documentId) {
    var service = new ROSLIB.Service({
        ros: ros,
        name: '/rosapi/topics_for_type',
        serviceType: 'rosapi/TopicsForType'
    });

    var request = new ROSLIB.ServiceRequest({
        type: 'sensor_msgs/CompressedImage'
    });

    service.callService(request, function(result) {
        var selector = document.getElementById(documentId);
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
        result.topics.forEach(function(topic) {
            var option = document.createElement('option');
            option.value = topic;
            option.text = topic;
            selector.appendChild(option);
        });
    });
}

function handleImage(documentId, message) {
    var img = document.getElementById(documentId);
    var base64String = "data:image/jpeg;base64," + message.data;
    img.src = base64String;
}

function subscribeImage(selectorId, outputId, imageId, topic) {
    if (topic) {
        topic.unsubscribe();
    }

    var selectElement = document.getElementById(selectorId);
    var topicName = selectElement.options[selectElement.selectedIndex].text;
    selectElement.options[0].text = topicName;
    document.getElementById(outputId).textContent = topicName;

    topic = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: 'sensor_msgs/CompressedImage'
    });

    topic.subscribe(function(message) {
        handleImage(imageId, message);
    });
}

function addEventListenerToElement(documentId, eventType, functionEvent) {
    document.getElementById(documentId).addEventListener(eventType, function() {
        functionEvent(documentId);
    });
}

function handleClick(buttonId) {
    const index = parseInt(buttonId) - 1;

    let currentValue = boolArray[index];
    let newValue = !currentValue;

    boolArray[index] = newValue;

    const topicName = `/buttons/${buttonId}`;
    
    const buttonTopic = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: 'std_msgs/Bool'
    });

    const message = new ROSLIB.Message({
        data: newValue
    });

    buttonTopic.publish(message);

    console.log(`Published to ${topicName} with data: ${newValue}`);
}

function updateButtonBackground(buttonId, status) {
    boolArray[buttonId-1] = status
    const button = document.getElementById(buttonId);
    if (status) {
        button.style.backgroundColor = 'green'; // true -> 초록색
    } else {
        button.style.backgroundColor = 'red'; // false -> 빨간색
    }
}

function subscribeToButtonTopics() {
    for (let i = 1; i <= 8; i++) {
        const topicName = `/buttons/${i}`;
        
        const buttonTopic = new ROSLIB.Topic({
            ros: ros,
            name: topicName,
            messageType: 'std_msgs/Bool'
        });

        buttonTopic.subscribe(function(message) {
            updateButtonBackground(i.toString(), message.data);
        });
    }
}



// function publishControllerData(axesData, buttonsData) {
//     if (controllerPublisher) {
//         var axesArray = axesData.map(axis => parseFloat(axis));
//         var buttonsArray = buttonsData.map(button => button.pressed ? 1 : 0);

//         var joyMessage = new ROSLIB.Message({
//             axes: axesArray,
//             buttons: buttonsArray
//         });
//         controllerPublisher.publish(joyMessage);
//     } else {
//         console.error('controllerPublisher is undefined');
//     }
// }

// function updateControllerInfo() {
//     const gamepads = navigator.getGamepads();

//     for (let i = 0; i < gamepads.length; i++) {
//         const gamepad = gamepads[i];
//         if (gamepad) {
//             let buttonsData = [];
//             let axesData = [];

//             for (let j = 0; j < gamepad.buttons.length; j++) {
//                 const button = gamepad.buttons[j];
//                 buttonsData.push({
//                     index: j,
//                     pressed: button.pressed
//                 });
//             }

//             for (let k = 0; k < gamepad.axes.length; k++) {
//                 let value = parseFloat(gamepad.axes[k].toFixed(2));
//                 if (Math.abs(value) < joyDeadZone && Math.abs(value) > -joyDeadZone) {
//                     value = 0.00;
//                 }
//                 axesData.push(value);
//             }

//             controllerData.push({
//                 controllerIndex: i,
//                 buttons: buttonsData,
//                 axes: axesData
//             });

//             // Only publish if controllerPublisher is defined
//             if (controllerPublisher) {
//                 publishControllerData(axesData, buttonsData);
//             }

//         }
//     }
// }

// function gameLoop() {
//     updateControllerInfo();
//     requestAnimationFrame(gameLoop);
// }

// gameLoop();

// window.addEventListener("gamepadconnected", (event) => {
//     const gamepad = event.gamepad;
//     const statusDiv = document.getElementById("controller-status");
//     statusDiv.textContent = `Controller connected: ${gamepad.id}`;

//     updateControllerInfo();
// });

// window.addEventListener("gamepaddisconnected", (event) => {
//     const statusDiv = document.getElementById("controller-status");
//     statusDiv.textContent = "No controller connected.";

//     const infoDiv = document.getElementById("controller-info");
//     infoDiv.innerHTML = '';
// });
