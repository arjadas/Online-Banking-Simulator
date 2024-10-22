import { Button, Card, Grid, Spacer, Text } from '@geist-ui/react';
import { Plus, User } from '@geist-ui/react-icons';
import React from 'react';
import { UserPrevContactResult } from '~/routes/app.paySomeone';
import ResizableText from './ResizableText';

interface ContactFormProps {
    contacts: UserPrevContactResult[];
    onSubmit: (selectedContact: UserPrevContactResult | null) => void;
}

const UserPrevContactForm: React.FC<ContactFormProps> = ({ contacts, onSubmit }) => {
    return (
        <Card width="100%" shadow style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Card.Content>
                <ResizableText h3>Pay Someone</ResizableText>
                <Spacer h={1} />
                <Grid.Container gap={2}>
                    {contacts.map((contact) => {
                        return contact.contact_user && <Grid key={contact.contact_user!.uid} xs={24}>
                            <Button
                                icon={<User size={48} />}
                                width="100%"
                                height="110%"
                                type="success-light"
                                style={{ marginBottom: 20 }}
                                onClick={() => onSubmit(contact)}
                                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px', flexDirection: 'column', marginTop: 5 }}>
                                    <ResizableText b >{contact.contact_user!.first_name + ' ' + contact.contact_user!.last_name}</ResizableText>
                                    <ResizableText small >{contact.contact_description}</ResizableText>
                                </div>
                            </Button>
                        </Grid>
                    })}
                    <Grid xs={24}>
                        <Button
                            icon={<Plus size={48} />}
                            width="100%"
                            height="110%"
                            type="secondary"
                            style={{ marginBottom: 20 }}
                            onClick={() => onSubmit(null)}
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px', flexDirection: 'column' }}>
                                <ResizableText b >New Contact</ResizableText>
                                <ResizableText small >Enter ACC/BSB, PayID & BPay</ResizableText>
                            </div>
                        </Button>
                    </Grid>
                </Grid.Container>
            </Card.Content>
        </Card>
    );
};

export default UserPrevContactForm;