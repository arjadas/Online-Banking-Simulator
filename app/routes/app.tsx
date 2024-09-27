
import { Button, Card, CssBaseline, Drawer, GeistProvider, Grid, Image, Page, Spacer, Tabs, Text, Themes } from '@geist-ui/core';
import { DollarSign, Grid as GridIcon, Home, List, LogOut, Settings, Shuffle, User } from '@geist-ui/react-icons';
import { Outlet, useMatches, useNavigate } from "@remix-run/react";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ResizableText from '~/components/ResizableText';

const navItems = [
  { icon: <Home />, label: "Home", to: "/app/accounts" },
  { icon: <List />, label: "History", to: "/app/transactions" },
  { icon: <Settings />, label: "Settings", to: "/app/settings" },
  { icon: <LogOut />, label: "Logout", to: "/logout" },
];

//TODO set up second auth
export default function AppLayout() {
  const { isDarkTheme, textScale} = useSelector((state: RootState) => state.app);
  const [drawerOpen, setDrawerOpen] = React.useState(false)
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

  return (
    <GeistProvider themes={[lightTheme, darkTheme]} themeType={isDarkTheme ? 'dark1' : 'light1'}>
      <Drawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          transform: 'translate(0%, -5%)',
          gap: 16,
        }}>
          <Drawer.Title>
            <ResizableText h2 style={{margin: -10}}>Pay</ResizableText>
          </Drawer.Title>
          <Drawer.Subtitle>Instantiate a transfer</Drawer.Subtitle>
          <Spacer h={2} />
          <Button style={buttonStyle} type='success-light' auto scale={2} icon={<Shuffle />} onClick={() => { navigate("/app/transfer"); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Transfer between accounts
          </Button>
          <Button style={buttonStyle} type='success-light' auto scale={2} icon={<User />} onClick={() => { navigate("/app/paySomeone"); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Pay someone
          </Button>
          <Button style={buttonStyle} type='success-light' auto scale={2} icon={<GridIcon />} onClick={() => { navigate("/app/accounts"); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Default Payments
          </Button>
        </div>
      </Drawer>
      <Page>
        <Page.Header>
          <Grid.Container gap={0} justify="space-between" alignItems="center">
            <Grid>
              <Image height="200px" style={{ margin: -20 }} src="/logo.png" />
            </Grid>
            <Grid>
              <Card padding={0.5} style={{ transform: `scale(${textScale / 100})`, transformOrigin: 'top right' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tabs
                    initialValue={initialValue.toString()}
                    align="left"
                    onChange={handleTabChange}
                    style={{
                      //  '--tabs-indicator-color': '#0070f3',
                      // '--tabs-active-color': '#0070f3',
                      margin: 10
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
                                //color: currentPath === item.to ? '#0070f3' : 'inherit'
                              }
                            })}
                            <span style={{
                              //color: currentPath === item.to ? '#0070f3' : 'inherit'
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
                  <Spacer h={1} />
                  <Button icon={<DollarSign />} onClick={() => setDrawerOpen(true)} auto scale={6 / 5} type="success" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Pay</Button>
                </div>
              </Card>
            </Grid>
          </Grid.Container>
        </Page.Header>
        <Outlet />
      </Page>
    </GeistProvider>
  );
}
