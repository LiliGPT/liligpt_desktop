import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SvgIcon } from '@mui/material';
import { closeProjectThunk, openProjectThunk, selectProjects, selectRootProjects, setOpenedProjectUid } from '../../redux/slices/projectsSlice';

const EditorTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectRootProjects());

  const onClickOpenProject = () => {
    dispatch(openProjectThunk());
  };

  const onClickTab = (projectUid: string) => {
    dispatch(setOpenedProjectUid(projectUid));
  };

  const onClickCloseButton = (projectUid: string) => {
    dispatch(closeProjectThunk(projectUid));
  };

  return (
    <div className="flex flex-row">
      <div className="w-4/12"></div>
      <div className="flex flex-wrap gap-1 w-7/12">
        {projects.map((project) => (
          <div
            key={project.projectUid}
            className="flex-none relative px-4 py-1 bg-gray-200 rounded-tl rounded-tr text-sm"
          >
            <span className="mr-2" onClick={() => onClickTab(project.projectUid)}>{project.displayName}</span>
            <button className="absolute top-0 right-0 p-1" onClick={() => onClickCloseButton(project.projectUid)}>
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
