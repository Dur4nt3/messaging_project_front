import './stylesheets/DotsLoader.css'

export default function DotsLoader({ testId = null }) {
    return (
        <div className='dots-loader' data-testid={testId ? testId : 'dots-loader'}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}
