import createSagaMiddleware, { Task, SagaMiddleware } from 'redux-saga';
import rootSaga from '../modules/Root/sagas';

export const middleware: SagaMiddleware<{}> = createSagaMiddleware<{}>({});
export const run = (): Task => middleware.run(rootSaga);
