import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchCurrentUser } from '../store/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  return { user, isAuthenticated, loading, error, accessToken, logout: () => dispatch(logout()) };
};
