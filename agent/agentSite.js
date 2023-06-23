//const { getQuery } = require('../get/api');
//const { load } = require('../get/load.js');
const { loggerAgent } = require('../logs/logs-utils');
const { writeError } = require('../logs/logs-utils.js');
//const moment = require('moment');
const amqplib = require('amqplib');
const axios = require("axios");
const fs = require('fs/promises');
const https = require("https");


/// run this to cron as agent/agent.js periodically event hour

async function list() {
  const configString = await fs.readFile('./agent/config_agentSite.json');
  const arr = JSON.parse(configString);
  console.log(arr);
  const arrPromises = [];

  arr.forEach(element => {
    arrPromises.push(check(element)) 
  });
  let res_promise = await Promise.all(arrPromises);
  console.log('res_promise',res_promise);

}

async function check(endpoint) {

    if (endpoint.protocol === 'rest') {
      return await checkRest(endpoint)
    }


    loggerAgent.info('agentSite - ending check');
 
}

async function checkRest (endpoint) {
  loggerAgent.info(`agentSite - starting checkRest: ${endpoint.app} ${endpoint.name} ${endpoint.protocol} ${endpoint.url} ${endpoint.method}'`);
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const configAxios = {
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        "Content-Type": "application/json",
        //'Host': String(uuidv4()),
        //"Connection": "keep-alive",
        //"Postman-Token": Date.now(),
        //"User-Agent": "PostmanRuntime/7.30.1",// need 2-nd token
        //Authorization: token,
      },
      httpsAgent: agent,
      timeout: 16000
    };
    const response = await axios(configAxios);
  
    if (response[endpoint.responce_error_path]) {
      if (response[endpoint.responce_error_path].length > 0) {
        await loggerAgent.error("inside_error_path " + endpoint.responce_error_path + " contains: " + response[endpoint.responce_error_path]);
        return false;
      }
    }
    const response_type = endpoint.response_type.split(',')
    if (response_type[0]==="arr") {
      if (Array.isArray(response[endpoint.responce_data_path])) {
        if (response_type[1].includes('size')) {

        }
        return true
      }
    }
    return false
      
  } catch (error) {
    loggerAgent.error('agentSite - ' + error.stack);
    console.log(error.stack);
    return false;
  }

}

async function sendToRabbit() {
    // const queue = 'transactions';
    // const conn = await amqplib.connect(`amqp://${process.env.RMUSER}:${process.env.RMPASSWORD}@localhost`);
    // const ch2 = await conn.createChannel();
    // await ch2.assertQueue(queue);
    // await ch2.sendToQueue(queue, Buffer.from(JSON.stringify(
    //   {
    //     user: String(user.id), 
    //     message: "new_transactions",
    //     payload: arrNewTrans, 
    //     count: index
    //   }
    // )));
}


async function agent() {
  console.log('======== ' + new Date().toLocaleString("ru-RU"));
  await list();
}

agent();



