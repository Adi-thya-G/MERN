class ApiErrors extends Error {
  constructor(status,message,error=[],stack="")
  {
    super();
    this.status = status;
    this.data=null;
    this.message = message;
    this.success = false;
    this.error=error;
    if(stack)
    {
      this.stack = stack;
    }
    else{
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

export default ApiErrors;