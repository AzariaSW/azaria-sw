import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";;

import useAdminLogin from "../../hooks/useAdminLogin";
import { Button, Input } from "../../../../../components/common";
import { Spinner } from "../../../../../components/feedback";
import loginSchema from "../../validation/adminLogin.schema";
import "./AdminLogin.css";

export default function AdminLogin({ challengeToken }) {
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

  const login = useAdminLogin({
    onSuccess: (data) => {
      navigate("/admin/dashboard", {
        state: {
          token: data.token,
        },
      });
    },
  });

  function onSubmit(data) {
    login.mutate({
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

          <Button
            type="submit"
            className="admin-login__submit"
            disabled={login.isPending}
          >
            {login.isPending ? (
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
