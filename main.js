const express = require('express')
const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use(express.json())

const googleapikey = process.env.API_Key


async function getplaceID(textquery){
    const baseurl = "https://places.googleapis.com/v1/places:searchText"
    const headers ={
        "Content-Type": "application/json",
    "X-Goog-Api-Key": googleapikey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    }
    const body = {textQuery : textquery};
    const resp =await axios.post(baseurl,body,{headers});
    const places = resp.data?.places || [];
    if(!places.length) return null;
    const placeid = places[0].id
    getplacedetails(placeid);
}


async function getplacedetails(placeID){
    const fields = [
        "displayName",
        "reviews"
    ]
    const baseurl = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeID)}?fields=${encodeURIComponent(fields)}`;
    const headers = {"X-Goog-Api-Key": googleapikey}
    const response = await axios.get(baseurl,{headers});
    console.log(response.data.reviews);
}


app.listen(9000,()=>{
    getplaceID("Diamond Bell Inn and Suites Bell California")
})