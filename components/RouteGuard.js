import { isAuthenticated } from '../lib/authenticate';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { favouritesAtom } from '../store';
import { getFavourites, getHistory } from '../lib/userData';
const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    updateAtoms();
    authCheck(router.pathname)
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  function authCheck(url) {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  async function updateAtoms(){
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
   }

  return <>{authorized && props.children}</>
}