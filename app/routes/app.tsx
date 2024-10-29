
import { Button, ButtonGroup, Card, Drawer, GeistProvider, Grid, Image, Page, Spacer, Tabs, Themes } from '@geist-ui/core';
import { DollarSign, Grid as GridIcon, Home, List, LogOut, Settings, Shuffle, User, CreditCard } from '@geist-ui/react-icons';
import { MetaFunction, Outlet, useMatches, useNavigate, Link } from "@remix-run/react";
import React from 'react';
import { useSelector } from 'react-redux';
import AuthenticatedLink from '~/components/AuthenticatedLink';
import ResizableText from '~/components/ResizableText';
import { RootState } from '../store';
import { ChevronRightCircle } from '@geist-ui/icons';

export const meta: MetaFunction = () => {
  return [
    { title: "Learn to Bank" },
    { name: "description", content: "Get a grasp on Australia's current online banking systems." },
  ];
};

const navItems = [
  { icon: <Home />, label: "Home", to: "/app/accounts" },
  { icon: <List />, label: "History", to: "/app/transactions" },
  { icon: <ChevronRightCircle />, label: "Upcoming", to: "/app/upcoming" },
  { icon: <CreditCard />, label: "Cards", to: "/app/cards" },
  { icon: <Settings />, label: "Settings", to: "/app/settings" },
  { icon: <LogOut />, label: "Logout", to: "/logout" },
];

export default function AppLayout() {
  const { isDarkTheme, textScale } = useSelector((state: RootState) => state.app);
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const lightTheme = Themes.createFromLight({ type: 'light1', palette: { success: "#009dff", } });
  const darkTheme = Themes.createFromDark({ type: 'dark1', palette: { background: "#111111", success: "#009dff", } });
  const matches = useMatches();
  const navigate = useNavigate();

  // Determine the current path from matches
  const currentPath = matches[matches.length - 1]?.pathname || '/';

  const buttonStyle = {
    width: textScale * 20,
    height: 75,
    fontSize: textScale,
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
            <ResizableText h2 style={{ margin: -10 }}>Pay</ResizableText>
          </Drawer.Title>
          <Drawer.Subtitle style={{ fontSize: `${textScale}px` }}>Initiate a transfer</Drawer.Subtitle>
          <Spacer h={2} />
          <AuthenticatedLink to="/app/transfer" prefetch="intent" style={{ textDecoration: 'none' }}>
            <Button
              style={buttonStyle}
              type='success-light'
              auto
              scale={2}
              onClick={() => setDrawerOpen(false)}
              icon={<Shuffle size={textScale}/>} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Transfer between accounts
            </Button>
          </AuthenticatedLink>
          <AuthenticatedLink to="/app/paySomeone" prefetch="intent" style={{ textDecoration: 'none' }}>
            <Button
              style={buttonStyle}
              type='success-light'
              auto
              scale={2}
              onClick={() => setDrawerOpen(false)}
              icon={<User size={textScale}/>} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Pay someone
            </Button>
          </AuthenticatedLink>
        </div>
      </Drawer>
      <Page margin={0} padding={0} style={{ margin: 0, padding: 0, width: "100vw" }}>
        <Page>
          <Page.Header>
            <Grid.Container gap={0} justify="space-between" alignItems="center">
              <Grid>
                <Image height="200px" style={{ margin: -20 }} src="/logo.png" />
              </Grid>
              <Grid>
                <Card padding={0.5} style={{ transformOrigin: 'top right' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    <ButtonGroup scale={6 / 5}>
                      {navItems.map((item, index) => {
                        const isSelected = currentPath === item.to;

                        return (<Button
                          key={index}
                          icon={
                            <span style={{display:'flex',alignItems:'center', scale: `${textScale/13}`}}>
                              {React.cloneElement(item.icon)}
                            </span>
                            }
                          onClick={() => navigate(item.to)}
                          style={{
                            fontSize: textScale,
                            backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                            borderBottom: isSelected ? '2px solid #000' : 'none',
                            borderRadius: 0,
                          }}
                          auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {item.label}
                        </Button>)
                      })}
                    </ButtonGroup>
                    <Spacer w={1} />
                    <Button 
                      icon={
                        <span style={{display:'flex',alignItems:'center', scale: `${textScale/13}`}}>
                          {<DollarSign/>}
                        </span>
                      } 
                      onClick={() => setDrawerOpen(true)} 
                      auto scale={6 / 5} 
                      type="success" 
                      style={{fontSize: textScale}}
                      placeholder={undefined} 
                      onPointerEnterCapture={undefined} 
                      onPointerLeaveCapture={undefined}
                    >
                      Pay
                    </Button>
                  </div>
                </Card>
              </Grid>
            </Grid.Container>
          </Page.Header>
          <Page.Content>
            <Outlet />
            <Spacer h={4} />
          </Page.Content>
        </Page>
        <Page.Footer>
          <div style={{
            textAlign: 'center',
            padding: 20,
            margin: 0,
            borderTop: '1px solid #eaeaea',
            backgroundColor: "white",
            marginTop: 20
          }}>
            <ResizableText p style={{ color: '#666', margin: 0 }}>
              Learn to Bank is an educational simulation of Australian online banking systems.
              All transactions and balances are simulated for learning purposes.
            </ResizableText>
            <ResizableText small style={{ color: '#999', marginTop: '10px' }}>
              © {new Date().getFullYear()} The University of Melbourne. All rights reserved.
            </ResizableText>
          </div>
        </Page.Footer>
      </Page>
    </GeistProvider>
  );
}