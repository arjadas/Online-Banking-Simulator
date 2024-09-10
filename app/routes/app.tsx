
import { Page, Text, Grid, } from '@geist-ui/core';
import { Outlet } from "@remix-run/react";
import DynamicTabs from '../components/DynamicTabs';

export default function AppLayout() {
  return (
    <Page>
      <Page.Header>
        <Grid.Container gap={2} justify="space-between" alignItems="center">
          <Grid>
            <Text h2>Learn to Bank</Text>
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
