
import { Page, Text, Grid, Image } from '@geist-ui/core';
import { Outlet } from "@remix-run/react";
import DynamicTabs from '../components/DynamicTabs';

export default function AppLayout() {
  return (
    <Page>
      <Page.Header>
        <Grid.Container gap={2} justify="space-between" alignItems="center">
          <Grid>
            <Image height="200px" style={{padding: 0 }} src="/logo.png" />
          </Grid>
          <Grid>
            <Grid.Container gap={4}>
              <DynamicTabs />
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Page.Header>
      <Outlet />
    </Page>
  );
}
