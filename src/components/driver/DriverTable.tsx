import useModal from "@/hooks/useModal";
import IndividualDriverModal from "./IndividualDriverModal";
import { Button } from "../ui/Button";

const DriverTable = () => {
    const [isShowingModal, toggleModal] = useModal();
    const sampleData = [
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
        ["103SANZHARBEK", null, "SANZHARBEK", "BOTOBAEV", null, "7244674444", "usarmy4444s@gmail.com", "2018-06-04T00:00:00.000Z", "2020-05-20T19:52:03.720Z", "MAIN"],
     
        
    ];
    return (
        <div className="mt-[50px] px-[30px] py-[20px] bg-dark-700 rounded-2xl">
            <IndividualDriverModal show={isShowingModal} onCLoseButtonClick={toggleModal}/>
            <table className="border border-dark-800 px-2 py-3">
                <thead>
                    <tr className="text-left">
                        <th className="border border-dark-800 px-2 py-3">Driver ID</th>
                        <th className="border border-dark-800 px-2 py-3">Status</th>
                        <th className="border border-dark-800 px-2 py-3">First Name</th>
                        <th className="border border-dark-800 px-2 py-3">Last Name</th>
                        <th className="border border-dark-800 px-2 py-3">Truck ID</th>
                        <th className="border border-dark-800 px-2 py-3">Phone Number</th>
                        <th className="border border-dark-800 px-2 py-3">Email Address</th>
                        <th className="border border-dark-800 px-2 py-3">Hired On</th>
                        <th className="border border-dark-800 px-2 py-3">Updated On</th>
                        <th className="border border-dark-800 px-2 py-3">Company ID</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((item, index) => (
                        <tr onClick={toggleModal} className="hover:bg-dark-900 cursor-pointer"  key={item[0] || index}>
                            <td className="border border-dark-800 px-2 py-3 px-2 py-3">{item[0] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[1] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[2] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[3] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[4] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[5] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[6] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[7]?.split("T")[0] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[8]?.split("T")[0] || "None"}</td>
                            <td className="border border-dark-800 px-2 py-3 px-2">{item[9] || "None"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button/>
        </div>)

}
export default DriverTable