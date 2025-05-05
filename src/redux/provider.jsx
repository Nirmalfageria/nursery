// src/redux/provider.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from '../app/store/store';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
