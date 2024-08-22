import { Link } from "react-router-dom"
interface BottomWarning{
    label: string;
    buttonText: string;
}

export function BottomWarning({label, buttonText}: BottomWarning) {
    return <div className="py-2 text-sm flex justify-center">
      <div>
        {label}
      </div>
      <Link className="pointer underline pl-1 cursor-pointer" to={"#"}>
        {buttonText}
      </Link>
    </div>
}