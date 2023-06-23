import { logger } from "../utils/logger";
import fs from 'fs';
import { checkRest } from "./checkRest";
import { botSend } from "../transport/bot";

export type configT = {
  app: string,  // name of service
  name: string, // name of endpoint
  enable: boolean, // skipped if false 
  protocol: string, // rest or other
  url?: string, // first part of url
  method?: string,  // http-method - post, get, delete
  endpoint?: string,  // second part of url
  endpointAuth?: string,  // for PAG function - url for post 
  endpointGet?: string,   // for PAG function - url for get 
  field_jwt?: string, // for PAG function - name of field store jwt
  post_body: any, // body for post request. If empty - must be {}
  response_code: number,  // success http code
  response_type?: string, // arr or obj
  response_details?: string,  // required field
  response_error_path?: string, // field with error for alarm
  response_data_path?: string,  // must be data or more
  message_error?: string, // message for sended of transport
  timeout: number,  // for axios
  need_result?: boolean, // что считается успехом
  status?: boolean, // matching response and need result
  transport?: string[], // type of transport
  transport_address?: string[], // address list
  repeat: number, // interval for repeat in ms
  last_check?: Date, // not put manually, date of last check

}

export function list() {
  const configString = fs.readFileSync('./configs/config_agentSite.json');
  let arr: configT[] = JSON.parse(String(configString));
  setInterval(function() {
    list_repeat(arr)
  },2000)
}

export async function list_repeat(arr: configT[]) {

  //console.log(arr);
  //const arrPromises: Promise<boolean | undefined>[] = [];

  for (let element of arr) {
      if (!element.enable) {
        continue;
      }
      const dateNow = new Date;
      let delta = 0;

      if (!element.last_check) {
        delta = dateNow.getTime();
      } else {
        //console.log('last_check', element.last_check.getTime());
        delta = dateNow.getTime() - Number(element.last_check?.getTime())
      }
      //console.log('--------last_check', element.last_check);
      //console.log(element.status);

      if (delta > element.repeat) {
        
        //arr.forEach(element => {
        check(element).then(resOfCheck => {
          //console.log('resOfCheck', resOfCheck);
          if (resOfCheck === element.need_result) {
            element.status = true;
          } else {
            element.status = false;
            handleTransport(element)          
          }
          console.log("====",element.app, element.name, element.status, element.last_check);
          
          
        })
        element.last_check = new Date;
      }
    }
}

async function check(endpoint: configT): Promise<boolean | undefined> {

  if (endpoint.protocol === 'rest') {
    return await checkRest(endpoint)
  }
  logger.info('agentSite - ending check');
}

async function handleTransport(element:configT) {
  if (!element.transport) {
    return
  } 
  if (!Array.isArray(element.transport)) {
    return    
  }
  const message = `Агент мониторинга API: несоответствие
  app:     ${element.app}
  name:    ${element.name}
  endpoint:${element.url} ${element.endpoint}
  protocol:${element.protocol}
  method:  ${element.method}
  date:    ${element.last_check?.toLocaleString('ru-RU')}
  expect status:   ${element.need_result}
  received status: ${element.status}
  `;
  for (let transport of element.transport) {
    if (!element.transport_address) {
      continue
    } 
    if (!Array.isArray(element.transport_address)) {
      continue  
    }    
    if (transport === 'telegram') {
      for (let address of element.transport_address) {
        //botSend(message, address)
      }
     }
  }
}