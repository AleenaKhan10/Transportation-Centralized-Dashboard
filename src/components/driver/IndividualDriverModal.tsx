import {Button} from '../ui/Button'
const IndividualDriverModal = ({show, onCLoseButtonClick}: {show: Boolean, onCLoseButtonClick: ()=> void}) => {
    if(!show) {
        return null
    }

    return (
        <div className='max-w-md h-[534px] border-white rounded-lg shadow-md bg-white-950'>
            <h1>Individaul Driver Modal</h1>
            <Button onClick={onCLoseButtonClick}>Close</Button>
        </div>
    )
}

export default IndividualDriverModal;
