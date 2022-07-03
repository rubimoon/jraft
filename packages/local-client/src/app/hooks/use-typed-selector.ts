import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state/configureStore';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
