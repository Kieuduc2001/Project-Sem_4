import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { store } from './redux/store';
import App from './App';
import './style/mainStyle.css';
import './index.css';
import './satoshi.css';
import YearProvider from './context/YearProvider/YearProvider';

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap your App component with Provider and pass the store */}
    <Provider store={store}>
      <YearProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </YearProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
