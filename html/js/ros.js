var image1_topic, image2_topic, image3_topic, image4_topic, image_main_topic;
var raw_data_topic;

var ros = null;

var robot_init = false;
var manipulator_init = false;

function init2() {
    let robot_connect_button = document.getElementById('robot_connect_button');
    robot_connect_button.addEventListener('click', connect);
}

function connect() {
    if(ros)
    {
        ros.close();
        ros = null; 
        const robot_connection_output = document.getElementById('connection_output');
        robot_connection_output.textContent = `Disconnected`;
        robot_connect_button.style = "height: 90%; background-color: rgb(255, 127, 127)";
    }
    else
    {
        init_ros();
    }
}

function init_ros() {
    // ROS Initialize
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
        robot_connection_output.textContent =  `Connected to ${url}`;
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

        document.getElementById('button_circuit').addEventListener('click', initializeRobot);
        document.getElementById('button_manipulator').addEventListener('click', initializeManipulator);

        addEventListenerToElement('image_main_topic_selector', 'click', () => listImageTopics('image_main_topic_selector'));
        addEventListenerToElement('image_main_topic_selector', 'click', () => subscribeImage('image_main_topic_selector', 'image_main_topic', 'image_main_viewer', image_main_topic))

        addEventListenerToElement('image1_topic_selector', 'click', () => listImageTopics('image1_topic_selector'));
        addEventListenerToElement('image1_topic_selector', 'click', () => subscribeImage('image1_topic_selector', 'image1_topic', 'image1_viewer', image1_topic));
        
        addEventListenerToElement('image2_topic_selector', 'click', () => listImageTopics('image2_topic_selector'));
        addEventListenerToElement('image2_topic_selector', 'click', () => subscribeImage('image2_topic_selector', 'image2_topic', 'image2_viewer', image2_topic));

        addEventListenerToElement('image3_topic_selector', 'click', () => listImageTopics('image3_topic_selector'));
        addEventListenerToElement('image3_topic_selector', 'click', () => subscribeImage('image3_topic_selector', 'image3_topic', 'image3_viewer', image3_topic));

        addEventListenerToElement('image4_topic_selector', 'click', () => listImageTopics('image4_topic_selector'));
        addEventListenerToElement('image4_topic_selector', 'click', () => subscribeImage('image4_topic_selector', 'image4_topic', 'image4_viewer', image4_topic));
    });

    ros.on('error', function(error) {
        console.log('Error connecting to ROS websocket server: ', error);
        robot_connection_output.textContent =  `Error connecting to ROS websocket server: ${error}`;
        robot_connect_button.style = "height: 90%; background-color: rgb(255, 127, 127);"
    });

    ros.on('close', function() {
        console.log('Connection to ROS websocket server closed.');
    });

    // ROS Subscribers & Publishers
    const requestPublisher = new ROSLIB.Topic({
        ros: ros,
        name: '/webgui/request',
        messageType: 'std_msgs/String'
    });

    const cmdVelSubscriber = new ROSLIB.Topic({
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
    })

    // Other ROS functions
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

        if(robot_init) 
        {
            robot_init = false;
            button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(255, 127, 127);';
            button.innerHTML = 'START CIRCUIT';
            var message = new ROSLIB.Message({
                data: "STOP CIRCUIT"
            });
            requestPublisher.publish(message);
        }

        else            
        {
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

        if(robot_init) 
        {
            robot_init = false;
            button.style = 'width: 90%; padding: 1%; margin-top: 2px; margin-bottom: 2px; background-color: rgb(255, 127, 127);';
            button.innerHTML = 'START MANIPULATOR';
            var message = new ROSLIB.Message({
                data: "STOP MANIPULATOR"
            });
            requestPublisher.publish(message);
        }

        else            
        {
            robot_init = true;
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
        if(topic) {
            topic.unsubscribe();
        }

        var selectElement = document.getElementById(selectorId);
        var topicName = selectElement.options[selectElement.selectedIndex].text;
        selectElement.options[0].text = topicName;
        document.getElementById(outputId).textContent = topicName;

        topic = new ROSLIB.Topic({
            ros : ros,
            name : topicName,
            messageType : 'sensor_msgs/CompressedImage'
        });

        topic.subscribe(function(message){
            handleImage(imageId, message);
        })
    }
}

function addEventListenerToElement(documentId, eventType, functionEvent) {
    document.getElementById(documentId).addEventListener(eventType, function() {
        functionEvent(documentId);
    });
}

