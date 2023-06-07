interface Props {
  action_type: string;
  content: string | null;
  path: string;
}

export function ExecutableAction(props: Props) {
  const { action_type, path } = props;

  return (
    <div className="px-2 py-1 mt-0.5 bg-slate-200 rounded-md">
      {action_type} - {path}
    </div>
  );
}