interface Props {
  title: string;
}

export function MainAppTitle({ title }: Props) {
  return (
    <div className="flex flex-row pt-2 bg-slate-500 border-b-slate-300 border-b-2">
      <h1
        className="text-sm h-3 px-2 text-white"
      >{title}</h1>
    </div>
  );
};
