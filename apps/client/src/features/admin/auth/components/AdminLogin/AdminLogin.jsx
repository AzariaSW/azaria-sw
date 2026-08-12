import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useAdminLogin from "../../hooks/useAdminLogin";
import useAdminAuth from "../../context/useAdminAuth";
import { Button, Input } from "../../../../../components/common";
import { Spinner } from "../../../../../components/feedback";
import loginSchema from "../../validation/adminLogin.schema";
import "./AdminLogin.css";

export default function AdminLogin({ challengeToken }) {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useAdminLogin({
    onSuccess: (data) => {
      login(data.token);
      navigate("/admin/dashboard", {
        replace: true,
      });
    },
  });

  function onSubmit(data) {
    loginMutation.mutate({
      data,
      token: challengeToken,
    });
  }

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h1>Azaria-SW</h1>
          <p>Administrator Login</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            placeholder="username"
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            type="password"
            label="Password"
            placeholder="password"
            error={errors.password?.message}
            {...register("password")}
          />

          {loginMutation.isError && (
            <p className="admin-login__error">
                "Login failed. Please try again."
            </p>
          )}

          <Button
            type="submit"
            className="admin-login__submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Spinner size="sm" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
