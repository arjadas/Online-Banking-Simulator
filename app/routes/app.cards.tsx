import React, { useState } from "react";
import { Card, Text, Button, Grid, Spacer, Divider } from "@geist-ui/react";
import { CreditCard, Eye, EyeOff } from '@geist-ui/react-icons';

interface CardInfo {
  cardNumber: string;
  name: string;
  expiry: string;
  CSC: string;
  balance: number;
  cardType: 'Debit Card' | 'Credit Card';
}

export default function MyCards() {
  // Temporaly cards
  const cards: CardInfo[] = [{
      cardNumber: '1111 1111 1234 5678',
      name: 'JOHN BANKER',
      expiry: '12/24',
      CSC: '123',
      balance: 1200.50,
      cardType: 'Debit Card',
    }, {
      cardNumber: '2222 2222 2345 6789',
      name: 'JOHN BANKER',
      expiry: '11/25',
      CSC: '234',
      balance: 830.22,
      cardType: 'Debit Card',
    }, {
      cardNumber: '3333 3333 3456 7890',
      name: 'JOHN BANKER',
      expiry: '10/26',
      CSC: '345',
      balance: 520.10,
      cardType: 'Credit Card',
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

  return (
    <div style={styles.container}>
      <div style={styles.carouselContainer}>
        
        {/* Previous button */}
        <Button auto onClick={goToPrev} style={{ ...styles.arrowButton, left: '10px' }} {...({} as any)}>
          &#10094;
        </Button>

        {/* Carousel Content */}
        <div style={styles.carouselWrapper}>
          <div style={styles.mainCard}>
            <div
              style={{
                ...styles.slidesContainer,
                transform: `translateX(-${currentIndex * (100/cards.length)}%)`,
              }}
            >
              {cards.map((cardInfo, index) => (
                <div
                  style={{
                    ...styles.carouselCard,
                    ...(currentIndex === index ? styles.current : styles.preview),
                  }}
                >
                  <Card shadow width='450px' style={{ backgroundColor: '#ffffff' }}>

                    <Card.Content>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CreditCard size={30} />
                        <Text h4>{cardInfo.cardNumber}</Text>
                      </div>
                    </Card.Content>

                    <Divider style={{ backgroundColor: 'black', height: '2px' }}/>
                    
                    <Card.Content>
                      <Text b>{cardInfo.cardType}</Text>
                      <Text>${cardInfo.balance.toFixed(2)} <span style={{ color: 'gray', fontSize: '14px' }}>available</span></Text>

                      <Text >{cardInfo.name}</Text>
                      <Text>EXPIRY {showDetails[index]? cardInfo.expiry : '**/**'}</Text>
                      <Text>CSC {showDetails[index]? cardInfo.CSC : '***'}</Text>

                      {/* show/hide button */}
                      <Button onClick={() => toggleDetails(index)} shadow auto type="secondary-light" style={{ width: '150px'}} {...({} as any)}>
                          {showDetails[index] ? <EyeOff /> : <Eye />}
                          <Spacer w={1} />
                          {showDetails[index] ? 'Hide' : 'Show'}
                      </Button>
                    </Card.Content>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next button */}
        <Button auto onClick={goToNext} style={{ ...styles.arrowButton, right: '10px' }} {...({} as any)}>
          &#10095;
        </Button>
      </div>
      
      {/* Dots indicators */}
      <div style={styles.dotsContainer}>
        {cards.map((_, index) => (
          <div
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: currentIndex === index ? "#000" : "#ddd",
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as "relative",
    width: "100%",
    maxWidth: "1000px",
    margin: "50px auto",
    flexDirection: "column" as "column",
  },
  carouselContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as "relative",
    width: "100%",
    maxWidth: "1000px",
    margin: "50px auto",
    overflow: "hidden",
  },
  carouselWrapper: {
    display:"flex",
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    overflow: "hidden",
    position: "relative" as "relative",
  },
  slidesContainer: {
    display: "flex",
    transition: "transform 0.5s ease",
  },
  carouselCard: {
    minWidth: "450px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    transition: "transform 0.5s ease, opacity 0.5s ease",
  },
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
    position: "absolute" as "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  mainCard: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '450px',
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    margin: "0 5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};