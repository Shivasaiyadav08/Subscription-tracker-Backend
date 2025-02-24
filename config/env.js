import { config } from "dotenv";


//conects to .env.development.local or .env.production.local file
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});
export  const {PORT,NODE_ENV,DB_URI,JWT_SECRET,JWT_EXPIRE_IN,ARCJET_KEY,ARCJET_ENV,QSTASH_TOKEN, QSTASH_URL,SERVER_URL,EMAIL_PASS}=process.env