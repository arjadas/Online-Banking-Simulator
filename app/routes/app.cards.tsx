import { Button, Card, Divider, Grid, Spacer } from '@geist-ui/react';
import { CreditCard as CreditCardIcon, Eye, EyeOff } from '@geist-ui/react-icons';
import { CreditCard, DebitCard } from "@prisma/client";
import { LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ResizableText from '~/components/ResizableText';
import { openCard } from "~/service/cardService";
import { RootState } from '~/store';
import { toFixedWithCommas } from '~/util/util';
import { getUserSession } from '../auth.server';
import { getPrismaClient } from "../service/db.server";

interface balance {
  credit: number;
  debit: number;
}

interface CardInfo {
  cardNumber: string;
  name: string;
  expiry: string;
  CSC: string;
  balance: number;
  cardType: "Debit Card" | "Credit Card";
}

function isNumeric(value: any): boolean {
  return !isNaN(value);
}

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);
  const CARDDURATION = 13;

  if (!user) return json({ error: "Unauthenticated" }, { status: 401 });

  const [userData, userCreditAcc, userDebitAcc] = await Promise.all([
    db.user.findUnique({
      where: { uid: user.uid }
    }),
    db.account.findMany({
      where: { uid: user.uid, short_description: "Clever Credit" },
      select: { acc: true, balance: true },
    }),
    db.account.findMany({
      where: { uid: user.uid, short_description: "Delightful Debit" },
      select: { acc: true, balance: true },
    })
  ]);

  if (!userData) {
    console.error("User not found.");
    throw new Response("No user found!", { status: 404 });
  }
  if (!userCreditAcc) {
    console.error("Credit Account not found.");
    throw new Response("No Credit Account found!", { status: 404 });
  }
  if (!userDebitAcc) {
    console.error("Debit Account not found.");
    throw new Response("No Debit Account found!", { status: 404 });
  }

  const accBalance: balance = {
    credit: userCreditAcc[0].balance,
    debit: userDebitAcc[0].balance,
  }

  let [creditCardData, debitCardData] = await Promise.all([
    db.creditCard.findUnique({
      where: { accountId: userCreditAcc[0].acc }
    }),
    db.debitCard.findUnique({
      where: { accountId: userDebitAcc[0].acc }
    }),
  ]);

  if (!creditCardData) {
    // create a new card, we didn't find one
    creditCardData = await openCard(context, userCreditAcc[0].acc, userData.first_name, userData.last_name, CARDDURATION, "credit");
  }

  while (!isNumeric(creditCardData!.card_number)) {
    console.error("Credit Card number issue! Re-creating a new card..");

    await db.creditCard.delete({
      where: { accountId: userCreditAcc[0].acc },
    });

    creditCardData = await openCard(context, userCreditAcc[0].acc, userData.first_name, userData.last_name, CARDDURATION, "credit");
  }

  if (!debitCardData ) {
    // create a new card, we didn't find one
    debitCardData = await openCard(context, userDebitAcc[0].acc, userData.first_name, userData.last_name, CARDDURATION, "debit");
  }

  while (!isNumeric(debitCardData.card_number)) {
    console.warn("Debit Card number issue! Re-creating a new card..");

    await db.debitCard.delete({
      where: { accountId: userCreditAcc[0].acc },
    });

    debitCardData = await openCard(context, userDebitAcc[0].acc, userData.first_name, userData.last_name, CARDDURATION, "debit");
  }

  return json({
    creditCardData,
    debitCardData,
    accBalance,
  });
};

