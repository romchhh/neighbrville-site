"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAdminAuth } from "./AdminAuthProvider";
import styles from "./AdminLoginForm.module.css";

export default function AdminLoginForm() {
  const { session, ready, login } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !session) return;
    const next = searchParams.get("next") || "/admin/dashboard";
    router.replace(next);
  }, [ready, session, router, searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    void login(loginValue, password, remember)
      .then((result) => {
        if (!result.ok) {
          setError(result.error);
          setSubmitting(false);
          return;
        }
        const next = searchParams.get("next") || "/admin/dashboard";
        router.replace(next);
      })
      .catch(() => {
        setError("Could not sign in. Try again.");
        setSubmitting(false);
      });
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.logo}>NV</span>
          <span className={styles.badge}>Admin</span>
        </div>

        <div className={styles.intro}>
          <h1 className={styles.title}>Admin sign in</h1>
          <p className={styles.lead}>
            Manage waitlist registrations, visits, SEO and integrations.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Login</span>
            <input
              type="text"
              name="login"
              autoComplete="username"
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              placeholder="admin"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Remember me</span>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <Image
          src="/images/sections/be-here.webp"
          alt=""
          fill
          sizes="(max-width: 960px) 100vw, 48vw"
          quality={70}
          className={styles.visualImage}
        />
        <div className={styles.visualShade} />
      </div>
    </div>
  );
}
