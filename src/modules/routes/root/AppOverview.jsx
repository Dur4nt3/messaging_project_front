import './stylesheets/AppOverview.css';

function OverviewFragment({ title, description }) {
    return (
        <div className='overview-fragment'>
            <h2 className='fragment-title'>{title}</h2>
            {description}
        </div>
    );
}

export default function AppOverview() {
    return (
        <div className='app-overview-cont'>
            <OverviewFragment
                title='Open source'
                description={
                    <p>
                        Built in the open,
                        <br />
                        free to inspect.
                    </p>
                }
            />

            <OverviewFragment
                title='Simple by design'
                description={
                    <p>
                        No clutter, no noise,
                        <br />
                        just conversations.
                    </p>
                }
            />
            
            <OverviewFragment
                title='Free to use'
                description={
                    <p>
                        No subscriptions,
                        <br />
                        no paywalls.
                    </p>
                }
            />
        </div>
    );
}
