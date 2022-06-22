import { CardMedia } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";

const images = [
  {
    id: 1,
    src: "/images/coverbig.jpg",
  },
  {
    id: 2,
    src: "/images/hein_htet2.jpg",
  },
];

const Banner = ({ src }) => {
  return (
    <Card>
      <CardMedia sx={{width: 'full', height: 'full'}} component="img" image={src} alt="carousel images" />
    </Card>
  );
};

const CarouselImage = () => {
  return (
    <Carousel sx={{minWidth: '35vw'}} height={400} animation="slide" duration="1000" interval={5000}>
      {images.map((img) => (
        <Banner key={img.id} src={img.src} />
      ))}
    </Carousel>
  );
};

export default CarouselImage;
