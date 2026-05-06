import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Layout";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", organization: "", phone: "" });
  const [errors, setErrors] = useState({});

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = "Required";
    if (!form.username) errs.username = "Required";
    if (!form.email) errs.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Required";
    else if (form.password.length < 6) errs.password = "Min 6 chars";
    if (!form.organization) errs.organization = "Required";
    if (!form.phone) errs.phone = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    navigate("/", { state: { registered: true } });
  };

  const F = ({ id, label, type = "text", placeholder }) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} value={form[id]} onChange={(e) => update(id, e.target.value)}
        className={errors[id] ? "border-rose-500" : ""} data-testid={`register-${id}`} />
      {errors[id] && <p className="text-xs text-rose-600 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-start bg-white px-6 sm:px-10 py-10 lg:py-16" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Logo />
      <div className="max-w-2xl w-full mx-auto mt-12">
        <h1 className="text-4xl sm:text-5xl tracking-tighter font-bold text-[#0f172a] mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Create your developer account
        </h1>
        <p className="text-slate-500 mb-8">Join thousands of developers building on the Robi network.</p>

        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="register-form">
          <F id="name" label="Full Name" placeholder="Rafiul Karim" />
          <F id="username" label="Username" placeholder="rafiul" />
          <F id="email" label="Email" type="email" placeholder="you@company.com" />
          <F id="password" label="Password" type="password" />
          <F id="organization" label="Organization" placeholder="BDapps" />
          <F id="phone" label="Phone" placeholder="+8801711000000" />
          <div className="sm:col-span-2 flex items-center gap-3 pt-4">
            <Button data-testid="register-submit" type="submit" className="bg-[#e11d48] hover:bg-[#be123c] text-white h-11 px-8">Create Account</Button>
            <Link to="/" data-testid="goto-login" className="text-sm text-slate-500 hover:text-[#0f172a]">Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
