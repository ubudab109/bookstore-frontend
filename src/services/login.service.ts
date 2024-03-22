import { CustomerDataInterface } from "@/interface/customer_data.interface";
import { ResponseInterface } from "@/interface/response.inteface";
import axios, { AxiosResponse } from "axios";

interface LoginServiceFunction {
  loginProcess: (
    username: string,
    password: string
  ) => Promise<ResponseInterface>;
}

export function LoginServices(): LoginServiceFunction {
  const loginProcess = async (
    username: string,
    password: string
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;

    try {
      const request: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
          username,
          password,
        }
      );

      const customerData: CustomerDataInterface = request.data.data;
      response = {
        success: request.data.success,
        message: request.data.message,
        data: request.data.success ? customerData : null,
      };
      return response;
    } catch (error: any) {
      const data = error.response.data;
      response = {
        success: false,
        message: data.message,
        data: null,
      };
      return response;
    }
  };

  return {
    loginProcess,
  };
}
