import type { Meta, StoryObj } from '@storybook/react'

import TransactionsPage from './TransactionsPage'

const meta: Meta<typeof TransactionsPage> = {
  component: TransactionsPage,
}

export default meta

type Story = StoryObj<typeof TransactionsPage>

export const Primary: Story = {}
