const DriverSearchBar = () => {
    return (
        <div className="mt-[20px] flex flex-row items-center w-1/2 min-w-[320px] pl-[15px] ml-[15px]">
            <img src="/icons/search_3917132.png" alt="search icon" className="w-[20px] h-[20px] mr-[-35px] z-30" />
            <input type="text" placeholder="Search Dirver's Name, DriverID, truckID, Phone number or Email" className="w-full h-[40px] py-2 pr-6 pl-[45px] rounded-full text-black">
            </input>
        </div>
    )
}
export default DriverSearchBar