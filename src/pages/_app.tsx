import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootLayout from '@/app/layout';
import appStore from '@/redux/store';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    const { store, persistor } = appStore();
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <RootLayout>
                    <Component {...pageProps} />
                </RootLayout>
            </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}

export default MyApp;