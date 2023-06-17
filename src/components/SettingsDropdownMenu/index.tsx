import { Settings } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  menuOptions: string[];
  callbacks: (() => void)[];
  iconClassName?: string;
}

export function SettingsDropdownButton(props: Props) {
  const [visible, setVisible] = useState(false);
  const iconClassName = `cursor-pointer ${props.iconClassName ?? ""}`;

  const onClickCallback = (index: number) => {
    return () => {
      setVisible(false);
      props.callbacks[index]();
    };
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setVisible(!visible)}>
          <Settings className={iconClassName} fontSize="small" />
        </span>
      </div>
      {visible && (
        <div className="z-50 origin-top-right absolute right-0 mt-0.5 w-44 rounded-md shadow-lg bg-slate-50 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {props.menuOptions.map((option, index) => (
              <div
                key={index}
                onClick={onClickCallback(index)}
                className="block px-4 py-1 text-xs text-slate-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
                role="menuitem"
              >{option}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
