import { useState } from "react";

function CharityHamburger() {
    
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
    <nav>
    <section className="MOBILE-MENU flex lg:hidden">
    <div
        className="HAMBURGER-ICON space-y-2"
        onClick={() => setIsNavOpen((prev) => !prev)}
    >
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
    </div>

    <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
        <div
        className="absolute top-0 left-0 px-6 py-6"
        onClick={() => setIsNavOpen(false)}
        >
        <svg
            className="h-8 w-8 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        </div>
        <ul className="flex flex-col items-center justify-between min-h-[250px]">
        <li className="border-b border-gray-400 my-8 uppercase">
            <a href="/EventForm">Create Event</a>
        </li>
        <li className="border-b border-gray-400 my-8 uppercase">
            <a href="/">Home</a>
        </li>
        <li className="border-b border-gray-400 my-8 uppercase">
            <a href="/CharityProfile">Profile</a>
        </li>
        </ul>
    </div>
    </section>

    <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
    <li>
        <a href="/EventForm">Create Event</a>
    </li>
    <li>
        <a href="/">Home</a>
    </li>
    <li>
        <a href="/CharityProfile">Profile</a>
    </li>
    </ul>
    </nav>
)};

export default CharityHamburger;