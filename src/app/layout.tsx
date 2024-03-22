import { Navbar, Nav, Button, Container, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { InitialStateInterface } from '@/interface/initial_state.interface';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/css/custom.css';
import { LoginServices } from '@/services/login.service';
import { setCustomerData, setLoggedIn } from '@/redux/action';
import { Cart } from 'react-bootstrap-icons';

interface FormLoginRequest {
  username: string;
  password: string;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const isLoggedIn = useSelector(
    (state: InitialStateInterface) => state.isLoggedIn
  );
  const cartTotal = useSelector(
    (state: InitialStateInterface)  => state.customer_data.processOrderCount
  );
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [formLogin, setFormLogin] = useState<FormLoginRequest>({
    username: '',
    password: '',
  });
  const [validationMessages, setValidationMessages] = useState<Array<string>>([]);
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);

  const handleClose = (): void => {
    setShow(false);
    setValidationMessages([]);
  };
  const handleShow = (): void => setShow(true);

  const { loginProcess } = LoginServices();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  }

  const login = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (formLogin.username === '' || formLogin.password === '') {
      console.log('work')
      setValidationMessages([
        'Email and password is required',
      ]);
    } else {
      setIsLoadingLogin(true);
      await loginProcess(formLogin.username, formLogin.password).then((res) => {
        if (!res.success) {
          setValidationMessages(res.message);
        } else {
          setValidationMessages([]);
          dispatch(setCustomerData(res.data));
          dispatch(setLoggedIn(true));
          localStorage.setItem('customerId', res.data?.id);
          // window.location.reload();
          setShow(false);
        }
        setIsLoadingLogin(false);
      });
    }
  };

  return (
    <>
      <Navbar sticky="top" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <Link className="navbar-brand" href="/">Book Store</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {
              isLoggedIn ? (
                <Nav>
                  <Link href="/cart"><Cart /> <span>{cartTotal}</span></Link>
                </Nav>
              ) : (
                <Nav>
                  <Button onClick={handleShow}>Login</Button>
                </Nav>
              )
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-4">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => login(e)}>
              {
                validationMessages.map((msg, ind) => (
                  <ul key={ind}>
                    <li style={{ color: 'red' }}>{msg}</li>
                  </ul>
                ))
              }
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" onChange={onChangeInput} type="text" placeholder="username" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" onChange={onChangeInput} type="password" placeholder="password" />
              </Form.Group>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" style={{ marginLeft: '3px' }} variant="primary">
                {isLoadingLogin ? 'Proces....' : 'Login'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {children}
      </div>
    </>
  );
}
