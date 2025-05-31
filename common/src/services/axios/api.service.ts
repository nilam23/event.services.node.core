import { IAxiosAPIInvocationResponse } from '@interfaces/helpers/misc.interface';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export class AxiosAPIService {
  /**
   * @description service method responsible for invoking an endpoint via axios
   * @param {Method} method the http method
   * @param {string} url the server URL that will be used for the request
   * @param {string} baseURL the base URL for the server unless url is absolute
   * @param {any} data the data to be sent as request body
   * @param {AxiosHeaders} headers the custom headers to be sent
   * @param {any} params the URL parameters to be sent with the request
   * @returns
   */
  public invokeAPI = async (
    method: Method,
    url: string,
    baseURL: string,
    data: any = null,
    headers: any = null,
    params: any = null,
  ): Promise<IAxiosAPIInvocationResponse> => {
    const reqConfigs: AxiosRequestConfig<any> = { method, url, baseURL };

    if (data) reqConfigs.data = data;
    if (headers) reqConfigs.headers = headers;
    if (params) reqConfigs.params = params;

    const axiosPromiseResponse: [PromiseSettledResult<AxiosResponse<any, any>>] = await Promise.allSettled([axios(reqConfigs)]);
    const axiosResponse: PromiseSettledResult<AxiosResponse<any, any>> = axiosPromiseResponse[0];

    if (axiosResponse.status === 'fulfilled') {
      const apiSuccessResponse: AxiosResponse = axiosResponse.value;
      return { statusCode: apiSuccessResponse.status, data: apiSuccessResponse.data };
    } else {
      const apiFailureResponse = axiosResponse.reason as { response?: AxiosResponse };
      return { statusCode: apiFailureResponse.response.status, data: apiFailureResponse.response.data };
    }
  };
}
