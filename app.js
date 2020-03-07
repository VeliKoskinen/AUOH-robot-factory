const axios = require('axios');
const mqtt = require('mqtt');

const main_loop = () => {
    setTimeout(() => {
        let start_time_stamp = new Date();

        axios.get('https://fanuc-robot-http-server.herokuapp.com/')
            .then((res) => {
                const time_stamp = new Date();
                const delta = time_stamp - start_time_stamp;
                start_time_stamp = time_stamp;
                const regexp = 'Joint   [1-6]: *(-?.*)';
                let joints = [];

                let matches = res.data.matchAll(regexp);
                let count = 0;
                for (const match of matches) {
                    count++;
                    if (count > 6) break;
                    const value = parseFloat(match[1]);
                    joints.push(value);
                }

                let data = {
                  time: time_stamp,
                  joints: joints
                };
                mqtt_client.publish('joints', JSON.stringify(data));
                mqtt_client.publish('joint1', JSON.stringify(joints[0]));
                mqtt_client.publish('joint2', JSON.stringify(joints[1]));
                mqtt_client.publish('joint3', JSON.stringify(joints[2]));
                mqtt_client.publish('joint4', JSON.stringify(joints[3]));
                mqtt_client.publish('joint5', JSON.stringify(joints[4]));
                mqtt_client.publish('joint6', JSON.stringify(joints[5]));
                console.log(start_time_stamp, joints, delta, 'ms');
                main_loop();
            });
    }, 10);
}

const mqtt_client = mqtt.connect('wss://auoh.herokuapp.com');
mqtt_client.on('connect', () => {
   console.log('connected to mqtt broker');
   main_loop();
});

/*const axios = require('axios');

const main_loop = () => {
  setTimeout(() => {
    let start_time_stamp = new Date();

axios.get('https://fanuc-robot-http-server.herokuapp.com/')
 .then((res) => {
 console.log(res); {
   
 }
 });
const regexp = '   Joint   ([1-6]):     (.....|....)';
let joints = [];
let matches = res.data.matchAll(regexp);
let count = 0;
for (const match of matches) {
count++;
if (count > 6) break;
const value = parseFloat(match[1]);
joints.push(value);
}
const main_loop = () => {
   setTimeout(() => {
    main_loop();
   }, 10);
    }
const time_stamp = new Date();
const delta = time_stamp - start_time_stamp;
*/