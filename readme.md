Служба постоянного мониторинга REST/RPC точек. 
В конфиг (configs/config_agentSite.json) нужно прописать каждую проверяемую точку. 
После запуска каждая точка будет проверяться исходя из параметров конфига.

[{
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
}]

Из транспортов доступны:
- запись в log, вывод в консоль
- telegram. Для этого транспорта необходим токен - задается в configs/.env, параметр - BOT_TOKEN
