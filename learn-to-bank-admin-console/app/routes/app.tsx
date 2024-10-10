
import { Button, Card, Drawer, GeistProvider, Grid, Image, Page, Spacer, Tabs, Themes } from '@geist-ui/core';
import { DollarSign, Grid as GridIcon, Home, List, LogOut, Settings, Shuffle, Database } from '@geist-ui/react-icons';
import { MetaFunction, Outlet, useMatches, useNavigate, Link } from "@remix-run/react";
import React from 'react';
import { useSelector } from 'react-redux';
import { AuthenticatedLink } from '~/components/AuthenticatedLink';
import { RootState } from '../store';
'./app.dashboard';

export const meta: MetaFunction = () => {
  return [
    { title: "Learn to Bank" },
    { name: "description", content: "Get a grasp on Australia's current online banking systems." },
  ];
};

const navItems = [
  { icon: <Database />, label: "Database", to: "/app/dashboard" },
  { icon: <LogOut />, label: "Logout", to: "/logout" },
];

export default function AppLayout() {
  const { isDarkTheme, textScale } = useSelector((state: RootState) => state.app);
  const lightTheme = Themes.createFromLight({ type: 'light1', palette: { success: "#009dff", } });
  const darkTheme = Themes.createFromDark({ type: 'dark1', palette: { background: "#111111", success: "#009dff", } });
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

  const buttonStyle = {
    width: 350,
    height: 75,
    fontSize: 18,
    gap: 16,
  };

  console.log(isDarkTheme, 3428)
  return (
    <GeistProvider themes={[lightTheme, darkTheme]} themeType={isDarkTheme ? 'dark1' : 'light1'}>
      <div style={{ backgroundColor: isDarkTheme ? '#111111' : '#EEEEEE' }}>
        <Page style={{
          margin: 0,
          padding: 0,
        }}>
          <Page.Header style={{ padding: 20, marginLeft: 50 }}>
            <Grid.Container gap={0} justify="space-between" alignItems="center">
              <Grid>
                <Image height="150px" src="/logo.png" />
              </Grid>
              <Grid>
                <Card padding={0.5} style={{ transform: `scale(${textScale / 100})`, transformOrigin: 'top right' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                      initialValue={initialValue.toString()}
                      align="left"
                      onChange={handleTabChange}
                      style={{ margin: 10 } as any}
                    >
                      {navItems.map((item, index) => (
                        <Tabs.Item
                          key={index}
                          label={
                            <Link to={item.to} prefetch="intent" style={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'inherit',
                              textDecoration: 'none',
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                              {React.cloneElement(item.icon, { size: 24, color: 'white' })}
                              <span style={{ color: 'white' }}>{item.label}</span>
                            </Link>
                          }
                          value={index.toString()}
                        />
                      ))}
                    </Tabs>
                    <Spacer h={1} />
                  </div>
                </Card>
              </Grid>
            </Grid.Container>
          </Page.Header>
          <Outlet />
        </Page>
      </div>
    </GeistProvider >
  );
}
