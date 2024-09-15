import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from "./context/auth";
import {QueryClient, QueryClientProvider, QueryCache} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { Toaster } from 'react-hot-toast';



const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) =>
      console.log(`Something went wrong: ${error.message}`),
  }),
  
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
          <QueryClientProvider client={queryClient}>
              <AuthProvider>
                  <Toaster 
                  position="top-right"
                  toastOptions={{
                    className: 'bg-red-800 font-semibold text-gray-700 px-6 py-4',
                  }}
                  />
                  <App />
              </AuthProvider>
              <ReactQueryDevtools />
          </QueryClientProvider>
  </React.StrictMode>
);

