import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

jest.mock("@/services/authService", () => ({
  login: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedLogin = login as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() });
  });

  it("renders the form with email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("displays error message on failed login", async () => {
    mockedLogin.mockRejectedValue(new Error("Credenciales incorrectas"));
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "incorrect@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("Credenciales incorrectas")).toBeInTheDocument();
  });

  it("navigates to customer page on successful login", async () => {
    const pushMock = jest.fn();
    mockedUseRouter.mockReturnValue({ push: pushMock });
    mockedLogin.mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "correct@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(pushMock).toHaveBeenCalledWith("pages/customer");
  });
});
