import { Tabs } from '@geist-ui/core';
import { useMatches, useNavigate } from '@remix-run/react';
import { Home, CreditCard, List, Settings, LogOut, DollarSign } from '@geist-ui/react-icons';
import React from 'react';

const navItems = [
    { icon: <Home />, label: "Home", to: "/app/accounts" },
    { icon: <DollarSign />, label: "Pay", to: "/app/pay" },
    { icon: <List />, label: "History", to: "/app/history" },
    { icon: <Settings />, label: "Settings", to: "/app/settings" },
    { icon: <LogOut />, label: "Logout", to: "/logout" },
];

const DynamicTabs = () => {
    const matches = useMatches();
    const navigate = useNavigate();

    // Determine the current path from matches
    const currentPath = matches[matches.length - 1]?.pathname || '/';

    // Determine initialValue based on current URL
    const initialValue = navItems.findIndex(item => item.to === currentPath);

    // Handle tab change
    const handleTabChange = (value: string) => {
        const newPath = navItems[parseInt(value)].to;
        navigate(newPath);
    };

    return (
        <Tabs
            initialValue={initialValue.toString()}
            align="left"
            onChange={handleTabChange}
            style={{
                '--tabs-indicator-color': '#0070f3',
                '--tabs-active-color': '#0070f3'
            } as any}
        >
            {navItems.map((item, index) => (
                <Tabs.Item
                    key={index}
                    label={
                        <>
                            {React.cloneElement(item.icon, {
                                size: 24,
                                style: {
                                    color: currentPath === item.to ? '#0070f3' : 'inherit'
                                }
                            })}
                            <span style={{
                                color: currentPath === item.to ? '#0070f3' : 'inherit'
                            }}>
                                {item.label}
                            </span>
                        </>
                    }
                    value={index.toString()}
                >
                </Tabs.Item>
            ))}
        </Tabs>
    );
}

export default DynamicTabs;
