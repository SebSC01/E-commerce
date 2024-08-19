"use client";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumb.module.scss";

const Breadcrumb = () => {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter(x => x);

    const breadcrumbItems = pathnames.map((path, index) => {
        const href = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
            <li key={href}>
                <a href={href}>{path.replace(/-/g, ' ')}</a>
            </li>
        );
    });

    return (
        <nav className={styles.breadcrumb}>
            <ul>
                <li><a href="/">Home</a></li>
                {breadcrumbItems}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
