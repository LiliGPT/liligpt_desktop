import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authLoginThunk, selectCurrentUser } from "../../redux/slices/authSlice";
import { TextField } from "@mui/material";
import { CustomButton } from "../buttons/CustomButton";

interface Props {
  children: React.ReactNode;
}

export function CustomAuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser());
  const auth = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("giovanneafonso@gmail.com");
  const [password, setPassword] = useState("shake123");

  const onClickLogin = async () => {
    await dispatch(authLoginThunk(username, password));
  };

  if (user) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex flex-col justify-center items-center h-screen"
    >
      <div className="p-2 w-72 bg-slate-200 rounded-lg">
        <h2>Entrar</h2>

        <div className="p-2">
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="p-2">
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!!auth.errorMessage && (
          <div className="p-2 text-red-500">{auth.errorMessage}</div>
        )}

        <div className="p-1 text-right">
          <CustomButton
            color="normal"
            size="medium"
            label="Sign in"
            onClick={onClickLogin}
          />
        </div>
      </div>
    </div>
  );
}