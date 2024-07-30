thisHostName = document.location.hostname;

function init_ros() {
    console.log("ROS initialization.");
    // Initialize ROS connections, subscribers, etc.
    var ros = new ROSLIB.Ros({
        url: 'ws://localhost:9090'
    });

    ros.on('connection', function() {
        console.log('Connected to ROS websocket server.');
    });

    ros.on('error', function(error) {
        console.log('Error connecting to ROS websocket server: ', error);
    });

    ros.on('close', function() {
        console.log('Connection to ROS websocket server closed.');
    });
}

function listImageTopics(documentId) {
    ros.getTopicsForType('sensor_msgs/Image', function(topics) {
        var selector = document.getElementById(documentId);
        selector.innerHTML = '<option value="">Select Image main Topic</option>';
        topics.forEach(function(topic) {
            var option = document.createElement('option');
            option.value = topic;
            option.text = topic;
            selector.appendChild(option);
        });
    });
}

function subscribeToImageTopic(selector, viewer, topic_) {
    var topicName = document.getElementById(selector).value;

    if (topic_) {
        topic_.unsubscribe();
    }

    if (topicName) {
        topic_ = new ROSLIB.Topic({
            ros: ros,
            name: topicName,
            messageType: 'sensor_msgs/Image'
        });

        topic_.subscribe(function(message) {
            var imageElement = document.getElementById(viewer);
            imageElement.src = 'data:image/jpeg;base64,' + message.data;
        });
    }
}
