import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import logo from "../../public/logo.png"; // Assuming you have a logo image
const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg text-primary flex items-center justify-center">
                {/* <MessageSquare className="w-5 h-5 text-primary" /> */}
                {/* <img
                  src={logo}
                  alt="logo"
                  className="w-10 aspect-square   text-primary"
                /> */}
                <svg
                  clsdassName="text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 757 743"
                  width="757"
                  height="743"
                  fill="currentColor"
                >
                  <circle
                    cx="366.413"
                    cy="342.139"
                    r="250.731"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="111.458"
                    stroke-linecap="round"
                  />
                  <circle cx="620.872" cy="654.166" r="53.729" />
                </svg>
              </div>
              <h1 className="text-lg font-bold">Qonvo</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
