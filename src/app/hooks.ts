import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

/**
 * Typed version of react-redux's useDispatch hook, pre-bound to this
 * app's AppDispatch type so dispatched actions get proper autocomplete
 * and type-checking instead of falling back to `any`.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of react-redux's useSelector hook, pre-bound to this
 * app's RootState type so selector callbacks know the exact shape
 * of the store instead of falling back to `any`.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
