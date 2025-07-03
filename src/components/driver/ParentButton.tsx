import useModal from "@/hooks/useModal";
import IndividualDriverModal from "./IndividualDriverModal";
import { Button } from "../ui/Button";

const ParentButton =()=>{
    const [isShowingModal, toggleModal] = useModal();

    return (
        <>
            <IndividualDriverModal show={isShowingModal} onCLoseButtonClick={toggleModal}/>
            <Button onClick={toggleModal}>Open</Button>
        </>
    )
}

export default ParentButton