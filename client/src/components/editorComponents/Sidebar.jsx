import { Clapperboard, Home, Box, LayoutDashboard, Settings, BookOpen, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { logout } from '../../redux/reducers/userSlice';
import { useState } from "react";

const menuItems = [
    {
        icons: <Home size={30} />,
        label: 'Home',
    },
    {
        icons: <Box size={30} />,
        label: 'Products',
    },
    {
        icons: <LayoutDashboard size={30} />,
        label: 'Dashboard',
    },
    {
        icons: <Settings size={30} />,
        label: 'Setting',
    },
    {
        icons: <BookOpen size={30} />,
        label: 'Log',
    },
    {
        icons: <Search size={30} />,
        label: 'Report',
    },
];

export function Sidebar({ open, setOpen }) {
    const [logoutAlert, setLogoutAlert] = useState(false);
    const { user } = useSelector((state) => state.user);
    console.log(user);

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(logout());
        } catch (e) {
            console.log(e);
            console.log("logout fail");
        }
    };

    return (
        <nav
            className={`h-screen p-2 flex flex-col duration-500 bg-zinc-900 text-zinc-50 border-r border-zinc-400 z-20 ${
                open ? 'w-60' : 'w-16'
            }`}
        >
            {/* Header */}
            <div
                className={`px-3 py-2 my-2 cursor-pointer flex justify-evenly items-center relative group`}
            >
                <div>
                    <Clapperboard strokeWidth={1} size={40} />
                </div>
                <div className={`${!open && 'w-0 -translate-x-4'} duration-500 overflow-hidden`}>
                    SAREGAMA
                </div>
            </div>

            {/* Body */}
            <ul className="flex-1 text-zinc-50">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className="px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group"
                    >
                        <div>{item.icons}</div>
                        <p
                            className={`${!open && 'w-0 -translate-x-4'} duration-500 overflow-hidden`}
                        >
                            {item.label}
                        </p>
                        <p
                            className={`${
                                open && 'hidden'
                            } absolute shadow-md rounded-md w-0 p-0 text-zinc-50 duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}
                        >
                            {item.label}
                        </p>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className={`flex ${open ? 'flex-col items-start gap-2 p-2' : ''}`}>
                <div className={`flex gap-3`}>
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div
                        className={`leading-5 ${
                            !open && 'w-0 -translate-x-4'
                        } duration-500 overflow-hidden`}
                    >
                        <p>{user.name}</p>
                        <span className="text-xs">{user.email}</span>
                    </div>
                </div>

                {open && (
                    <Button
                        variant="outline"
                        className="text-zinc-600"
                        onClick={() => setLogoutAlert(!logoutAlert)}
                    >
                        Log Out
                    </Button>
                )}
            </div>

            {logoutAlert && (
                <div
                    onClick={() => setLogoutAlert(!logoutAlert)}
                    className="w-screen h-screen absolute bg-black/20 flex items-center justify-center backdrop-blur-md"
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
