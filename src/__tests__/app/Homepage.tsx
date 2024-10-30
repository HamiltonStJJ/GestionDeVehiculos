import {render,screen} from '@testing-library/react';
import LoginPage from '@/app/pages/auth/Login/page';

it('renders the login', () => {
  render(<LoginPage />);
  expect(screen.getByText('Registrarse')).toBeInTheDocument();
});