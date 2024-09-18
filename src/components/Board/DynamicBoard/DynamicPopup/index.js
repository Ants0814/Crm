import BookingLimit from "../../../../Forms/BookingLimit";
import TimeControl from "../../../../Forms/TimeControl";

export default function DynamicPopup({ type ,rows,setIsShowDynamicPopup}){
    switch (type) {
        case 'None':
        return <></>
      case 'TimeControl':
        return <><TimeControl  setIsShowDynamicPopup={setIsShowDynamicPopup} rows={rows}/></>;
      case 'BookingLimit':
        return <><BookingLimit setIsShowDynamicPopup={setIsShowDynamicPopup} rows={rows}/></>;
      default:
        return <></>;
    }
  };
  