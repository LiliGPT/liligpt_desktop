import ConfigIcon from '@mui/icons-material/Settings';
import { CircularProgress, SvgIcon } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import { selectCurrentTesting } from '../../../redux/slices/currentTesting';

export function TestingStatus() {
  const currentTesting = useAppSelector(selectCurrentTesting);

  let content;

  if (currentTesting.errorMessage) {
    content = (
      <span className="text-red-700">{currentTesting.errorMessage}</span>
    );
  }

  if (currentTesting.isLoading) {
    // content will be a loading spinner
    content = (
      <div>
        loading...
        <div className="animate-spin">
          <SvgIcon component={ConfigIcon} fontSize='small' />
        </div>
      </div>
    );
  }

  content = (
    <div>
      <div className="p-0.5">
        total coverage: <span className="text-yellow-500">45%</span>
      </div>
      {currentTesting.scripts && currentTesting.scripts.map((script) => {
        let testStatusColor = 'bg-gray-500';
        if (script.isSuccess === false) testStatusColor = 'bg-red-500';
        if (script.isSuccess === true) testStatusColor = 'bg-green-500';
        const testCoverage = `${script.coverage}%`;
        let testCoverageColor = 'text-gray-500';
        if (script.coverage > 80) testCoverageColor = 'text-green-500';
        else if (script.coverage > 50) testCoverageColor = 'text-yellow-500';
        else testCoverageColor = 'text-red-500';
        const coverageContent = script.coverage > 0 ? (
          <span className={testCoverageColor}>{' - '}{testCoverage}</span>
        ) : <></>;
        let testResult;
        if (script.isSuccess !== null) {
          testResult = script.isSuccess === false ? (
            <pre className="text-red-500 text-xs whitespace-break-spaces">{script.output}</pre>
          ) : (
            <></>
          );
        }
        const testStatus = script.isLoading ? (
          <span className="inline-block pr-2">
            <CircularProgress size={8} color="primary" />
          </span>
        ) : (
          <div className={`w-2 h-2 rounded-full ${testStatusColor} inline-block mr-2`}></div>
        );
        return (
          <div className="p-0.5" key={script.scriptValue}>
            {testStatus}
            <span>{script.scriptKey}</span>{coverageContent}
            {script.isSuccess === false && (<>
              <br />
              <span className="text-gray-500 text-xs">{script.scriptValue}</span>
            </>)}
            <br />
            {testResult}
          </div>
        );
      })}
    </div>
  )

  if (false) {
    content = (
      <div>
        Nenhum script de teste foi detectado para este projeto.
      </div>
    );
  } else if (false) {
    content = (
      <div>
        <div className="p-0.5">
          total coverage: <span className="text-yellow-500">45%</span>
        </div>
        <div className="p-0.5">
          <div className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></div>
          <span>npm run test</span> - <span className="text-yellow-500">45%</span>
        </div>
        <div className="p-0.5">
          <div className="w-2 h-2 rounded-full bg-red-500 inline-block mr-2"></div>
          <span>npm run test:api</span>{' - '}
          <span className="text-red-700">Cannot get property 'length' of undefined</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-200 text-gray-900 text-sm p-2 pl-3 pb-3 rounded-md mb-3">
      <div className="absolute right-2 top-1.5">
        <span onClick={() => { }}>
          <SvgIcon component={ConfigIcon} fontSize='small' />
        </span>
      </div>
      <h2>Testing Status</h2>

      {content}
    </div>
  );
}