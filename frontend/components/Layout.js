import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/AppContext";
import Cookie from "js-cookie";
const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });

import Head from "next/head";
import Link from "next/link";


function Navigation() {
  const { user, setUser, resetCart } = useAppContext();
  const router = useRouter();

  function handleLogout() {
    setUser(null);
    Cookie.remove("token");
    router.push("/");
    ;
    
  }

  return (
    <header className="bg-blue-800 background navbar">
      <nav className="flex justify-between p-6 px-4">
        <div className="flex justify-between items-center w-full mx-16">
          <div className="xl:w-1/3">
            <Link
              className="block text-2xl max-w-max text-white title"
              href="/"
            >
              Order Food From My Favorite Place...
            </Link>
          </div>

          <div className="xl:block xl:w-1/3">
            <div className="flex items-center justify-end">
              <Link
                className="text-gray-50  hover:text-yellow-200 font-bold"
                href="/"
              >
                Home
              </Link>

              <div className="hxl:block">
                {user ? (
                  <div className="flex items-center justify-end">
                    <span className="inline-block py-2 px-4 mr-2 leading-5 text-gray-50  hover:text-gray-100 bg-transparent font-medium rounded-md">
                      {user.username}
                    </span>
                    <button
                      className="inline-block py-2 px-4 text-sm leading-5 text-green-50 bg-green-500 hover:bg-green-600 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end">
                    <Link
                      className="inline-block py-2 px-4 mr-2 leading-5 text-gray-50  hover:text-yellow-200 font-bold bg-transparent rounded-md"
                      href="/login"
                    >
                      Log In
                    </Link>
                    <Link
                      className="inline-block py-2 px-4 text-sm leading-5 text-green-50 bg-blue-600 hover:bg-green-700 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md"
                      href="/register"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Layout(props) {
  const title = "Order Food From Your Favorite";

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />     
      </Head>
      <Navigation />
      <Cart />
      
      <div className="container mx-auto px-6">{props.children}</div>
     
    </div>
  );
}