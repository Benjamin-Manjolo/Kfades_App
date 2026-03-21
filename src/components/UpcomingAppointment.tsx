import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";


interface Booking{
  id: number;
  booking_id: string;
  service_name: string;
  price: number;
  date: string;
  time: string;
  customer_name: string;
  phone: string;
  address: string;
  special_requests: string | null;
  payment_option: string;
  status: string;
  created_at: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const UpcomingAppointments : React.FC = () =>{

    const navigate = useNavigate();
    const [notifOpen, setNotifOpen] = useState(true);
    const [loading,setLoading] =useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const markNotificationRead = (id: number) =>
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const fetchBookings = async () => {
            try{
                const response = await fetch ('https://kfades.onrender.com/api/bookings');
                const result = await response.json();
                if(result.success && result.rawData){
                    setBookings(result.rawData);
                    const newNotifications: Notification[] = result.rawData.slice(0,5).map((booking:Booking,index:number) => ({
                        id:index,
                        message:`You have successfully Booked: ${booking.customer_name} — ${booking.service_name}`,
                        type:booking.status === `pending` ? 'warning' :' success',
                        timestamp:new Date(booking.created_at).toLocaleString(),
                        read:false,
                    }));
                    setNotifications(newNotifications);

                }
            }
            catch(error){
                console.error('error fetching bookings:',error);
            }   finally{
                setLoading(false);
            }
    }
    return(
        <>
            <NavBar/>
        <div className="relative">
            <button
            onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-md border border-[#3D444D] text-black hover:text-black hover:bg-white/5 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  
                  
            </button>
              {notifOpen && (
                  <div className="fixed left-0 top-12 w-full bg-white  shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 ">
                      <p  className='font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3'>Activity</p>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-black text-sm text-center py-6">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`px-4 py-3  cursor-pointer hover:bg-white/5 transition-colors ${n.read ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-black text-xs leading-relaxed">{n.message}</p>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />}
                          </div>
                          <p className="text-black text-[10px] mt-1">{n.timestamp}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
        </div>
        </>
    )
    
}
export default UpcomingAppointments;