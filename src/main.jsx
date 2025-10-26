import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx';
import Landing from './Landing.jsx';
import Ticket from './Ticket.jsx';
import Travel from './Travel.jsx';
import SeatView from './SeatView.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children : [
      {
        path:'/',
        element: <Home/>
      },
      {
        path:'/book',
        element: <Landing/>
      }
    ]
  },
  {
    path:'/ticket',
    element:<Ticket/>
  },
  {
    path:'/travel',
    element:<Travel/>
  },
  {
    path:'/seatview',
    element:<SeatView/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
