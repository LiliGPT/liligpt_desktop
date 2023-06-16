import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SvgIcon } from '@mui/material';
import { closeProjectThunk, openProjectThunk, selectCurrentProject, selectProjects, selectRootProjects, setOpenedProjectUid } from '../../redux/slices/projectsSlice';
import { CustomButton } from '../buttons/CustomButton';

const EditorTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectRootProjects());
  const currentProjectUid = useAppSelector(selectCurrentProject())?.projectUid;

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
    <div className="flex flex-row pt-2 bg-slate-500 border-b-slate-300 border-b-2">
      <div className="flex flex-wrap w-11/12">
        {projects.map((project) => {
          const isActive = project.projectUid === currentProjectUid;
          let className = 'flex-none relative ml-1 px-4 py-1 rounded-tl rounded-tr text-sm cursor-pointer';
          className += `${isActive ? ' bg-slate-200' : ' bg-slate-400 hover:bg-slate-200'}`;
          return (
            <div
              key={project.projectUid}
              className={className}
              onClick={() => onClickTab(project.projectUid)}
            >
              <span className="mr-2">{project.displayName}</span>
              <button className="absolute top-0 right-0 p-1" onClick={() => onClickCloseButton(project.projectUid)}>
                <CloseIcon fontSize='small' />
              </button>
            </div>
          );
        })}
      </div>
      <div className="w-1/12 text-right pr-2">
        {/*<span className="px-2 py-1 text-white bg-slate-400 hover:bg-slate-200 hover:text-gray-500 text-xs rounded-md cursor-pointer font-bold" onClick={onClickOpenProject}>
          open
      </span>*/}
        <CustomButton
          className="absolute right-1 top-1"
          label="open"
          onClick={onClickOpenProject}
          size="small"
          color="normal"
        />
      </div>
    </div>
  );
};

export default EditorTabs;
