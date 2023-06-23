import { logger } from "../utils/logger";
import https from 'https';
import axios, { Axios, AxiosPromise, AxiosResponse } from 'axios';
import { configT } from "./list";
import expect from "expect";
//import { afterAll, expect, test } from 'vitest';

//import { describe } from "node:test";
//import { it } from "node:test";
//import expect from "node:test";
//import eaxios from 'axios';

export async function checkRest(endpoint: configT) {
  logger.info(`agentSite - starting checkRest: ${endpoint.app} ${endpoint.name} ${endpoint.protocol} ${endpoint.url} ${endpoint.method}'`);
  try {
    let response: any;
    if (endpoint.method == "post-auth-get") {
      response = await PAG(endpoint);
    } else {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const configAxios = {
        method: endpoint.method,
        url: endpoint.url + String(endpoint.endpoint),
        data: endpoint.post_body,
        headers: {
          "Content-Type": "application/json",
          //'Host': String(uuidv4()),
          //"Connection": "keep-alive",
          //"Postman-Token": Date.now(),
          //"User-Agent": "PostmanRuntime/7.30.1",// need 2-nd token
          //Authorization: token,
        },
        httpsAgent: agent,
        timeout: endpoint.timeout
      };
      //test('with axios', async () => {
        //console.log(configAxios);
        
      response = await axios(configAxios);
    }
    //console.log(response);

    // проверка статус-кода
    if (response.status !== endpoint.response_code) {
      //console.log('status code expected ' + endpoint.response_code + ', received ' + response.status);
      throw new Error('status code expected ' + endpoint.response_code + ', received ' + response.status);
    }

    // проверка отсутсвия объекта с ошибками. Если есть - ошибка
    if (String(endpoint.response_error_path) !== "") {
    if (response.data?.[String(endpoint.response_error_path)]) {
      //console.log(response.data?.[String(endpoint.response_error_path)]);
      if (response.data?.[String(endpoint.response_error_path)] != null) {
        //console.log('response_error_path be or not null ');
        throw new Error('response_error_path be or not null ');
      }
    }
    }
//    expect(response).not.toHaveProperty(String(endpoint.response_error_path));

    // проверка типа ответа
    const response_type = String(endpoint.response_type).split(',')
    if (response_type[0] === "arr") {
      //console.log('response data ',response[String(endpoint.response_data_path)]);
      expect(Array.isArray(response[String(endpoint.response_data_path)])).toBe(true)
    }
    if (response_type[0] === "obj") {
      //console.log('response data ',response[String(endpoint.response_data_path)]);
      expect(response[String(endpoint.response_data_path)]).toBeInstanceOf(Object)
      const response_fields = String(endpoint.response_details).split(',')
      response_fields.forEach(field => {
        //console.log('field', field);
        if (field !== "") {
          expect(response[String(endpoint.response_data_path)]).toHaveProperty(field);
        }

      })
    }

    // 
    //let res: any = expect(response.status).toBe(endpoint.response_code);


    return true

  } catch (error) {
    logger.error('checkRest - ' + JSON.stringify(error));
    console.log(String(error));
    return false;
  }

}

async function PAG(endpoint: configT) {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const configAxiosAuth = {
      method: "post",
      url: endpoint.url + String(endpoint.endpointAuth),
      data: endpoint.post_body,
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: agent,
      timeout: endpoint.timeout
    };
  
    //test('with axios', async () => {
    const responseAuth: any = await axios(configAxiosAuth);
    const jwt = responseAuth.data.data?.[String(endpoint.field_jwt)];
    //console.log(jwt);
    if (jwt === "") {
      throw new Error('PAG - не удалось получить JWT');
    }
  //return
    const configAxiosGet = {
      method: "get",
      url: endpoint.url + String(endpoint.endpointGet),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt,
      },
      httpsAgent: agent,
      timeout: endpoint.timeout,
    };    

    const responseGet: any = await axios(configAxiosGet);
    console.log("responseGet", responseGet.data);
    return responseGet;

      
  } catch (error) {
    logger.error('checkRest - ' + error);
    console.log(String(error).slice(0,100));
    return false;    
  }
  


  

 
  
}