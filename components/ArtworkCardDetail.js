import useSWR from 'swr';
import {Button, Card} from 'react-bootstrap';
import Error from "next/error";
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store.js';
import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from '../lib/userData';

export default function ArtworkCardDetail(props){
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(favouritesList?.includes(props.objectID)?true: false);
    
    useEffect(()=>{
        setShowAdded(favouritesList?.includes(props.objectID))
       }, [favouritesList])
    
       async function favouritesClicked(){
        if (showAdded==false) {
            setFavouritesList(await addToFavourites(props.objectID))
            setShowAdded(true)
        }
        else{
            setFavouritesList(await removeFromFavourites(props.objectID))
            setShowAdded(false)
        }
    }
    const { data, error } = useSWR(props.objectID?`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`:null);
    if(error){
        return(
            <Error statusCode={404} />
        )
    }
    else if(data){
        return (
            <Card>
            {data.primaryImage? <Card.Img variant="top"  src={data.primaryImage} />:""}
            <Card.Body>
                <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                <Card.Text> <strong>Date: </strong>{data.objectDate ? data.objectDate:"N/A"} <br/>
                <strong>Classification: </strong>{data.classification? data.classification:"N/A"}<br/>
                <strong>Medium: </strong>{data.medium ? data.medium : "N/A"}<br/> <br/>
                <strong>Artist: </strong>{data.artistDisplayName ? data.artistDisplayName +" ( ":"N/A"}
                {data.artistDisplayName?  <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>: ""}
                {data.artistDisplayName?" )":""}
                <br/>
                <strong>Credit Line: </strong>{data.creditLine? data.creditLine:"N/A"}<br/>
                <strong>dimensions: </strong>{data.dimensions ? data.dimensions : "N/A"}<br/> <br/>
                <Button variant='primary' onClick={(e)=>favouritesClicked()}>{showAdded?"+ Favourite (added)":"+ Favourite"}</Button>
                </Card.Text>
            </Card.Body>
        </Card>
        );
    }
    else{
        return null;
    }

}

