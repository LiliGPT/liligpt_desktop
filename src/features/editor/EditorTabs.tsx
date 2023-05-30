import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { EditorTab, closeProjectByTabIdThunk, openProjectThunk, selectEditorTabs, setCurrentTabIdThunk } from '../../redux/slices/currentProject';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SvgIcon } from '@mui/material';

const EditorTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector(selectEditorTabs);

  const onClickOpenProject = () => {
    dispatch(openProjectThunk());
  };

  const onClickTab = (tabId: string) => {
    dispatch(setCurrentTabIdThunk(tabId));
  };

  const onClickCloseButton = (tabId: string) => {
    dispatch(closeProjectByTabIdThunk(tabId));
  };

  return (
    <div className="flex flex-row">
      <div className="w-4/12"></div>
      <div className="flex flex-wrap gap-1 w-7/12">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="flex-none relative px-4 py-1 bg-gray-200 rounded-tl rounded-tr text-sm"
          >
            <span className="mr-2" onClick={() => onClickTab(tab.id)}>{tab.displayName}</span>
            <button className="absolute top-0 right-0 p-1" onClick={() => onClickCloseButton(tab.id)}>
              <CloseIcon fontSize='small' />
            </button>
          </div>
        ))}
      </div>
      <div className="w-1/12 text-right pr-2">
        <span className="text-blue-400" onClick={onClickOpenProject}>
          open
        </span>
      </div>
    </div>
  );
};

export default EditorTabs;
