import { CustomAPIError } from "./CustomAPIError.js";
import { StatusCodes } from 'http-status-codes';


class ServerError extends CustomAPIError{
   constructor(message,description){
      super(message,description);
      this.errorCode = StatusCodes.INTERNAL_SERVER_ERROR
   }
}
export default ServerError