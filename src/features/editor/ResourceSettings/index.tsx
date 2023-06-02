import CloseIcon from '@mui/icons-material/Close';

type Props = {
  onClickCloseButton: () => void;
}

export function ResourceSettings({ onClickCloseButton }: Props) {
  return (
    <div className="flex items-stretch flex-col">
      <div className="flex flex-row">
        <div className="flex flex-col w-2/6">
          &nbsp;
        </div>
        <div className="flex flex-col w-4/6">
          <div className="flex flex-row relative">
            <div className="absolute right-2 top-2">
              <span onClick={onClickCloseButton}>
                <CloseIcon />
              </span>
            </div>
            form here
          </div>
        </div>
      </div>
    </div>
  );
}
