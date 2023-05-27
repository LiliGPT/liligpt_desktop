import { TreeItem, TreeItemProps, TreeView, treeItemClasses } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { SvgIcon, SvgIconProps } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { OptionalRenderTree, RenderTree, loadRenderTree, selectEditorCurrentProject } from "../slice";

/*
const data: RenderTree = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};
*/

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    // paddingLeft: 18,
    paddingLeft: 0,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export function FileSystemTree() {
  const dispatch = useAppDispatch();
  const renderTree = useAppSelector(selectEditorCurrentProject);

  useEffect(() => {
    dispatch(loadRenderTree());
  }, []);


  if (renderTree.errorMessage) {
    return <div>Error: {renderTree.errorMessage}</div>;
  }

  if (renderTree.isLoading) {
    return <div>loading...</div>;
  }

  if (!renderTree.renderTree) {
    return <div>...</div>;
  }

  // return <div>{JSON.stringify(renderTree.renderTree)}</div>;

  // todo: get projectDir from redux
  const buildTree = (nodes: RenderTree) => (
    <StyledTreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => buildTree(node))
        : null}
    </StyledTreeItem>
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultExpanded={[renderTree.renderTree.name]}
      // defaultCollapseIcon={<ExpandMoreIcon />}
      // defaultExpandIcon={<ChevronRightIcon />}
      // https://www.schemecolor.com/windows-10-folder-yellow-colors.php
      defaultCollapseIcon={< FolderIcon htmlColor="#F8D775" />}
      defaultExpandIcon={< FolderIcon htmlColor="#D8B755" />}
      defaultEndIcon={< FileIcon color="action" />}
    // sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {buildTree(renderTree.renderTree)}
    </TreeView >
  );
}