import React, { useEffect, useState } from 'react';
import { Card, Button, Spacer, Text, Grid } from '@geist-ui/react';
import { User, Plus } from '@geist-ui/react-icons';
import { UserPrevContact } from '@prisma/client';
import { UserPrevContactResult } from '~/routes/app.paySomeone';

interface ContactFormProps {
    contacts: UserPrevContactResult[];
    onSubmit: (selectedContact: UserPrevContactResult | null) => void;
}

const UserPrevContactForm: React.FC<ContactFormProps> = ({ contacts, onSubmit }) => {
    return (
        <Card width="100%" shadow>
            <Card.Content>
                <Text h3>Pay Someone</Text>
                <Spacer h={1} />
                <Grid.Container gap={1}>
                    {contacts.map((contact) => {
                        const contact_user = (contact?.contact_user ?? contact?.contact_mock_user)!

                        return <Grid key={contact_user.uid} xs={24}>
                            <Button
                                icon={<User />}
                                width="100%"
                                type="success-light"
                                onClick={() => onSubmit(contact)}
                                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <div style={{ marginLeft: '10px' }}>
                                    <Text b style={{ color: 'inherit' }}>{contact_user.first_name + ' ' + contact_user.last_name}</Text>
                                </div>
                            </Button>
                        </Grid>
                    })}
                    <Grid xs={24}>
                        <Button
                            icon={<Plus />}
                            width="100%"
                            type="secondary-light"
                            onClick={() => onSubmit(null)}
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <Text b style={{ color: 'inherit', marginLeft: '10px' }}>New Contact</Text>
                        </Button>
                    </Grid>
                </Grid.Container>
            </Card.Content>
        </Card>
    );
};

export default UserPrevContactForm;