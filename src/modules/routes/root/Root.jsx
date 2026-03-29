import { useLoaderData } from 'react-router';

import HomeNav from './HomeNav';
import HomeHeader from './HomeHeader';
import AppOverview from './AppOverview';
import HomeFooter from './HomeFooter';

export default function Root() {
    const userData = useLoaderData();

    return (
        <>
            <HomeNav name={userData?.name || null}/>
            <HomeHeader />
            <AppOverview />
            <HomeFooter />
        </>
    );
}
