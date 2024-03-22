import { BookDataInterface } from "@/interface/book_data.interface";
import { ResponseInterface } from "@/interface/response.inteface";
import axios, { AxiosResponse } from "axios";

interface BookServiceFunction {
  list: (keyword?: string, tags?: string[]) => Promise<ResponseInterface>;
}

export function BookServices(): BookServiceFunction {
  const list = async (
    keyword?: string,
    tags?: string[],
    page?: number,
    pageSize: number = 10
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      let formatTag: string;
      if (tags?.length) {
        formatTag = JSON.stringify(tags);
      } else {
        formatTag = "";
      }
      const request: AxiosResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/books?keyword=${keyword}&tags=${formatTag}&page=${page}&pageSize=${pageSize}`
      );
      const bookData: Array<BookDataInterface> = request.data.data;
      response = {
        success: request.data.success,
        message: request.data.message,
        data: bookData,
      };
      return response;
    } catch (error: any) {
      response = {
        success: false,
        message: "Internal server error",
        data: null,
      };
      return response;
    }
  };

  return {
    list,
  };
}
