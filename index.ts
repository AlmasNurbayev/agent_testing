import { botInit } from "./transport/bot";
import { list } from "./agent/list";
import dotenv from 'dotenv';


async function agent() {
  console.log('======== ' + new Date().toLocaleString("ru-RU"));
  dotenv.config({path: './configs/.env'});
  await list();
 console.log(new Date);
 
}

agent();
