import { notification } from "@tauri-apps/api";
import { selectEditorCurrentProject } from "../slice"
import { useAppSelector } from "../../redux/hooks"
import ConfigIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material";

export function ProjectOverview() {
  const currentProject = useAppSelector(selectEditorCurrentProject);

  const onClickConfigButton = async () => {
    alert('TODO: open config modal');
  };

  // header will be horizontal with title <h1/> and a clickable config icon in the right
  const header = (
    <div className="flex flex-row justify-between items-center">
      <h1>{currentProject.displayName}</h1>
      <span className="cursor-pointer" onClick={onClickConfigButton}>
        <ConfigIcon className="-mt-6 cursor-pointer" />
      </span>
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

  return (
    <div className="w-full p-2">
      {header}
      <p className="mb-5 italic text-gray-400">Vou colocar aqui o que vou fazer em sequência.</p>

      <h2>Sobre o Projeto</h2>
      <ul className="list-disc list-inside ml-1 mb-5">
        <li>Linguagem: Node.js</li>
        <li>Framework: Nestjs</li>
        <li>
          Estado atual dos testes
          <span className="block ml-5">
            <ul className="list-disc list-inside">
              <li>Testes unitários</li>
              <li>Testes de integração</li>
              <li>Coverage: 85%</li>
            </ul>
          </span>
        </li>
        <li>Padronização do código - Modular</li>
      </ul>

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
    </div>
  );
}