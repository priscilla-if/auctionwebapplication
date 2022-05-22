import axios from 'axios';
import React, {useEffect} from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    TextField,
    IconButton,
    InputAdornment,
    Button,
    InputLabel,
    FormControl, MenuItem, Select, Pagination
} from "@mui/material";
import {useUserStore} from "../store";
import AuctionListObject from "./AuctionListObject";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import EditIcon from "@mui/icons-material/Edit";
import MultiSelect from './MultiSelect';



const AuctionList = () => {


    const [auctionLength, setAuctionLength] = React.useState<number>(0);

    // To access the value of the state and the functions we defined, changing it from other components
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])

    // For Select closed/open queries
    const [openClosedQuery, setOpenClosedQuery] = React.useState("ANY");
    const updateClosedQueryState = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setOpenClosedQuery(event.target.value)
    }

    // For pagination - startIndex queries
    const [paginationQuery, setPaginationQuery] = React.useState(1);
    const updatePaginationQuery = async (event: any, page: any) => {
        setPaginationQuery(page * 10 - 10)

    }

    // For MultiSelect queries - categories
    const [multiSelectCategories, setMultiSelectCategories] = React.useState<string[]>([]);
    const [categoryQuery, setCategoryQuery] = React.useState<number[]>([]);

    const updateMultiSelect = (categoryIds: string[]) => {
        let numsArray = [];
        setMultiSelectCategories(categoryIds);
        for (let categoryId of categoryIds) {
            numsArray.push(parseInt(categoryId, 10))
        }
        setCategoryQuery(numsArray)
    }

    // Error flags for queries

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    // Search query for string and sorting variables and functions
    const [query, setQuery] = React.useState("");
    const [sortQuery, setSortQuery] = React.useState("CLOSING_SOON");

    const searchAuctions = (query:String) => {
        console.log("hello")
        axios.get('http://localhost:4941/api/v1/auctions', {params: {q:query, sortBy: sortQuery, categoryIds: categoryQuery, status: openClosedQuery, startIndex: paginationQuery, count: 10}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
            })
        getAuctionLength()

    }

    const updateSortQueryState = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSortQuery(event.target.value)
    }

    const updateQueryState = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuery(event.target.value)
    }


    useEffect(() => {
        searchAuctions(query)
    }, [paginationQuery]);

    const getAuctionLength = () => {
        axios.get('http://localhost:4941/api/v1/auctions', {params: {q:query, sortBy: sortQuery, categoryIds: categoryQuery, status: openClosedQuery}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctionLength(response.data.auctions.length)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
            })
    }

    // useEffect(() => {
    //     getAuctionLength()
    // }, [searchAuctions]);


    // Get auctions as soon as page is rendered
    React.useEffect(() => {
        getAuctionLength();
        searchAuctions(query);
    }, [])

    const auction_rows = () => auctions.map((auction: Auction) =>
        <AuctionListObject key={auction.auctionId + auction.title} auction={auction}/>)

    // CSS properties for buttons and cards

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        // width: "fit-content"
    }

    const buttonCSS: CSS.Properties = {
        padding: "10px"
    }

    return (
        <Paper elevation={3} style={card}>
            <h1>Auctions List</h1>
            <div>
                <div style={buttonCSS}>
            <TextField id="outlined-basic" label="Search" variant="outlined" value={query} onChange={updateQueryState} />
                </div>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sortQuery}
                        label="Sort By"
                        onChange={updateSortQueryState}
                    >
                        <MenuItem value={"ALPHABETICAL_ASC"}>Alphabetical A-Z</MenuItem>
                        <MenuItem value={"ALPHABETICAL_DESC"}>Alphabetical Z-A</MenuItem>
                        <MenuItem value={"BIDS_ASC"}>Ascending Bids</MenuItem>
                        <MenuItem value={"BIDS_DESC"}>Descending Bids</MenuItem>
                        <MenuItem value={"RESERVE_ASC"}>Ascending Reserve</MenuItem>
                        <MenuItem value={"RESERVE_DESC"}>Descending Reserve</MenuItem>
                        <MenuItem value={"CLOSING_LAST"}>Closing Last</MenuItem>
                        <MenuItem value={"CLOSING_SOON"}>Closing Soon</MenuItem>
                    </Select>
                </FormControl>
                <div><MultiSelect categoryIds={multiSelectCategories} updateMultiSelect = {updateMultiSelect}/></div>
                <div><FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Open - Closed</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={openClosedQuery}
                        label="Open/Closed/All"
                        onChange={updateClosedQueryState}
                    >
                        <MenuItem value={"OPEN"}>Open</MenuItem>
                        <MenuItem value={"CLOSED"}>Closed</MenuItem>
                        <MenuItem value={"ANY"}>All</MenuItem>
                    </Select>
                </FormControl></div>
                <div style={buttonCSS}><Button variant="outlined" endIcon={<SearchOutlined/>} onClick={() => searchAuctions(query)}>Search</Button></div>
            </div>
            <div style={{display:"block", maxWidth:"965px",
                minWidth:"320"}}>
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                {auction_rows()}
            </div>

            <Pagination count={Math.ceil(auctionLength / 10)} showFirstButton showLastButton onChange={updatePaginationQuery}/>

        </Paper>



    )
}
export default AuctionList;