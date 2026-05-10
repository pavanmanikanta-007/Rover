import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";  // ✅ removed non-existent imports

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { googleLogout } from '@react-oauth/google';
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../../services/AuthProvider';


function Header() {

  const { user, logout } = useAuth();  // ✅ reactive, no localStorage read needed
  const [openDailog, setOpenDailog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      googleLogout();
      logout();  // ✅ updates context → header re-renders instantly
      toast.success("Logged out successfully 👋");
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error("Logout failed ❌");
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b bg-white/80 backdrop-blur-md">

      <Link to="/">
        <img src="/logo.svg" className="h-10 w-auto cursor-pointer" alt="Rover Logo" />
      </Link>

      <div>
        {user ? (
          <div className='flex items-center gap-3'>

            <Link to='/create-trip'>
              <Button variant='outline' className="rounded-full cursor-pointer">
                Create Trip
              </Button>
            </Link>

            <Button
              variant='outline'
              className="rounded-full cursor-pointer"
              onClick={() => navigate('/my-trips')}
            >
              My Trips
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user?.picture}
                  referrerPolicy="no-referrer"
                  className="w-[38px] h-[38px] rounded-full object-cover border cursor-pointer hover:scale-105 transition-all"
                  alt="User"
                />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={10}
                className="w-92 rounded-2xl border border-gray-200 shadow-2xl p-0 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.picture}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      alt="User"
                    />
                    <div className="min-w-0">
                      <h2 className="font-bold text-base text-gray-900 truncate">{user?.name}</h2>
                      <p className="text-sm text-gray-500 break-all">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-red-100 bg-red-50 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-100 hover:text-red-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          <Button
            className="cursor-pointer rounded-full px-6"
            onClick={() => setOpenDailog(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <img src="/logo.svg" className="w-32 object-contain" alt="Logo" />
            </DialogTitle>
            <DialogDescription className="pt-4">
              <span className="font-bold text-lg text-black block">Sign In with Google</span>
              <span className="text-gray-500 text-sm">Securely continue to Rover</span>
              <Button
                variant="outline"
                className="mt-5 w-full flex items-center gap-2 bg-black text-white hover:bg-neutral-800 hover:text-white cursor-pointer"
              >
                <FcGoogle className="text-lg" />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default Header;