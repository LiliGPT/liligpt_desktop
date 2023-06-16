import { CircularProgress, SvgIcon } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { ReduxTest, runTestThunk, selectTestsFromProject } from '../../../redux/slices/testsSlice';
import { selectCurrentProject } from '../../../redux/slices/projectsSlice';
import PlayIcon from '@mui/icons-material/PlayArrow';

export function TestingStatus() {
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectCurrentProject())!;
  const tests: ReduxTest[] = useAppSelector(selectTestsFromProject(project.projectUid));

  let content;

  content = (
    <div>
      {/*<div className="p-0.5">
        total coverage: <span className="text-yellow-500">45%</span>
      </div>*/}
      {tests.map((test: ReduxTest) => {
        let testStatusColor = 'bg-gray-500';
        if (test.isSuccess === false) testStatusColor = 'bg-red-500';
        if (test.isSuccess === true) testStatusColor = 'bg-green-500';
        const testCoverage = `${test.coverage}%`;
        let testCoverageColor = 'text-gray-500';
        if (test.coverage > 80) testCoverageColor = 'text-green-500';
        else if (test.coverage > 50) testCoverageColor = 'text-yellow-500';
        else testCoverageColor = 'text-red-500';
        const coverageContent = test.coverage > 0 ? (
          <span className={testCoverageColor}>{' - '}{testCoverage}</span>
        ) : <></>;
        let testResult;
        if (test.isSuccess !== null) {
          testResult = test.isSuccess === false ? (
            <pre className="text-red-500 text-xs whitespace-break-spaces">{test.output}</pre>
          ) : (
            <></>
          );
        }
        const testStatus = test.isLoading ? (
          <span className="inline-block pr-2">
            <CircularProgress size={8} color="primary" />
          </span>
        ) : (
          <div className={`w-2 h-2 rounded-full ${testStatusColor} inline-block mr-2`}></div>
        );
        const playButton = !test.isLoading && (
          <span className="inline-block pr-2" onClick={() => dispatch(runTestThunk(project.projectUid, test.command))}>
            <PlayIcon fontSize="small" />
          </span>
        );
        return (
          <div className="p-0.5" key={test.testUid}>
            {testStatus}
            <span>{test.displayName}</span>{coverageContent}
            {playButton}
            {test.isSuccess === false && (<>
              <br />
              <span className="text-gray-500 text-xs">{test.command}</span>
            </>)}
            <br />
            {testResult}
          </div>
        );
      })}
    </div>
  )

  return (
    <div className="relative bg-slate-200 border-slate-300 border text-gray-900 text-sm p-2 pl-3 pb-3 rounded-md mb-3">
      <h2>Testing Status</h2>

      {content}
    </div>
  );
}