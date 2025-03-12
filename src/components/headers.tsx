import Link from "next/link";

const Headers = () => {

    const logout = ()=>{
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link href={`/`} className="btn btn-ghost text-xl">DSA Project</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 items-center">
                    <li className="mx-5">
                        <details>
                            <summary>Menu</summary>
                            <ul className="bg-base-100 rounded-t-none p-2">
                                <li>
                                    <Link href="/login-dashbord">Login Dashbord</Link>
                                </li>
                                {/* <li>
                                    <a>Link 2</a>
                                </li> */}
                            </ul>
                        </details>
                    </li>
                    <li>
                        <button className="btn btn-warning" onClick={logout}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default Headers;
