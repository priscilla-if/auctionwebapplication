import React, {useEffect} from "react";
import CSS from "csstype";
import {Paper} from "@mui/material";
import axios from "axios";

interface IAuctionProps {
    auction: Auction
}

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
    display: "block",
    width: "fit-content"
}

const AuctionListObject = (props: IAuctionProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const [image, setImage] = React.useState("");



    const getImage = () => {
        (axios.get('http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image')
                .then((response) => {
                        setImage(response.data)
                    }))
    }

    React.useEffect(() => {
        getImage()
        console.log(image)
    }, [])

    return (
        <Paper elevation={3} style={card}>
        <div ><h3>{auction.title}</h3>
            <h3>{auction.highestBid}</h3>
            <h3>{auction.sellerFirstName}</h3>
            <h3>{auction.sellerLastName}</h3>
            <img src={image} alt={"lol"}/>
        </div>
        </Paper>


)
}
export default AuctionListObject