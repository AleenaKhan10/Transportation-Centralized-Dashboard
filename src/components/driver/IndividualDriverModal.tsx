import { Button } from '../ui/Button'
import { motion } from 'framer-motion'

const tbodyData = [
    ["Safty", "check_17681948", "protection_3306551"],
    ["HOS", "check_17681948", "alarm-clock_661568"],
    ["Maintainence", "check_17681948", "tools_10161143"],
    ["Dispatch", "check_17681948", "phone-call_4213179"]
]
const IndividualDriverModal = ({ show, onCLoseButtonClick }: { show: Boolean, onCLoseButtonClick: () => void }) => {
    if (!show) {
        return null
    }
    return (
        <div className='w-[400px] h-[557px]'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-[35px] shadow-2xl border border-dark-700/50"
            >
                <div className='flex flex-col gap-y-[10px] items-center'>
                    <div className='h-1/4 flex flex-row items-center justify-center gap-[20px]'>
                        <img src="/icons/avatar.png" className='w-[105px] h-[105px] rounded-full' />
                        <div className='flex flex-col gap-y-[5px]'>
                            <p className='text-2xl font-bold'>Syafiq</p>
                            <div className='flex flex-row items-center gap-x-[5px]'>
                                <img src="/icons/check_3472620.png" alt="check" className='w-[20px] h-[20px]' />
                                <p className='text-[15px]'>Working</p>
                            </div>
                            <div className='flex flex-row items-center gap-x-[5px]'>
                                <img src="/icons/recycling_8980951.png" alt="check" className='w-[20px] h-[20px]' />
                                <p className='text-[15px]'> Under Load</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-[5px]'>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/globe_11856835.png" alt="check" className='w-[20px] h-[20px]' />
                            <div className='flex justify-between items-center w-[260px]'>
                                <p className='text-[15px]'>Primary Language:</p>
                                <p className='text-[15px]'>English</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/globe_11856987.png" alt="check" className='w-[20px] h-[20px]' />
                            <div className='flex justify-between items-center w-[260px]'>
                                <p className='text-[15px]'>Secondary Language:</p>
                                <p className='text-[15px]'>Polish</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-[10px] w-[290px]'>
                        <input type="checkbox" className='w-[20px] h-[20px]' />
                        <p className='text-[15px]'>Do Not Disturb</p>
                    </div>
                    <div className='w-[350px] border border-bottom-width-[0.5px] border-dark-700'></div>
                    <div className='flex justify-center items-center w-[290px]'>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/chat_5193582.png" alt="check" className='w-[20px] h-[20px]' />
                            <p className='text-center text-[18px] font-bold'> Communication Permission</p>
                        </div>
                    </div>
                    <table className='w-[290px]'>
                        <thead>
                            <tr>
                                <td></td>
                                <td>
                                    <div className='flex flex-row justify-center items-center'><p className='text-[15px]'>Call</p>
                                    </div>
                                </td>
                                <td>
                                    <div className='flex flex-row justify-center items-center'>
                                        <p className='text-[15px]'>Text</p>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody className='border border-dark-700'>
                            {tbodyData.map((row) => (
                                <tr>
                                    <td>
                                        <div className="p-[3px] pl-[10px] flex flex-row gap-x-[10px] items-center">
                                            <img src={`/icons/${row[2]}.png`} alt="check" className="w-[20px] h-[20px]" />
                                            <p className='text-[15px]'>{row[0]}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='flex flex-row justify-center items-center p-[3px]'>
                                            <img src={`/icons/${row[1]}.png`} alt="check" className="w-[20px] h-[20px]" />
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <div className='flex flex-row justify-center items-center p-[3px]'>
                                            <img src={`/icons/${row[1]}.png`} alt="check" className="w-[20px] h-[20px]" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='w-[350px] border border-bottom-width-[0.5px] border-dark-700'></div>
                    <div className='flex flex-col gap-y-[5px] items-center w-[290px]'>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/bar-chart_9249549.png" alt="check" className='w-[20px] h-[20px]' />
                            <p className='text-[18px] font-bold'>System Access Permission</p>
                        </div>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/trolley_4722232.png" alt="check" className='w-[20px] h-[20px]' />
                            <p className='text-[15px] text-left'>Logistic Tracking</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-[5px]'>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/telephone_17580897.png" alt="check" className='w-[20px] h-[20px]' />
                            <div className='flex justify-between items-center w-[260px]'>
                                <p className='text-[14px]'>Call Allowed Hours:</p>
                                <p className='text-[14px]'>8:00 AM-5:00 PM</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-[10px]'>
                            <img src="/icons/comment_4015902.png" alt="check" className='w-[20px] h-[20px]' />
                            <div className='flex justify-between items-center w-[260px]'>
                                <p className='text-[14px]'>Text Allowed Hours:</p>
                                <p className='text-[14px]'>8:00 AM-5:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={onCLoseButtonClick}>Close</Button>
            </motion.div>
        </div>
    )
}

export default IndividualDriverModal;
