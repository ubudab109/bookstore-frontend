import { CustomerOrderInterface } from "@/interface/customer_order.interface";
import { ResponseInterface } from "@/interface/response.inteface";
import axios, { AxiosResponse } from "axios";

interface OrderServiceFunction {
  addToCart: (customerId: number, bookId: number) => Promise<ResponseInterface>;
  cancelOrder: (orderId: number) => Promise<ResponseInterface>;
  getOrderCustomer: (customerId: number) => Promise<ResponseInterface>;
  editOrder: (orderId: number, quantity: number) => Promise<ResponseInterface>;
  payOrder: (
    customerId: number,
    orderIds: number[]
  ) => Promise<ResponseInterface>;
}

export function OrderServices(): OrderServiceFunction {
  const addToCart = async (
    customerId: number,
    bookId: number
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      const request: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${customerId}/add-to-cart/${bookId}`,
        {
          quantity: 1,
        }
      );
      const orderData: CustomerOrderInterface = request.data.data;
      response = {
        success: request.data.success,
        message: request.data.message,
        data: orderData,
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

  const cancelOrder = async (orderId: number): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      const request: AxiosResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}/cancel`
      );
      response = {
        success: request.data.success,
        message: request.data.message,
        data: null,
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

  const getOrderCustomer = async (
    customerId: number
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      const request: AxiosResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/customer/${customerId}`
      );
      const orderData: CustomerOrderInterface = request.data.data;
      response = {
        success: request.data.success,
        message: request.data.message,
        data: orderData,
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

  const editOrder = async (
    orderId: number,
    quantity: number
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      const request = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}/edit`,
        {
          quantity,
        }
      );
      const orderData: CustomerOrderInterface = request.data.data;
      response = {
        success: request.data.success,
        message: request.data.message,
        data: orderData,
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
  const payOrder = async (
    customerId: number,
    orderIds: number[]
  ): Promise<ResponseInterface> => {
    let response: ResponseInterface;
    try {
      const request = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/customer/${customerId}/pay`,
        {
          orderIds: orderIds,
        }
      );
      response = {
        success: request.data.success,
        message: request.data.message,
        data: null,
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
    addToCart,
    cancelOrder,
    editOrder,
    getOrderCustomer,
    payOrder,
  };
}
