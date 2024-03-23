/* eslint-disable react-hooks/exhaustive-deps */
import { CustomerOrderInterface } from "@/interface/customer_order.interface";
import { InitialStateInterface } from "@/interface/initial_state.interface";
import { setCustomerData } from "@/redux/action";
import { OrderServices } from "@/services/order.service";
import { useRouter } from "next/router";
import React from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Cart: React.FC = () => {
    const [orders, setOrders] = React.useState<CustomerOrderInterface[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [messageError, setMessageError] = React.useState<string>('');
    const orderSelectedState = useSelector(
        (state: InitialStateInterface) => state.customer_data
    );
    const [loadingPay, setIsLoadingPay] = React.useState<boolean>(false);
    const dispatch = useDispatch();

    const customerId = localStorage.getItem('customerId');
    const { getOrderCustomer, cancelOrder, payOrder, editOrder } = OrderServices();

    const cancelOneOrder = async (orderId: number, indexOrder: number): Promise<void> => {
        if (confirm('Are You sure want to cancel this order?')) {
            await cancelOrder(orderId).then((res) => {
                if (!res.success) {
                    alert('Failed to cancel order ' + res.message);
                } else {
                    alert(res.message);
                    const updatedOrders = [...orders];
                    updatedOrders.splice(indexOrder, 1);
                    setOrders(updatedOrders);
                    if (orderSelectedState.orders) {
                        const updatedOrderSelectedState = { ...orderSelectedState };
                        if (updatedOrderSelectedState && updatedOrderSelectedState.orders) {
                            if (updatedOrderSelectedState.processOrderCount) {
                                updatedOrderSelectedState.processOrderCount--;
                            }
                            const globalOrders = [...updatedOrderSelectedState.orders];
                            const indexGlobalOrder = globalOrders.findIndex(item => item.id === orderId);
                            globalOrders.splice(indexGlobalOrder, 1);
                            updatedOrderSelectedState.orders = globalOrders;
                            dispatch(setCustomerData(updatedOrderSelectedState));
                        }
                    }
                }
            })
        }
    }

    const getCartOrder = async (): Promise<void> => {
        setIsLoading(true);
        if (customerId) {
            await getOrderCustomer(parseInt(customerId)).then((res) => {
                if (!res.success) {
                    setIsError(true);
                    setMessageError(res.message);
                } else {
                    setIsError(false);
                    setMessageError('');
                    setOrders(res.data);
                }
                setIsLoading(false);
            })
        }
    }

    const editOrderRow = async (
        orderId: number,
        item: CustomerOrderInterface,
        index: number,
        quantity: number,
    ): Promise<void> => {
        if (quantity !== null) {
            await editOrder(orderId, quantity)
                .then((res) => {
                    if (res.success) {
                        let copyOrders = [...orders];
                        copyOrders[index].quantity = quantity;
                        if (item.book) {
                            copyOrders[index].total = item.book?.price * quantity;
                        }
                        setOrders(copyOrders);
                        if (orderSelectedState.orders) {
                            const updatedOrderSelectedState = { ...orderSelectedState };
                            if (updatedOrderSelectedState && updatedOrderSelectedState.orders) {
                                const globalOrders = [...updatedOrderSelectedState.orders];
                                const indexGlobalOrder = globalOrders.findIndex(item => item.id === res.data.id);
                                if (indexGlobalOrder !== -1) {
                                    // Update existing order
                                    const updatedOrder = {
                                        ...globalOrders[indexGlobalOrder],
                                        quantity: res.data.quantity,
                                        total: res.data.total
                                    };
                                    globalOrders[indexGlobalOrder] = updatedOrder;
                                }
                            }
                        }
                    } else {
                        alert('Failed update existing order ' + res.message);
                    }
                });
        }
    }

    const payAllOrder = async (): Promise<void> => {
        if (confirm('Are you sure want to paid all order?')) {
            setIsLoadingPay(true);
            const customerId = localStorage.getItem('customerId');
            let orderIds: Array<number> = [];
            let total: number = orders.reduce((acc, order) => acc + order.total, 0);
            orders.forEach(item => {
                orderIds.push(item.id);
            });
            if (customerId) {
                await payOrder(parseInt(customerId), orderIds)
                    .then((res) => {
                        alert(res.message);
                        if (res.success) {
                            if (orderSelectedState.points !== undefined) {
                                dispatch(setCustomerData({
                                    orders: [],
                                    processOrderCount: 0,
                                    points: orderSelectedState.points - total,
                                }))
                                setOrders([]);
                            }
                        }
                        setIsLoadingPay(false);
                    }).catch((err) => {
                        alert('There is something wrong. Please try again later');
                    });
            }
        }
    }

    React.useEffect(() => {
        getCartOrder();
    }, []);

    return (
        <div className="p-5">
            <h1>Cart</h1>
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Book</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Action</th>
                    </tr>

                </thead>
                <tbody>
                    {
                        isLoading ? (
                            <tr>
                                <td colSpan={4}>Loading...</td>
                            </tr>
                        ) : (
                            isError ? (
                                <tr>
                                    <td colSpan={4}>{messageError}</td>
                                </tr>
                            ) : (
                                orders.map((item, ind) => (
                                    <tr key={ind}>
                                        <td>{ind + 1}</td>
                                        <td>
                                            <img width={100} height={100} src={item.book ? item.book.cover_image : ''} alt="img-book" />
                                            <div className="col">
                                                <span>{item.book?.title}</span>
                                                <br />
                                                <span>{item.book?.writer}</span>
                                            </div>
                                        </td>
                                        <td className="text-center">{item.book?.price}pts</td>
                                        <td className="text-center">
                                            <input min={1} className="form-control" type="number" name="quantity" id="quantity" value={item.quantity} onChange={e => editOrderRow(item.id, item, ind, parseInt(e.target.value))} />
                                        </td>
                                        <td className="text-center">{item.total}pts</td>
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => cancelOneOrder(item.id, ind)}>Cancel</Button>
                                        </td>
                                    </tr>
                                ))
                            )
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="text-right text-bold">SUB TOTAL</td>
                        <td className="text-center text-bold">{
                            orders.reduce((acc, order) => acc + order.total, 0)
                        }pts</td>
                    </tr>
                </tfoot>
            </Table>
            <div className="col-12">
                {
                    orders.length > 0 ? (

                        <Button style={{ width: '100%' }} className="text-center" onClick={loadingPay ? () => null : () => payAllOrder()}>
                            {loadingPay ? 'Paying...' : 'Pay'}
                        </Button>
                    ) : null
                }
            </div>
        </div>
    );
};

export default Cart;
