/* eslint-disable react-hooks/exhaustive-deps */
import BookCard from "@/components/book_card.component";
import { BookDataInterface } from "@/interface/book_data.interface";
import { InitialStateInterface } from "@/interface/initial_state.interface";
import { setCustomerData } from "@/redux/action";
import { OrderServices } from "@/services/order.service";
import React, { ChangeEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { ActionMeta, MultiValue } from 'react-select';
import { useInfiniteQuery } from "react-query";
import { BookServices } from "@/services/book.service";

interface FilterBook {
    keyword?: string;
    tags: string[];
};

const Home: React.FC = () => {
    const isLoggedIn = useSelector(
        (state: InitialStateInterface) => state.isLoggedIn
    );

    const orderSelectedState = useSelector(
        (state: InitialStateInterface) => state.customer_data
    );
    const dispatch = useDispatch();
    const options = [
        { value: 'fiction', label: 'fiction' },
        { value: 'non-fiction', label: 'non-fiction' },
        { value: 'science', label: 'science' },
        { value: 'essay', label: 'essay' },
    ];

    const [filter, setFilter] = React.useState<FilterBook>({
        keyword: '',
        tags: []
    });
    const contentRef = React.useRef<HTMLDivElement>(null);
    const { addToCart } = OrderServices();

    const cartProcess = async (bookId: number): Promise<void> => {
        const customerId = localStorage.getItem('customerId');
        if (customerId) {
            await addToCart(parseInt(customerId), bookId)
                .then((res) => {
                    if (res.success) {
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
                                    alert('Existing order updated successfully');
                                } else {
                                    // Add new order
                                    globalOrders.push(res.data);
                                    if (updatedOrderSelectedState.processOrderCount !== undefined) {
                                        updatedOrderSelectedState.processOrderCount++;
                                    }
                                    alert('New order added successfully');
                                }
                                updatedOrderSelectedState.orders = globalOrders;
                                dispatch(setCustomerData(updatedOrderSelectedState));
                            }
                        }
                    }
                })
        }

    }

    const handleTagChange = (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>): void => {
        const selectedTags = newValue.map(option => option.value);
        setFilter({
            ...filter,
            tags: selectedTags
        });
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

    } = useInfiniteQuery(
        ['books', filter.keyword, filter.tags],
        async ({ pageParam = 1 }) => {
            const { list } = BookServices();
            const res = await list(filter.keyword, filter.tags, pageParam);
            return res.data;
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < 10) {
                    return undefined;
                }
                return allPages.length + 1;
            },
            
        }
    );

    const handleScroll = (): void => {
        if (!isFetchingNextPage && hasNextPage && contentRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = contentRef.current;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
            if (scrollPercentage >= 0.8) {
                fetchNextPage();
            }
        }
    };

    return (
        <div>
            <Form className="mb-4">
                <Row>
                    <Col>
                        <Form.Label>Keyword</Form.Label>
                        <Form.Control name="keyword" onChange={(e) => setFilter({ ...filter, keyword: e.target.value })} placeholder="Book One" />
                    </Col>
                    <Col>
                        <Form.Group as={Col} controlId="my_multiselect_field">
                            <Form.Label>Tags</Form.Label>
                            <Select onChange={handleTagChange} options={options} isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div className="card-grid" ref={contentRef} onScroll={handleScroll} style={{overflow: 'scroll', height: '500px'}}>
                {
                    isLoading ? (
                        <div>Loading....</div>
                    ) : isError ? (
                        <div>{error.message}</div>
                    ) : data ? (
                        data.pages.map((page, pageIndex) => (
                            <React.Fragment key={pageIndex}>
                                {page.map((item: BookDataInterface, index: number) => (
                                    <BookCard
                                        id={item.id}
                                        title={item.title}
                                        writer={item.writer}
                                        cover_image={item.cover_image}
                                        price={item.price}
                                        tags={item.tags}
                                        key={index}
                                        isLoggedIn={isLoggedIn}
                                        action={() => cartProcess(item.id)}
                                    />
                                ))}
                            </React.Fragment>
                        ))
                    ) : null
                }
                {
                    isFetchingNextPage && (
                        <div>Loading more...</div>
                    )
                }
            </div>

        </div>
    );
};

export default Home;
