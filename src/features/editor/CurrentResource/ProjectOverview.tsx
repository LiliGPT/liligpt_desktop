import { notification } from "@tauri-apps/api";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { Button } from "@mui/material";
import { TestingStatus } from "./TestingStatus";
import { LocalServerBlock } from "../LocalServerBlock";
import { installDependenciesThunk, selectCurrentProject } from "../../../redux/slices/projectsSlice";
import { AskMissionInput } from "./AskMissionInput";

export function ProjectOverview() {
  const currentProject = useAppSelector(selectCurrentProject())!;
  const dispatch = useAppDispatch();

  const onClickInstallDependencies = async () => {
    dispatch(installDependenciesThunk(currentProject.projectUid));
  };

  const isValidLanguage = currentProject.codeLanguage !== 'Unknown';
  const isValidFramework = !!(isValidLanguage && currentProject.framework !== 'Unknown');

  // header will be horizontal with title <h1/> and a clickable config icon in the right
  const header = (
    <div>
      <h1>{currentProject.displayName}</h1>
    </div>
  );

  const ver_logs = (
    <a href="#">ver logs</a>
  );

  const db_buttons = (
    <>
      <a href="#">conectar</a> -{' '}
      <a href="#">dados de conexão</a>
    </>
  );

  let dependencyAction;
  if (currentProject.dependencies.isLoading) {
    dependencyAction = (
      <span className="text-orange-400 italic text-xs">instalando...</span>
    );
  } else if (isValidFramework && !currentProject.dependencies.isInstalled) {
    dependencyAction = (
      <Button variant="text" color="primary" onClick={onClickInstallDependencies}>Instalar</Button>
    );
  }

  return (
    <div className="w-full p-2">
      {header}

      <ul className="list-disc list-inside ml-1 mb-5">
        <li>Linguagem: {currentProject.codeLanguage}</li>
        <li>Framework: {currentProject.framework}</li>
        <li>
          Dependências Instaladas: {currentProject.dependencies.isInstalled ? 'Sim' : 'Não'}
          {' '}
          {dependencyAction}
        </li>
      </ul>

      {isValidLanguage && <LocalServerBlock />}

      {isValidFramework && <TestingStatus />}

      {isValidLanguage && isValidFramework && <AskMissionInput />}

      {/*
      <h2>Aplicações rodando</h2>
      <ul className="list-disc list-inside ml-1 mb-5 text-sm">
        <li>develop - https://develop.exemplo.com.br/api/v2 - {ver_logs}</li>
        <li>homolog - https://homolog.exemplo.com.br/api/v2 - {ver_logs}</li>
        <li>production - https://exemplo.com.br/api/v2 - {ver_logs}</li>
      </ul>

      <h2>Bancos de dados</h2>
      <ul className="list-disc list-inside ml-1 mb-5 text-sm">
        <li>develop - {db_buttons}</li>
        <li>homolog - {db_buttons}</li>
        <li>production - {db_buttons}</li>
      </ul>

      <div className="flex flex-col items-start">
        <h2>Ações</h2>
        <div className="flex flex-row items-start space-x-2">
          <Button variant="contained" color="primary">Nova missão</Button>
          <Button variant="contained" color="primary">Sugestões de melhoria</Button>
        </div>
      </div>
      */}
    </div>
  );
}