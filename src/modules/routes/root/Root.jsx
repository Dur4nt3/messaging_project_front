import HomeNav from './HomeNav';
import HomeHeader from './HomeHeader';
import AppOverview from './AppOverview';
import HomeFooter from './HomeFooter';

export default function Root() {
    return (
        <>
            <HomeNav />
            <HomeHeader />
            <AppOverview />
            <HomeFooter />
        </>
    );
}
