import {Container, Nav, Navbar, Form, Button} from "react-bootstrap"
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from "next/link";
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store.js';
import { addToHistory } from '../lib/userData';
import { removeToken, readToken } from '../lib/authenticate';

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();
    const [searchData, setSearchData] = useState();
    const [isExpanded, setIsExpanded] = useState(false);
    let token = readToken();
    async function submission(e) {
        e.preventDefault();
        setIsExpanded(false)
        router.push(`/artwork?title=true&q=${searchData}`);
        setSearchHistory(await addToHistory(`title=true&q=${searchData}`))
    }

    function logout() {   
      setIsExpanded(false)
      removeToken()
      router.push('/login')
    }
return (
    <>
      <Navbar className= "fixed-top navbar-dark bg-primary"  expand="lg" expanded={isExpanded}>
        <Container>
          <Navbar.Brand className="navbar-brand"> Pushpinder Kaur</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" onClick={(e)=>setIsExpanded(!isExpanded)}/>
            <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
          <Link href="/" passHref legacyBehavior><Nav.Link  onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/"}>Home</Nav.Link></Link>
          {token  && 
          <Link href="/search" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>}
          </Nav>

          
                    {token && 
          <Form onSubmit={submission} className="d-flex" setIsExpanded={false} >
            &nbsp;
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              
              onChange={(e) => setSearchData(e.target.value)}
              
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>}
          

          {token ? <Nav>
            &nbsp;
          <NavDropdown title={token.userName} id="basic-nav-dropdown">
          <Link href="/favourites" passHref legacyBehavior>
          <NavDropdown.Item onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item>
            </Link>
          <Link href="/history" passHref legacyBehavior>
          <NavDropdown.Item onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/history"}>Search History</NavDropdown.Item>
          </Link>
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
          </Nav>
          :
          <Nav >
            <Link href="/register" passHref legacyBehavior>
            <Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/register"}>Register</Nav.Link>
              </Link>
            <Link href="/login" passHref legacyBehavior>
            <Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/login"}>Login</Nav.Link>
              </Link>
          </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br /><br />
    </>)}