export default function MyCards() {
  const { creditCardData: creditCard, debitCardData: debitCard, accBalance: accBalance } = useLoaderData<{
    creditCardData: CreditCard;
    debitCardData: DebitCard;
    accBalance: balance;
  }>();
  const { textScale } = useSelector((state: RootState) => state.app);

  const cards: CardInfo[] = [{
    cardNumber: creditCard.card_number,
    name: creditCard.cardholder_name,
    expiry: creditCard.expiry_date,
    CSC: creditCard.csc,
    balance: accBalance.credit,
    cardType: "Credit Card"
  }, {
    cardNumber: debitCard.card_number,
    name: debitCard.cardholder_name,
    expiry: debitCard.expiry_date,
    CSC: debitCard.csc,
    balance: accBalance.debit,
    cardType: "Debit Card"
  }
  ];

  const [showDetails, setShowDetails] = useState<boolean[]>(Array(cards.length).fill(false));
  // Toggle show/hide for expiry and CVC details
  const toggleDetails = (index: number) => {
    setShowDetails((prevShowDetails) =>
      prevShowDetails.map((detail, i) => (i === index ? !detail : detail))
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper functions to calculate next and previous indexes
  const getPrevIndex = (index: number) => (index === 0 ? cards.length - 1 : index - 1);
  const getNextIndex = (index: number) => (index === cards.length - 1 ? 0 : index + 1);

  const goToNext = () => {
    setCurrentIndex(getNextIndex(currentIndex));
  };

  const goToPrev = () => {
    setCurrentIndex(getPrevIndex(currentIndex));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const cardWidth = () => {
    const maxWidth = 800
    const width = (textScale/15) * 500;
    if (width <= maxWidth) {
      return width;
    }
    return maxWidth;
  }

  return (
    <Grid.Container style={{ display: "flex", flexDirection: "column" }}>
      <Grid>
        <Grid.Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
          margin: "50px auto",
          overflow: "hidden",
        }}>
          <Grid>
            {/* Previous button */}
            <Button auto onClick={goToPrev} style={{ ...styles.arrowButton, left: "10px" }}
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              &#10094;
            </Button>
          </Grid>

          <Grid style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "85%",
            height: "100%",
            paddingBottom: "30px",
            overflow: "hidden",
            position: "relative",
          }}>

            {/* Carousel Content */}
            <Grid.Container style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "100%",
              width: `${cardWidth()}px`,
            }}>
              <Grid>
                <div
                  style={{
                    display: "flex",
                    transition: "transform 0.5s ease",
                    transform: `translateX(-${currentIndex * (100 / cards.length)}%)`,
                  }}
                >
                  {cards.map((cardInfo, index) => (
                    <Card key={index} shadow style={{
                      minWidth: `${cardWidth()}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      aspectRatio: 16 / 9,
                      padding: "10px",
                      transition: "transform 0.5s ease, opacity 0.5s ease",
                      ...(currentIndex === index ? styles.current : styles.preview),
                    }}>
                      <Card.Content>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <CreditCardIcon size={textScale * 2} />
                          <ResizableText h4>{cardInfo.cardNumber}</ResizableText>
                        </div>
                      </Card.Content>

                      <Divider h="2px" />

                      <Card.Content style={{ position: "relative" }}>
                        <ResizableText b>{cardInfo.cardType}</ResizableText>
                        <ResizableText>${toFixedWithCommas(cardInfo.balance / 100, 2)} <span style={{ color: "gray" }}>available</span></ResizableText>
                        <ResizableText>{cardInfo.name}</ResizableText>
                        <ResizableText>EXPIRY {showDetails[index] ? cardInfo.expiry : "**/**"}</ResizableText>
                        <ResizableText>CSC {showDetails[index] ? cardInfo.CSC : "***"}</ResizableText>

                        {/* show/hide button */}
                        <Button onClick={() => toggleDetails(index)} shadow auto type="secondary-light"
                          style={{
                            position: "absolute",
                            height: `${textScale * 2}`,
                            bottom: "10px",
                            right: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                          {showDetails[index] ? <EyeOff size={textScale * 1.3} /> : <Eye size={textScale * 1.3} />}
                          <Spacer w={1} />
                          {showDetails[index] ? <ResizableText>Hide</ResizableText> : <ResizableText>Show</ResizableText >}
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              </Grid>
            </Grid.Container>
          </Grid>

          <Grid>
            {/* Next button */}
            <Button auto onClick={goToNext} style={{ ...styles.arrowButton, right: "10px" }}
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              &#10095;
            </Button>
          </Grid>
        </Grid.Container>
      </Grid>

      <Grid>
        {/* Dots indicators */}
        <Grid.Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}>
          {cards.map((_, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              key={index}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                margin: "0 5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                backgroundColor: currentIndex === index ? "#000" : "#ddd",
              }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}

const styles = {
  current: {
    transform: "scale(1)",
    opacity: 1,
  },
  preview: {
    opacity: 0.5,
    transform: "scale(0.8)",
  },
  arrowButton: {
    fontSize: "2rem",
    position: "absolute" as const,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};