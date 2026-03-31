import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import auth from "@/services/api/auth";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		setLoading(true);

		const res = await auth.login(username, password);
		if (res.error) {
			setError(res.error);
			setLoading(false);
			return;
		}

		const user = await auth.getUser();
		console.log("GET USER:", user);

		if (user) {
			setUser(user);
			navigate("/");
		}
		setLoading(false);
	};

	return (
		<>
			<title>Login | SimpleGIS</title>
			<div className="bg-black/10 h-screen w-full flex justify-center items-center">
				<div
					className="login w-[90vw] md:w-[40vw] max-w-120 bg-white rounded-lg shadow-md shadow-gray-500
        p-5
        flex flex-col gap-2
        "
				>
					<img
						src="gis.png"
						alt="icon"
						width="100"
						className="mx-auto"
					/>
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
									className="bg-white mb-2 h-10 "
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

						<button
							className="bg-black  hover:bg-white hover:text-black hover:border hover:border-black active:bg-black/30 active:text-white active:border-none w-full rounded-md text-white font-bold h-10 cursor-pointer  transition-all duration-300 ease flex justify-center items-center gap-2
						disabled:bg-gray-300
						disabled:hover:bg-gray-300
						disabled:hover:text-white
						disabled:hover:border-none
						disabled:cursor-not-allowed
						
						"
							disabled={loading}
						>
							{loading ? (
								<>
									Logging in...{" "}
									<Loader className="animate-spin" />
								</>
							) : (
								"Login"
							)}
						</button>

						<div className="flex items-center my-4">
							<div className="grow border-t border-gray-300" />
							<span className="mx-3 text-gray-500 text-sm">
								OR
							</span>
							<div className="grow border-t border-gray-300" />
						</div>

						<Link
							to="/register"
							className={`flex justify-center items-center bg-white/20 border-black border w-full rounded-md text-black font-bold h-10 cursor-pointer hover:bg-black hover:text-white active:bg-black/30 active:text-white active:border-none  transition-all duration-300 ease
							`}
						>
							Register
						</Link>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
