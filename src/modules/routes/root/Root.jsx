import { useLoaderData } from 'react-router';

import HomeNav from './HomeNav';
import HomeHeader from './HomeHeader';
import AppOverview from './AppOverview';
import HomeFooter from './HomeFooter';

export default function Root() {
    const tokenExists = useLoaderData();

    return (
        <>
            <HomeNav auth={tokenExists} />
            <HomeHeader />
            <AppOverview />
            <HomeFooter />
        </>
    );
}
