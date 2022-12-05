import {useState} from 'react';
import { useRouter } from 'next/router';
import { Card, Form, Button, Alert } from "react-bootstrap";
import { authenticateUser } from "../lib/authenticate";
import { useAtom } from 'jotai';
import { searchHistoryAtom , favouritesAtom} from '../store';
import { getFavourites, getHistory } from '../lib/userData';

export default function Login(){
  const router = useRouter();
  const [warning, setWarning] = useState()
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await authenticateUser(userName, password)
      await updateAtoms()
      router.push("/favourites")
    }catch(err){
      setWarning(err.message);
    }}

  async function updateAtoms(){
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
    }

  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label><Form.Control value={userName} onChange={e=>setUserName(e.target.value)} type="text" id="userName" name="userName" />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label><Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" id="password" name="password" />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button><br /><br />
        { warning && 
        <Alert variant="danger">
          {warning}
        </Alert>}
      </Form>
    </>
  );
}