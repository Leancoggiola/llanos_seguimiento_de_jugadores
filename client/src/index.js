import React from 'react';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import store from './middleware/store.js';

// App Component
import App from './App';

const root = createRoot(document.getElementById('root'));

if(process.env.NODE_ENV === 'production') {
  disableReactDevTools()
}

root.render(
  <Provider store={store}>
    <CookiesProvider>
      <App/>
    </CookiesProvider>
  </Provider>
);

