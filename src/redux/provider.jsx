// src/app/provider.js
'use client';

import { Provider } from 'react-redux';
import store from '../redux/store/store';

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
