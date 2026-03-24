import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import auth from "@/services/api/auth";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import { Link } from "react-router-dom";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const res = await auth.login(username, password);

		if (res.error) {
			setError(res.error);
			return;
		}

		const user = await auth.getUser();

		if (user) {
			setUser(user);
			navigate("/");
		}
	};

	return (
		<>
			<title>Login | SimpleGIS</title>
			<div className="bg-blue-50 h-screen w-full flex justify-center items-center">
				<div
					className="login w-[90vw] md:w-[40vw] max-w-120 bg-blue-100 rounded-lg shadow-md shadow-gray-500
        p-5
        flex flex-col gap-2
        "
				>
					<h2 className="text-2xl text-center font-bold">Welcome</h2>
					<p className="text-xs text-center text-gray-600 mb-5">
						Login with your credentials to get started.
					</p>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									className="bg-white mb-2 h-10"
									placeholder="Enter your username..."
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									required
								></Input>
							</Field>
							<Field>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									className="bg-white mb-5 h-10"
									placeholder="Enter your password..."
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								></Input>
							</Field>
						</FieldGroup>

						{error && (
							<p className="text-red-500 text-sm mb-2">{error}</p>
						)}

						<button className="bg-blue-950 w-full rounded-md text-white font-bold h-10 cursor-pointer hover:bg-blue-400 transition-all duration-300 ease">
							Login
						</button>

						<div className="flex items-center my-4">
							<div className="grow border-t border-gray-300" />
							<span className="mx-3 text-gray-500 text-sm">
								OR
							</span>
							<div className="grow border-t border-gray-300" />
						</div>
					</form>
					<Link
						to="/register"
						className="flex justify-center items-center bg-blue-950/20 border-blue-950 border w-full rounded-md text-blue-950 font-bold h-10 cursor-pointer hover:bg-blue-400 transition-all duration-300 ease"
					>
						Register
					</Link>
				</div>
			</div>
		</>
	);
};

export default Login;
