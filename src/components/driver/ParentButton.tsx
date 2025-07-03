import useModal from "@/hooks/useModal";
import IndividualDriverModal from "./IndividualDriverModal";
import { Button } from "../ui/Button";

const ParentButton =()=>{
    const [isShowingModal, toggleModal] = useModal();

    return (
        <div>
            <Button onClick={toggleModal}>Open</Button>
            <IndividualDriverModal show={isShowingModal} onCLoseButtonClick={toggleModal}/>
        </div>
    )
}

export default ParentButton