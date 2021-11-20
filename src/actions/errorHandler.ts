export const errorHandler = (error: any) => {
  return error.response 
    ? error.response.data
    : error.message;
};
